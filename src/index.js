import RollApp from './view/roller/RollApp.js';
import { listenSockets } from "./socket_store";
import MenuApp from './view/MenuApp.js';
import { constants } from './constants.js';

import "../styles/headless.scss";

Hooks.once('ready', () => {
    const sidebarRect = document.querySelector('#sidebar').getBoundingClientRect();
    new MenuApp({ left: sidebarRect.x - 235, top: sidebarRect.y }).render(true, { focus: true });
    // new RollApp().render(true, { focus: true });
    listenSockets();
});

Hooks.once('init', async function() {
    // Make a bind to summon the roller
    game.keybindings.register("resistance-roller", "start-roll", {
				name: "Initiate resistance roll",
				onDown: () => {
                    new RollApp().render(true, {focus: true});
				},
				onUp: () => {},
				precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
			});
    
    // Set up api access
    game[constants.moduleId] = {
        RollApp,
        summonRoller: (actor) => RollApp.appForActor(actor).render(true, { focus: true })
    };

    // Set up some basic configurable options
    CONFIG.resistanceRoller = { 
        domains: ["Cursed", "Desolate", "Haven", "Occult", "Religion", "Technology", "Warren", "Wild"],
        skills: ["Compel", "Delve", "Discern", "Endure", "Evade", "Hunt", "Kill", "Mend", "Sneak"],
        resistances: ["Blood", "Echo", "Fortune", "Mind", "Supplies"]
    }; 
});

Hooks.on('getActorDirectoryEntryContext', (html, entries) => {
    // Add a context menu option to track adversaries
    entries.splice(0, 0, {
        name: "Track Resistance",
        icon: '<i class="fas fa-heart-pulse"></i>',
        callback: ([li]) => {
            let actor = game.actors.get(li.dataset.documentId);
            let tracked = actor.flags[constants.moduleId]?.tracked ?? false;
            actor.update({[`flags.${constants.moduleId}.tracked`]: !tracked});
        }
    })
})
