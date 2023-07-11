import { writable, type Writable } from 'svelte/store';
import { PhantasmaLink } from 'phantasma-ts';
import { PhantasmaAPI, type Contract } from 'phantasma-ts/src/core';
import type { ABIMethod } from 'phantasma-ts/core';
import { ModalInternalTypes } from '$lib/Components/Modals/ModalInternalTypes';
import { ethers } from 'ethers';

import DepositContractABIFile from '$lib/Commands/DepositContract.json';
import TokenERC20ABIFile from '$lib/Commands/ERC20ABI.json';

export const SimnetURL = 'http://127.0.0.1:7077/rpc';
export const TestnetURL = 'https://testnet.phantasma.io/rpc';
export const MainnetURL = 'https://bp1.phantasma.io/rpc';
export const SoftwareName = 'Phantasma Deposit';

export const DepositAddress = '0x32B89a3B44AE22a87dFAe8A79c6Bdf577065E3D4'; // Replace with your contract address
export const SOULAddressETH = "0x75858677e27C930FB622759FeafFeE2b754Af07F";
export const KCALAddressETH = "0x47C1178F49140ECdBfbdF0aE2935cDB640D579F9";
export const SOULAddressBNB = "0x298Eff8af1ecEbbB2c034eaA3b9a5d0Cc56c59CD";
export const KCALAddressBNB = "0x855EA8048E1852996429A50aBdA60F583909d298";
export const DepositContractABI = DepositContractABIFile; // Replace with your contract ABI
export const TokenERC20ABI = TokenERC20ABIFile; // The standard ERC20 contract ABI (SOUL / KCAL)

export const EthereumProvider: Writable<ethers.BrowserProvider | null> = writable();
export const EthereumSigner: Writable<ethers.Signer | null> = writable();
export const EthereumAddress: Writable<string> = writable('');

export const contractName = writable('');
export const LinkWallet = writable(new PhantasmaLink('', true));
export const PhantasmaAPIClient = writable(new PhantasmaAPI(MainnetURL, null, 'mainnet'));
export const LinkDapp = writable('');
export const activePage = writable('');
export const apiStatus = writable(false);
export const apiLink = writable(MainnetURL);

export const GasPrice = writable(1000000);
export const GasLimit = writable(21000);

export const leftSidebarMenu = writable(false);
export const rightSidebarMenu = writable(false);
export const notifications = writable(false);
export const walletOpened = writable(false);

export const connectWallet = writable(false);
export const connectedToWallet = writable(false);
export const allContracts = writable(Array<string>());
export const contractDetails: Writable<Contract> = writable();
export const contractMethod: Writable<ABIMethod | undefined> = writable();
export const consoleOutput = writable('');

export const OpenedModal = writable(ModalInternalTypes.None);
