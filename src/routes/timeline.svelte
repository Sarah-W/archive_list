<script>
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte';
  import trashIcon from '@iconify-icons/mdi/trash-can-outline.js';
  import recycle from '@iconify-icons/mdi/recycle.js';  
  import LittleDoc from '$lib/LittleDoc.svelte'
  import DnzSearchBox from '../lib/DNZSearchBox.svelte'
  import { scaleTime } from 'd3-scale'
  import { extent } from 'd3-array'
  import { add, addMonths, format, intervalToDuration } from 'date-fns'

  let height = 1000
  
  let scale = scaleTime().domain([ addMonths(new Date(),-1),new Date()])
  let f = "MMMM yyyy"

 $: {
  scale.range([100,height-100])
  scale=scale
}



  let results = new Promise(()=>{})

  /**
* @type {{ page: number; } | undefined}
*/
  let searchparams
  /**
* @type {svelte.JSX.MouseEventHandler<HTMLButtonElement> | null | undefined}
*/
  let incrementPage
    /**
* @type {svelte.JSX.MouseEventHandler<HTMLButtonElement> | null | undefined}
*/
  let decrementPage

  let selected = {}
  /**
* @type {any[]}
*/
  let trashed = []
  let hoveredElement=""

  const isNotTrash = (/** @type {string} */ id,/** @type {string[]} */ trashed)=>{
    return !(trashed.findIndex(d=>d==id) >= 0)
  }
  const isNotSelected = (/** @type {string} */ id,/** @type {{}} */ selected)=>{
    let _selected = Object.keys(selected)
    return !(_selected.findIndex(d=>d==id) >= 0)
  }  

  const dragFromResult = (/** @type {DragEvent & { currentTarget: EventTarget & HTMLDivElement; }} */ e,/** @type {{ id: { toString: () => any; }; }} */ item)=>{
    // @ts-ignore
    const bbox=e.target.getBoundingClientRect()
    let data={
      fetched:item,
      id:item.id.toString(),
      width:bbox.width,
      height:bbox.height,
      x:e.offsetX,
      y:e.offsetY
    }
   	// @ts-ignore
   	e.dataTransfer.setData('text/plain', JSON.stringify(data));
  }

  const dragFromTimeline = (/** @type {DragEvent & { currentTarget: EventTarget & HTMLDivElement; }} */ e,/** @type {any} */ _doc)=>{
    let doc={..._doc}    
    doc.x = e.offsetX
    doc.y = e.offsetY
   	// @ts-ignore
   	e.dataTransfer.setData('text/plain', JSON.stringify(doc));
  }

  const dragover = (/** @type {DragEvent & { currentTarget: EventTarget & HTMLDivElement; }} */ e,/** @type {string} */ element)=>{
    e.preventDefault();
    hoveredElement = element
  }

  const rescale = ()=>{
    let dateRange = extent(Object.values(selected),(d=>new Date(d.fetched.date[0])))
    if(dateRange[1]-dateRange[0] < 3e9){// a bit over 1 month
      scale.domain([dateRange[0],addMonths(dateRange[0],1)])
    } else{
      scale.domain(dateRange)
    }
    scale=scale
  }

  const addToTimeline = (/** @type {DragEvent & { currentTarget: EventTarget & HTMLDivElement; }} */e)=>{
    e.preventDefault();
    // @ts-ignore
    e.target.classList.remove("draggedover")
    // @ts-ignore
    let {id,fetched,width,height,x,y} = JSON.parse(e.dataTransfer.getData("text/plain"))
    // @ts-ignore
    selected[id]={
      id,
      fetched,
      x:e.offsetX-x,
      // y:e.offsetY-y,
      date:new Date(fetched.date[0]),
      width,
      height
    }
    rescale()
  }



  const dismiss =(e)=>{
    e.preventDefault();
    let {id} = JSON.parse(e.dataTransfer.getData("text/plain"))
    delete selected[id]
    selected=selected
    hoveredElement=""
    rescale()
  }

  const trash =(e)=>{
    e.preventDefault();
    let {id} = JSON.parse(e.dataTransfer.getData("text/plain"))
    delete selected[id]
    trashed.push(id)
    selected=selected
    hoveredElement=""
    rescale()
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
      
      <div class = results
      on:dragover={(e)=>dragover(e,"")}
      on:drop={dismiss}
      >
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
    bind:clientHeight={height}
    on:drop={addToTimeline}
    on:dragover={dragover}>
    <svg class = timeline height = 1000px width = 100%>

      {#each scale.ticks(3) as scaleTick}
        <text class = "time"
          x={100}
          y={scale(scaleTick)}
        >
          {format(scaleTick,f)}
        </text>
      {/each} 
      {#each Object.entries(selected) as [id,doc],i (id)}
        <foreignObject 
          x={doc.x}
          y={scale(doc.date)} 
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
    display:block;
    background-color: rgb(239, 239, 239);
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
    height:100%;
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

  text.time{
    font-size: 120px;
    font-family: 'Times New Roman', Times, serif;
    fill: rgb(206, 202, 202);
    pointer-events: none;
  }
</style>