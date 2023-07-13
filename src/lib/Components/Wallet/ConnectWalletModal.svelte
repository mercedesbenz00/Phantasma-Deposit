<script lang="ts">
	import Modal from '$lib/Components/Modals/Modal.svelte';
	import { ModalType } from '$lib/Components//Modals/ModalType';
	import Icon from '@iconify/svelte';

	import { LinkWallet, LinkDapp, SoftwareName } from '$lib/store';
	import { PhantasmaLink } from 'phantasma-ts';
	import { createEventDispatcher, onDestroy } from 'svelte';

	import { connectWallet } from '$lib/store';
	import {
		NotificationError,
		NotificationSuccess
	} from '$lib/Components/Notification/NotificationsBuilder';

	let _modalType = ModalType.Wallet;

	const dispatch = createEventDispatcher();
	const close = () => dispatch('close');

	let Link: PhantasmaLink;

	LinkWallet.subscribe((value) => {
		Link = value;
	});

	const login = (providerHint: string | undefined) => {
		// @ts-ignore
		Link.login(
			function (success) {
				NotificationSuccess('Wallet connected!', "You're now connected to your wallet.");
				LinkWallet.set(Link);
				connectWallet.set(false);
				// @ts-ignore
			},
			function (error) {
				NotificationError('Wallet connect Error!', "We couldn't connect to your wallet.");
				console.error('error');
			},
			2,
			'phantasma',
			providerHint
		);
	};

	LinkWallet.set(new PhantasmaLink(SoftwareName, true));

	import { onMount } from 'svelte';

	let ws: WebSocket;

	onMount(() => {
		ws = new WebSocket('ws://localhost:7090/phantasma');

		ws.onopen = () => {
			console.log('Connection opened');
		};

		ws.onmessage = (msg) => {
			console.log('Message received:', msg.data);
		};

		ws.onerror = (error) => {
			console.log('Error occurred:', error);
		};

		ws.onclose = () => {
			console.log('Connection closed');
		};
	});

	// Don't forget to close the connection when the component is destroyed
	onDestroy(() => {
		if (ws) {
			ws.close();
		}
	});
</script>

<Modal title="Connect wallet" modalType={_modalType} on:close={close}>
	<p class="text-sm font-normal text-gray-500 dark:text-gray-400">
		Connect with one of our available wallet providers or create a new one.
	</p>
	<ul class="my-4 space-y-3">
		<li>
			<a
				href="#"
				on:click={() => login('poltergeist')}
				class="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
			>
				<img src="SOUL.png" alt="poltergeist" class="w-8 h-8" />
				<span class="flex-1 ml-3 whitespace-nowrap">Poltergeist Wallet</span>
				<span
					class="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400"
					>Popular</span
				>
			</a>
		</li>
		<li>
			<a
				href="#"
				on:click={() => login('ecto')}
				class="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
			>
				<img src="ectoIcon.png" alt="poltergeist" class="w-8 h-8 rounded-full" />
				<span class="flex-1 ml-3 whitespace-nowrap">Ecto Wallet</span>
			</a>
		</li>
	</ul>
	<div>
		<a
			href="#"
			class="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400"
		>
			<Icon icon="ph:question-light" />
			Why do I need to connect with my wallet?
		</a>
	</div>
</Modal>
