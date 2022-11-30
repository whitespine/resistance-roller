<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true} />

<script>
   import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
   import { mastery, selectedDomain, selectedSkill, difficulty, resistance, dice, stressBonus } from "../../stores";
   import Checktangle from "./Checktangle.svelte";
   import Adversary from "./Adversary.svelte";
   import DiceControl from "./DiceControl.svelte";
   import { TJSDocument, TJSDocumentCollection } from "@typhonjs-fvtt/runtime/svelte/store";
   import ParticipantsControl from "./ParticipantsControl.svelte";

   export let elementRoot;

   const domains = CONFIG.resistanceRoller.domains;
   const skills = CONFIG.resistanceRoller.skills;
   const resistances = CONFIG.resistanceRoller.resistances;

   // Get what adversary we should show
   export let actor;
   $: actore = actor ? new TJSDocument(actor) : null;

   // Helpers for tracking stuff
   // Iterator for our roll dice
   $: rollDice = new Array(4).fill(0);
</script>

<!-- ApplicationShell provides the popOut / application shell frame, header bar, content areas -->
<!-- ApplicationShell exports `elementRoot` which is the outer application shell element -->
<ApplicationShell bind:elementRoot>
   <main>
      <div class="box adversary">
         {#if actor}
            <Adversary {actore} />
         {:else}
            <span>NO TRACKED ADVERSARY</span>
         {/if}
      </div>
      <div class="box participants">
         <h2>Participants</h2>
         <ParticipantsControl />
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
            <select bind:value={$selectedSkill}>
               {#each skills as s}
                  <option value={s}>
                     {s.toUpperCase()}
                  </option>
               {/each}
            </select>
         </div>

         <div>
            <h2>Domain</h2>
            <select bind:value={$selectedDomain}>
               {#each domains as d}
                  <option value={d}>
                     {d.toUpperCase()}
                  </option>
               {/each}
            </select>
         </div>

         <div>
            <h2>Mastery</h2>
            <Checktangle label={"Mastery"} selected={$mastery} on:click={() => mastery.update((x) => !x)} />
         </div>
      </div>
      <div class="box stress-dice">
         <h2>Danger</h2>
         <DiceControl {dice} {stressBonus} />
      </div>
      <div class="box the-roll">
         <h2>Roll</h2>
         <div class="dice-pool">
            {#each rollDice as _}
               <img src="icons/dice/d10black.svg" />
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
      min-width: 0px;

      h2 {
         text-align: center;
      }
   }

   main {
      display: grid;
      grid-template-columns: 2fr repeat(3, 1fr);
      grid-template-rows: 1fr 1fr;
      gap: 5px 5px;
   }

   .adversary {
      grid-column: 1;
      grid-row: 1 / 3;
   }
   .skilldom {
      grid-column: 2;
      grid-row: 1;

      display: grid;
      grid-template-rows: repeat(3, 1fr);
   }
   .participants {
      grid-column: 3;
      grid-row: 1;
   }
   .stress-dice {
      grid-column: 2;
      grid-row: 2;
   }
   .the-roll {
      grid-column: 4;
      grid-row: 2;

      h2 {
         width: 100%;
      }

      .dice-pool {
         display: flex;

         img {
            width: 64px;
            border: none;
            margin-left: -48px;
            filter: opacity(40%);
         }

         img:nth-of-type(1) {
            margin-left: 0px;
            filter: none;
         }
      }

      align-items: center;
   }
   .difficulty {
      grid-column: 4;
      grid-row: 1;
   }
   .stress-track {
      grid-column: 3;
      grid-row: 2;
   }
</style>
