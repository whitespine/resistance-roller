<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true} />

<script>
    import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
    import ResistancePicker from "../components/ResistancePicker.svelte";
    import { constants } from "../../constants";
    import { nullable_tjs_doc } from "../../stores";
    import { getContext } from "svelte";
    import { editRollMessage } from "../../socketlib";

    export let elementRoot;

    const domains = CONFIG[constants.moduleId].domains;
    const skills = CONFIG[constants.moduleId].skills;

    // Props
    /** @type {ChatMessage} */
    export let message;

    /** @type {Actor} */
    export let participant;

    // Derived values
    // Get the flags
    /** @type {RollResultMessageFlags} */
    $: flagData = message.getFlag(constants.moduleId, 'data');
    $: rollData = flagData.rollData;
    $: participantEntry = rollData.effects.find(e => e.actor_id == participant.uuid);
    $: resistTrack = participant.system.resistances[resistance];
    $: currentStress = resistTrack.value;
    $: protection = resistTrack.protection;
    $: incomingStress = stress - protection;

    // Modifiable values
    let stress = participantEntry.stress_roll;
    let resistance = participantEntry.resistance;

    // Callbacks
    const application = getContext('external').application;
    async function confirm() {
        let falloutResult;
        if (incomingStress > 0) {
            // If incoming stress > 0, need to apply then move into the fallout flow
            await participant.update({
                [`system.resistances.${resistance}.value`]: currentStress + incomingStress,
            });
            let totalStress = Object.values(participant.system.resistances).reduce((acc, res) => acc + res.value, 0);
            console.log("Total stress:", totalStress);

            // Fallout has already been rolled - check if fallout has occurred
            if(participantEntry.fallout_roll < totalStress) {
                falloutResult = "none";
            } else if (participantEntry.fallout_roll <= 6) {
                falloutResult = "minor";
                // Clear track
                await participant.update({
                    [`system.resistances.${resistance}.value`]: 0
                });
            } else {
                falloutResult = "major";
                // Clear all
                let changeEntries = CONFIG[constants.moduleId].resistances.map(r => [`system.resistances.${r}.value`, 0])
                await participant.update(Object.fromEntries(changeEntries));
            }
        }

        // Update the message
        editRollMessage(message, participant, {
            ...participantEntry,
            status: "resolved",
            falloutTotalStress,
            resistance,
            falloutResult
        })

        // Close it
        application.close();
    }

    async function ignore() {
        // Just close it
        application.close();
    }
</script>

<!-- ApplicationShell provides the popOut / application shell frame, header bar, content areas -->
<!-- ApplicationShell exports `elementRoot` which is the outer application shell element -->
<ApplicationShell bind:elementRoot>
    <main class="resist-roller">
        <div class="flexcol">
            <h2>Stress Incurred</h2>
            <ResistancePicker bind:selectedResistance={resistance} playerCharacter={participant} />
            <button on:click={confirm} class="confirm">Take {incomingStress} stress</button>
            <button on:click={ignore} class="ignore">Ignore Hit</button>
        </div>
    </main>
</ApplicationShell>

<style lang="scss">
</style>
