import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const connectWallet = async (): Promise<string> => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      return accounts[0];
    } catch (error) {
      throw new Error('Failed to connect wallet');
    }
  } else {
    throw new Error('MetaMask not detected');
  }
};

export const payWithEthereum = async (amount: number, toAddress?: string): Promise<string> => {
  if (!window.ethereum) {
    throw new Error('MetaMask not detected');
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    // Convert amount to wei (for demo purposes, we'll use a small amount)
    const valueInWei = ethers.parseEther((amount * 0.001).toString()); // Convert to a small ETH amount for testing
    
    // For demo purposes, we'll send to a dummy address if no address is provided
    const recipientAddress = toAddress || '0x742d35Cc6634C0532925a3b8D94B9b89c0b8C666';
    
    const transaction = await signer.sendTransaction({
      to: recipientAddress,
      value: valueInWei,
    });

    // Wait for transaction confirmation
    await transaction.wait();
    
    return transaction.hash;
  } catch (error) {
    console.error('Payment error:', error);
    throw new Error('Payment failed');
  }
};

export const getWalletAddress = async (): Promise<string | null> => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });
      return accounts[0] || null;
    } catch (error) {
      return null;
    }
  }
  return null;
};

export const isMetaMaskAvailable = (): boolean => {
  return typeof window !== 'undefined' && !!window.ethereum;
};

// Send a contract transaction with prepared data
export const sendContractPayment = async (
  to: string,
  data: string,
  valueWei: string
): Promise<{ hash: string; wait: () => Promise<any> }> => {
  if (!window.ethereum) {
    throw new Error('MetaMask not detected');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const tx = await signer.sendTransaction({ to, data, value: BigInt(valueWei) });
  return tx as any;
};

// Ensure MetaMask is connected to local Ganache
export const ensureGanacheNetwork = async () => {
  if (!window.ethereum) throw new Error('MetaMask not detected');
  const ganacheChainIdHex = '0x539'; // 1337 in hex
  try {
    // Try switching first
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ganacheChainIdHex }],
    });
  } catch (switchError: any) {
    // If chain not added, add it
    if (switchError?.code === 4902 || (switchError?.message || '').includes('Unrecognized chain ID')) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: ganacheChainIdHex,
          chainName: 'Ganache Local',
          nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
          rpcUrls: ['http://127.0.0.1:7545'],
          blockExplorerUrls: [],
        }],
      });
    } else {
      throw switchError;
    }
  }
};

// Send plain ETH to an address with a given amount (in ETH)
export const sendEth = async (to: string, amountEth: string): Promise<{ hash: string; wait: () => Promise<any> }> => {
  if (!window.ethereum) throw new Error('MetaMask not detected');
  await ensureGanacheNetwork();
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const value = ethers.parseEther(amountEth);
  const tx = await signer.sendTransaction({ to, value });
  return tx as any;
};