#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype,
    Address, Bytes, Env, Symbol, Vec,
    symbol_short,
};

// ─────────────────────────────────────────────
// Data Structures
// ─────────────────────────────────────────────

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum JobStatus {
    Created,
    Funded,
    InProgress,
    Submitted,
    Approved,
    Rejected,
    Cancelled,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Job {
    pub id: u64,
    pub requester: Address,
    pub worker: Option<Address>,
    pub token: Address,
    pub total_amount: i128,
    pub metadata_hash: Bytes,
    pub submission_hash: Option<Bytes>,
    pub status: JobStatus,
    pub created_at: u64,
    pub deadline: u64,
}

// ─────────────────────────────────────────────
// Storage Keys
// ─────────────────────────────────────────────

const JOB_COUNT: Symbol = symbol_short!("JOB_CNT");

fn job_key(id: u64) -> (Symbol, u64) {
    (symbol_short!("JOB"), id)
}

// ─────────────────────────────────────────────
// Contract
// ─────────────────────────────────────────────

#[contract]
pub struct MicroWorkContract;

#[contractimpl]
impl MicroWorkContract {

    /// Create a new job (status = Created, no escrow yet)
    pub fn create_job(
        env: Env,
        requester: Address,
        token: Address,
        total_amount: i128,
        metadata_hash: Bytes,
        deadline: u64,
    ) -> u64 {
        requester.require_auth();

        // Increment job counter
        let id: u64 = env.storage().instance()
            .get(&JOB_COUNT)
            .unwrap_or(0u64)
            + 1;
        env.storage().instance().set(&JOB_COUNT, &id);

        let now = env.ledger().timestamp();

        let job = Job {
            id,
            requester: requester.clone(),
            worker: None,
            token,
            total_amount,
            metadata_hash,
            submission_hash: None,
            status: JobStatus::Created,
            created_at: now,
            deadline,
        };

        env.storage().persistent().set(&job_key(id), &job);

        env.events().publish(
            (symbol_short!("JOB_NEW"), requester),
            id,
        );

        id
    }

    /// Fund job — requester deposits tokens into contract escrow
    pub fn fund_job(env: Env, job_id: u64, requester: Address) {
        requester.require_auth();

        let mut job: Job = env.storage().persistent()
            .get(&job_key(job_id))
            .expect("Job not found");

        assert!(job.status == JobStatus::Created, "Job must be in Created state");
        assert!(job.requester == requester, "Only requester can fund job");

        // Transfer tokens from requester to this contract
        let token_client = soroban_sdk::token::Client::new(&env, &job.token);
        token_client.transfer(
            &requester,
            &env.current_contract_address(),
            &job.total_amount,
        );

        job.status = JobStatus::Funded;
        env.storage().persistent().set(&job_key(job_id), &job);

        env.events().publish(
            (symbol_short!("JOB_FUND"), job_id),
            job.total_amount,
        );
    }

    /// Worker takes the job (status: Funded → InProgress)
    pub fn take_job(env: Env, job_id: u64, worker: Address) {
        worker.require_auth();

        let mut job: Job = env.storage().persistent()
            .get(&job_key(job_id))
            .expect("Job not found");

        assert!(job.status == JobStatus::Funded, "Job must be funded");

        let now = env.ledger().timestamp();
        assert!(now < job.deadline, "Job deadline has passed");

        job.worker = Some(worker.clone());
        job.status = JobStatus::InProgress;
        env.storage().persistent().set(&job_key(job_id), &job);

        env.events().publish(
            (symbol_short!("JOB_TAKE"), job_id),
            worker,
        );
    }

    /// Worker submits work result as IPFS hash (status: InProgress → Submitted)
    pub fn submit_work(
        env: Env,
        job_id: u64,
        worker: Address,
        submission_hash: Bytes,
    ) {
        worker.require_auth();

        let mut job: Job = env.storage().persistent()
            .get(&job_key(job_id))
            .expect("Job not found");

        assert!(job.status == JobStatus::InProgress, "Job must be in progress");
        assert!(
            job.worker == Some(worker.clone()),
            "Only assigned worker can submit"
        );

        let now = env.ledger().timestamp();
        assert!(now < job.deadline, "Deadline has passed");

        job.submission_hash = Some(submission_hash);
        job.status = JobStatus::Submitted;
        env.storage().persistent().set(&job_key(job_id), &job);

        env.events().publish(
            (symbol_short!("JOB_SUB"), job_id),
            worker,
        );
    }

    /// Requester approves work — releases escrow to worker (status → Approved)
    pub fn approve_work(env: Env, job_id: u64, requester: Address) {
        requester.require_auth();

        let mut job: Job = env.storage().persistent()
            .get(&job_key(job_id))
            .expect("Job not found");

        assert!(job.status == JobStatus::Submitted, "No submission to approve");
        assert!(job.requester == requester, "Only requester can approve");

        let worker = job.worker.clone().expect("No worker assigned");

        // Release escrow payment to worker
        let token_client = soroban_sdk::token::Client::new(&env, &job.token);
        token_client.transfer(
            &env.current_contract_address(),
            &worker,
            &job.total_amount,
        );

        job.status = JobStatus::Approved;
        env.storage().persistent().set(&job_key(job_id), &job);

        env.events().publish(
            (symbol_short!("JOB_APPR"), job_id),
            job.total_amount,
        );
    }

    /// Requester rejects work — worker must resubmit (status → Rejected)
    pub fn reject_work(env: Env, job_id: u64, requester: Address) {
        requester.require_auth();

        let mut job: Job = env.storage().persistent()
            .get(&job_key(job_id))
            .expect("Job not found");

        assert!(job.status == JobStatus::Submitted, "No submission to reject");
        assert!(job.requester == requester, "Only requester can reject");

        // Revert back to InProgress so worker can resubmit
        job.status = JobStatus::Rejected;
        job.submission_hash = None;
        env.storage().persistent().set(&job_key(job_id), &job);

        env.events().publish(
            (symbol_short!("JOB_REJ"), job_id),
            requester,
        );
    }

    /// Cancel job — refunds requester if no worker has been assigned
    pub fn cancel_job(env: Env, job_id: u64, requester: Address) {
        requester.require_auth();

        let mut job: Job = env.storage().persistent()
            .get(&job_key(job_id))
            .expect("Job not found");

        assert!(job.requester == requester, "Only requester can cancel");
        assert!(
            job.status == JobStatus::Created || job.status == JobStatus::Funded,
            "Cannot cancel: job already in progress"
        );

        // Refund escrow if already funded
        if job.status == JobStatus::Funded {
            let token_client = soroban_sdk::token::Client::new(&env, &job.token);
            token_client.transfer(
                &env.current_contract_address(),
                &requester,
                &job.total_amount,
            );
        }

        job.status = JobStatus::Cancelled;
        env.storage().persistent().set(&job_key(job_id), &job);

        env.events().publish(
            (symbol_short!("JOB_CNCL"), job_id),
            requester,
        );
    }

    // ─────────────────────────────────────────
    // Read-only queries
    // ─────────────────────────────────────────

    /// Get a single job by ID
    pub fn get_job(env: Env, job_id: u64) -> Job {
        env.storage().persistent()
            .get(&job_key(job_id))
            .expect("Job not found")
    }

    /// Get total number of jobs created
    pub fn job_count(env: Env) -> u64 {
        env.storage().instance().get(&JOB_COUNT).unwrap_or(0u64)
    }
}