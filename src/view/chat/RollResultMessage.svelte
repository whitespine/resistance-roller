<!-- Super simple Svelte component that takes in a prop and outputs it. -->
<script>
    import { summonAllDialogs } from "../../socketlib";
    import { fly, fade } from "svelte/transition";

    /** @type {ChatMessage} */
    export let message; // Itself

    /** @type {RollResultData} */
    export let rollData;

    /** @type {Actor | null} */
    $: leader = rollData.actorID ? fromUuidSync(rollData.actorID) : null;

    /** @type {string} */
    $: roll = Roll.fromData(rollData.rollJSON);
    $: r = roll.total;
    $: resultString =
        r == 1
            ? "CRITICAL FAILURE"
            : r <= 5
            ? "FAILURE"
            : r <= 7
            ? "SUCCSTRESS"
            : r <= 9
            ? "SUCCESS"
            : "CRITICAL SUCCESS";

    // Hydrate the effects
    /** @type {RollResultEntry[]} */
    $: hydratedEffects = rollData.effects.map((e) =>
        foundry.utils.mergeObject(
            {
                actor: fromUuidSync(e.actorID),
                stressRoll: Roll.fromData(e.stressRollJSON),
                falloutRoll: Roll.fromData(e.falloutRollJSON),
            },
            e
        )
    );

    // Are any pending?
    $: anyPending = hydratedEffects.some((e) => e.status == "unresolved");

    // Re-summon the dialog to confirm
    function summonDialogs() {
        summonAllDialogs(message, true);
    }
</script>

<div class="flexcol resist-roller">
    <h2>{leader?.name ?? "Unknown Character"}'s roll:</h2>
    <div class="summary">
        {#if anyPending}
            <i
                on:click={summonDialogs}
                title="Resolve Rolls"
                class="fas fa-octagon-check fa-2xl"
                style="grid-area: btn; cursor: pointer; margin: 14px 14px"
            />
        {/if}
        <strong style="grid-area: dic">ROLL:</strong>
        <span style="grid-area: rol">
            {#await roll.render() then elt}
                {@html elt}
            {/await}
        </span>
        <strong style="grid-area: res">RESULT:</strong>
        <span style="grid-area: amt">{resultString}</span>
    </div>
    {#each hydratedEffects as eff}
        {#if eff.status == "unresolved" || eff.stressTaken == 0}
            <div transition:fade class="result no-stress">
                <img src={eff.actor?.img} title={eff.actor?.name} />
                <span>{eff.status == "unresolved" ? "UNRESOLVED" : "NO STRESS TAKEN"}</span>
            </div>
        {:else}
            <div transition:fade class="result stress">
                <img src={eff.actor?.img} title={eff.actor?.name} />
                <span style="grid-area: strrol">{eff.stressTaken} {eff.resistance.toUpperCase()}</span>
                <span style="grid-area: strtot">{eff.falloutTotalStress} TOTAL</span>
                <span style="grid-area: fal"> {@html eff.falloutRoll.toAnchor().outerHTML} vs {eff.falloutTotalStress}: {eff.falloutResult.toUpperCase()} FALLOUT</span>
            </div>
        {/if}
    {/each}
</div>

<style lang="scss">
    .summary {
        display: grid;
        grid-template-rows: 2fr 1fr;
        grid-template-columns: 1fr 2fr 50px;
        grid-template-areas:
            "dic rol btn"
            "res amt btn";
        align-items: center;
    }
    .result {
        display: grid;

        &.no-stress {
            grid-template-rows: 1fr;
            grid-template-columns: 48px 1fr;
        }

        &.stress {
            grid-template-rows: 1fr 1fr;
            grid-template-columns: 48px 1fr 1fr;
            grid-template-areas:
                "por strrol strtot"
                "por fal    fal";
        }

        background-color: var(--main-off-white);
        border-radius: 3px;
        margin: 3px 2px;
        padding: 4px;
        color: black;

        * {
            border: 1px solid black;
            margin-left: -1px;
        }

        span {
            text-align: center;
        }

        img {
            min-height: 48px;
            max-width: 48px;
            max-height: 48px;
            background-color: black;
            grid-row: 1 / 3;
        }
    }
</style>
