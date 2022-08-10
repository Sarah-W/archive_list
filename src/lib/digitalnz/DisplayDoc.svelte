<script>
	export let document = {};
</script>

<div class="entry">
	<p>{document.title}</p>
	<p>id: {document.id}</p>
</div>
{#each Object.entries(document) as entry}
	<!-- {#if entry[1] && entry[1].length && (entry[1]!="Unknown")} -->
	<div class="entry">
		{entry[0]}:
		{JSON.stringify(entry[1])}
	</div>
	<!-- {/if}   -->
{/each}

<style lang="scss">
	.entry {
		display: flex;
		gap: 10px;
	}
</style>
