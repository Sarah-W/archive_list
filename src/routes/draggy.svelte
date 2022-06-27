<script>
  import Icon,{addIcon} from '@iconify/svelte/dist/OfflineIcon.svelte';
  import close from '@iconify-icons/mdi/close.js';
  import { searchById } from '$lib/digitalNZutils.js'
  import LittleDoc from '$lib/LittleDoc.svelte'
  import PrettyDoc from '$lib/PrettyDoc.svelte'
  import DnzSearchBox from '../lib/DNZSearchBox.svelte'

  addIcon("close",close)

  let results = new Promise(()=>{})
  let searchparams,incrementPage,decrementPage

  let selected = {}

  const dragstart = (e,document)=>{
   	e.dataTransfer.setData('text/plain', document.id.toString());
  }
  const dragover = (e)=>{
    e.preventDefault();
  }
  
  const drop = (e)=>{
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    selected[id]=searchById(id)
  }

  const dismiss =(id)=>{
    delete selected[id]
    selected=selected
  }

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
                <!-- {document.id} -->
                <LittleDoc {document} />
              </div>
            {/each}
    
          <button on:click={incrementPage}>Next Page</button>
        {/await}
        
      </div>
      
  </div>

  <div class = main
    on:drop={drop}
    on:dragover={dragover}>
    {#each Object.entries(selected) as [id,doc](id)}
      {#await doc then document}
        {#if document}
          <div class=docpanel>
            <PrettyDoc {document}/>
            <div class=dismiss on:click={()=>dismiss(id)}>
              <Icon icon = "close" style={"display:block"}/>
            </div>
          </div>
        {/if}
      {/await}
    {/each}  
  </div>

</div>

<style lang="scss">

    div{
      border: solid thin grey;
    }

  .container{
    height: 98vh;
    width:80%;
    margin:auto;
    display:grid;
    grid-template-columns: 30% 70%;
    grid-template-rows: 100%;
  }
  .sidebar{
    display:flex;
    flex-direction: column;
    height:100%
  }
  .results{
    overflow-x:auto;
    height:auto;
  }
  .main{
    overflow-x:auto
  }
  .docpanel{
    display:block;
    position:relative;
    .dismiss{
      position:absolute;
      right:0px;
      top:0px;
      font-size:50px;
      display: block;
      border:none;
      opacity: 50%;
      width: fit-content;
    }
  }

  button{
      width:100%;
      height:30px;
      margin:10px 0px 10px 0px;
    }

//   @media only screen and (max-width: 500px) {
//     .container{
//       display: flex;
//       flex-direction: column;
//       width:100%;
//       margin:5px;
//     }

//     .sidebar{
//       width:100%;
//     }
//     .main{
//       overflow-x: scroll;
//       flex-basis: 100%;
//     }
//     button{
//         width:100%;
//         height:30px;
//         margin-top: 15px;
//       }

//   }

// @media only screen and (min-width: 500px) {
//   .container{
//     display:flex;
//     width:70%;
//     margin:auto;
//     flex-direction: row;
//   }

//     div{
//       border: solid thin grey;
//     }

//     .sidebar{
//       width:30%;
//     }
//     .main{
//       // display:flex;
//       flex-basis: 70%;
//     }
//   }

//   h2{
//     margin-left: 5px;
//   }
//   button{
//       width:100%;
//       height:30px;
//       margin:10px 0px 10px 0px;
//     }
</style>