import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';
import { nullable_tjs_doc } from '../../stores';

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
         height: 550,
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

   /** Summon a roll prompt against the provided actor
    * 
    * @param {Actor | null} actor Actor to track
    * @returns 
    */
   static for(actor) {
      return new RollApp({
         svelte: {
            props: {
               playerCharacter: nullable_tjs_doc(game.user.character),
               adversary: nullable_tjs_doc(actor)
            }
         }
      });
   }
}