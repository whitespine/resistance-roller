<script>
   import { ApplicationShell }   from '@typhonjs-fvtt/runtime/svelte/component/core';
   import { domainChoices, skillChoices } from "../../stores"

   export let elementRoot;

   const domains = CONFIG.resistanceRoller.domains;
   const skills = CONFIG.resistanceRoller.skills;


</script>

<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true}/>

<!-- ApplicationShell provides the popOut / application shell frame, header bar, content areas -->
<!-- ApplicationShell exports `elementRoot` which is the outer application shell element -->
<ApplicationShell bind:elementRoot>
   <main>
      <h1 class="header">Resistance Roll</h1>
      <div class="domains"> 
         Domains

         {#each domains as domain}
            <label>
               <input type=checkbox bind:group={$domainChoices} name="flavours" value={domain}>
               {domain}
            </label>
         {/each}
         <span>{$domainChoices.join("")}</span>
      </div>
      <div class="skills"> 
         Skills
      </div>
      <div class="addons"> 
         Addons
      </div>
      <div class="threats">
         Threats
      </div>
      <div class="threats">
         Goal
      </div>
   </main>
</ApplicationShell>

<style lang="scss">
   main {
      display: grid;
      text-align: center;
      grid-template-columns: repeat(6, 1fr);
      grid-template-rows: 60px 1fr 60px;
   }

   .header {
      grid-column: 1 / 7;
      grid-row: 1;
   }
   .domains {
      grid-column: 1 / 3;
      grid-row: 2;
      display: flex;
      flex-direction: column;
   }
   .skills {
      grid-column: 3 / 5;
      grid-row: 2;
      display: flex;
      flex-direction: column;
   }
   .addons {
      grid-column: 5 / 7;
      grid-row: 2;
   }
   .threats {
      grid-column: 3;
      grid-row: 3;
   }
</style>