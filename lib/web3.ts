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