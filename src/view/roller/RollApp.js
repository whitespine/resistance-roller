import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';

import RollAppShell from './RollAppShell.svelte';

export default class RollApp extends SvelteApplication {
   /**
    * Default Application options
    *
    * @returns {object} options - Application options.
    * @see https://foundryvtt.com/api/Application.html#options
    */
   static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
         title: 'Resist.title',  // Automatically localized from `lang/en.json`.
         width: 900,
         height: 600,
         resizable: true,

         svelte: {
            class: RollAppShell,
            target: document.body,
            props: {
               adversary: null
            }
         }
      });
   }

   static for(actor) {
      return new RollApp({
         svelte: {
            props: {
               adversary: actor
            }
         }
      });
   }
}