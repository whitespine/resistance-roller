<script>
   export let dice;
   export let stressBonus;

   const incrementDice = () => {
      if ($dice < 12) {
         $dice += 2;
      } else {
         $stressBonus += 1;
      }
   };
   const decrementDice = () => {
      if ($stressBonus > 0) {
         $stressBonus -= 1;
      } else if ($dice > 4) {
         $dice -= 2;
      }
   };
   let diceIcon;
   $: {
      if ($dice < 4) {
         diceIcon = "icons/svg/degen.svg";
      } else if ($dice > 12) {
         diceIcon = "icons/svg/regen.svg";
      } else {
         diceIcon = `icons/dice/d${$dice}black.svg`;
      }
   }
</script>

<div on:click={incrementDice} on:contextmenu|preventDefault={decrementDice}>
   <img src={diceIcon} />
   {#if $stressBonus > 0}
      <span>D{$dice} + {$stressBonus}</span>
   {:else}
      <span>D{$dice}</span>
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
