import { TJSGameSettings }    from '@typhonjs-fvtt/svelte-standard/store';
import { constants } from './constants';

export const settings = new TJSGameSettings();

export function initSettings() {
    // Register settings 
    game.settings.register(constants.moduleId, "noise", {
        name: "Enable Audio Cues",
        hint: "If enabled, play audio cues for Stress / Fallout",
        scope: "client",
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register(constants.moduleId, "noise-stress", {
        name: "Stress Audio Cue",
        hint: "If set, a path to an audio file to play when stress is incurred",
        scope: "world",
        config: true,
        type: String,
        filePicker: true,
        default: ""
    });

    game.settings.register(constants.moduleId, "noise-fallout-minor", {
        name: "Minor Fallout Audio Cue",
        hint: "If set, a path to an audio file to play when minor fallout is incurred",
        scope: "world",
        config: true,
        type: String,
        filePicker: true,
        default: ""
    });

    game.settings.register(constants.moduleId, "noise-fallout-major", {
        name: "Major Fallout Audio Cue",
        hint: "If set, a path to an audio file to play when major fallout is incurred",
        scope: "world",
        config: true,
        type: String,
        filePicker: true,
        default: ""
    });
}