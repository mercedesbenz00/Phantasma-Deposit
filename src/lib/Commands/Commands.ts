import {
	Address,
	byteArrayToHex,
	PBinaryWriter,
	PhantasmaAPI,
	PollChoice,
	ScriptBuilder,
	Transaction,
	VMType
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
	Base16,
	ConsensusMode,
	ConsensusPoll,
	hexStringToUint8Array,
	PBinaryReader,
	PollState,
	Serialization,
	stringToUint8Array,
	Timestamp,
	uint8ArrayToString,
	VMObject
} from 'phantasma-ts/core';
import {
	NotificationError,
	NotificationSuccess
} from '$lib/Components/Notification/NotificationsBuilder';
import { ethers, parseUnits } from 'ethers';
//import { web3 } from 'svelte-web3';
import {Web3,  Contract } from 'web3';

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

export function shuffleArray<T>(array: T[]): T[] {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}
/**
 * Get Tokens details by token symbol.
 * @param symbol
 * @returns
 */
export async function GetTokenDetails(symbol: string) {
	return await api.getToken(symbol);
}

/**
 * Get transaction by Hash
 * @param txHash
 * @returns
 */
export async function GetTransactionByHash(txHash: string) {
	return await api.getTransaction(txHash);
}

/**
 *
 * @param data
 * @returns
 */
export function DecodeInformation(data: string): VMObject {
	const bytes = Base16.decodeUint8Array(data.toUpperCase());
	const vm = new VMObject();
	const reader = new PBinaryReader(bytes);
	vm.UnserializeData(reader);
	return vm;
}

// "04534f554c044b43414c2f5333644a57614c444b596868544866323845667350366174655a35773554655a55535638774d394a4e6661443739452f53336450364c52433366337877345a5a324848394251487a594e4875485338766574624351706b4d4676526d5645460600b4f135010007221d65b56004000203000d0000b036cc325c3eb5df1633000696d2a1ca0100010006c477e55f05000100"
/**
 *
 * @param bytes
 * @param rawHex
 * @returns
 */
export function DecodeStruct(bytes: Uint8Array, rawHex: string): any {
	const result = {};
	const reader = new PBinaryReader(bytes);
	console.log(rawHex);
	if (rawHex[1] == '4') {
		console.log(reader.readString());
		rawHex = rawHex.slice(reader.position, rawHex.length);
		return DecodeStruct(bytes, rawHex);
	}

	if (rawHex[1] == '5') {
		console.log(reader.readInt());
	}
	return result;
}

/**
 *
 * @param vm
 * @returns
 */
export function FormatData(vm: VMObject): any {
	const result: any = {};
	if (vm.Data instanceof Map && vm.Data instanceof Map<VMObject, VMObject>) {
		console.log('map', vm);
		/*if (vm.Data.size == 4) {
			let index = 0;
			let _keyAddress = '';
			for (const item of vm.Data.keys()) {
				_keyAddress = item.AsString();
				index++;
				if (index == 3) break;
			}

			if (_keyAddress == 'LengthInBytes') {
				//return Address.FromBytes(Base16.decodeUint8Array(hexData.toUpperCase()));
			}
		}*/
		for (const item of vm.Data) {
			console.log(item);
			const _key = item[0].AsString();
			result[_key] = FormatData(item[1]);
		}
	} else if (vm.Data instanceof Array) {
		const arr: any[] = [];
		console.log('array', vm);

		for (const item of vm.Data) {
			console.log('array item', item);
			arr.push(FormatData(item));
		}
		return arr;
	} else if (vm.Data instanceof VMObject) {
		console.log('vm data', vm);
		return FormatData(vm.Data);
	} else {
		console.log('vm', vm);
		/*if (vm.Type == VMType.Bytes) {
			const data = DecodeInformation(vm.AsString());
			return FormatData(data);
		}*/
		return vm.AsString();
	}
	return result;
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

export async function ConnectToMetamaskV2() {
	try {
		if ( typeof window.ethereum !== 'undefined' ) {
			await window.ethereum.request({ method: 'eth_requestAccounts' });
			const accounts = await ethereum.request({ method: 'eth_accounts' });;
			ethereum.defaultAccount = accounts[0];
			console.log('Connected to MetaMask', accounts[0]);
		}else {
			NotificationError('Wallet Error!', 'Please install MetaMask first.');
		}
	  } catch (error) {
		console.error('MetaMask connection error:', error);
	  }
}

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

// This should be called for KCAL and for SOUL with the max amounts
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

/// Get Balance of a token for the connected wallet
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
 * Transfer tokens from one address to another
 * @param symbol
 * @param amount
 * @param to
 * @returns
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

export async function DepositAll(phaAddress: string){
	try{
		let contract = new ethers.Contract(DepositAddress, DepositContractABI, provider);
		let runner = await contract.connect(signer);
		await runner.depositAll(phaAddress);
	}catch (error) {
		NotificationError('Error!', 'Token deposit failed. While depositing SOUL and KCAL, please make sure you have enough SOUL and KCAL in your wallet to cover the transaction fee');
	}	
}

export async function SendTransactionEthereum(to: string) {
	if (!signer) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	const transactionRequest: ethers.TransactionRequest = {
		from: account,
		to: to,
		value: ethers.parseEther('0.01'),
		gasPrice: ethers.parseUnits('20', 'gwei'),
		gasLimit: 21000
	};

	provider.getTransactionCount(account).then((nonce) => {
		transactionRequest.nonce = nonce;
	});
	//provider.getTransaction()
	const tx = await signer.sendTransaction(transactionRequest);
}
