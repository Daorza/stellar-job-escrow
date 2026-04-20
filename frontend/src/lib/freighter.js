import freighterApi from "@stellar/freighter-api";

export async function connectWallet() {
  const { isConnected } = await freighterApi.isConnected();
  if (!isConnected) {
    alert("Please install Freighter wallet extension first.");
    return null;
  }
  await freighterApi.requestAccess();
  const { address } = await freighterApi.getAddress();
  return address;
}

export async function getNetwork() {
  const { network, networkPassphrase } = await freighterApi.getNetwork();
  return { network, networkPassphrase };
}

export async function signTransaction(xdr) {
  const { signedTxXdr } = await freighterApi.signTransaction(xdr, {
    network: "TESTNET",
    networkPassphrase: "Test SDF Network ; September 2015",
  });
  return signedTxXdr;
}