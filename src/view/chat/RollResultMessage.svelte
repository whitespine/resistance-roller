<!-- Super simple Svelte component that takes in a prop and outputs it. -->
<script>
    /** @type {RollResultMessageFlags} */
    export let roll = null;
    /** @type {Actor | null} */
    $: leader = (roll.actor_id ? fromUuidSync(roll.actor_id) : null); 
</script>

<div class="flexcol">
    <div class="result">
        <h2>{leader?.name ?? "Unknown Character's"} roll:</h2>
        <span>Dice: {(roll?.rolls ?? [0]).join(", ")}</span>
        <span>Result: {roll?.roll ?? 0}</span>
    </div>
</div>

<style lang="scss">
    .result {
        display: grid;
        grid-template-rows: 32px 1fr;
        grid-template-columns: 32px 1fr 1fr;
    }
</style>
