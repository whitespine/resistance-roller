<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true} />

<script>
    import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
    import { constants } from "../../constants";
    import { numericSetter } from "../../util";
    import Checktangle from "../components/Checktangle.svelte";

    export let elementRoot;

    // Get our constants
    const domains = CONFIG[constants.moduleId].domains;
    const skills = CONFIG[constants.moduleId].skills;

    /** @type { import("svelte/store").Writable<Actor> } */
    export let actor;

    // Generates a callback to toggle the presence of an item at the specified path
    const presenceToggler = (path, value) => () => {
        let arr = foundry.utils.getProperty($actor, path) ?? [];
        if (arr.includes(value)) {
            arr = arr.filter((x) => x != value);
        } else {
            arr = [...arr, value];
        }
        $actor.update({ [path]: arr });
    };

    const setName = foundry.utils.debounce((evt) => {
        let name = evt.target.value;
        $actor.update({ name });
    }, 1000);
    const setStatus = foundry.utils.debounce((evt) => {
        let status = evt.target.value;
        $actor.setFlag(constants.moduleId, "status", status);
    }, 1000);

    $: selectedDomains = $actor.flags[constants.moduleId]?.domains ?? [];
    $: selectedSkills = $actor.flags[constants.moduleId]?.skills ?? [];
    $: currentResistance = $actor.flags[constants.moduleId]?.currentResistance ?? 0;
    $: maxResistance = $actor.flags[constants.moduleId]?.maxResistance ?? constants.defaultMaxResistance;
    $: protection = $actor.flags[constants.moduleId]?.protection ?? 0;
    $: status = $actor.flags[constants.moduleId]?.status ?? "";
</script>

<ApplicationShell bind:elementRoot>
    <main class="resist-roller">
        <div style="grid-area: stat;">
            <h2>Status</h2>
            <label>
                Name
                <input value={$actor.name} on:input={setName} />
            </label>
            <label>
                Status
                <textarea style="height: 240px;" value={status} on:input={setStatus} />
            </label>
        </div>
        <div style="grid-area: dom;">
            <h2>Domains</h2>
            {#each domains as domain}
                <Checktangle
                    label={domain}
                    selected={selectedDomains.includes(domain)}
                    on:click={presenceToggler(`flags.${constants.moduleId}.domains`, domain)}
                />
            {/each}
        </div>
        <div style="grid-area: skl;">
            <h2>Skills</h2>
            {#each skills as skill}
                <Checktangle
                    label={skill}
                    selected={selectedSkills.includes(skill)}
                    on:click={presenceToggler(`flags.${constants.moduleId}.skills`, skill)}
                />
            {/each}
        </div>
        <div style="grid-area: res">
            <h2>Resistance</h2>
            <label>
                Curr Resistance
                <input
                    on:change={numericSetter($actor, `flags.${constants.moduleId}.currentResistance`)}
                    type="number"
                    min="0"
                    max={maxResistance}
                    value={currentResistance}
                />
            </label>
            <label>
                Max Resistance
                <input
                    on:change={numericSetter($actor, `flags.${constants.moduleId}.maxResistance`)}
                    type="number"
                    min="0"
                    max="30"
                    value={maxResistance}
                />
            </label>
            <label>
                Protection
                <input
                    on:change={numericSetter($actor, `flags.${constants.moduleId}.protection`)}
                    type="number"
                    min="0"
                    max="5"
                    value={protection}
                />
            </label>
        </div>
    </main>
</ApplicationShell>

<style lang="scss">
    main {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: 1fr;
        grid-template-areas: "stat dom skl res";
        gap: 0px 10px;
    }
</style>
