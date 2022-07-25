<script>
  export let backgroundColor = "#999"
  export let textColor = "#cecece"
  export let fontSize = 20
  export let nTicks = 4
  export let fontFamily =  "'Times New Roman', Times, serif"
  export let ffName = "Serif" 

  const fontDictionary ={
    "Serif":"'Times New Roman', Times, serif",
    "Sans serif":"Arial, Helvetica, sans-serif",
    "Monospace":"'Courier New', Courier, monospace",
    // "Brush":"'Brush Script MT', 'Brush Script Std',cursive",
    "Comic":"'Comic Sans MS', 'Comic Sans',Chilanka, cursive"
  }

$: fontFamily=fontDictionary[ffName]


</script>

<fieldset>
  <legend>Style Options</legend>
  <div class = colorset>
    <div >
      <label for="background">Background</label>
      <input type="color" id="background" name="background"
            bind:value={backgroundColor}>  
    </div>
    <div >
      <label for="textcolour">Scale Text</label>
      <input type="color" id="textcolour" name="textcolour"
            bind:value={textColor}>
      
    </div>
  </div>
  <div class = input>
    <label for="fontsize">Text Size</label>
    <input type="range" id="fontsize" name="fontsize"
      min=10 max=100
      bind:value={fontSize}>
  </div>
  <div class = input>
    <label for="nticks">Number of Scale Ticks</label>
    <input type="range" id="nticks" name="nticks"
      min=2 max=10
      bind:value={nTicks}> 
  </div>
  <div class = select>
    <label for="fontstyle">Font style </label>
    <select
      type="select"
      id="fontstyle"
      bind:value={ffName}
    >
      {#each Object.keys(fontDictionary) as style}
        <option value={style}>{style}</option>
      {/each}
    </select>
  </div>

</fieldset>

<style lang="scss">
  fieldset{
    border-radius:4px;
    border-color: #ccc;
    border-width: thin;
    border-style: solid;
    margin:5px;
  }

  div.buttonset{
    width:100%;
    display:flex;
    flex-direction: row;
    margin:0px;
    padding:5px 0px;
    gap:5px;
    justify-content: space-between;
    button{
      width:100%
    }
  }

  div.colorset{
    width:100%;
    display:flex;
    flex-direction: row;
    margin:0px 0px 3px 0px;
    padding:5px 0px;
    gap:5px;
    justify-content:start;
    input{
      width:100%
    }
    label{
      margin-bottom: 3px;
      font-size: small;
    }
  }

.select{
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
  label{
    margin-bottom: 3px;
    font-size: small;
  }
} 


  .input{
  display: flex;
  flex-direction: column;
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
    margin-bottom: -3px;
    font-size: small;
  }

} 


button{
    width:100%;
    height:30px;
    margin:10px 0px 10px 0px;
  }
</style>