<script>
  import { searchById } from '$lib/digitalNZutils.js'
  import LittleDoc from '$lib/LittleDoc.svelte'
  import PrettyDoc from '$lib/PrettyDoc.svelte'
  import DnzSearchBox from '../lib/DNZSearchBox.svelte'

  let results = new Promise(()=>{})
  let searchparams,incrementPage,decrementPage

  let idlist = [] 
  let selected = {}

  const dragstart = (e,document)=>{
   	e.dataTransfer.setData('text/plain', document.id.toString());
    console.log("drag has started",document.id.toString())
  }
  const dragover = (e)=>{
    e.preventDefault();
  }
  
  const drop = (e)=>{
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    selected[id]=searchById(id)
    // console.log({id})
    // idlist=[id,...idlist]
  }

  // $: doclist = idlist.map(id=>({doc:searchById(id),id}))
  // $: console.log({idlist,doclist})

</script>

<div class = container>
  <div class = sidebar>
    <DnzSearchBox 
      bind:results={results}
      bind:searchparams={searchparams} 
      bind:incrementPage={incrementPage}
      bind:decrementPage={decrementPage}/>
      
      <div class = results>
        {#await results then docs}
          {#if searchparams.page>1}
            <button on:click={decrementPage}>Previous Page</button>
          {/if}  
            {#each docs.search.results as document}
              <div 
                draggable=true 
                on:dragstart={e=>dragstart(e,document)} 
                >
                {document.id}
                <LittleDoc {document} />
              </div>
            {/each}
    
          <button on:click={incrementPage}>Next Page</button>
        {/await}
        
      </div>
      
  </div>
  <!-- <div class = main 
    on:drop={drop}
    on:dragover={dragover}>
    {#each doclist as {doc,id}(id)}
      {#await doc then document}
        {#if document}
          <PrettyDoc {document}/>
        {/if}
      {/await}
    {/each}  
  </div> -->
  <div class = main 
    on:drop={drop}
    on:dragover={dragover}>
    {#each Object.entries(selected) as [id,doc](id)}
      {#await doc then document}
        {#if document}
          <PrettyDoc {document}/>
        {/if}
      {/await}
    {/each}  
  </div>

</div>

<style lang="scss">

@media only screen and (max-width: 500px) {
  .container{
    display: flex;
    flex-direction: column;
    width:100%;
    margin:5px;
  }

  .sidebar{
    width:100%;
  }
  .main{
    overflow-x: scroll;
    flex-basis: 100%;
  }
  button{
      width:100%;
      height:30px;
      margin-top: 15px;
    }

}

@media only screen and (min-width: 500px) {
  .container{
    display:flex;
    width:70%;
    margin:auto;
    flex-direction: row;
  }

    div{
      border: solid thin grey;
    }

    .sidebar{
      width:30%;
    }
    .main{
      // display:flex;
      flex-basis: 70%;
    }
  }

  h2{
    margin-left: 5px;
  }
  button{
      width:100%;
      height:30px;
      margin:10px 0px 10px 0px;
    }
</style>