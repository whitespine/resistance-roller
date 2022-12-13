import { constants } from "../constants";
import { writable } from "svelte/store";

const MODE_REQUEST_VALUE = "req"; // data will be the requesters current time. Only respond if you have a newer one
const MODE_REQUEST_ALL = "req_all"; // data will be null. time will not matter
const MODE_SET_VALUE = "set"; // data will be the new value
const MODE_SET_ALL = "set_all"; // data will be an object of of { key: {time, val} }

// All of our stores are tracked here
const SOCKET_STORES = {};

/**
 * All messages will have the following:
 * - mode: one of the above constnats
 * - time: when it was emitted
 * - store: store it is about
 * - data: the message payload
 */

/** Initializes the sockets for synchronizing our store */
export function listenSockets() {
    // Initialize our listeners
    game.socket.on(constants.socketName, (message, senderId) => {
        // Unpack message
        let { store, mode, time, data } = message;
        let ss;
        if (store) {
            ss = SOCKET_STORES[store];
            if (!ss) {
                console.error(`Received message about unknown store ${store}`);
                return;
            }
        }

        // Handle messages
        if (mode == MODE_REQUEST_VALUE) {
            // Tell the specified store to give up its data
            ss.respondPeers(data);
        } else if (mode == MODE_SET_VALUE) {
            // Pass it along to the appropriate store
            ss.receive(data, time);
        } else if (mode == MODE_REQUEST_ALL) {
            // Someone asked for everything. Oblige!
            let payload = {};
            for(let [key, store] of Object.entries(SOCKET_STORES)) {
                payload[key] = store.getState();
            }
            sendSocket(null, MODE_SET_ALL, payload);
        } else if (mode == MODE_SET_ALL) {
            // We got everything. Didn't necessarily ask for it, but best to set all values to be sure
            for(let [key, val] of Object.entries(data)) {
                ss = SOCKET_STORES[key];
                ss.receive(val.value, val.time);
            }
        }
    });

    // Have all current sockets ask peers
    sendSocket(null, MODE_REQUEST_ALL, null, null);
}

/** Wrapper to send on our socket */
function sendSocket(store, mode, data, time_override=null) {
    game.socket.emit(constants.socketName, {
        store,
        mode, 
        time: time_override ?? Date.now(),
        data 
    });
}

/**
 * Create a new socket store with the provided name, and given initial value.
 * If any peers exist their initial value will be used instead.
 */
export function socket_store(key, initial) {
    // Check duplicate
    if (key in SOCKET_STORES) {
        throw new Error(`Duplicate socket store key ${key}`);
    }

    const { subscribe, set } = writable(initial);

    let time = 0;
    let cv = initial;

    // Establish our methods
    // Sets this store without emitting any changes on socket
    const receive = (v, inc_time) => {
        // Newer = set, older = ignore
        if (time < inc_time) {
            cv = v;
            set(v);
            time = inc_time;
        }
    }

    // Sets this store, sending the change on socket as well
    const setSend = (v) => {
        cv = v;
        set(v);
        time = Date.now();
        sendSocket(key, MODE_SET_VALUE, v);
    }

    // Updates this store, sending the change on socket as well
    const updateSend = (f) => {
        setSend(f(cv));
    }

    // Asks peers for their current value
    const askPeers = (v) => {
        sendSocket(key, MODE_REQUEST_VALUE, time);
    }

    // Possibly respond to askPeers
    const respondPeers = (request_time) => {
        if (request_time < time) {
            sendSocket(store, MODE_SET_VALUE, cv, time);
        }
    }

    // Use for building bring-up-to-speed stuff
    const getState = () => {
        return {
            key, 
            time, 
            value: cv
        }
    }

    let result = {
        subscribe, 
        receive,
        set: setSend,
        update: updateSend,
        askPeers,
        respondPeers,
        getState
    };
    SOCKET_STORES[key] = result;
    return result;
}