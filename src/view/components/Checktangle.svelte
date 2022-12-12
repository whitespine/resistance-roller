<script>
   export let label = "PLACEHOLDER";
   export let selected = false;
</script>

<div> 
   <button class:selected class="text--nowrap text--dramatic" on:click>
      {#if $$slots.left}
         <div style="float: left">
            <slot name="left" />
         </div>
      {/if}

      <span>{label}</span>

      {#if $$slots.right}
         <div style="float: right">
            <slot name="right" />
         </div>
      {/if}
   </button>
</div>

<style lang="scss">
   button {
      // font-family: "MelmaCracked";
      border: 0;

      background-color: #834040;
      color: #b0b0b0;

      margin: 2px;
   }

   button.selected {
      background-color: #630000;
      color: #f0f0f0;
   }
</style>
