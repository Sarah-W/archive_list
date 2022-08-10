<script>
	// @ts-nocheck
	export let document = {};
	// export let hovereddoc = {}
	let noImgSource = false;
</script>

{#if document.thumbnail_url && !noImgSource}
	<!-- <div class = pic style:display={currentdoc=document?.id?"none":"block"}> -->
	<div class="pic">
		<img
			alt={document.title}
			src={document.thumbnail_url}
			on:error={() => {
				noImgSource = true;
			}}
		/>
	</div>
{/if}

<style lang="scss">
	.pic {
		border-radius: 15px;
		background-color: none;
		img {
			z-index: 999;
			border: solid thin grey;
			display: block;
			height: auto;
			width: auto;
			max-width: 200px;
			border-radius: 15px;
		}
	}
</style>
