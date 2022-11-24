import { SvelteApplication }  from '@typhonjs-fvtt/runtime/svelte/application';

import RollAppShell          from './RollAppShell.svelte';

export default class RollApp extends SvelteApplication
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
         title: 'TemplateESM.title',  // Automatically localized from `lang/en.json`.
         width: 600,
         height: 600,

         svelte: {
            class: RollAppShell,
            target: document.body
         }
      });
   }
}