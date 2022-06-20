<script>
// @ts-nocheck

  import {format} from 'date-fns'

  const dateformat = "d/M/yyyy"

  export let document = {}
  
</script>

  <div class="doc">
      {#if document.thumbnail_url}
      <div class = pic>
        <img alt={document.title} src={document.thumbnail_url}/>
      </div>
      {/if}
      <div class =guts>
        
        {#if document.display_date}
          <p>Date: {document.display_date}</p>
        {:else if document.date[0]}
          <p>Date: {format(new Date(document.date),dateformat)}</p>
        {/if}
        <a target=_blank href={document.landing_url}>
          <h1>{document.title}</h1>
        </a>
      </div>  
  </div>



<style lang="scss">

  .doc{
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
    .pic{
      width: 45px;
      height:45px;
      border-radius: 45px;
      margin:5px 0px 5px 5px;
      border: solid thin grey;
      background-color: pink;

      img{
        display:block;
        object-fit:cover;
        height:45px;
        border-radius: 45px;
        width: 45px;
      }
    }
    .pic:hover{
      width:fit-content;
      height:fit-content;
      border-radius: 45px;
      margin:5px 0px 5px 5px;
      border: solid thin grey;
      background-color: pink;

      img{
        display:block;
        height:auto;
        width: auto;
        max-width: 200px;
        border-radius: 45px;
      }
    }
  }
  .guts{

    border: solid thin rgb(211, 210, 210);
    display:flex;
    flex-direction: column;
    margin:5px;
    padding:5px;
    border-radius: 40px;
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