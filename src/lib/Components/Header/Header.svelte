<script lang="ts">
	import Icon from '@iconify/svelte';
	import Notification from '$lib/Components/Notification/Notification.svelte';
	import {
		activePage,
		notifications,
		leftSidebarMenu,
		rightSidebarMenu,
		connectWallet,
		LinkWallet,
		walletOpened
	} from '$lib/store';
	import ConnectWalletModal from '$lib/Components/Wallet/ConnectWalletModal.svelte';
	import { PhantasmaLink } from 'phantasma-ts';
	import { NotificationSuccess } from '../Notification/NotificationsBuilder';

	/**
	 * @type {string}
	 */
	let activePageItem: string;
	activePage.subscribe((value) => {
		activePageItem = value;
	});

	let notificationsActive: boolean;
	notifications.subscribe((value) => {
		notificationsActive = value;
	});

	function notificationTrigger() {
		notifications.set(!notificationsActive);
	}

	let leftSideNavBarActive: boolean;
	leftSidebarMenu.subscribe((value) => {
		leftSideNavBarActive = value;
	});

	function leftSideNavTrigger() {
		leftSidebarMenu.set(!leftSideNavBarActive);
	}

	let rightSideNavBarActive: boolean;
	rightSidebarMenu.subscribe((value) => {
		rightSideNavBarActive = value;
	});

	function rightSideNavTrigger() {
		rightSidebarMenu.set(!rightSideNavBarActive);
	}

	let showConnectWalletModal: boolean;
	connectWallet.subscribe((value) => {
		showConnectWalletModal = value;
	});

	function connectToWallet() {
		// Show popup modal
		if (!showConnectWalletModal) connectWallet.set(true);
	}

	function disconnectWallet() {
		console.log('disconnectWallet');
		LinkWallet.set(new PhantasmaLink('', false));
		NotificationSuccess(
			'Wallet disconnected',
			"You've successfully disconnected from your wallet."
		);
	}

	let _walletStatus: boolean;

	let Link: PhantasmaLink;

	LinkWallet.subscribe((value) => {
		Link = value;
		if (value.account) _walletStatus = true;
		else _walletStatus = false;
	});

	let walletOpenedActive: boolean;
	walletOpened.subscribe((value) => {
		walletOpenedActive = value;
	});

	function walletTrigger() {
		walletOpened.set(!walletOpenedActive);
	}
</script>

<!-- Navbar -->
<nav
	class="relative flex flex-wrap items-center justify-between px-0 py-2 mx-6 transition-all shadow-none duration-250 ease-soft-in rounded-2xl lg:flex-nowrap lg:justify-start"
	navbar-main
	navbar-scroll="true"
