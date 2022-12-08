<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true} />

<script>
   import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
   import { mastery, selectedDomain, selectedSkill, difficulty, resistance, dice, stressBonus } from "../../stores";
   import Checktangle from "../components/Checktangle.svelte";
   import Dropdown from "../components/Dropdown.svelte";
   import Adversary from "./Adversary.svelte";
   import DiceControl from "./DiceControl.svelte";
   import { TJSDocument, TJSDocumentCollection } from "@typhonjs-fvtt/runtime/svelte/store";
   import ParticipantsControl from "./ParticipantsControl.svelte";
   import { constants } from "../../constants";
   import { nullable_tjs_doc } from "../../doc_store";
   import { each } from "svelte/internal";

   export let elementRoot;

   const domains = CONFIG[constants.moduleId].domains;
   const skills = CONFIG[constants.moduleId].skills;
   const resistances = CONFIG[constants.moduleId].resistances;

   // Get what adversary we should show
   export let adversary = null;
   let adverstorey = nullable_tjs_doc(adversary);

   // Don't bother handling player character changing mid-interaction. Grab pc
   let playerCharactore = nullable_tjs_doc(game.user.character);

   // Reactive props
   let adversarySkills = []; 
   let adversaryDomains = []; 
   let playerSkills = [];
   let playerDomains = [];
   let dicePool = 1;
   $: {
      adversarySkills = $adverstorey?.flags[constants.moduleId]?.skills ?? [];
      adversaryDomains = $adverstorey?.flags[constants.moduleId]?.domains ?? [];
      playerSkills = Object.fromEntries(Object.entries($playerCharactore?.system.skills ?? {}).map(kv => [kv[0], kv[1].value]));
      playerDomains = Object.fromEntries(Object.entries($playerCharactore?.system.domains ?? {}).map(kv => [kv[0], kv[1].value]));
      let playerProtections = Object.entries(Object.entries($playerCharactore?.system.resistances ?? {}).map(kv => [kv[0], kv[1].protection]));

      dicePool = 1;
      dicePool += playerSkills[$selectedSkill] ? 1 : 0;
      dicePool += playerDomains[$selectedDomain] ? 1 : 0;
      dicePool += $mastery ? 1 : 0;
      dicePool -= $difficulty;
   }

   // Helpers for tracking stuff
   // Iterator for our roll dice
   $: rollDice = new Array(dicePool).fill(0);
</script>

<!-- ApplicationShell provides the popOut / application shell frame, header bar, content areas -->
<!-- ApplicationShell exports `elementRoot` which is the outer application shell element -->
<ApplicationShell bind:elementRoot>
   <main class="resist-roller">
      <Adversary class="box adversary" actor={$adverstorey} on:select-actor={(x) => $adverstorey = x.detail } />
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
            <Checktangle label={res} selected={$resistance == res} on:click={() => resistance.set(res)} >
                  <div class="choice-hints" slot="left">
                     {#each new Array($playerCharactore?.system.resistances[res].protections ?? 0) as _, i}
                        <i class="fas fa-2xs fa-shield"> </i>
                     {/each}
                  </div>
            </Checktangle>
         {/each}
      </div>
      <div class="box skilldom">
         <div>
            <h2>Skill</h2>
            <Dropdown value={$selectedSkill} options={skills} on:change={(e) => $selectedSkill = e.detail } let:value={skillOption}>
               <Checktangle label={skillOption} selected=false>
                  <div class="choice-hints" slot="left">
                     {#if adversarySkills.includes(skillOption)}
                        <i class="fas fa-2xs fa-skull"> </i>
                     {/if}
                     {#if playerSkills[skillOption]}
                        <i class="fas fa-2xs fa-user"> </i>
                     {/if}
                  </div>
               </Checktangle>
            </Dropdown>
         </div>

         <div>
            <h2>Domain</h2> 
            <Dropdown value={$selectedDomain} options={domains} on:change={(e) => $selectedDomain = e.detail } let:value={domainOption}>
               <Checktangle label={domainOption} selected=false>
                  <div class="choice-hints" slot="left">
                     {#if adversaryDomains.includes(domainOption)}
                        <i class="fas fa-2xs fa-skull"> </i>
                     {/if}
                     {#if playerDomains[domainOption]}
                        <i class="fas fa-2xs fa-user"> </i>
                     {/if}
                  </div>
               </Checktangle>
            </Dropdown>
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
   main {
      display: grid;
      grid-template-columns: 280px repeat(3, 1fr);
      grid-template-rows: 1fr 1fr;
      gap: 5px 5px;
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
   .choice-hints {
      display: grid;
      grid-template-columns: 14px;
      grid-template-rows: 14px 14px;
      i {
         margin-top: 6px;
      }
   }
</style>
