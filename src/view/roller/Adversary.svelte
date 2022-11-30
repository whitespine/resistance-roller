<script>
   import { constants } from "../../constants";

   export let actore; // A TJSDocument of an actor
   $: flags = $actore.flags[constants.moduleId];
   $: currentResistance = flags?.current_resistance ?? 0;
   $: maxResistance = flags?.max_resistance ?? constants.defaultMaxResistance;
   $: domains = flags?.domains ?? [];
</script>

<div class="main">
   <h2 class="name">{$actore.name}</h2>
   <div class="portrait">
      <img src={$actore.img} />
   </div>
   <div class="progress-bar">
      <div class="progress" style="width: {(100 * currentResistance) / maxResistance}%" />
      <span class="progress-text">
         {currentResistance} / {maxResistance}
      </span>
   </div>
   {#each domains as domain}
      <div class="domain">{domain}</div>
   {/each}
</div>

<style lang="scss">
   .main {
      display: grid;
      grid-template-rows: 35px 1fr 20px;
      grid-template-columns: 1fr 1fr;
      grid-auto-rows: 20px;
   }

   .name {
      text-align: center;
      grid-column: 1 / 3;
   }

   .portrait {
      grid-column: 1 / 3;
   }

   img {
      border: none;
   }

   .progress-bar {
      grid-column: 1 / 3;
      display: block;
      width: 100%;
      background: #37114d;
      // overflow: hidden;
      text-align: center;
   }

   .progress {
      background: #32e0e0;
      transition: all 0.3s;
      height: 20px;
      margin-bottom: -21px;
   }

   .progress-text {
      font-size: 1.3em;
      color: white;
      text-shadow: 1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000;
   }

   .domain {
      font-size: 0.8em;
      text-transform: uppercase;
      color: #d0d0d0;

      border: 0;
      font-weight: bold;
      margin: 2px;
      padding: 2px;
      background-color: #834040;
   }
</style>
