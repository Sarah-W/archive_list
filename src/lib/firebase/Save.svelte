<script>
// @ts-nocheck

  import { user, list, saveTimeline, updateTimeline, deleteTimeline } from '$lib/firebase/firebase'
  import { createEventDispatcher } from 'svelte';
  import { page } from '$app/stores';
  export let initialTimeline = {}
  const dispatch = createEventDispatcher();
  export let documents = {}
  export let style = {}
  export /**
* @type {never[]}
*/
  let isPublic = false
  let trashed =[]
  let makeNewTimeline = false 
  let newTimelineName = ""
  let id = ""
  let index ="blank"

  const findIndex = (id,/** @type {any[]} */ list)=>{
    const i = list.findIndex(d=>d.id == id)
    if (i > -1){index=i} else index="blank" 
  }

  $: id=initialTimeline.id
  // @ts-ignore
  $: findIndex(id, $list)
  $: url = $page.url.href.replace(`/${$page.params?.id}`,"")+"/"+id

  const load = ()=>{
    // @ts-ignore
    const timeline = $list[index]
    id=timeline? timeline.id : null
    dispatch("load",timeline)
    newTimelineName= ""
	} 

	const save = ()=>{  
    const docs = Object.values(documents).map(({id,height,width,x,y})=>({id,height,width,x,y}))
		saveTimeline(newTimelineName,$user,docs,trashed,style,false)
		makeNewTimeline=false
	}  

  const update = async ()=>{
    const docs = Object.values(documents).map(({id,height,width,x,y})=>({id,height,width,x,y}))
		let published = !!($list[index].data.published)
    // @ts-ignore
		id = await updateTimeline($list[index],docs,trashed,style,published)
	}

  const togglePublish = async ()=>{
    let published = !($list[index].data.published)
    const docs = Object.values(documents).map(({id,height,width,x,y})=>({id,height,width,x,y}))
    id = await updateTimeline($list[index],docs,trashed,style, published)
  }

	const del = ()=>{
		deleteTimeline(id)
    dispatch("load",null)
	}



</script>


<fieldset>
  <legend>Saved Timelines</legend>
  {#if $user}
    <div class = input style:display={makeNewTimeline?"none":null}>
      <label for="timelines">Load a timeline: </label>
      <select
        type="select"
        id="timelines"
        bind:value={index}
        on:change={load}
      >
        <option value={"blank"}>&lt;new timeline&gt;</option>
        {#each $list as {data,id},i (id)}
          <option value={i}>{data.name}</option>
        {/each}
      </select>
  
      <div style:display={makeNewTimeline?"none":null} class = buttonset>
        <button disabled = {index=="blank"}  on:click={update}>Save</button>
        <button disabled = {index=="blank"}  on:click={togglePublish}>{$list[index]?.data.published ?"Unpublish":"Publish"}</button>	
        <button disabled = {index=="blank"}  on:click={load}>Revert</button>
        <button disabled = {index=="blank"}  on:click={del}>Delete</button>
      </div>
    </div>

    <div class = input  style:display={makeNewTimeline?null:"none"} >
      <label for="timelinename">New timeline name: </label>
      <input
        type="text"
        id="timelinename"
        bind:value={newTimelineName}
      />
  

      <div class = buttonset style:display={makeNewTimeline?null:"none"}>
        <button disabled = {!newTimelineName} on:click={save}>Save</button>
        <button on:click={()=>{makeNewTimeline=false}}>Cancel</button>
      </div>
    </div>

    <div class=input style:display={makeNewTimeline?"none":null} >
      <label for="newtimeline">Or save as a new timeline </label>
      <div id=newtimeline class = buttonset>	
        <button  disabled = {false} on:click={()=>{makeNewTimeline = true}}>Save as</button>
      </div>
    </div>

    <div class=input style:display={$list[index]?.data.published ?null:"none"} >
      <label for="share">Share this timeline: </label>
        <input id = share class = input type=text value = {url}/>
    </div>
    {:else}
    <p>Sign in to save, load or share a timeline.</p>
    {/if}

</fieldset>

<style lang="scss">
    fieldset{
      border-radius:4px;
      border-color: #ccc;
      border-width: thin;
      border-style: solid;
      margin:5px; 
    }

    div.buttonset{
		width:100%;
		display:flex;
		flex-direction: row;
		margin:0px;
		padding:5px 0px;
		gap:5px;
		justify-content: space-between;
		button{
			width:100%
		}
	}
    .input{
    display: flex;
    flex-direction: column;
    select{
      font-size: large;
      width:100%;
      color:darkslategrey;
      border-radius:4px;
      border-color: #ccc;
      border-width: thin;
      border-style: solid;
      padding:3px 0px 3px 3px;
      margin-bottom: 3px;
    }
    input{
      font-size: large;
      max-width:100%;
      color:darkslategrey;
      border-radius:4px;
      border-color: #ccc;
      border-width: thin;
      border-style: solid;
      padding:4px 7px 4px 7px;
      margin-bottom: 3px;
    }
    label{
      margin-bottom: 3px;
      font-size: small;
    }
  } 
  div.checkbox{
    display: flex;
    flex-direction: row;
    margin-bottom: 3px;
    gap:2px;
    input{
      margin-left:0px;
      margin-top:0px;
    }
  }
 

  button{
      width:100%;
      height:30px;
      margin:10px 0px 10px 0px;
    }
</style>