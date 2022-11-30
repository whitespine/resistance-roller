<script>
   export let label = "PLACEHOLDER";
   export let selected = false;
</script>

<button class:selected class="text--nowrap text--dramatic" on:click>
   {label}
</button>

<style lang="scss">
   button {
      // font-family: "MelmaCracked";
      border: 0;

      background-color: #834040;
      color: #b0b0b0;
   }

   button.selected {
      background-color: #630000;
      color: #f0f0f0;
   }
</style>
