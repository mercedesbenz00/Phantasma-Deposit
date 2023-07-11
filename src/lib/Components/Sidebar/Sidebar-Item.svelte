<script lang="ts">
	import Icon from '@iconify/svelte';
	import { activePage } from '$lib/store';
	import { createEventDispatcher } from 'svelte';

	let activePageItem: string;
	const dispatch = createEventDispatcher();
	const click = () => dispatch('click');

	activePage.subscribe((value) => {
		activePageItem = value;
	});

	function changePage() {
		activePage.set(page);
		click();
	}

	export let link = '/';
	export let title = 'Something';
	export let icon = 'Something';
	export let page = 'page';
</script>

<li class="mt-0.5 w-full">
	{#if activePageItem == page}
		<a
			class="py-2.7 shadow-soft-xl text-sm ease-nav-brand my-0 mx-4 flex items-center whitespace-nowrap rounded-lg bg-white px-4 font-semibold text-slate-700 transition-colors"
			on:click={changePage}
			href={link}
		>
			<div
				class="bg-gradient-to-tl from-blue-600 to-cyan-400 shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center stroke-0 text-center xl:p-2.5"
			>
				<Icon width="12px" height="12px" color="#FFFFFF" {icon} />
			</div>
			<span class="ml-1 duration-300 opacity-100 pointer-events-none ease-soft">{title}</span>
		</a>
	{:else}
		<a
			class="py-2.7 text-sm ease-nav-brand my-0 mx-4 flex items-center whitespace-nowrap px-4 transition-colors"
			on:click={changePage}
			href={link}
		>
			<div
				class="shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center stroke-0 text-center xl:p-2.5"
			>
				<Icon width="12px" height="12px" color="#000000" {icon} />
			</div>
			<span class="ml-1 duration-300 opacity-100 pointer-events-none ease-soft">{title}</span>
		</a>
	{/if}
</li>
