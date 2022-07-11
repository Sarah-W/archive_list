<script>
  // import User from './User.svelte';
</script>

<nav>
  <div class = container>
    <div class = inner>
      <div id = start>
        <h1 style="margin-bottom:0px">Timeline</h1>
      </div>
      <div id = middle></div>
      <div id = end >
        <!-- <User></User> -->
      </div>
    </div>
  </div>
</nav>

<style lang="scss">


  .container {
    display:grid;
    grid-template-columns: 100%;
    grid-template-rows: 100%;
    height: 6.5vh;
    width: 90%;
    margin:auto;
    border: solid thin grey;
    .inner{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 10px;
    }
  }
</style>