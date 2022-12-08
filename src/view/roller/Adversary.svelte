<script>
   import { constants } from "../../constants";
   import { createEventDispatcher } from "svelte";
   import { TJSDocumentCollection } from "@typhonjs-fvtt/runtime/svelte/store";
   import Dropdown from "../components/Dropdown.svelte";

   /** @type { Actor } */
   export let actor = null;

   // Establish our callback for changing the actor
   const dispatch = createEventDispatcher();
	function selectActor(actor) {
		dispatch('select-actor', actor); 
   }

   // Establish our store for observing all actors
   /** @type { Array<Actor> } */
   const allActors = new TJSDocumentCollection(game.actors);

   // Derive properties from current actor
   $: name = actor?.name ?? "Nobody";
   $: img = actor?.img ?? "icons/svg/mystery-man.svg";
   $: flags = actor?.flags[constants.moduleId];
   $: currentResistance = flags?.current_resistance ?? 0;
   $: maxResistance = flags?.max_resistance ?? constants.defaultMaxResistance;
   $: domains = flags?.domains ?? [];

   // Derive options
   $: actorOptions = $allActors.filter(a => a.flags[constants.moduleId]?.tracked);
</script>

<div class="{$$props.class} main">
   <Dropdown class="name-selector" value={"foo"} options={actorOptions} let:value={actorOption} on:change={(e) => selectActor(e.detail )}>
      <h2 class="name" slot="button">
         <span>
            {name}
         </span>
         <i class="fas fa-ellipsis-vertical" style="float: right; cursor: pointer; padding-right: 10px;"></i>
      </h2>
      <span>{actorOption.name}</span>
   </Dropdown>
   <div class="portrait">
      <img src={img} />
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
