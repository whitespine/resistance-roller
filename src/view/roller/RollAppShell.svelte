<script>
   import { ApplicationShell }   from '@typhonjs-fvtt/runtime/svelte/component/core';
   import { domainChoices, skillChoices, mastery } from "../../stores"
   import Checktangle from "./Checktangle.svelte";

   export let elementRoot;

   const domains = CONFIG.resistanceRoller.domains;
   const skills = CONFIG.resistanceRoller.skills;

   const togglePresence = (in_store, value) => (() => {
      in_store.update(current => {
         if(current.includes(value)) {
            return current.filter(x => x != value);
         } else {
            return [...current, value];
         }
      })
   });

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
            <Checktangle label={domain} selected={$domainChoices.includes(domain)} on:click={togglePresence(domainChoices, domain)} />
         {/each}
         {$domainChoices.join("")}
      </div>
      <div class="skills"> 
         Skills
         {#each skills as skill}
            <Checktangle label={skill} selected={$skillChoices.includes(skill)} on:click={togglePresence(skillChoices, skill)} />
         {/each}
      </div>
      <div class="addons"> 
         Misc
         <label>
            <input type=checkbox bind:checked={$mastery}>
            Mastery
         </label>
      </div>
      <div class="help"> 
         Participants
      </div>
      <div class="difficulty">
         Difficulty
      </div>
      <div class="stress-dice">
         Stress
      </div>
   </main>
</ApplicationShell>

<style lang="scss">
   main {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      grid-template-rows: 60px 1fr 1fr 2fr 60px;
      gap: 5px 10px;
   }

   .header {
      text-align: center;
      grid-column: 1 / 7;
      grid-row: 1;
   }
   .domains {
      grid-column: 1 / 3;
      grid-row: 2 / 4;
      display: flex;
      flex-direction: column;
   }
   .skills {
      grid-column: 3 / 5;
      grid-row: 2 / 4;
      display: flex;
      flex-direction: column;
   }
   .addons {
      grid-column: 5 / 7;
      grid-row: 2 / 3;
      display: flex;
      flex-direction: column;
   }
   .help {
      grid-column: 5 / 7;
      grid-row: 3 / 4;
      display: flex;
      flex-direction: column;
   }
   .stress-dice {
      grid-column: 6;
      grid-row: 4;
   }
   .difficulty {
      grid-column: 1;
      grid-row: 4;
   }
</style>