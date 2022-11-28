import { SvelteApplication }  from '@typhonjs-fvtt/runtime/svelte/application';

import ClientSettingsAppShell  from './ClientSettingsAppShell.svelte';

import { constants }          from '../../constants.js';
import settings          from '../../settings';

export default class ClientSettingsApp extends SvelteApplication
{
   // Note: In this trivial example we create a TJSGameSettings instance here, but normally you want to create a single
   // instance that is shared across your module / package.

   constructor(options)
   {
      super(options);

      // Register a client game setting.
      settings.register({
         namespace: constants.moduleId,
         key: 'app-state',
         options: {
            scope: 'client',
            config: false,
            default: {},
            type: Object
         }
      });

      try
      {
         // Attempt to parse client game setting and set application state.
         this.state.set(game.settings.get(constants.moduleId, 'app-state'));
      }
      catch (err) { /**/ }
   }

   /**
    * Default Application options
    *
    * @returns {object} options - Application options.
    * @see https://foundryvtt.com/api/Application.html#options
    */
   static get defaultOptions()
   {
      return foundry.utils.mergeObject(super.defaultOptions, {
         id: 'app-state-client-setting',
         title: 'App State (Reload / Client Setting)',
         resizable: true,
         width: 500,
         height: 175,

         svelte: {
            class: ClientSettingsAppShell,
            target: document.body,

            // You can provide a function and this context is the application when invoked.
            props: function()
            {
               // Creates a store
               return { settingStore: settings.getStore('app-state') };
            }
         }
      });
   }
}