<script>
// @ts-nocheck
  import { createEventDispatcher } from 'svelte';
  import {format} from 'date-fns'
  import { categories } from '$lib/digitalnz/digitalNZutils'
  import Icon from '@iconify/svelte/dist/OfflineIcon.svelte';
  export let color = "white"

  const dateformat = "d/M/yyyy"

  export let document = {}
  let noImgSource=false
  let dispatch = createEventDispatcher()

  const mouseenterHandler= (e)=>{
    const bbox = e.target.getBoundingClientRect()
    dispatch("hover",{id:document.id,left:bbox.left,top:bbox.top})
  }

  const mouseleaveHandler= ()=>{
    dispatch("unhover",{})
  }

  // $: console.log(noImgSource)
  
  const _format= (date)=>{
    try {
      return format(new Date(document.date[0]),dateformat)
    } catch {
      console.log("bad date", date)
    }
    return ""
  }
</script>

  <div class="doc" style:background-color={color}>

    {#if document.thumbnail_url && !noImgSource}  
      <div class = pic>
        <img 
          alt={document.title} 
          src={document.thumbnail_url} 
          on:mouseenter={mouseenterHandler}
          on:mouseleave={mouseleaveHandler} 
          on:error={()=>{noImgSource=true}}/>
      </div>
    {:else}
      <div class = icon>
        {#if document.category[0] && categories.dict[document.category[0]]}
          <Icon icon ={categories.dict[document.category[0]].icon}  style={"display:block"}/>
        {:else}
          <!-- <Icon icon ={empty}  style={"display:block"}/> -->
        {/if}  
      </div>
    {/if}

      <div class =guts>
        <div class=header>
          {#if document.display_date}
            <p>{document.display_date}</p>
          {:else if document.date[0]}
            <p>{_format(document.date)}</p>
          {/if}
          <p>{document.content_partner[0]}</p>
        </div>
        <a target=_blank href={document.landing_url}>
          <h1>{document.title}</h1>
        </a>
      </div>  
  </div>



<style lang="scss">
  .popout{
    position:fixed;
    left:0;
    top:0;
  }

  .doc{
    // position: relative;
    border: solid thin grey;
    display:flex;
    align-items: center;
    margin:5px;
    width:fit-content;
    max-width:400px;
    border-radius: 45px;
    h1{
      font-size: small;
      margin:.2em 0em .2em 0em;
    }
    p{
      font-size: x-small;
      margin:.2em 0em .2em 0em;
    }
  }
    .pic,.icon{
      position:relative;
      min-width: 45px;
      width: 45px;
      height:45px;
      border-radius: 45px;
      margin:5px 0px 5px 5px;
      img{
        border: solid thin grey;
        position:absolute;
        display:block;
        object-fit:cover;
        height:45px;
        border-radius: 45px;
        width: 45px;
      }
    }

    .icon{
      width: 45px;
      height:45px;
      display:flex;
      justify-content: center;
      align-items: center;
      background-color: rgb(196, 207, 207);
      font-size: 35px;
      color:rgb(67, 64, 73);
    }


    // .pic:hover{
    //   border-radius: 15px;
    //   background-color: none;
    //   img{
    //     z-index: 999;
    //     border: solid thin grey;
    //     display:block;
    //     height:auto;
    //     width: auto;
    //     max-width: 200px;
    //     border-radius: 15px;
    //   }
    // }
  
  .guts{
    // border: solid thin rgb(211, 210, 210);
    display:flex;
    flex-direction: column;
    margin:5px;
    padding:5px;
    border-radius: 40px;
    .header{
      display:flex;
      flex-direction: row;
      gap:10px;
    }
  }

  // @media only screen and (max-width: 500px) {
  
  //   .guts{
  //     border: solid thin grey;
  //     display:flex;
  //     flex-direction: column;
  //     margin:5px;
  //     .pic{
  //       display:flex;
  //       justify-content: space-around;
  //       max-width: 100%;
  //       padding:3px;
  //       border: solid thin grey;
  //       img{
  //         max-width: 100%;
  //       }
  //     }
  //     .meta{
  //       // width:100%;
  //       padding-left:5px;
  //       p.link{
  //         width:95%;
  //           overflow:hidden;
  //           white-space: nowrap;
  //           text-overflow:ellipsis;
  //       }
  //     }
  //   }

  // }


</style>