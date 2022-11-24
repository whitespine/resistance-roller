import { readable, derived } from 'svelte/store';
import { socket_store } from "./socket_store";

export const domainChoices = socket_store("domain_choices", []);
export const skillChoices = socket_store("skill_choices", []);
export const participantChoices = socket_store("participant_choices", []);
export const mastery = socket_store("mastery", false);
export const resistance = socket_store("resistance", "Mind");
export const difficulty = socket_store("difficulty", 0);

export const users = readable([], (set) => {
    let user_ids = [];
    let interval = setInterval(() => {
        // Get the current active users
        let new_users = game.users.filter(u => u.active);
        let new_user_ids = new_users.map(u => u.id);
        if (user_ids.length != new_user_ids.length || user_ids.some((id, index) => id != new_user_ids[index])) {
            user_ids = new_user_ids;
            set(new_users) ;
        }
    }, 1000); 

	return function stop() {
        clearInterval(interval);
    };
});
export const playerCharacters = derived(users, (us) => us.map(u => u.character).filter(x => x));