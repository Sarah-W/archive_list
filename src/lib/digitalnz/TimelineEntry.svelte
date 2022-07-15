<script>
// @ts-nocheck
  import LittleDoc from '$lib/digitalnz/LittleDoc.svelte'
  import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  const dispatch = createEventDispatcher()

  export let doc 
  export let scale

  let { id, fetched, x, date, y, width, height } = doc

  $: ({ id, fetched, x, date, y, width, height } = doc)

  let positionY
  // let dateY = scale(date)-height/2
  
  const onUpdateY = (y)=> {
   positionY = tweened(y, {duration: 1000, easing: cubicOut})
   positionY.set(scale(date)-height/2)
  }

  const onUpdateScale = (scale)=> {
   positionY.set(scale(date)-height/2)
  }

  $:onUpdateY(y)
  $:onUpdateScale(scale)

  const dragFromTimeline = (/** @type {DragEvent & { currentTarget: EventTarget & HTMLDivElement; }} */ e,/** @type {any} */ _doc)=>{
    let doc={..._doc}
    doc.x = e.offsetX
    doc.y = e.offsetY
   	// @ts-ignore
   	e.dataTransfer.setData('text/plain', JSON.stringify(doc));
    // @ts-ignore
 
  }

  const addToTimeline = (/** @type {DragEvent & { currentTarget: EventTarget & HTMLDivElement; }} */e,currentX=0)=>{
    e.preventDefault();
    e.stopPropagation()

    let {id,fetched,width,height,x,y} = JSON.parse(e.dataTransfer.getData("text/plain"))
    
    let updatedDoc={
      id,
      fetched,
      x:e.offsetX+currentX-x,
      date:new Date(fetched.date[0]),
      y:$positionY-e.offsetY,
      width,
      height
    }    

    dispatch("caughtDrop",updatedDoc)
  }

</script>

<foreignObject
          style:x={x}
          y={$positionY} 
          width={width} 
          height={height}
          out:fade
          >
          <div class = result
          draggable=true 
          on:dragstart={e=>dragFromTimeline(e,doc)}
          on:drop={e=>addToTimeline(e,x)}
          >
            <LittleDoc document={doc.fetched}/>
          </div>
        </foreignObject>    

<style lang="scss">

foreignObject{
  overflow:visible;
}
</style>

