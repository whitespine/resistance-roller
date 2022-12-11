import {
   SvelteApplication,
   TJSDialog
} from '@typhonjs-fvtt/runtime/svelte/application';

import MenuAppShell from './MenuAppShell.svelte';

import ClientSettingsApp from './settings/ClientSettingsApp';
import RollApp from './roller/RollApp';
import StressConfirmApp from './stresstaker/StressConfirmApp';
/*
import AppStateSessionApp        from './app-state/session-storage/AppStateSessionApp.js';
import ChatDialogContent         from './chatmessage/ChatDialogContent.svelte';
import ContentEditableApp        from './editor/content-editable/ContentEditableApp.js';
import BasicDocumentApp          from './document/basic/BasicDocumentApp.js';
import EmbeddedDocApplication    from "./document/embedded-collection/EmbeddedDocApplication.js";
import HeaderButtonsApplication  from './header-buttons/HeaderButtonsApplication.js';
import HelloFoundryApplication   from './hello/HelloFoundryApplication.js';
import PositionApplication       from './position/app-control/PositionApplication.js';
import PositionBasicOverlayApp   from './position/basic-overlay/PositionBasicOverlayApp.js';
import PositionBoxApplication    from './position/box/PositionBoxApplication.js';
import PositionCarouselApp       from './position/carousel/PositionCarouselApp.js';
import ProseMirrorApp            from './editor/prosemirror/ProseMirrorApp.js';
import TinyMCEApp                from './editor/tinymce/TinyMCEApp.js';
*/


export default class MenuApp extends SvelteApplication {
   /**
    * @inheritDoc
    */
   constructor(options = {}) { super(options); }

   /**
    * Default Application options
    *
    * @returns {object} options - Application options.
    * @see https://foundryvtt.com/api/Application.html#options
    */
   static get defaultOptions() {
      /** @type {{}[]} */
      const buttons = [
         { title: 'Roller', onclick: () => RollApp.for(null) },
         {
            title: 'Stress Confirm',
            onclick: () => StressConfirmApp.for(game.messages.contents[game.messages.size - 1], game.actors.getName("GMPC"))
         },
         { title: 'Settings', class: ClientSettingsApp },
         // { title: 'Hello Foundry', class: HelloFoundryApplication },
         // { title: 'Hello Foundry', class: HelloFoundryApplication },
         // { title: 'Header Buttons', class: HeaderButtonsApplication },
         // { title: 'Reactive Document (Basic)', class: BasicDocumentApp },
         // { title: 'Reactive Embedded Collections', class: EmbeddedDocApplication },
         // { title: 'Chat Message', onclick: () => new TJSDialog(
         // {
         // title: 'Essential Svelte (ESM) - Chat Message',
         // content: ChatDialogContent
         // }, { id: 'essential-esm-chat-dialog' })
         // },
         // { title: 'Position (Basic Overlay)', class: PositionBasicOverlayApp },
         // { title: 'Position (App)', class: PositionApplication },
         // { title: 'Position (Box)', class: PositionBoxApplication },
         // { title: 'Position (Carousel)', class: PositionCarouselApp },
         // { title: 'App State (Client Setting)', class: ClientSettingApp },
         // { title: 'App State (Session Storage)', class: AppStateSessionApp },
         // { title: 'Content Editable', class: ContentEditableApp },
         // { title: 'TinyMCE', class: TinyMCEApp },
         // { title: 'ProseMirror', class: ProseMirrorApp }
      ];

      return foundry.utils.mergeObject(super.defaultOptions, {
         id: 'essential-svelte-esm',
         headerButtonNoClose: true,
         resizable: false,
         minimizable: true,
         popOut: false,
         width: 225,
         height: 'auto',
         positionOrtho: false,
         transformOrigin: null,
         title: 'Resist.menu',
         zIndex: 95,

         svelte: {
            class: MenuAppShell,
            target: document.body,
            intro: true,
            props: {
               buttons
            }
         }
      });
   }
}