import RollApp from './view/roller/RollApp.js';
import { TJSGameSettings }    from '@typhonjs-fvtt/svelte-standard/store';
import MenuApp from './view/MenuApp.js';

Hooks.once('ready', () => {
    console.log("Henlo?)");
    const sidebarRect = document.querySelector('#sidebar').getBoundingClientRect();
    new MenuApp({ left: sidebarRect.x - 235, top: sidebarRect.y }).render(true, { focus: true });
    // new RollApp().render(true, { focus: true });
});

Hooks.once('init', async function() {
    // make a bind to summon the roller
    game.keybindings.register("resistance-roller", "start-roll", {
				name: "Initiate resistance roll",
				onDown: () => {
                    new RollApp().render(true, {focus: true});
				},
				onUp: () => {},
				precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
			});

    CONFIG.resistanceRoller = { settings: new TJSGameSettings() }; 
});
