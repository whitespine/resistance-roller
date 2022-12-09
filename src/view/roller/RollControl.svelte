<script>
    import { constants } from "../../constants";

    /** @type { number } */
    export let dicePool = 1;

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
        let roll = new Roll(formula);
        await roll.roll({async: true});
        console.log(roll.result);

        // Start animation and await its completion
        await spin();
    }

    let diceRotations = new Array(10).fill(0);
    function spin() {
        return new Promise((succ) => {
            diceRotations = diceRotations.map(_ => (Math.random() - 0.5) * 3600);
            setTimeout(() => {
                diceRotations = diceRotations.map(_ => 0);
                succ();
            }, 200);
        });
    }

    // Helpers for tracking stuff
    // Iterator for our roll dice
    $: rollDice = new Array(dicePool > 0 ? dicePool : 1).fill(0);
    $: diceIcon = dicePool > 0 ? "icons/dice/d10black.svg" : dicePool == 0 ? "icons/dice/d8black.svg" : "icons/dice/d6black.svg";
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
