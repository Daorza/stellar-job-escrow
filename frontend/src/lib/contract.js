import {
  Contract,
  rpc,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  Address,
  nativeToScVal,
} from "@stellar/stellar-sdk";

import { signTransaction } from "./freighter";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://soroban-testnet.stellar.org";
const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID;

export const server = new rpc.Server(RPC_URL);

async function invokeContract(publicKey, method, params = []) {
  const account = await server.getAccount(publicKey);
  const contract = new Contract(CONTRACT_ID);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(contract.call(method, ...params))
    .setTimeout(30)
    .build();

  const preparedTx = await server.prepareTransaction(tx);
  const signedXdr = await signTransaction(preparedTx.toXDR());

  const result = await server.sendTransaction(
    TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET)
  );
  return result;
}

export async function createJob(publicKey, metadataHash, totalAmount, deadline) {
  return invokeContract(publicKey, "create_job", [
    new Address(publicKey).toScVal(),
    new Address(CONTRACT_ID).toScVal(),
    nativeToScVal(totalAmount, { type: "i128" }),
    nativeToScVal(metadataHash, { type: "bytes" }),
    nativeToScVal(deadline, { type: "u64" }),
  ]);
}

export async function getJob(jobId) {
  const account = await server.getAccount(CONTRACT_ID).catch(() => null);
  const contract = new Contract(CONTRACT_ID);
  const result = await server.simulateTransaction(
    new TransactionBuilder(
      { accountId: () => CONTRACT_ID, sequenceNumber: () => "0", incrementSequenceNumber: () => {} },
      { fee: BASE_FEE, networkPassphrase: Networks.TESTNET }
    )
      .addOperation(contract.call("get_job", nativeToScVal(jobId, { type: "u64" })))
      .setTimeout(30)
      .build()
  );
  return result;
}

export async function fundJob(publicKey, jobId) {
  return invokeContract(publicKey, "fund_job", [
    nativeToScVal(jobId, { type: "u64" }),
    new Address(publicKey).toScVal(),
  ]);
}

export async function takeJob(publicKey, jobId) {
  return invokeContract(publicKey, "take_job", [
    nativeToScVal(jobId, { type: "u64" }),
    new Address(publicKey).toScVal(),
  ]);
}

export async function submitWork(publicKey, jobId, submissionHash) {
  return invokeContract(publicKey, "submit_work", [
    nativeToScVal(jobId, { type: "u64" }),
    new Address(publicKey).toScVal(),
    nativeToScVal(submissionHash, { type: "bytes" }),
  ]);
}

export async function approveWork(publicKey, jobId) {
  return invokeContract(publicKey, "approve_work", [
    nativeToScVal(jobId, { type: "u64" }),
    new Address(publicKey).toScVal(),
  ]);
}