>
	<div class="flex items-center justify-between w-full px-4 py-1 mx-auto flex-wrap-inherit">
		<div class="flex items-center mt-2 grow sm:mt-0 sm:mr-6 md:mr-0 lg:flex lg:basis-auto">
			<div class="flex items-center md:ml-auto md:pr-4">
				<!--<div class="relative flex flex-wrap items-stretch w-full transition-all rounded-lg ease-soft">
              <span class="text-sm ease-soft leading-5.6 absolute z-50 -ml-px flex h-full items-center whitespace-nowrap rounded-lg rounded-tr-none rounded-br-none border border-r-0 border-transparent bg-transparent py-2 px-2.5 text-center font-normal text-slate-500 transition-all">
                <Icon icon="fa-search" />
              </span>
              <input type="text" class="pl-8.75 text-sm focus:shadow-soft-primary-outline ease-soft w-1/100 leading-5.6 relative -ml-px block min-w-0 flex-auto rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow" placeholder="Type here..." />
            </div>-->
			</div>
			<ul class="flex flex-row justify-end pl-0 mb-0 list-none md-max:w-full">
				<!-- online builder btn  -->
				<!-- <li class="flex items-center">
              <a class="inline-block px-8 py-2 mb-0 mr-4 font-bold text-center uppercase align-middle transition-all bg-transparent border border-solid rounded-lg shadow-none cursor-pointer leading-pro border-fuchsia-500 ease-soft-in text-xs hover:scale-102 active:shadow-soft-xs text-fuchsia-500 hover:border-fuchsia-500 active:bg-fuchsia-500 active:hover:text-fuchsia-500 hover:text-fuchsia-500 tracking-tight-soft hover:bg-transparent hover:opacity-75 hover:shadow-none active:text-white active:hover:bg-transparent" target="_blank" href="https://www.creative-tim.com/builder/soft-ui?ref=navbar-dashboard&amp;_ga=2.76518741.1192788655.1647724933-1242940210.1644448053">Online Builder</a>
            </li> -->
				{#if _walletStatus}
					<li class="flex items-center mr-2">
						<span
							class="border-solid bg-sky-600 border-sky-700 rounded-md text-white text-[0.75rem] px-3 py-1 text-center"
						>
							{Link.account.address}
						</span>
					</li>
				{/if}
				<li class="flex items-center">
					{#if _walletStatus}
						<a
							href="#"
							class="block px-0 py-2 font-semibold transition-all ease-nav-brand text-sm text-slate-500"
							on:click={walletTrigger}
						>
							<Icon height="16" width="16" class="sm:mr-1" icon="mdi:wallet" />
							<span class="hidden sm:inline">Wallet</span>
						</a>

						<ul
							class:transform-dropdown={!walletOpenedActive}
							class:transform-dropdown-show={walletOpenedActive}
							class:opacity-0={!walletOpenedActive}
							class:before:-top-5={!walletOpenedActive}
							class="text-sm transform-dropdown before:font-awesome before:leading-default before:duration-350 before:ease-soft
                lg:shadow-soft-3xl duration-250 min-w-[10%] w-[18rem] before:sm:right-7.5 before:text-5.5 pointer-events-none absolute right-10 top-0 z-50 origin-top
                list-none rounded-lg border-0 border-solid border-transparent bg-white bg-clip-padding px-2 py-4 text-left text-slate-500 transition-all
                before:absolute before:right-8 before:left-auto before:top-0 before:z-50 before:inline-block before:font-normal opacity-0 before:text-white
                before:antialiased before:transition-all before:content-['\f0d8'] sm:-mr-8 lg:absolute lg:right-20 lg:left-auto lg:mt-2 lg:block lg:cursor-pointer"
						>
							<!-- add show class on dropdown open js -->
							<!--<li
								class="flex items-center break-all border-solid bg-slate-400 border-slate-400 rounded-md text-white px-3 py-2 mb-2"
							>
								<p class="text-[0.75rem]">{Link.account.address}</p>
							</li>

							<li>
								<hr class="my-2 border-gray-300" />
							</li>-->

							<li class="pointer-events-auto">
								<a
									href="#"
									class="block px-0 py-2 font-semibold transition-all ease-nav-brand text-sm text-slate-500"
									on:click={disconnectWallet}
								>
									<Icon height="16" width="16" class="sm:mr-1" icon="mdi:wallet" />
									<span class="hidden sm:inline">Disconnect</span>
								</a>
							</li>
						</ul>
					{:else}
						<a
							href="#"
							class="block px-0 py-2 font-semibold transition-all ease-nav-brand text-sm text-slate-500"
							on:click={connectToWallet}
						>
							<Icon height="16" width="16" class="sm:mr-1" icon="mdi:wallet" />
							<span class="hidden sm:inline">Connect</span>
						</a>
					{/if}
				</li>
				<li class="flex items-center pl-4 xl:hidden">
					<a
						href="#"
						class="block p-0 transition-all ease-nav-brand text-sm text-slate-500"
						on:click={leftSideNavTrigger}
					>
						<div class="w-4.5 overflow-hidden">
							<i
								class:-translate-x-[5px]={leftSideNavBarActive}
								class="ease-soft mb-0.75 relative block h-0.5 rounded-sm bg-slate-500 transition-all"
							/>
							<i
								class="ease-soft mb-0.75 relative block h-0.5 rounded-sm bg-slate-500 transition-all"
							/>
							<i
								class:-translate-x-[5px]={leftSideNavBarActive}
								class="ease-soft relative block h-0.5 rounded-sm bg-slate-500 transition-all"
							/>
						</div>
					</a>
				</li>
				<li class="flex items-center px-4">
					<a
						href="#"
						class="p-0 transition-all text-sm ease-nav-brand text-slate-500"
						on:click={rightSideNavTrigger}
					>
						<Icon class="cursor-pointer" icon="fa-cog" />
						<!-- fixed-plugin-button-nav  -->
					</a>
				</li>

				<!-- notifications -->

				<!--<li class="relative flex items-center pr-2">
					<p class="hidden transform-dropdown-show" />
					<a
						href="#"
						class="block p-0 transition-all text-sm ease-nav-brand text-slate-500"
						aria-expanded="false"
						on:click={notificationTrigger}
					>
						<Icon class="cursor-pointer" icon="fa-bell" />
					</a>
					<ul
						class:transform-dropdown={!notificationsActive}
						class:transform-dropdown-show={notificationsActive}
						class:opacity-0={!notificationsActive}
						class:before:-top-5={!notificationsActive}
						class="text-sm transform-dropdown before:font-awesome before:leading-default before:duration-350 before:ease-soft lg:shadow-soft-3xl duration-250 min-w-44 before:sm:right-7.5 before:text-5.5 pointer-events-none absolute right-0 top-0 z-50 origin-top list-none rounded-lg border-0 border-solid border-transparent bg-white bg-clip-padding px-2 py-4 text-left text-slate-500 transition-all before:absolute before:right-2 before:left-auto before:top-0 before:z-50 before:inline-block before:font-normal opacity-0 before:text-white before:antialiased before:transition-all before:content-['\f0d8'] sm:-mr-6 lg:absolute lg:right-0 lg:left-auto lg:mt-2 lg:block lg:cursor-pointer"
					>
						
						<Notification />
						<Notification />
					</ul>
				</li>-->
			</ul>
		</div>
	</div>
</nav>

<!-- end Navbar -->
