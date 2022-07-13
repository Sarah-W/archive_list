<script>
  import DisplayDoc from '$lib/digitalnz/DisplayDoc.svelte'
  import LittleDoc from '$lib/digitalnz/LittleDoc.svelte'
  import PrettyDoc from '$lib/digitalnz/PrettyDoc.svelte'
  import DnzSearchBox from '../lib/digitalnz/DNZSearchBox.svelte'

  let results = new Promise(()=>{})
  let searchparams,incrementPage,decrementPage

</script>

<div class = container>
  <div class = sidebar>
    <DnzSearchBox 
      bind:results={results}
      bind:searchparams={searchparams} 
      bind:incrementPage={incrementPage}
      bind:decrementPage={decrementPage}/>
  </div>

  <div class = results>
    {#await results}
    <h2>Waiting for search</h2> 
    {:then docs}
      {#if searchparams.page>1}
        <button on:click={decrementPage}>Previous Page</button>
      {/if}  
        {#each docs.search.results as document}
          <LittleDoc {document} />
          <PrettyDoc {document}></PrettyDoc>
          <DisplayDoc {document}></DisplayDoc>        
        {/each}
      <button on:click={incrementPage}>Next Page</button>
    {/await}
    
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
  .results{
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
    display: flex;
    width:80%;
    margin:auto;
  }

    div{
      border: solid thin grey;
    }

    .sidebar{
      width:20%;
    }
    .results{
      flex-basis: 80%;
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