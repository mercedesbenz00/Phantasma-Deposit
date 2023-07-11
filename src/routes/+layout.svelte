<script lang="ts">
	import '../app.css';
	import '../soft-ui-dashboard-tailwind.min.css';
	import Header from '$lib/Components/Header/Header.svelte';
	import Footer from '$lib/Components/Footer/Footer.svelte';
	import Sidebar from '$lib/Components/Sidebar/Sidebar.svelte';
	import ConnectWalletModal from '$lib/Components/Wallet/ConnectWalletModal.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { NotificationsOptions } from '$lib/Components/Notification/NotificationsBuilder';
	import { connectWallet, OpenedModal, PhantasmaAPIClient, SoftwareName } from '$lib/store';
	import { ModalInternalTypes } from '$lib/Components/Modals/ModalInternalTypes';

	let showConnectWalletModal: boolean;
	let hash = '';
	connectWallet.subscribe((value) => {
		showConnectWalletModal = value;
	});

	function closeConnectWallet() {
		connectWallet.set(!showConnectWalletModal);
	}

	function closeModal() {
		OpenedModal.set(ModalInternalTypes.None);
	}

	let openedModal: ModalInternalTypes = ModalInternalTypes.None;
	OpenedModal.subscribe((value) => {
		openedModal = value;
	});
</script>

<svelte:head>
	<title>{SoftwareName}</title>
</svelte:head>

<Sidebar />
<main
	class="ease-soft-in-out xl:ml-68.5 relative h-full max-h-screen rounded-xl transition-all duration-200"
>
	<Header />
	<div class="mb-4 px-6 mx-auto">
		<div class="flex flex-wrap mt-6 -mx-3">
			{#if showConnectWalletModal}
				<ConnectWalletModal on:close={() => closeConnectWallet()} />
			{/if}
		</div>
	</div>

	<slot />
</main>

<Footer />

<SvelteToast options={NotificationsOptions} />

<style>
	:root {
		--toastContainerBottom: 4rem;
		--toastContainerTop: auto;
	}
</style>
