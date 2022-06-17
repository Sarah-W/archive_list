<script>
// @ts-nocheck

  import {format} from 'date-fns'

  const dateformat = "d/M/yyyy"

  export let document = {}
  
  $: datefields = ["created_at", ...Object.keys(document).filter(d=>d.includes("date"))]
  $:console.log(document)

</script>
<div class="doc">
  <div class = head>
    <div><h3>{document.title}</h3></div>

    <!-- <div><p>id: {document.id}</p></div> -->
  </div>
  <div class = guts>
    {#if document.thumbnail_url}
      <div class = pic>
        <img alt={document.title} src={document.thumbnail_url}/>
      </div>
    {/if}
    <div class=meta>
      {#if document.display_date}
        <p>Date: {document.display_date}</p>
      {:else if document.date[0]}
        <p>Date: {format(new Date(document.date),dateformat)}</p>
      {/if}
      {#if document.description}
        <p>Description: {document.description}</p>
      {/if}
      <p>Primary Collection: {document.primary_collection}</p>
      {#if document.fulltext}
        <div class = fulltext>
          <p>{document.fulltext}</p>
        </div>
      {/if}  
      <p class = link><a target=_blank href={document.landing_url}>{document.landing_url}</a></p>
      <p>Available date fields</p>
      <ul>
        {#each datefields as datefield}
          {#if document[datefield] && document[datefield].length}
            {@const date = new Date(document[datefield])}
            <li>
              {datefield}: 
              {#if isNaN(date)}
                {document[datefield]} (unparseable)
              {:else}
                {format(date,dateformat)}
              {/if}
            </li>
          {/if}
        {/each}
      </ul>
      
    </div>
  </div>
</div>


<style lang="scss">

  .entry{
    display: flex;
    gap:10px;
  }

  .fulltext{
    max-height: 200px;
    overflow-y: auto;
    padding:5px;
    margin: 5px 0px 5px 0px;
  }
  .guts{
    border: solid thin grey;
    display:flex;
    margin:5px;
    .pic{
      max-width: 20%;
      padding:3px;
      border: solid thin grey;
      img{
        max-width: 100%;
      }
    }
    .meta{
      width:100%;
      padding-left:5px
    }
  }

  .head{
    display: flex;
    gap:10px;
    justify-content: space-between;
    padding:5px;
  }

  div.doc{
    border: solid thin grey;
  }

  @media only screen and (max-width: 500px) {
  
    .guts{
      border: solid thin grey;
      display:flex;
      flex-direction: column;
      margin:5px;
      .pic{
        display:flex;
        justify-content: space-around;
        max-width: 100%;
        padding:3px;
        border: solid thin grey;
        img{
          max-width: 100%;
        }
      }
      .meta{
        // width:100%;
        padding-left:5px;
        p.link{
          width:95%;
            overflow:hidden;
            white-space: nowrap;
            text-overflow:ellipsis;
        }
      }
    }

  }


</style>