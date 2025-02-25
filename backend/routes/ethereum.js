const { ethers } = require('ethers');
const express = require('express');
const router = express.Router();

const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/9ee231651f774d03ba4cc8db1515f15d');

const wallets = new Map();

const contractAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7'; // USDT on Ethereum Mainnet
const contractABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function owner() view returns (address)"
];
const contract = new ethers.Contract(contractAddress, contractABI, provider);

router.post('/wallet/create', (req, res) => {
  try {
    // Create a new random wallet
    const wallet = ethers.Wallet.createRandom();
    const walletData = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic.phrase
    };

    // Store the wallet in memory
    wallets.set(wallet.address, walletData);

    res.json({
      success: true,
      message: 'Wallet created successfully',
      wallet: walletData
    });
  } catch (error) {
    console.error('Error creating wallet:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create wallet'
    });
  }
});

router.get('/wallet/balance/:address', async (req, res) => {
  try {
    const address = req.params.address;

    // Check if the wallet exists
    if (!wallets.has(address)) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    // Get the balance of the wallet
    const balance = await provider.getBalance(address);
    res.json({
      success: true,
      balance: ethers.formatEther(balance),
      address: address
    });
  } catch (error) {
    console.error('Error retrieving balance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve balance'
    });
  }
});

router.post('/wallet/fund', async (req, res) => {
  try {
    const { address, amount } = req.body;

    if (!wallets.has(address)) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    // Simulate funding (this is just a demo; in real-world, you'd send ETH from another wallet)
    res.json({
      success: true,
      message: `Wallet funded with ${amount} ETH (simulated)`,
      address: address
    });
  } catch (error) {
    console.error('Error funding wallet:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fund wallet'
    });
  }
});

router.post('/wallet/withdraw', async (req, res) => {
  try {
    const { address, amount } = req.body;

    if (!wallets.has(address)) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    // Simulate withdrawal (this is just a demo; in real-world, you'd send ETH to another wallet)
    res.json({
      success: true,
      message: `Withdrawn ${amount} ETH from wallet (simulated)`,
      address: address
    });
  } catch (error) {
    console.error('Error withdrawing balance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to withdraw balance'
    });
  }
});

router.get('/contract-info/:address', async (req, res) => {
  try {
    const address = req.params.address;

    const balance = await contract.balanceOf(address);
    const owner = await contract.owner();

    res.json({
      success: true,
      balance: ethers.formatEther(balance),
      owner: owner,
      contractAddress: contractAddress
    });
  } catch (error) {
    console.error('Error fetching contract info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contract info'
    });
  }
});

module.exports = router;