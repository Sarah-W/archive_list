<script>
  import {
    searchByTerm,
    searchByCategory,
    searchWithParams,
    categories,
    primaryCollections
  } from '$lib/digitalNZutils.js'
  import DisplayDoc from '$lib/DisplayDoc.svelte'
  import PrettyDoc from '$lib/PrettyDoc.svelte'

  let category=""
  let primary_collection=""
  let text = ""

  // $:console.log({category,primary_collection,text})

  $: searchparams ={
    category,
    primary_collection,
    text
  }

 let updateCollections = (/** @type {any} */ collections)=>{
  // if(!collections.find(d=>d==primary_collection)){primary_collection=""}
  primary_collection=""
  return collections
 }

  $:collections = primaryCollections(category)
    .then(updateCollections)

 let results = new Promise(()=>{})

 const search = async()=>{
  results = searchWithParams(searchparams)
  console.log(await results)
 }

 const enter = (e) => {
		if (e.code == 'Enter') {
			search();
		}
	};

</script>


<div class = container>
  <div class = sidebar>
    <div>
      <fieldset>
        <legend>Search DigitalNZ</legend>
        <div class = input>
          <label for="category">Category</label>
          <select
            id="category"
            bind:value={category}
          >
          <option value="">All Categories</option>
            {#each categories as category}
              <option value={category}>{category}</option>
            {/each}  
          </select>
        </div>
        <div class = input>
          <label for="collection">Primary Collection</label>
          <select
            id="collection"
            bind:value={primary_collection}
          >
          <option value="">All Collections</option>
          {#await collections then c}
            {#each c as collection}
              <option value={collection}>{collection}</option>
            {/each}
          {/await}  
          </select>
        </div>
        <div class = input>
          <label for="term">Search Term</label>
          <input
            type="text"
            id="term"
            bind:value={text}
            label="term"
            on:keypress={enter}
          />
        </div>
        <button on:click={search}>Go!</button>
      </fieldset>
    </div>
  </div>

  <div class = results>
    <h1>A list of docs</h1>
    {#await results then docs}
      {#each docs.search.results as document}
       <!-- <DisplayDoc {document}> -->
       <!-- </DisplayDoc> -->
       <PrettyDoc {document}></PrettyDoc>
      {/each}
    {/await}
  </div>
</div>

<style lang="scss">

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
    overflow-x: scroll;
    flex-basis: 80%;
  }


  fieldset{
      border-radius:4px;
      border-color: #ccc;
      border-width: thin;
      border-style: solid;
      margin:5px; 
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

</style>