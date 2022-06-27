<script>
  import Icon,{addIcon} from '@iconify/svelte/dist/OfflineIcon.svelte';
  import trashIcon from '@iconify-icons/mdi/trash-can-outline';
  import recycle from '@iconify-icons/mdi/recycle';  
  import close from '@iconify-icons/mdi/close'; 
  import { searchById } from '$lib/digitalNZutils.js'
  import LittleDoc from '$lib/LittleDoc.svelte'
  import PrettyDoc from '$lib/PrettyDoc.svelte'
  import DnzSearchBox from '../lib/DNZSearchBox.svelte'


  addIcon("close",close)

  let results = new Promise(()=>{})
  let searchparams,incrementPage,decrementPage

  let selected = {}
  let trashed = []
  let hoveredElement=""

  const isNotTrash = (id,trashed)=>{
    return !(trashed.findIndex(d=>d==id) >= 0)
  }
  const isNotSelected = (id,selected)=>{
    let _selected = Object.keys(selected)
    return !(_selected.findIndex(d=>d==id) >= 0)
  }  

  const dragFromResult = (e,item)=>{
    const bbox=e.srcElement.getBoundingClientRect()
    let data={
      fetched:item,
      id:item.id.toString(),
      width:bbox.width,
      height:bbox.height,
      x:e.offsetX,
      y:e.offsetY
    }
   	e.dataTransfer.setData('text/plain', JSON.stringify(data));
  }

  const dragFromTimeline = (e,_doc)=>{
    let doc={..._doc}    
    doc.x = e.offsetX
    doc.y = e.offsetY
   	e.dataTransfer.setData('text/plain', JSON.stringify(doc));
  }

  const dragover = (e,element)=>{
    e.preventDefault();
    hoveredElement = element
  }

  const drop = (e)=>{
    e.preventDefault();
    e.srcElement.classList.remove("draggedover")
    let {id,fetched,width,height,x,y} = JSON.parse(e.dataTransfer.getData("text/plain"))
    selected[id]={
      id,
      fetched,
      x:e.offsetX-x,
      y:e.offsetY-y,
      width,
      height
    }
  }

  const dismiss =(e)=>{
    e.preventDefault();
    let {id} = JSON.parse(e.dataTransfer.getData("text/plain"))
    delete selected[id]
    selected=selected
    hoveredElement=""
  }

  const trash =(e)=>{
    e.preventDefault();
    let {id} = JSON.parse(e.dataTransfer.getData("text/plain"))
    delete selected[id]
    trashed.push(id)
    selected=selected
    hoveredElement=""
  }

</script>

<div class = container>
  <div class = sidebar>
    <DnzSearchBox
      hasDate={true}
      showHasDate={false} 
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
              {#if document.date && isNotSelected(document.id,selected) && isNotTrash(document.id,trashed)}
                <div class = result
                  draggable=true 
                  on:dragstart={e=>dragFromResult(e,document)} 
                  >
                  <LittleDoc {document} />
                </div>
                {/if}
            {/each}
    
          <button on:click={incrementPage}>Next Page</button>
        {/await}
        
      </div>
      
  </div>

  <div class = main
    on:drop={drop}
    on:dragover={dragover}>
    <svg class = timeline height = 1000px width = 100%>
      {#each Object.entries(selected) as [id,doc],i (id)}
        <foreignObject 
          x={doc.x} 
          y={doc.y} 
          width={doc.width} 
          height={doc.height+200}
          >
          <div class = result
          draggable=true 
          on:dragstart={e=>dragFromTimeline(e,doc)} 
          >
            <LittleDoc document={doc.fetched}/>
          </div>
        </foreignObject>    
      {/each} 
    </svg> 
  </div>
</div>
<div class="disposal">
  <div 
    class = recycle
    class:hovering={hoveredElement == "recycle"}
    on:dragover={(e)=>dragover(e,"recycle")}
    on:drop={dismiss}
    >
    <Icon icon = {recycle} style={"display:block"}/>
  </div>
  <div 
    class = trash
    class:hovering={hoveredElement == "trash"}
    on:dragover={(e)=>dragover(e,"trash")}
    on:drop={trash}
    >
    <Icon icon = {trashIcon} style={"display:block"}/>
  </div>
</div>

<style lang="scss">
  svg.timeline{
    background-color: aquamarine;
  }
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
  .result{
    width:fit-content;
    border:none
  }
  .main{
    overflow-x:auto
  }

  .disposal{
    position:absolute;
    right:0;
    bottom:0;
    width:fit-content;
    border:none;
    .recycle,.trash{
      display:flex;
      flex-direction: row;
      justify-content: end;
      align-items: center;
      border-radius: 5px;
      background-color: grey;
      opacity:15%;
      font-size:100px;
      width:250px;
      height:110px;
      margin:5px;
    }
    .hovering{
      opacity:50%;
    }
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
      :global(svg){
        display:block;
      }
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