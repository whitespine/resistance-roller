/**
 * @typedef {object} RollResultEntry
 * 
 * The sub-item of of RollResultMessageFlags encapsulating the effects on a single participant
 *
 * @property {string | null} actor_id - The actor uuid of this participant
 * @property {string} status - One of "unresolved" | "resolved"
 * @property {number} stress_roll - The amount of stress rolled
 * @property {number} fallout_roll - The fallout roll
 * @property {number} fallout_stress - The fallout roll
 * @property {string} resistance - The resistance the roll was taken against
 * @property {string} fallout_result - One of "none" | "minor" | "major"
 * @property {object} stress_pre_apply - A save state of the stress object at the time the action is rolled
 */


/**
 * @typedef {object} RollResultData
 * 
 * Data structure meant to entirely encompass the result (pending or otherwise) of a roll
 *
 * @property {string} actor_id - The actor uuid who initiated the roll
 * @property {string} foe_id - The actor uuid the roll was initiated against
 * @property {string} skill - The skill the roll was in
 * @property {string} domain - The domain the roll was in
 * @property {string} resistance - The resistance the roll was suggested to be against
 * @property {Array<number>} rolls - The values rolled
 * @property {Array<number>} roll - The max of the values rolled
 * @property {Array<RollResultEntry>} effects - The effects on participants
 */

/**
 * @typedef {object} RollResultMessageFlags
 * 
 * The flag data on a message encapsulating the result of a single action roll.
 * All fields are optional to reflect the uncertain nature of 
 * 
 * @property {RollResultData} rollData
 */