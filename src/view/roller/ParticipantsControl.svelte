<script>
    import { participantChoices } from "../../stores";
    import { TJSDocumentCollection } from "@typhonjs-fvtt/runtime/svelte/store";
    import Checktangle from "../components/Checktangle.svelte";
    import { presenceToggler } from "../../util";

    // Get what helper characters we should show
    const users = new TJSDocumentCollection(game.users);
    const all_actors = new TJSDocumentCollection(game.actors);
    let activeCharacters;
    let activeUsers;
    let playerCharacter;
    $: {
        $all_actors; // Want to watch for mutations on all actors
        activeUsers = $users.filter((u) => u.active);
        activeCharacters = activeUsers.map((u) => u.character).filter((c) => c);
        playerCharacter = game.user.character;

        // Additionally, fix participant choices
        if($participantChoices.some(c_uuid => !activeCharacters.some(c2 => c_uuid == c2.uuid))) {
            $participantChoices = $participantChoices.filter(c_uuid => activeCharacters.some(c2 => c_uuid == c2.uuid));
        }
    }
</script>

<div>
    {#each activeCharacters as pc}
        {#if pc == playerCharacter}
            <Checktangle
                label={pc.name.substr(0, 12)}
                selected={$participantChoices.includes(pc.uuid)}
                on:click={presenceToggler(participantChoices, pc.uuid)}
            >
                <div class="self-indicator" slot="right">
                    ME
                </div>
            </Checktangle>
        {:else}
            <Checktangle
                label={pc.name}
                selected={$participantChoices.includes(pc.uuid)}
                on:click={presenceToggler(participantChoices, pc.uuid)}
            />
        {/if}
    {/each}
</div>

<style lang="scss">
    div {
        display: flex;
        flex-direction: column;
    }

    .self-indicator {
        border-left: 1px black solid;
        padding-left: 5px;
        padding-right: 5px;
        background-color: var(--main-dark-red);
        color: white;
    }
</style>
