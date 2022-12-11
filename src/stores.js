import { socket_store } from "./socket_store";

// The synchronized settings for the active roll
/** @type {import("svelte/store").Writable<string>} */
export const selectedSkill = socket_store("current_skill", "kill");

/** @type {Writable<string>} */
export const selectedDomain = socket_store("current_domain", "religion");

/** @type {Writable<string[]>} */
export const participantChoices = socket_store("participant_choices", []);

/** @type {Writable<boolean>} */
export const mastery = socket_store("mastery", false);

/** @type {Writable<string>} */
export const selectedResistance = socket_store("resistance", "mind");

/** @type {Writable<number>} */
export const difficulty = socket_store("difficulty", 0);

/** @type {Writable<number>} */
export const stressDice = socket_store("stress_dice", 6);

/** @type {Writable<number>} */
export const stressBonus = socket_store("stress_bonus", 0);
