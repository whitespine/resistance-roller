<script>
    export let stressDice;
    export let stressBonus;

    const incrementDice = () => {
        if (stressDice < 12) {
            stressDice += 2;
        } else {
            stressBonus += 1;
        }
    };
    const decrementDice = () => {
        if (stressBonus > 0) {
            stressBonus -= 1;
        } else if (stressDice > 4) {
            stressDice -= 2;
        }
    };
    let diceIcon;
    $: {
        if (stressDice < 4) {
            diceIcon = "icons/svg/degen.svg";
        } else if (stressDice > 12) {
            diceIcon = "icons/svg/regen.svg";
        } else {
            diceIcon = `icons/dice/d${stressDice}black.svg`;
        }
    }
</script>

<div on:click={incrementDice} on:contextmenu|preventDefault={decrementDice}>
    <img src={diceIcon} />
    {#if stressBonus > 0}
        <span>D{stressDice} + {stressBonus}</span>
    {:else}
        <span>D{stressDice}</span>
    {/if}
</div>

<style lang="scss">
    div {
        display: flex;
        flex-direction: column;
    }
    span {
        text-align: center;
        font-weight: bold;
    }
    img {
        border: none;
        margin-bottom: -25px;
    }
</style>
