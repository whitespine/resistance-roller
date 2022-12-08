<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true} />

<script>
   import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@rgossiaux/svelte-headlessui";
   import Portal from "svelte-portal";
   import { getContext } from "svelte";
   import { fade } from "svelte/transition";
   const { application } = getContext("external");

   // Application position store reference. Stores need to be a top level variable to be accessible for reactivity.
   const position = application.position;
   // Get what adversary we should show
   export let options;
   export let value;
   export let width_override = null;
   let root = null;
   let left = 0;
   let top = 0;
   let width = 0;
   $: {
      if (root) {
         $position;
         let rect = root.getBoundingClientRect();
         left = rect.left + window.scrollX;
         top = rect.bottom + window.scrollY;
         width = width_override ?? (rect.right - rect.left);
      }
   }
</script>

<div class="{$$props.class ?? ""} dropdown-root" bind:this={root}>
   <Listbox {value} on:change let:open>
      <ListboxButton as="div">
         {#if $$slots.button}
            <slot value={value} name=button></slot>
         {:else}
            <slot value={value}></slot>
         {/if}
      </ListboxButton>
      <Portal target="body">
         {#if open}
            <div class="resist-roller dropdown" transition:fade={{ duration: 200 }} style="left: {left}px; top: {top}px; width: {width}px">
               <ListboxOptions static as="div" class="options flexcol">
                  {#each options as opt}
                     <ListboxOption as="div" value={opt}>
                        <slot value={opt}>
                           <span>{opt}</span>
                        </slot>
                     </ListboxOption>
                  {/each}
               </ListboxOptions>
            </div>
         {/if}
      </Portal>
   </Listbox>
</div>

<style lang="scss">
</style>
