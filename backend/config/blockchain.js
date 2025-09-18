const { ethers } = require('ethers');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

let contractInstance = null;
let provider = null;

function getProvider() {
  if (provider) return provider;
  const rpcUrl = process.env.ETH_RPC_URL || 'http://127.0.0.1:7545'; // Ganache default
  provider = new ethers.JsonRpcProvider(rpcUrl);
  return provider;
}

function getContract() {
  if (contractInstance) return contractInstance;
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error('CONTRACT_ADDRESS not set in environment');
  }

  // Resolve build path from project root (backend runs from backend/ cwd)
  const buildPath = path.resolve(__dirname, '..', '..', 'build', 'contracts', 'ReservationPayment.json');
  if (!fs.existsSync(buildPath)) {
    throw new Error(`Contract build not found at ${buildPath}. Run truffle compile && truffle migrate`);
  }
  const artifact = JSON.parse(fs.readFileSync(buildPath, 'utf8'));
  const abi = artifact.abi;

  const prov = getProvider();
  contractInstance = new ethers.Contract(contractAddress, abi, prov);
  return contractInstance;
}

async function getPaymentStatus(bookingId) {
  const contract = getContract();
  const [user, amountWei, paid] = await contract.getPayment(bookingId);
  return {
    user,
    amountWei: amountWei.toString(),
    amountEth: ethers.formatEther(amountWei),
    paid,
  };
}

module.exports = {
  getProvider,
  getContract,
  getPaymentStatus,
};
