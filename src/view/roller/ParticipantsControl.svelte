<script>
   import { participantChoices } from "../../stores"
   import { TJSDocumentCollection }  from '@typhonjs-fvtt/runtime/svelte/store';
   import Checktangle from "./Checktangle.svelte";
   import { presenceToggler } from "../../util";

   // Get what helper characters we should show
   const users = new TJSDocumentCollection(game.users);
   $: activeUsers = $users.filter(u => u.active);
   $: activeCharacters = activeUsers.map(u => u.character).filter(c => c);
</script>

<div>
   {#each activeCharacters as pc}
      <Checktangle label={pc.name} selected={$participantChoices.includes(pc.id)} on:click={presenceToggler(participantChoices, pc.id)} />
   {/each}
</div>

<style lang="scss">
    div {
        display: flex;
        flex-direction: column;
    }
</style>
