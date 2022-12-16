import { SvelteApplication }  from '@typhonjs-fvtt/runtime/svelte/application';
import { nullable_tjs_doc } from '../../stores';

import RollFlagEditorShell          from './RollFlagEditorShell.svelte';

export default class RollFlagEditorApp extends SvelteApplication
{
   /**
    * Default Application options
    *
    * @returns {object} options - Application options.
    * @see https://foundryvtt.com/api/Application.html#options
    */
   static get defaultOptions()
   {
      return foundry.utils.mergeObject(super.defaultOptions, {
         title: 'Resist.editor.title',  // Automatically localized from `lang/en.json`.
         width: 600,

         svelte: {
            class: RollFlagEditorShell,
            target: document.body
         }
      });
   }

   /** Summon an edit prompt for the provided actor
    * 
    * @param {Actor | null} actor Actor to track
    * @returns 
    */
   static for(actor) {
      return new RollFlagEditorApp({
         svelte: {
            props: {
               actor: nullable_tjs_doc(actor)
            }
         }
      });
   }
}