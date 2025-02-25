const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/9ee231651f774d03ba4cc8db1515f15d');
const wallets = new Map();

const contractAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7'; // USDT on Ethereum Mainnet
const contractABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function owner() view returns (address)"
];
const contract = new ethers.Contract(contractAddress, contractABI, provider);

exports.createWallet = (req, res) => {
  try {
    const wallet = ethers.Wallet.createRandom();
    const walletData = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic.phrase
    };

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
};

exports.getBalance = async (req, res) => {
  try {
    const address = req.params.address;

    if (!wallets.has(address)) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

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
};

exports.fundWallet = async (req, res) => {
  try {
    const { address, amount } = req.body;

    if (!wallets.has(address)) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

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
};

exports.withdrawFromWallet = async (req, res) => {
  try {
    const { address, amount } = req.body;

    if (!wallets.has(address)) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

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
};

exports.getContractInfo = async (req, res) => {
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
};
