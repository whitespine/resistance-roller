<script>
   import { ApplicationShell }   from '@typhonjs-fvtt/runtime/svelte/component/core';
   import { mastery, participantChoices, difficulty, resistance, dice, stressBonus } from "../../stores"
   import Checktangle from "./Checktangle.svelte";
   import DocRollConfig from "./DocRollConfig.svelte";
   import Adversary from "./Adversary.svelte";
   import DiceControl from "./DiceControl.svelte";
   import { TJSDocument, TJSDocumentCollection }  from '@typhonjs-fvtt/runtime/svelte/store';

   export let elementRoot;

   const domains = CONFIG.resistanceRoller.domains;
   const skills = CONFIG.resistanceRoller.skills;
   const resistances = CONFIG.resistanceRoller.resistances;

   // Get what helper characters we should show
   const users = new TJSDocumentCollection(game.users);
   $: activeUsers = $users.filter(u => u.active);
   $: activeCharacters = activeUsers.map(u => u.character).filter(c => c);

   // Get what adversary we should show
   export let adversaryActor;
   $: currentAdversary = adversaryActor ? new TJSDocument(adversaryActor) : null;

   // Helpers for tracking stuff
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
      <div class="box adversary">
         {#if $currentAdversary}
            <Adversary></Adversary>
         {:else}
            <span>NO TRACKED ADVERSARY</span>
         {/if}
      </div>
      <div class="box participants"> 
         <h2>Participants</h2>
         {#each activeCharacters as pc}
            <Checktangle label={pc.name} selected={$participantChoices.includes(pc.id)} on:click={togglePresence(participantChoices, pc.id)} />
         {/each}
      </div>
      <div class="box difficulty">
         <h2>Difficulty</h2>
         <Checktangle label="Standard" selected={$difficulty == 0} on:click={() => difficulty.set(0)} />
         <Checktangle label="Risky" selected={$difficulty == 1} on:click={() => difficulty.set(1)} />
         <Checktangle label="Dangerous" selected={$difficulty == 2} on:click={() => difficulty.set(2)} />
      </div>
      <div class="box stress-track">
         <h2>Resistance</h2>
         {#each resistances as res}
            <Checktangle label={res} selected={$resistance == res} on:click={() => resistance.set(res)} />
         {/each}

      </div>
      <div class="box skilldom">
         <div>
            <h2>Skill</h2>
         </div>
      
         <div>
            <h2>Domain</h2>
         </div>

         <div>
            <h2>Mastery</h2>
            <Checktangle label={"Mastery"} selected={$mastery} on:click={() => mastery.update(x => !x)} />
         </div>
      </div>
      <div class="box stress-dice">
         <h2>Danger</h2>
         <DiceControl dice={dice} stressBonus={stressBonus} />
      </div>
      <div class="box the-roll">
         <div class="dice-pool">
            {#each [1,2,3] as _, i}
               <img src="icons/dice/d10black.svg">
            {/each}
         </div>
      </div>
   </main>
</ApplicationShell>

<style lang="scss">
   .box {
      padding: 3px;
      display: flex;
      flex-direction: column;
      border: 1px solid black;

      h2 {
         text-align: center;
      }
   }

   main {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: 50px 1fr 1fr;
      gap: 5px 5px;
   }

   .header {
      text-align: center;
      grid-column: 1 / 6;
      grid-row: 1;
   }
   .adversary {
      grid-column: 1 / 3;
      grid-row: 2;
   }
   .skilldom {
      grid-column: 3;
      grid-row: 2;

      display: grid;
      grid-template-rows: repeat(3, 1fr);
   }
   .participants {
      grid-column: 4;
      grid-row: 2;
   }
   .stress-dice {
      grid-column: 3;
      grid-row: 3;

   }
   .the-roll {
      grid-column: 5;
      grid-row: 3;

      .dice-pool {
         display: flex;

         img {
            border: none;
            margin-left: -45%;
            filter: opacity(40%);
         }

         img:nth-of-type(1) {
            margin-left: 0px;
            filter: none;
         }
      }
   }
   .difficulty {
      grid-column: 5;
      grid-row: 2;
   }
   .stress-track {
      grid-column: 4;
      grid-row: 3;
   }
</style>