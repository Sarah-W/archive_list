<script>
  import {
    searchWithParams,
    categories,
    primaryCollections
  } from '$lib/digitalNZutils.js'

  export let results = new Promise(()=>{})
  export let searchparams = {page:1}

  let category=""
  let primary_collection=""
  let text = ""
 

  // $:console.log({category,primary_collection,text})

  $: searchparams ={
    category,
    primary_collection,
    text,
    page:1
  }

 let updateCollections = (/** @type {any} */ collections)=>{
  // if(!collections.find(d=>d==primary_collection)){primary_collection=""}
  primary_collection=""
  return collections
 }

  $:collections = primaryCollections(category)
    .then(updateCollections)

 const search = async()=>{
  results = searchWithParams(searchparams)
 }

 const enter = (e) => {
		if (e.code == 'Enter') {
			search();
		}
	};

  export const incrementPage=()=>{
    searchparams.page ++
    search()
  }
  export const decrementPage=()=>{
    searchparams.page --
    search()
  }

</script>

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

<style lang="scss">

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

  button{
      width:100%;
      height:30px;
      margin:10px 0px 10px 0px;
    }
</style>

