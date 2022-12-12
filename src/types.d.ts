// The sub-item of of RollResultMessageFlags encapsulating the effects on a single participant
declare type RollResultEntry = {
 actorID: string, // The actor uuid of this participant
 status: string, // One of "unresolved" | "resolved"
 stressRoll: number, // The amount of stress rolled
 falloutRoll: number, // The fallout roll
 falloutTotalStress: number, // The total stress at time of fallout roll
 resistance: string, // The resistance the roll was taken against
 falloutResult: string, // One of "none" | "minor" | "major"
 stressPreApply: any // A save state of the stress object at the time the action is rolled
}


/**
 * @typedef {object} RollResultData
 * 
 * Data structure meant to entirely encompass the result (pending or otherwise) of a roll
 *
 */
declare type RollResultData = {
    actorID: string | null, // The actor uuid who initiated the roll
    foeID: string, // The actor uuid the roll was initiated against
    skill: string, // The skill the roll was in
    domain: string, // The domain the roll was in
    resistance: string, // The resistance the roll was suggested to be against
    rolls: Array<number>, // The values rolled
    roll: Array<number>, // The max of the values rolled
    effects: Array<RollResultEntry>, // The effects on participants
}

/**
 * @typedef {object} RollResultMessageFlags
 * 
 * The flag data on a message encapsulating the result of a single action roll.
 * All fields are optional to reflect the uncertain nature of 
 * 
 * @property {RollResultData} rollData
 */

declare type RollResultMessageFlags = {
    rollData: RollResultData
}