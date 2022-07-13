<script>
  import { user, saveTimeline, list } from '$lib/firebase/firebase'
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let documents = {}
  export let trashed =[]
  let makeNewTimeline = false 
  let newTimelineName = ""
  let index ="blank"

  const load = ()=>{
    dispatch("load",$list[index])
    newTimelineName= ""
	} 

	const save = ()=>{  
    const docs = Object.values(documents).map(({id,height,width,x,y})=>({id,height,width,x,y}))
    console.log({docs,trashed})
		saveTimeline(newTimelineName,$user,docs,trashed)
		makeNewTimeline=false
	}  

  const update = ()=>{
		// updateSkirt($skirtlist[skirtindex],_skirt,_pieces)
	}

	const del = ()=>{
		// deleteSkirt(skirtID).then(load)
	}


</script>


<fieldset>
  <legend>Saved Timelines</legend>
  <div class = input style:display={makeNewTimeline?"none":null}>
    <label for="timelines">Load a timeline: </label>
    <select
      type="select"
      id="timelines"
      bind:value={index}
      on:change={load}
    >
      <option value={"blank"}></option>
      {#each $list as {data,id},i (id)}
        <option value={i}>{data.name}</option>
      {/each}
    </select>
 
    <div style:display={makeNewTimeline?"none":null} class = buttonset>
      <button disabled = {index=="blank"}  on:click={update}>Save</button>	
      <button disabled = {index=="blank"} on:click={load}>Revert</button>
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
 

  button{
      width:100%;
      height:30px;
      margin:10px 0px 10px 0px;
    }
</style>