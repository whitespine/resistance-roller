<script>
   export let label = "PLACEHOLDER";
   export let selected = false;
</script>

<button class:selected on:click>
   {label}
</button>

<style lang="scss">
   button {
      // font-family: "MelmaCracked";
      font-size: 1.3em;
      text-transform: uppercase;
      color: #b0b0b0;

      border: 0;
      font-weight: bold;
      margin: 2px;
      padding: 2px;
      background-color: #834040;

      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
   }

   button.selected {
      background-color: #630000;
      color: #f0f0f0;
   }
</style>
