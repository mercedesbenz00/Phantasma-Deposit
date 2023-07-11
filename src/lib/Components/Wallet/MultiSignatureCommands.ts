import {
	Address,
	byteArrayToHex,
	Ed25519Signature,
	PBinaryWriter,
	PhantasmaAPI,
	PollChoice,
	ScriptBuilder,
	Transaction
} from 'phantasma-ts/core';
import { GasLimit, GasPrice, LinkWallet, PhantasmaAPIClient } from '$lib/store';
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

let api: PhantasmaAPI;
PhantasmaAPIClient.subscribe((client: any) => {
	api = client;
});

let Link: PhantasmaLink;
LinkWallet.subscribe((link: any) => {
	Link = link;
});

let gasLimit: number;
GasLimit.subscribe((limit: any) => {
	gasLimit = limit;
});

let gasPrice: number;
GasPrice.subscribe((price: any) => {
	gasPrice = price;
});

//         public Transaction GetTransaction(Address from, string subject)
//         public void CreateTransaction(Address from, string subject, Transaction transaction, Address[] listOfUsers)
//         public void AddSignatureTransaction(Address from, string subject, byte[] signature)
//         public void DeleteTransaction(Address[] addresses, string subject)

async function getTransactionResult(hash: string) {
	return await api.getTransaction(hash);
}

export function getTransactionMultiSig(subject: string, callback: any): Transaction | null {
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return null;
	}

	const from = Address.FromText(String(Link.account.address));
	const payload = Base16.encode('Consensus');
	const sb = new ScriptBuilder();
	const myScript = sb
		.AllowGas(from, Address.Null, gasPrice, gasLimit)
		.CallContract('consensus', 'GetTransaction', [from.Text, subject])
		.SpendGas(from)
		.EndScript();
	Link.signTx(
		myScript,
		payload,
		async function (tx: any) {
			console.log(tx);
			NotificationSuccess('Fetching Multi-sig!', 'Retriving transaction from the blockchain...');
			await new Promise((f) => setTimeout(f, 5000));
			getTransactionResult(tx.hash).then((result) => {
				//let transaction = new Transaction();
				//transaction.UnserializeData(result.script);
				callback(result);
			});
			//callback(getTransactionResult(tx.hash));
			return tx;
		},
		function () {
			NotificationError('Transaction Error', 'Error getting transaction.');
			//console.error(error);
			return null;
		}
	);

	return null;
}

export function signTransaction(transaction: Transaction, callback: any) {
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	Link.signTxSignature(
		Base16.encodeUint8Array(transaction.ToByteAray(false)),
		function (signature) {
			console.log(signature);
			callback(signature);
		},
		function (error) {
			console.log(error);
		}
	);
}

export function addSignatureTransaction(subject: string, signature: Ed25519Signature) {
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	const from = Address.FromText(String(Link.account.address));
	const payload = Base16.encode('Consensus');

	const sb = new ScriptBuilder();
	const myScript = sb
		.AllowGas(from, Address.Null, gasPrice, gasLimit)
		.CallContract('consensus', 'AddSignatureTransaction', [from.Text, subject, signature.Bytes])
		.SpendGas(from)
		.EndScript();
	Link.signTx(
		myScript,
		payload,
		function (tx) {
			NotificationSuccess('Transaction sent!', "You've sent a transaction");
			console.log(tx);
		},
		function () {
			NotificationError('Transaction Error', "Couldn't send transaction");
			console.error('error');
		}
	);
}

export function createTransaction(
	subject: string,
	transaction: Transaction,
	listOfUsers: string[]
) {
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}
	const listUserAddr = listOfUsers.map((user) => Address.FromText(user));
	const from = Address.FromText(String(Link.account.address));
	const hexTransaction = Serialization.Serialize(transaction);

	const payload = Base16.encode('Consensus');
	const sb = new ScriptBuilder();
	const myScript = sb
		.AllowGas(from, Address.Null, gasPrice, gasLimit)
		.CallContract('consensus', 'CreateTransaction', [
			from.Text,
			subject,
			hexTransaction,
			listUserAddr
		])
		.SpendGas(from)
		.EndScript();

	console.log(myScript);
	//return;

	Link.signTx(
		myScript,
		payload,
		function (tx) {
			NotificationSuccess('Transaction sent!', "You've sent a transaction");
			getTransactionResult(tx).then((result) => {
				console.log(result);
			});
			console.log(tx);
		},
		function () {
			NotificationError('Transaction Error', "Couldn't send transaction");
			console.error('error');
		}
	);
}

export function deleteTransaction(listOfUsers: string[], subject: string) {
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	const from = Address.FromText(String(Link.account.address));

	const payload = Base16.encode('Consensus');
	const sb = new ScriptBuilder();
	const myScript = sb
		.AllowGas(from, Address.Null, gasPrice, gasLimit)
		.CallContract('consensus', 'DeleteTransaction', [listOfUsers, subject])
		.SpendGas(from)
		.EndScript();
	Link.signTx(
		myScript,
		payload,
		function (tx) {
			NotificationSuccess('Transaction sent!', "You've sent a transaction");
			console.log(tx);
		},
		function () {
			NotificationError('Transaction Error', "Couldn't send transaction");
			console.error('error');
		}
	);
}

export function executeTransaction() {
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	const from = Address.FromText(String(Link.account.address));
	//Link.signTx();
}
