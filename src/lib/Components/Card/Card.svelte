<script>
	import Icon from '@iconify/svelte';
	import { slide } from 'svelte/transition';

	export let size = 'xs';
	export let title = 'Title';
	export let description = 'Description';
	export let growth = '+55%';
	export let icon = 'fa-solid:money-bill-wave';
	export let transitionType = 'null';
	export let transitionDetails = null;
</script>

{#if size == 'xs'}
	<div class="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
		<div
			class="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border {$$restProps.class ||
				''}"
		>
			<div class="flex-auto p-4">
				<div class="flex flex-row -mx-3">
					<div class="flex-none w-2/3 max-w-full px-3">
						<div>
							<p class="mb-0 font-sans font-semibold leading-normal text-sm">{title}</p>
							<h5 class="mb-0 font-bold">
								{description}
								<span class="leading-normal text-sm font-weight-bolder text-lime-500">{growth}</span
								>
							</h5>
						</div>
					</div>
					<div class="px-3 text-right basis-1/3">
						<div
							class="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-purple-700 to-pink-500"
						>
							<Icon height="18" width="18" class="text-lg relative top-2.5 text-white" {icon} />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

{#if size == 'xs-c'}
	<div class="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
		<div
			class="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border {$$restProps.class ||
				''}"
		>
			<div class="flex-auto p-4">
				<div class="flex flex-row -mx-3">
					<slot />
				</div>
			</div>
		</div>
	</div>
{/if}

{#if size == 'sm'}
	<div class="w-full px-3 mb-6 lg:mb-0 lg:w-4/12 lg:flex-none">
		<div
			class="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border {$$restProps.class ||
				''}"
		>
			<div class="flex-auto p-4">
				<div class="flex flex-wrap -mx-3">
					<slot />
					<!--<div class="max-w-full px-3 lg:w-1/2 lg:flex-none">
              <div class="flex flex-col h-full">
                  <p class="pt-2 mb-1 font-semibold">Built by developers</p>
                  <h5 class="font-bold">Soft UI Dashboard</h5>
                  <p class="mb-12">From colors, cards, typography to complex elements, you will find the full documentation.</p>
                  <a class="mt-auto mb-0 font-semibold leading-normal text-sm group text-slate-500" href="javascript:;">
                  Read More
                  <i class="fas fa-arrow-right ease-bounce text-sm group-hover:translate-x-1.25 ml-1 leading-normal transition-all duration-200"></i>
                  </a>
              </div>
              </div>
              <div class="max-w-full px-3 mt-12 ml-auto text-center lg:mt-0 lg:w-5/12 lg:flex-none">
              <div class="h-full bg-gradient-to-tl from-purple-700 to-pink-500 rounded-xl">
                  <img src="../assets/img/shapes/waves-white.svg" class="absolute top-0 hidden w-1/2 h-full lg:block" alt="waves" />
                  <div class="relative flex items-center justify-center h-full">
                  <img class="relative z-20 w-full pt-6" src="../assets/img/illustrations/rocket-white.png" alt="rocket" />
                  </div>
              </div>
              </div>-->
				</div>
			</div>
		</div>
	</div>
{/if}

{#if size == 'md'}
	<div class="w-full px-3 mb-6 lg:mb-0 lg:w-1/2 lg:flex-none">
		<div
			class="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border {$$restProps.class ||
				''}"
		>
			<div class="flex-auto p-4">
				<div class="flex flex-wrap -mx-3">
					<slot />
					<!--<div class="max-w-full px-3 lg:w-1/2 lg:flex-none">
        <div class="flex flex-col h-full">
        <p class="pt-2 mb-1 font-semibold">Built by developers</p>
        <h5 class="font-bold">Soft UI Dashboard</h5>
        <p class="mb-12">From colors, cards, typography to complex elements, you will find the full documentation.</p>
        <a class="mt-auto mb-0 font-semibold leading-normal text-sm group text-slate-500" href="javascript:;">
        Read More
        <i class="fas fa-arrow-right ease-bounce text-sm group-hover:translate-x-1.25 ml-1 leading-normal transition-all duration-200"></i>
        </a>
        </div>
        </div>
        <div class="max-w-full px-3 mt-12 ml-auto text-center lg:mt-0 lg:w-5/12 lg:flex-none">
        <div class="h-full bg-gradient-to-tl from-purple-700 to-pink-500 rounded-xl">
        <img src="../assets/img/shapes/waves-white.svg" class="absolute top-0 hidden w-1/2 h-full lg:block" alt="waves" />
        <div class="relative flex items-center justify-center h-full">
        <img class="relative z-20 w-full pt-6" src="../assets/img/illustrations/rocket-white.png" alt="rocket" />
        </div>
        </div>
        </div>-->
				</div>
			</div>
		</div>
	</div>
{/if}

{#if size == 'lg'}
	<div
		transition:slide={{ duration: 1000 }}
		class="w-full max-w-full px-3 mt-0 mb-6 md:mb-0 md:w-1/2 md:flex-none lg:w-2/3 lg:flex-none"
	>
		<div
			class="border-black/12.5 shadow-soft-xl relative flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border {$$restProps.class ||
				''}"
		>
			<div class="flex-auto p-4">
				<div class="flex flex-wrap mt-0 -mx-3">
					<!--<div class="flex-none w-7/12 max-w-full px-3 mt-0 lg:w-1/2 lg:flex-none">
          <h6>{title}</h6>
            <p class="mb-0 leading-normal text-sm">
            <i class="fa fa-check text-cyan-500"></i>
            {description}
          </p>
        </div>
        <div class="flex-auto p-6 px-0 pb-2">
          <div class="overflow-x-auto">
            <slot></slot>
          </div>
        </div>-->
					<slot />
				</div>
			</div>
		</div>
	</div>
{/if}

{#if size == 'xl'}
	<div class="w-full max-w-full px-3 mt-0 mb-6 md:mb-0 md:w-full md:flex-none lg:flex-none">
		<div
			class="border-black/12.5 shadow-soft-xl relative flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border {$$restProps.class ||
				''}"
		>
			<div class="flex-auto p-4">
				<div class="flex flex-wrap mt-0 -mx-3">
					<div class="flex-none w-7/12 max-w-full px-3 mt-0 lg:w-1/2 lg:flex-none">
						<h6>{title}</h6>
						<p class="mb-0 leading-normal text-sm">
							<i class="fa fa-check text-cyan-500" />
							{description}
						</p>
					</div>
				</div>
				<div class="flex-auto p-6 px-0 pb-2">
					<div class="overflow-x-auto">
						<slot />
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
