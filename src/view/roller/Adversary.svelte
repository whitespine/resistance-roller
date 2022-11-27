<script>
   import { constants } from "../../constants";
   import { TJSDocument }  from '@typhonjs-fvtt/runtime/svelte/store';

   export let actor;
   const actore = new TJSDocument(actor);
   $: flags = $actore.flags[constants.moduleId];
   $: currentResistance = flags?.current_resistance ?? 0;
   $: maxResistance = flags?.max_resistance ?? constants.defaultMaxResistance;
   $: domains = flags?.domains ?? [];
</script>


<div>
    <img src={$actore.img}>
    <span>{$actore.name}</span>
    <progress value={currentResistance / maxResistance}>{currentResistance} / {maxResistance}</progress>
    {#each domains as domain}
        <div class=domain> {domain} </div>       
    {/each}
</div>

<style lang="scss">
    div {
        display: grid;
        grid-template-rows: 1fr 10px 10px;
        grid-auto-rows: 20px;
    }
    progress {
		display: block;
		width: 100%;
	}
    .domain {
        font-size: 0.8em;
        text-transform: uppercase;
        color: #B0B0B0;

        border: 0;
        font-weight: bold;
        margin: 2px;
        padding: 2px;
        background-color: #834040;
    }
</style>