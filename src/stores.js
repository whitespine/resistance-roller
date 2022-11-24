import { socket_store } from "./socket_store";

export const domainChoices = socket_store("domain_choices", []);
export const skillChoices = socket_store("skill_choices", []);
export const mastery = socket_store("mastery", false);
export const resistance = socket_store("resistance", "Mind");