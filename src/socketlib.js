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
 */
export function summonAllDialogs(message) {
    socket.executeForEveryone("summon-all-dialogs", message.uuid);
}

/** Fulfills summonAllDialogs' contract */
async function fulfillSummonAllDialogs(messageId) {
    // Get the message
    let message = await fromUuid(messageId);

    // Get the flag data
    /** @type {RollResultMessageFlags} */
    const flagData = message.getFlag(constants.moduleId, 'data');

    // For each effect, check participant and possibly summon dialog
    for (let eff of flagData.rollData.effects) {
        /** @type {Actor} */
        let participant = await fromUuid(eff.actor_id);
        if (participant && participant.isOwner && !game.user.isGM) {
            // Awaken my masters
            StressConfirmApp.for(message, participant);
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
    let corrEffectIndex = flagData.rollData.effects.findIndex(e => e.actor_id == participantId);

    if(corrEffectIndex < 0) {
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
}

