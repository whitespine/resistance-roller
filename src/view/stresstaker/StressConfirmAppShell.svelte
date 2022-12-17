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

    // Props
    /** @type {ChatMessage} */
    export let message;

    /** @type {Actor} */
    export let participant;

    // One-time message derived values - we don't make these reactive
    // Get the flags
    /** @type {RollResultMessageFlags} */
    const flagData = message.getFlag(constants.moduleId, "data");
    const rollData = flagData.rollData;
    const participantEntry = rollData.effects.find((e) => e.actorID == participant.uuid);
    const incomingStress = Roll.fromData(participantEntry.stressRollJSON).total;

    // Modifiable values
    let stressTaken = incomingStress;
    let resistance = participantEntry.resistance;

    $: resistTrack = participant.system.resistances[resistance];
    $: currentStress = resistTrack.value;
    $: protection = resistTrack.protection;

    // When resistance is changed, set stressTaken to default
    $: {
        stressTaken = Math.max(incomingStress - protection, 0);
    }

    // Callbacks
    const application = getContext("external").application;
    async function confirm() {
        let falloutResult = "none";
        let falloutTotalStress = 0;
        if (incomingStress > 0) {
            // If incoming stress > 0, need to apply then move into the fallout flow
            await participant.update({
                [`system.resistances.${resistance}.value`]: currentStress + incomingStress,
            });
            falloutTotalStress = Object.values(participant.system.resistances).reduce((acc, res) => acc + res.value, 0);

            // Fallout has already been rolled - check if fallout has occurred
            let falloutRoll = Roll.fromData(participantEntry.falloutRollJSON);
            if (falloutRoll.total > falloutTotalStress) {
                falloutResult = "none";
            } else if (falloutRoll.total <= 6) {
                falloutResult = "minor";
                // Clear track
                await participant.update({
                    [`system.resistances.${resistance}.value`]: 0,
                });
            } else {
                falloutResult = "major";
                // Clear all
                let changeEntries = CONFIG[constants.moduleId].resistances.map((r) => [
                    `system.resistances.${r}.value`,
                    0,
                ]);
                await participant.update(Object.fromEntries(changeEntries));
            }
        }

        // Update the message
        let newData = foundry.utils.duplicate(participantEntry);
        newData = foundry.utils.mergeObject(newData, {
            status: "resolved",
            falloutTotalStress,
            resistance,
            falloutResult,
            stressTaken,
        });
        editRollMessage(message, participant, newData);

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
            <h2>{participant.name} Stress</h2>
            <span> {incomingStress} stress inflicted </span>
            <ResistancePicker bind:selectedResistance={resistance} playerCharacter={participant} />
            <div class="flexrow">
                <button on:click={() => (stressTaken = Math.max(stressTaken - 1, 0))}> - </button>
                <input type="number" bind:value={stressTaken} min="0" max="12" />
                <button on:click={() => (stressTaken = Math.min(stressTaken + 1, 12))}> + </button>
            </div>
            <button on:click={confirm} class="confirm">Take {stressTaken} stress</button>
            <button on:click={ignore} class="ignore">Ignore Hit</button>
        </div>
    </main>
</ApplicationShell>

<style lang="scss">
    h2, span {
        text-align: center;
        font-size: 1.3em;
    }
    input {
        text-align: center;
        height: inherit;
        font-size: 2em;
        font-family: 'Franklin Gothic Medium';
    }
</style>
