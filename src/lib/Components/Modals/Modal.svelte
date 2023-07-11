<script lang="ts">
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { ModalType } from './ModalType';

	const dispatch = createEventDispatcher();
	const close = () => dispatch('close');
	const confirm = () => dispatch('confirm');

	export let title = '';
	export let modalType: ModalType = ModalType.Information;

	let modal;

	const handle_keydown = (e) => {
		if (e.key === 'Escape') {
			close();
			return;
		}
	};
</script>

<svelte:window on:keydown={handle_keydown} />

<!--<div class="fixed top-0 left-0 w-full h-full bg-slate-400 bg-opacity-50 z-20" on:click={close}></div>-->

<!-- Main modal -->
{#if modalType == ModalType.Information}
	<div
		id="staticModal"
		tabindex="-1"
		aria-hidden="true"
		class:hidden={!close}
		class="hidden overflow-y-auto overflow-x-hidden bg-slate-400 bg-opacity-50 fixed top-0 right-0 left-0 z-[2000] p-4 w-full md:inset-0 h-modal md:h-full"
	>
		<div
			class="flex align-middle items-center justify-center mx-auto w-full max-w-2xl h-full md:h-auto"
		>
			<!-- Modal content -->
			<div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
				<!-- Modal header -->
				<div class="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
					<h3 class="text-xl font-semibold text-gray-900 dark:text-white">
						{title}
					</h3>
					<button
						type="button"
						class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
						data-modal-toggle="staticModal"
						on:click={close}
					>
						<svg
							class="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
							><path
								fill-rule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/></svg
						>
					</button>
				</div>
				<!-- Modal body -->
				<div class="p-6 space-y-6 w-80">
					<slot />
				</div>
				<!-- Modal footer -->
				<div
					class="flex items-center p-6 space-x-2 rounded-b border-t justify-center border-gray-200 dark:border-gray-600"
				>
					<button
						class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
						on:click={confirm}>Confirm</button
					>
					<button
						type="button"
						class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
						on:click={close}>Decline</button
					>
				</div>
			</div>
		</div>
	</div>
{/if}

{#if modalType == ModalType.Custom}
	<div
		id="staticModal"
		tabindex="-1"
		aria-hidden="true"
		class:hidden={!close}
		class="hidden overflow-y-auto overflow-x-hidden bg-slate-400 bg-opacity-50 fixed top-0 right-0 left-0 z-[2000] p-4 w-full md:inset-0 h-modal md:h-full"
	>
		<div
			class="flex align-middle items-center justify-center mx-auto w-full max-w-2xl h-full md:h-auto"
		>
			<!-- Modal content -->
			<div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
				<!-- Modal header -->
				<div class="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
					<h3 class="text-xl font-semibold text-gray-900 dark:text-white">
						{title}
					</h3>
					<button
						type="button"
						class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
						data-modal-toggle="staticModal"
						on:click={close}
					>
						<svg
							class="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
							><path
								fill-rule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/></svg
						>
					</button>
				</div>
				<slot />
			</div>
		</div>
	</div>
{/if}

{#if modalType == ModalType.Popup}
	<div
		id="popup-modal"
		tabindex="-1"
		class:hidden={!close}
		class="hidden overflow-y-auto overflow-x-hidden bg-slate-400 bg-opacity-50 fixed top-0 right-0 left-0 z-[2000] p-4 md:inset-0 h-modal md:h-full"
	>
		<div
			class="flex align-middle items-center justify-items-center justify-center mx-auto w-full max-w-md h-full md:h-auto"
		>
			<!-- Modal content -->
			<div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
				<!-- Modal header -->
				<div class="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
					<h3 class="text-xl font-semibold text-gray-900 dark:text-white">
						{title}
					</h3>
					<button
						type="button"
						class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
						data-modal-toggle="staticModal"
						on:click={close}
					>
						<svg
							class="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
							><path
								fill-rule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/></svg
						>
					</button>
				</div>

				<slot />
			</div>
		</div>
	</div>
{/if}

{#if modalType == ModalType.Wallet}
	<div
		id="staticModal"
		tabindex="-1"
		aria-hidden="true"
		class:hidden={!close}
		class="hidden overflow-y-auto overflow-x-hidden bg-slate-400 bg-opacity-50 fixed top-0 right-0 left-0 z-[2000] p-4 w-full md:inset-0 h-modal md:h-full"
	>
		<div
			class="flex align-middle items-center justify-center mx-auto w-full max-w-2xl h-full md:h-auto"
		>
			<!-- Modal content -->
			<div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
				<!-- Modal header -->
				<div class="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
					<h3 class="text-xl font-semibold text-gray-900 dark:text-white">
						{title}
					</h3>
					<button
						type="button"
						on:click={close}
						class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
						autofocus
					>
						<svg
							class="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
							><path
								fill-rule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/></svg
						>
					</button>
				</div>
				<!-- Modal body -->
				<div class="p-6">
					<slot />
				</div>
			</div>
		</div>
	</div>
{/if}
