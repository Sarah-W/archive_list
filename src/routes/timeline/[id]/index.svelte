<script>
	import { page } from '$app/stores';
	import Timeline from '$lib/digitalnz/Timeline.svelte';
	import { onePublicTimeline } from '$lib/firebase/firebase.js';
	let thistimeline = onePublicTimeline($page.params.id);
	$: console.log($thistimeline);
</script>

<Timeline initialTimeline={$thistimeline} />
