import {
	PhantasmaAPI,
} from 'phantasma-ts/core';
import {
	DepositAddress,
	DepositContractABI,
	EthereumAddress,
	EthereumProvider,
	EthereumSigner,
	GasLimit,
	GasPrice,
	LinkWallet,
	PhantasmaAPIClient,
	TokenERC20ABI,
} from '$lib/store';
import type { PhantasmaLink } from 'phantasma-ts';
import {
	NotificationError,
	NotificationSuccess
} from '$lib/Components/Notification/NotificationsBuilder';
import { ethers, parseUnits } from 'ethers';

let Link: PhantasmaLink;
LinkWallet.subscribe((link: any) => {
	Link = link;
});

let api: PhantasmaAPI;
PhantasmaAPIClient.subscribe((client: any) => {
	api = client;
});

let gasLimit: number;
GasLimit.subscribe((limit: any) => {
	gasLimit = limit;
});

let gasPrice: number;
GasPrice.subscribe((price: any) => {
	gasPrice = price;
});

export function removeHTMLEntities(str) {
	return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

let provider: ethers.BrowserProvider | null = null;
let signer: ethers.Signer | null = null;
let account: string | null = null;
EthereumProvider.subscribe((_provider) => {
	provider = _provider;
});

EthereumSigner.subscribe((_signer) => {
	signer = _signer;
});

EthereumAddress.subscribe((_account) => {
	account = _account;
});

/**
 * Connect to MetaMask
 */
export async function ConnectToMetamask() {
	if (typeof window.ethereum !== 'undefined') {
		provider = new ethers.BrowserProvider(window.ethereum);
		await provider.send('eth_requestAccounts', []);

		signer = await provider.getSigner();
		account = await signer.getAddress();

		EthereumSigner.set(signer);
		EthereumProvider.set(provider);
		EthereumAddress.set(account);

		console.log('Connected to MetaMask');
		console.log('Account:', account);
		console.log('balances', await signer.provider.getBalance(account));
		NotificationSuccess('Wallet Connected!', 'You are now connected to MetaMask.');
	} else {
		NotificationError('Wallet Error!', 'Please install MetaMask first.');
	}
}

/**
 * Disconnect from MetaMask
 */
export async function DisconnectFromMetamask() {
	if (typeof window.ethereum !== 'undefined') {
		await provider?.send('eth_requestAccounts', []);
		signer = null;
		account = null;

		EthereumSigner.set(signer);
		EthereumProvider.set(provider);
		EthereumAddress.set(account);

		console.log('Disconnected from MetaMask');
		NotificationSuccess('Wallet Disconnected!', 'You are now disconnected from MetaMask.');
	} else {
		NotificationError('Wallet Error!', 'Please install MetaMask first.');
	}
}

/**
 * Approve tokens for the deposit contract
 * @param _tokenAddress 
 * @param amount 
 * @returns 
 */
export async function ApproveTokens(_tokenAddress: string, amount: string){
	
	try {
		let user = await signer?.getAddress();
		let contract = new ethers.Contract(_tokenAddress, TokenERC20ABI, provider);
		let runner = await contract.connect(signer);
		let approveTx = await runner.approve(DepositAddress, amount);
		await approveTx.wait();
		NotificationSuccess('Success!', 'Token approval successful.');
		return true;
	  } catch (error) {
		NotificationError('Error!', 'Token approval failed.');
		return false;
	  }
}

/**
 * Check the allowance of a token for the connected wallet
 * @param _tokenAddress 
 * @returns 
 */
export async function CheckAllowance(_tokenAddress: string){
	try {
		let user = await signer?.getAddress();
		let contract = new ethers.Contract(_tokenAddress, TokenERC20ABI, provider);
		let runner = await contract.connect(signer);
		let allowance = await runner.allowance(user, DepositAddress);
		return allowance;
	  } catch (error) {
		NotificationError('Error!', 'Token allowance check failed.');
	  }
}

/**
 * Get the balance of a token for the connected wallet
 * @param _tokenAddress 
 * @returns 
 */
export async function GetBalance(_tokenAddress: string) {
	if (!signer) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	let user = await signer.getAddress();
	let contract = new ethers.Contract(_tokenAddress, TokenERC20ABI, provider);
	let runner = await contract.connect(signer);
	let balance = await runner.balanceOf(user);
	return balance;
}

/**
 * Get the network info of the connected wallet
 * @returns 
 */
export async function GetNetworkInfo()
{
	if (!signer) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	let network = await signer.provider.getNetwork();
	return network;
}

/**
 * Deposit SOUL to the deposit contract
 * @param phaAddress 
 */
export async function DepositSOUL(phaAddress: string){
	try {
		let contract = new ethers.Contract(DepositAddress, DepositContractABI, provider);
		let runner = await contract.connect(signer);
		await runner.depositSoul(phaAddress);
		NotificationSuccess('Success!', 'SOUL deposit successful');
	}catch (error) {
		NotificationError('Error!', 'Token deposit failed. While depositing SOUL, please make sure you have enough SOUL in your wallet to cover the transaction fee.');
	}
}

/**
 * Deposit KCAL to the deposit contract
 * @param phaAddress 
 */
export async function DepositKCAL(phaAddress: string){
	try {
		let contract = new ethers.Contract(DepositAddress, DepositContractABI, provider);
		let runner = await contract.connect(signer);
		await runner.depositKCAL(phaAddress);
		NotificationSuccess('Success!', 'KCAL deposit successful');
	}catch (error) {
		NotificationError('Error!', 'Token deposit failed. While depositing KCAL, please make sure you have enough KCAL in your wallet to cover the transaction fee.');
	}
	
}

/**
 * Deposit all tokens to the deposit contract
 * @param phaAddress 
 */
export async function DepositAll(phaAddress: string){
	try{
		let contract = new ethers.Contract(DepositAddress, DepositContractABI, provider);
		let runner = await contract.connect(signer);
		await runner.depositAll(phaAddress);
	}catch (error) {
		NotificationError('Error!', 'Token deposit failed. While depositing SOUL and KCAL, please make sure you have enough SOUL and KCAL in your wallet to cover the transaction fee');
	}	
}