<script>
   import { ApplicationShell }   from '@typhonjs-fvtt/runtime/svelte/component/core';
   import { domainChoices, skillChoices, mastery, playerCharacters, participantChoices, difficulty, resistance } from "../../stores"
   import Checktangle from "./Checktangle.svelte";

   export let elementRoot;

   const domains = CONFIG.resistanceRoller.domains;
   const skills = CONFIG.resistanceRoller.skills;
   const resistances = CONFIG.resistanceRoller.resistances;

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
         <h2>Domains</h2>
         {#each domains as domain}
            <Checktangle label={domain} selected={$domainChoices.includes(domain)} on:click={togglePresence(domainChoices, domain)} />
         {/each}
      </div>
      <div class="skills"> 
         <h2>Skills</h2>
         {#each skills as skill}
            <Checktangle label={skill} selected={$skillChoices.includes(skill)} on:click={togglePresence(skillChoices, skill)} />
         {/each}
      </div>
      <div class="addons"> 
         <h2>Mastery</h2>
         <Checktangle label={"Mastery"} selected={$mastery} on:click={() => mastery.update(x => !x)} />
         <h2>Participants</h2>
         {#each $playerCharacters as pc}
            <Checktangle label={pc.name} selected={$participantChoices.includes(pc.id)} on:click={togglePresence(participantChoices, pc.id)} />
         {/each}
      </div>
      <div class="difficulty">
         <h2>Difficulty</h2>
         <Checktangle label="Standard" selected={$difficulty == 0} on:click={() => difficulty.set(0)} />
         <Checktangle label="Risky" selected={$difficulty == 1} on:click={() => difficulty.set(1)} />
         <Checktangle label="Dangerous" selected={$difficulty == 2} on:click={() => difficulty.set(2)} />
      </div>
      <div class="stress-track">
         <h2>Resistance</h2>
         {#each resistances as res}
            <Checktangle label={res} selected={$resistance == res} on:click={() => resistance.set(res)} />
         {/each}

      </div>
      <div class="stress-dice">
         <h2>Stress</h2>
      </div>
      <div class="the-roll">
         <div>
            {#each [1,2,3] as _, i}
               <img src="icons/dice/d10black.svg">
            {/each}
         </div>
      </div>
   </main>
</ApplicationShell>

<style lang="scss">
   main {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      grid-template-rows: 50px 1fr 2fr 2fr 60px;
      gap: 1px 10px;
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
      grid-row: 2 / 4;
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
   .the-roll {
      grid-column: 3 / 5;
      grid-row: 4;
   }
   .difficulty {
      grid-column: 7 / 9;
      grid-row: 2;
   }
   .stress-track {
      grid-column: 7 / 9;
      grid-row: 3;
   }
</style>