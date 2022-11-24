<script>
    export let label = "PLACEHOLDER";
    export let selected = false;
</script>


<button class:selected on:click>
    { label }
</button>

<style lang="scss">
    button {
        // font-family: "MelmaCracked";
        font-size: 1.5em;
        text-transform: uppercase;
        color: #B0B0B0;

        border: 0;
        font-weight: bold;
        margin: 2px;
        padding: 2px;
        background-color: #834040;
    }

    button.selected {
        background-color: #630000;
        color: #F0F0F0;
    }

</style>