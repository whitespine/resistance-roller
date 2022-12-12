import { socket_store } from "./socket_store";

// The synchronized settings for the active roll
/** @type {import("svelte/store").Writable<string>} */
export const selectedSkill = socket_store("current_skill", "kill");

/** @type {import("svelte/store").Writable<string>} */
export const selectedDomain = socket_store("current_domain", "religion");

/** @type {import("svelte/store").Writable<string[]>} */
export const participantChoices = socket_store("participant_choices", []);

/** @type {import("svelte/store").Writable<boolean>} */
export const mastery = socket_store("mastery", false);

/** @type {import("svelte/store").Writable<string>} */
export const selectedResistance = socket_store("resistance", "mind");

/** @type {import("svelte/store").Writable<number>} */
export const difficulty = socket_store("difficulty", 0);

/** @type {import("svelte/store").Writable<number>} */
export const stressDice = socket_store("stress_dice", 6);

/** @type {import("svelte/store").Writable<number>} */
export const stressBonus = socket_store("stress_bonus", 0);
