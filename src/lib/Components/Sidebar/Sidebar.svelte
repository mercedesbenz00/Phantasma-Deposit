<script lang="ts">
	import Icon from '@iconify/svelte';
	import Item from '$lib/Components/Sidebar/Sidebar-Item.svelte';
	import {
		apiStatus,
		LinkWallet,
		leftSidebarMenu,
		PhantasmaAPIClient,
		TestnetURL,
		MainnetURL,
		SimnetURL,
		connectedToWallet,
		activePage,
		apiLink,
		OpenedModal,
		SoftwareName
	} from '$lib/store';
	import { PhantasmaAPI } from 'phantasma-ts/core';
	import type { PhantasmaLink } from 'phantasma-ts';
	import { ModalInternalTypes } from '../Modals/ModalInternalTypes';
	import { NotificationSuccess } from '../Notification/NotificationsBuilder';

	let _apiStatus: boolean;

	let _walletStatus: boolean;

	let activePageItem: string = '';

	let leftSideNavBarActive: boolean;

	let Link: PhantasmaLink;

	let api: PhantasmaAPI;

	PhantasmaAPIClient.subscribe((value) => {
		if (value != null) {
			apiStatus.set(true);
		} else {
			apiStatus.set(false);
		}
		api = value;
	});

	leftSidebarMenu.subscribe((value) => {
		leftSideNavBarActive = value;
	});

	function leftSideNavTrigger() {
		leftSidebarMenu.set(!leftSideNavBarActive);
	}

	apiStatus.subscribe((value) => {
		_apiStatus = value;
	});

	LinkWallet.subscribe((value) => {
		Link = value;
		if (value.account) {
			connectedToWallet.set(true);
			_walletStatus = true;
		} else {
			connectedToWallet.set(false);
			_walletStatus = false;
		}
	});

	activePage.subscribe((value) => {
		activePageItem = value;
	});

	let selectedAPI = MainnetURL;

	apiLink.subscribe((value) => {
		selectedAPI = value;
	});
</script>

<!-- sidenav  -->
<aside
	class:translate-x-0={leftSideNavBarActive}
	class:shadow-soft-xl={leftSideNavBarActive}
	class="sm:overflow-y-auto mb-32 md:overflow-hidden md:overflow-y-hidden max-w-62.5
	ease-nav-brand z-990 fixed inset-y-0 mt-4 md:mb-16 ml-4 block w-full -translate-x-full
	flex-wrap items-center justify-between rounded-2xl border-0 bg-white p-0 antialiased
	shadow-none transition-transform duration-200 xl:left-0 xl:translate-x-0 xl:bg-transparent max-h-screen overflow-y-auto"
>
	<div class="h-19.5">
		{#if leftSideNavBarActive}
			<a
				href="#"
				class="absolute top-0 right-0 p-4 opacity-50 cursor-pointer text-slate-400"
				on:click={leftSideNavTrigger}
			>
				<Icon height="16" width="16" icon="fa-close" />
			</a>
		{/if}
		<a class="block px-8 py-6 m-0 text-sm whitespace-nowrap text-slate-700" href="/">
			<img
				src="SOUL.png"
				class="inline h-full max-w-full transition-all duration-200 ease-nav-brand max-h-8"
				alt="main_logo"
			/>
			<span class="ml-1 font-semibold transition-all duration-200 ease-nav-brand"
				>{SoftwareName}</span
			>
		</a>
	</div>

	<hr
		class="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent"
	/>

	<h6 class="font-bold leading-tight uppercase text-xs opacity-70 text-center">Wallet Status</h6>

	<div
		class="h-12 mb-4 shadow-md text-sm ease-nav-brand my-0 mx-4 flex rounded-lg font-semibold text-slate-700 transition-colors bg-opacity-90 text-center items-center
    {_walletStatus ? 'bg-green-200' : 'bg-red-200'}"
	>
		<div class="my-4 p-2 rounded-md w-full mx-4 text-black text-center">
			{#if _walletStatus}
				Connected
			{:else}
				Not Connected
			{/if}
		</div>
	</div>

	<hr
		class="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent"
	/>

	<div class="items-center block overflow-auto w-auto max-h-56 md:max-h-80 grow basis-full">
		<ul class="flex flex-col pl-0 mb-0 pb-8">
			<Item title="Claim" link="/" icon="fluent:vote-20-regular" page="Claim" />
			<Item
				title="Hub"
				link="https://hub.phantasma.io"
				icon="fa6-solid:file-signature"
				page="Hub"
			/>
		</ul>
	</div>
</aside>

<!-- end sidenav -->
