<script>
	import { createEventDispatcher } from 'svelte';
	export let show = true;
	const dispatch = createEventDispatcher();
	const hide = () => {
		show = false;
		dispatch('hide', {});
	};
</script>

<div class="main" style:display={show ? null : 'none'} on:click={hide}>
	<div class="inner" on:click|stopPropagation>
		<slot />
	</div>
</div>

<style lang="scss">
	.main {
		display: flex;
		align-content: space-around;
		justify-content: center;
		width: 100vw;
		height: 100vh;
		z-index: 10000;
		position: fixed;
		top: 0;
		left: 0;
		background-color: rgba(63, 77, 77, 0.5);
		padding: auto;
	}
	.inner {
		margin: auto;
	}
</style>
