<!-- Super simple Svelte component that takes in a prop and outputs it. -->
<script>
    import { summonAllDialogs } from "../../socketlib";

    /** @type {ChatMessage} */
    export let message; // Itself

    /** @type {RollResultMessageFlags} */
    export let rollData;

    /** @type {Actor | null} */
    $: leader = rollData.actorID ? fromUuidSync(rollData.actorID) : null;

    /** @type {string} */
    $: r = rollData.roll;
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
    $: hydratedEffects = rollData.effects.map((e) => foundry.utils.mergeObject({
        actor: fromUuidSync(e.actorID),
    }, e));

    // Are any pending?
    $: anyPending = hydratedEffects.some((e) => e.status == "unresolved");

    // Re-summon the dialog to confirm
    function summonDialogs() {
        summonAllDialogs(message, true);
    }
</script>

<div class="flexcol">
    <h2>{leader?.name ?? "Unknown Character"}'s roll:</h2>
    <div class="summary">
        {#if anyPending}
            <i
                on:click={summonDialogs}
                class="fas fa-octagon-check fa-2xl"
                style="grid-area: btn; cursor: pointer; margin: 14px 14px"
            />
        {/if}
        <strong style="grid-area: dic">DICE:</strong>
        <span style="grid-area: rol">{(rollData?.rolls ?? [0]).join(", ")}</span>
        <strong style="grid-area: res">RESULT:</strong>
        <span style="grid-area: amt">{rollData?.roll ?? 0} - {resultString}</span>
    </div>
    {#each hydratedEffects as eff}
        <div class="result">
            <img src={eff.actor?.img} title={eff.actor.name} />
            {#if eff.status == "resolved"}
                <span>{eff.stressRoll} {eff.resistance.toUpperCase()}</span>
                <span>{eff.falloutResult.toUpperCase()} FALLOUT</span>
            {:else}
                <span style="grid-row: 1 / 3; grid-column: 2 / 4">UNRESOLVED</span>
            {/if}
        </div>
    {/each}
</div>

<style lang="scss">
    .summary {
        display: grid;
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 1fr 2fr 50px;
        grid-template-areas:
            "dic rol btn"
            "res amt btn";
    }
    .result {
        display: grid;
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 48px 1fr 1fr;
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
