<script>
    import { constants } from "../../constants";
    import { summonAllDialogs } from "../../socketlib";
    import { participantChoices, stressBonus, stressDice } from "../../stores";

    /** @type { number } */
    export let dicePool;
    /** @type { string } */
    export let domain;
    /** @type { string } */
    export let skill;
    /** @type { string } */
    export let resistance;
    /** @type { Actor } */
    export let adversary;

    async function doRoll() {
        // Decide our formula. Vary from the book - don't "drop" highest, that's factored into dice pool. Negative rolls still possible, just increasinly unlikely
        let formula;
        if (dicePool > 0) {
            formula = `${dicePool}d10kh1`;
        } else if (dicePool == 0) {
            formula = "d8";
        } else if (dicePool == -1) {
            formula = "d6";
        } else {
            formula = "0";
        }
        let actionRoll = new Roll(formula);
        await actionRoll.roll({ async: true });

        // Initialize our participant effects
        /** @type {RollResultEntry[]} */
        let effects = [];
        let participants = $participantChoices.map(fromUuidSync).filter(x => x);
        if (game.user.character) {
            participants = [game.user.character, ...participants];
        }

        let handledUuids = [];
        for (let participant of participants) {
            // Deduplication step
            if (handledUuids.includes(participant.uuid)) {
                continue;
            } else {
                handledUuids.push(participant.uuid);
            }

            // Roll fallout / stress
            let stressRoll = new Roll(`1d${$stressDice} + ${$stressBonus}`);
            await stressRoll.roll({ async: true });
            let falloutRoll = new Roll("1d12");
            await falloutRoll.roll({ async: true });

            // Create our effect object
            effects.push({
                actorID: participant.uuid,
                falloutRollJSON: falloutRoll.toJSON(),
                stressRollJSON: stressRoll.toJSON(),
                status: actionRoll.total >= 8 ? "resolved" : "unresolved",
                stressPreApply: foundry.utils.duplicate(participant.system.resistances),

                // Temp vals
                stressTaken: -1,
                falloutTotalStress: -1,
                falloutResult: "none",
                resistance: resistance,
            });
        }

        // Wait a moment to animate
        await spin();

        // Build our message template
        /** @type {RollResultData} */
        let rollData = {
            actorID: game.user.character?.uuid ?? null,
            foeID: adversary,
            effects,
            rollJSON: actionRoll.toJSON(),
            domain,
            skill,
            resistance,
        };

        /** @type {RollResultMessageFlags} */
        let flagData = { data: { rollData } };

        // Create the message
        let msg = await ChatMessage.create({
            user: game.user.id,
            flags: {
                [constants.moduleId]: flagData,
            },
        });

        // Send command to show a completion dialogue to all participants. Should hit us too
        summonAllDialogs(msg);
    }

    // Fun little thing for dice animation
    let diceRotations = new Array(10).fill(0);
    function spin() {
        return new Promise((succ) => {
            diceRotations = diceRotations.map((_) => (Math.random() - 0.5) * 3600);
            setTimeout(() => {
                diceRotations = diceRotations.map((_) => 0);
                succ();
            }, 200);
        });
    }

    // Helpers for tracking stuff
    // Iterator for our roll dice
    $: rollDice = new Array(dicePool > 0 ? dicePool : 1).fill(0);
    $: diceIcon =
        dicePool > 0 ? "icons/dice/d10black.svg" : dicePool == 0 ? "icons/dice/d8black.svg" : "icons/dice/d6black.svg";
</script>

<div class="flexcol">
    <h2>Roll</h2>
    <div class="dice-pool" on:click={doRoll}>
        {#each rollDice as _, i}
            <img style="transform: rotate({diceRotations[i]}deg)" src={diceIcon} />
        {/each}
    </div>
</div>

<style lang="scss">
    div {
        align-items: center;
    }
    h2 {
        width: 100%;
    }
    .dice-pool {
        display: flex;

        img {
            transform-origin: center;
            transition: transform 0.4s ease-out;
            width: 64px;
            border: none;
            margin-left: -48px;
            filter: opacity(40%);
        }

        &:hover {
            cursor: pointer;
            img {
                filter: opacity(40%) drop-shadow(0 0 10px crimson);
            }

            img:nth-of-type(1) {
                filter: drop-shadow(0 0 10px crimson);
            }
        }

        img:nth-of-type(1) {
            margin-left: 0px;
            filter: none;
        }
    }
</style>
