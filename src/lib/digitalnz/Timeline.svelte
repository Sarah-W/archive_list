<script>
  import TimelineEntry from '$lib/digitalnz/TimelineEntry.svelte';
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte';
  import trashIcon from '@iconify-icons/mdi/trash-can-outline.js';
  import recycle from '@iconify-icons/mdi/recycle.js';  
  import LittleDoc from '$lib/digitalnz/LittleDoc.svelte'
  import DnzSearchBox from '$lib/digitalnz/DNZSearchBox.svelte'
  import Save from '$lib/firebase/Save.svelte'
  import { scaleTime } from 'd3-scale'
  import { extent } from 'd3-array'
  import { addHours, format } from 'date-fns'
  import { searchById } from '$lib/digitalnz/digitalNZutils'
  export let initialTimeline = {}

  let height = 1000
  
  let scale = scaleTime().domain([ addHours(new Date(),-1),new Date()])
  let f = "h:mmaaa d MMM yyyy"

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

  const dragover = (/** @type {DragEvent & { currentTarget: EventTarget & HTMLDivElement; }} */ e,/** @type {string} */ element)=>{
    e.preventDefault();
    hoveredElement = element
  }

  const rescale = ()=>{
    let dateRange = extent(Object.values(selected),(d=>new Date(d.fetched.date[0])))
    let duration =  dateRange[1]-dateRange[0]
    switch(true){ 
      case duration < 3.6e6: //1 hour
        scale.domain([dateRange[0],addHours(dateRange[0],1)])
        f = "h:mmaaa d MMM yyyy"
        break;
      case duration < 8.64e7: //1 day
        scale.domain(dateRange)
        f = "haaa d MMM yyyy"
        break;
      case duration < 8.64e8: //10 days
        scale.domain(dateRange)
        f = "haaa d MMM yyyy"
        break;
      case duration < 3.16e10: //1 year
        scale.domain(dateRange)
        f = "d MMM yyyy"
        break;
      case duration < 1.58e11: //5 years
        scale.domain(dateRange)
        f = "MMMM yyyy"
        break;
      default:
        scale.domain(dateRange)
        f = "yyyy" 
    }
    
    scale=scale
  }

  const addToTimeline = (/** @type {DragEvent & { currentTarget: EventTarget & HTMLDivElement; }} */e,currentX=0)=>{
    e.preventDefault();
    e.stopPropagation()
    // @ts-ignore
    e.target.classList.remove("draggedover")
    // @ts-ignore
    let {id,fetched,width,height,x,y} = JSON.parse(e.dataTransfer.getData("text/plain"))
    // @ts-ignore

    selected[id]={
      id,
      fetched,
      x:e.offsetX+currentX-x,
      date:new Date(fetched.date[0]),
      y:e.offsetY-y,
      width,
      height
    }    
    rescale()
  }

  const caughtDrop=(/** @type {{ detail: any; }} */ e)=>{
    let doc = e.detail
    // @ts-ignore
    selected[doc.id]=doc
  }

  const dismiss =( /** @type {{ preventDefault: () => void; dataTransfer: { getData: (arg0: string) => string; }; }} */ e)=>{
    e.preventDefault();
    let {id} = JSON.parse(e.dataTransfer.getData("text/plain"))
    // @ts-ignore
    delete selected[id]
    selected=selected
    hoveredElement=""
    rescale()
  }

  const trash =(/** @type {{ preventDefault: () => void; dataTransfer: { getData: (arg0: string) => string; }; }} */ e)=>{
    e.preventDefault();
    let {id} = JSON.parse(e.dataTransfer.getData("text/plain"))
    // @ts-ignore
    delete selected[id]
    trashed.push(id)
    selected=selected
    hoveredElement=""
    rescale()
  }

  // @ts-ignore
  const retrieveDoc = async ({id,height,width,x,y})=>{
    let fetched = await searchById(id)
    let date = new Date(fetched.date[0])
    // @ts-ignore
    selected[id]= {id,height,width,x,y,fetched,date}
    rescale()
  }



  const loadTimeline =(/** @type {{ data: { documents: { id: any; height: any; width: any; x: any; y: any; }[]; }; }} */ timeline)=>{
    console.log(timeline)
    if(timeline.data){
      trashed = timeline.data.trash
      selected={}
      timeline.data.documents.forEach(retrieveDoc)
    }
  }

 // @ts-ignore
  $:  loadTimeline(initialTimeline)
   
</script>

<div class = container bind:clientHeight={height}>
  <div class = "sidebar left">
    <div class = search>
      <DnzSearchBox
        hasDate={true}
        showHasDate={false} 
        bind:results={results}
        bind:searchparams={searchparams} 
        bind:incrementPage={incrementPage}
        bind:decrementPage={decrementPage}/>
    </div>
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
    on:drop={addToTimeline}
    on:dragover={dragover}
    >
    <svg class = timeline height = 100% width = 100%>

      {#each scale.ticks(3) as scaleTick,i (i)}
        <g 
          class = time 
          style:transform={`translate(100px,${scale(scaleTick)}px`}
        >
          <text>
          {format(scaleTick,f)}
        </text>
        </g>
      {/each} 

      {#each Object.values(selected) as doc (doc.id)}
        <TimelineEntry {doc} {scale} on:caughtDrop={caughtDrop}></TimelineEntry>
      {/each}
    </svg> 
  </div>
  <div class = "sidebar right">
    <Save 
      documents={selected} 
      {trashed}
      {initialTimeline}
      on:load={(e)=>loadTimeline(e.detail)}
    />
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
    // border: solid thin grey;
  }

  .container{
    height: 91vh;
    width:90%;
    margin:auto;
    display:grid;
    grid-template-columns: 20% 60% 20%;
    grid-template-rows: 100%;
    border: solid thin grey;
  }
  .sidebar{
    display:flex;
    flex-direction: column;
    height:100%;
 
  }
  .search{
    border: solid thin grey;
  }
  .results{
    overflow-x:auto;
    height:100%;
    border: solid thin grey;
  }
  .result{
    width:fit-content;
    border:none;
    // background-color:white;
  }
  .main{
    position: relative;
    overflow-x:auto;
    border: solid thin grey;
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
foreignObject{
  overflow:visible;
}
  g.time{
    transition:transform 1s;
    text{
      font-size: 20px;
      font-family: 'Times New Roman', Times, serif;
      fill: rgb(206, 202, 202);
      pointer-events: none;
      user-select: none;
    }
  }
</style>