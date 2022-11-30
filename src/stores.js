import { socket_store } from "./socket_store";

// The synchronized settings for the active roll
export const domainChoices = socket_store("domain_choices", []);
export const skillChoices = socket_store("skill_choices", []);
export const selectedSkill = socket_store("current_skill", "");
export const selectedDomain = socket_store("current_domain", "");
export const participantChoices = socket_store("participant_choices", []);
export const mastery = socket_store("mastery", false);
export const resistance = socket_store("resistance", "Mind");
export const difficulty = socket_store("difficulty", 0);
export const dice = socket_store("stress_dice", 6);
export const stressBonus = socket_store("stress_bonus", 0);
