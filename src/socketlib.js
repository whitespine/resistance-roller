import { constants } from "./constants";
import StressConfirmApp from "./view/stresstaker/StressConfirmApp";

let socket;

Hooks.once("socketlib.ready", () => {
    socket = socketlib.registerModule(constants.moduleId);
    socket.register("summon-all-dialogs", fulfillSummonAllDialogs);
    socket.register("edit-roll-message", fulfillEditRollMessage);
});

/** Show the StressConfirmDialog for all unresolved effects on a roll
 *  if this user is an owner of that actor & this user is not a GM
 * 
 * @param {ChatMessage} message Message to summon messages for
 * @param {boolean} force Summon even if GM
 */
export function summonAllDialogs(message, force = false) {
    socket.executeForEveryone("summon-all-dialogs", message.uuid, force);
}

/** Fulfills summonAllDialogs' contract */
async function fulfillSummonAllDialogs(messageId, force) {
    // Get the message
    let message = await fromUuid(messageId);

    // Get the flag data
    /** @type {RollResultMessageFlags} */
    const flagData = message.getFlag(constants.moduleId, 'data');

    // For each effect, check participant and possibly summon dialog
    for (let eff of flagData.rollData.effects) {
        /** @type {Actor} */
        let participant = await fromUuid(eff.actorID);
        if (participant && participant.isOwner && (!game.user.isGM || force) && eff.status != "resolved") {
            // Awaken my masters
            StressConfirmApp.for(message, participant).render(true, { focus: true });
        }
    }
}

/**
 * 
 * @param {ChatMessage} message Message to edit
 * @param {Actor} participant Participant within the roll to fulfill
 * @param {RollResultEntry} newEffectData New data to put for that participant
 */
export function editRollMessage(message, participant, newEffectData) {
    socket.executeAsGM("edit-roll-message", message.uuid, participant.uuid, newEffectData);
}

/**
 * 
 * @param {string} messageId 
 * @param {string} participantId 
 * @param {RollResultEntry} newEffectData 
 */
async function fulfillEditRollMessage(messageId, participantId, newEffectData) {
    // Get the message
    /** @type {ChatMessage} */
    let message = await fromUuid(messageId);

    if (!message) {
        console.error("Message could not resolved - aborting");
        return;
    }

    // Get the participant
    /** @type {Actor} */
    let participant = await fromUuid(participantId);

    if (!participant) {
        console.error("Participant could not resolved - aborting");
        return;
    }

    // Get the flag data
    /** @type {RollResultMessageFlags} */
    const flagData = message.getFlag(constants.moduleId, 'data');

    if (!flagData) {
        console.error("Message had no flags - aborting");
        return;
    }

    // Find/Confirm that we're in the effects
    let corrEffectIndex = flagData.rollData.effects.findIndex(e => e.actorID == participantId);

    if (corrEffectIndex < 0) {
        console.error("Proposed participant was not found in flags - aborting");
        return;
    }

    // Patch it
    let effects = duplicate(flagData.rollData.effects);
    effects.splice(corrEffectIndex, 1, newEffectData);

    // Patch the effect, and apply the edit
    await message.setFlag(constants.moduleId, "data", {
        rollData: { effects }
    });


    // Play a sound effect if enabled
    if(game.settings.get(constants.moduleId, "noise")) {
        const play = (file) => {
            if(file) {
                game.audio.play(file, {volume: 1, autoplay: true, loop: false });
            }
        }
        if (newEffectData.falloutResult == "major") {
            play(game.settings.get(constants.moduleId, "noise-fallout-major"));
        } else if (newEffectData.falloutResult == "minor") {
            play(game.settings.get(constants.moduleId, "noise-fallout-minor"));
        } else if (newEffectData.falloutResult == "none" && newEffectData.stressTaken > 0) {
            play(game.settings.get(constants.moduleId, "noise-stress"));
        }
    }
}

