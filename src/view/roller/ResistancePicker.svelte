<script>
    import { constants } from "../../constants";
    import Checktangle from "../components/Checktangle.svelte";
    const resistances = CONFIG[constants.moduleId].resistances;

    /** @type { Actor } */
    export let playerCharacter;

    /** @type { string } */
    export let selectedResistance = "mind";
</script>

<div>
    {#each resistances as res}
        <Checktangle label={res} selected={selectedResistance == res} on:click={() => selectedResistance = res}>
            <div class="prot-hints" slot="left">
                {#each new Array(6) as _, i}
                    {#if i < playerCharacter?.system.resistances[res].protection ?? 0}
                        <i class="fas fa-2xs fa-shield" />
                    {:else}
                        <i class="fa-light fa-2xs fa-shield" />
                    {/if}
                {/each}
            </div>
            <div class="stress-hints" slot="right">
                {#each new Array(12) as _, i}
                    {#if i < playerCharacter?.system.resistances[res].value ?? 0}
                        <i class="fa-solid fa-2xs fa-square" />
                    {:else}
                        <i class="fa-sharp fa-2xs fa-square" />
                    {/if}
                {/each}
            </div>
        </Checktangle>
    {/each}
</div>

<style lang="scss">
    .prot-hints {
        display: grid;
        border-right: 1px black solid;
        grid-template-columns: repeat(3, 14px);
        grid-template-rows: 14px 14px;
        i {
            margin-top: 6px;
            margin-left: -3px;
        }
    }
    .stress-hints {
        display: grid;
        border-left: 1px black solid;
        grid-template-columns: repeat(4, 10px);
        grid-template-rows: repeat(3, 10px);
        i {
            margin-top: 6px;
            margin-right: -3px;
        }
    }
</style>
