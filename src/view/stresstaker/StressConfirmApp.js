import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';
import { constants } from '../../constants';

import StressConfirmAppShell from './StressConfirmAppShell.svelte';

export default class StressConfirmApp extends SvelteApplication {
   /**
    * Default Application options
    *
    * @returns {object} options - Application options.
    * @see https://foundryvtt.com/api/Application.html#options
    */
   static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
         title: 'Resist.title',  // Automatically localized from `lang/en.json`.
         width: 250,
         height: 380,
         resizable: false,

         svelte: {
            class: StressConfirmAppShell,
            target: document.body,
         }
      });
   }

   /** Create a dialogue for completion of this message, for this participant
    * 
    * @param {ChatMessage} message Message to get flags from
    * @param {Actor} participant Participant within the message to complete for
    * @returns 
    */
   static for(message, participant) {
      return new StressConfirmApp({
         svelte: {
            props: {
               message,
               participant
            }
         }
      });
   }
}