<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true} />

<script>
    import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
    import ResistancePicker from "../components/ResistancePicker.svelte";
    import { constants } from "../../constants";
    import { nullable_tjs_doc } from "../../stores";

    export let elementRoot;

    const domains = CONFIG[constants.moduleId].domains;
    const skills = CONFIG[constants.moduleId].skills;

    // Props
    /** @type {RollResultData} */
    export let rollData;

    /** @type {Actor} */
    export let participant;

    let participantEntry = rollData.effects.find(e => e.actor_id == participant.uuid);
    if(!participantEntry) {
        throw new Error("Bad participant");
    }

    // Modifiable values
    let stress = participantEntry.stress_roll;
    let resistance = participantEntry.resistance;

    // Derived values
    $: resistTrack = participant.system.resistances[resistance];
    $: currentStress = resistTrack.value;
    $: protection = resistTrack.protection;
    $: incomingStress = stress - protection;

    // Callbacks
    async function confirm() {
        let falloutResult = "None";
        if (incomingStress > 0) {
            // If incoming stress > 0, need to apply then move into the fallout flow
            await participant.update({
                [`system.resistances.${resistance}.value`]: currentStress + incomingStress,
            });
            let totalStress = Object.values(participant.system.resistances).reduce((acc, res) => acc + res.value, 0);
            console.log("Total stress:", totalStress);

            // Fallout has already been rolled
        }

        // Update the message
    }

    async function ignore() {
        // Just mark the participant as having ignored the results of the roll
    }
</script>

<!-- ApplicationShell provides the popOut / application shell frame, header bar, content areas -->
<!-- ApplicationShell exports `elementRoot` which is the outer application shell element -->
<ApplicationShell bind:elementRoot>
    <main class="resist-roller">
        <div class="flexcol">
            <h2>Stress Incurred</h2>
            <ResistancePicker bind:selectedResistance={resistance} playerCharacter={participant} />
            <button class="confirm">Take {incomingStress} stress</button>
            <button class="ignore">Ignore Hit</button>
        </div>
    </main>
</ApplicationShell>

<style lang="scss">
</style>
