import {
	Address,
	byteArrayToHex,
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

export function createDAO(id: string, name: string, script: string) {
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	const from = Address.FromText(String(Link.account.address));

	const payload = Base16.encode('DAO');
	const sb = new ScriptBuilder();

	const myScript = sb
		.AllowGas(from, Address.Null, gasPrice, gasLimit)
		.CallInterop('Nexus.CreateOrganization', [from.Text, id, name, Base16.decodeUint8Array(script)])
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

export function addMember(
	organization_name: string,
	organization_address: Address,
	target: Address
) {
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	const from = Address.FromText(String(Link.account.address));
	const payload = Base16.encode('DAO');
	const sb = new ScriptBuilder();

	const myScript = sb
		.AllowGas(from, Address.Null, gasPrice, gasLimit)
		.CallInterop('Organization.AddMember', [organization_address, organization_name, target.Text])
		.SpendGas(from)
		.EndScript();

	Link.signTx(
		myScript,
		payload,
		function (tx) {
			//transaction.unserialize("");
			NotificationSuccess('Transaction sent!', "You've sent a transaction");
			console.log(tx);
		},
		function () {
			NotificationError('Transaction Error', "Couldn't send transaction");
			console.error('error');
		}
	);
}

export function removeMember(
	organization_name: string,
	organization_address: Address,
	target: Address
) {
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	const from = Address.FromText(String(Link.account.address));
	const payload = Base16.encode('DAO');
	const sb = new ScriptBuilder();

	const myScript = sb
		.AllowGas(from, Address.Null, gasPrice, gasLimit)
		.CallInterop('Organization.RemoveMember', [
			organization_address,
			organization_name,
			target.Text
		])
		.SpendGas(from)
		.EndScript();

	Link.signTx(
		myScript,
		payload,
		function (tx) {
			console.log(tx);
			NotificationSuccess('Transaction sent!', "You've sent a transaction");
		},
		function () {
			NotificationError('Transaction Error', "Couldn't send transaction");
			console.error('error');
		}
	);
}

export function leaveDAO(organization_name: string) {
	if (!Link.account) {
		NotificationError('Wallet Error!', 'Please connect your wallet first.');
		return;
	}

	const from = Address.FromText(String(Link.account.address));
	const payload = Base16.encode('DAO');
	const sb = new ScriptBuilder();

	const myScript = sb
		.AllowGas(from, Address.Null, gasPrice, gasLimit)
		.CallInterop('Organization.RemoveMember', [from.Text, organization_name, from.Text])
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
