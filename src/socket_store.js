import { constants } from "./constants";
import { writable } from "svelte/store";

const MODE_REQUEST_VALUE = "req"; // data will be the requesters current time. Only respond if you have a newer one
const MODE_SET_VALUE = "set"; // data will be the new value

// All of our stores are tracked here
const socket_stores = {};

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
        console.log("RECEIVING SOCKET", store, mode, data, time);
        let ss = socket_stores[store];
        if (!ss) {
            console.error(`Received message about unknown store ${store}`);
            return;
        }

        // Handle messages
        if (mode == MODE_REQUEST_VALUE) {
            ss.respondPeers(data);
        } else if (mode == MODE_SET_VALUE) {
            ss.receive(data, time);
        }
    });

    // Have all current sockets ask peers
    for(let ss of Object.values(socket_stores)) {
        ss.askPeers();
    }
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
    if (key in socket_stores) {
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

    // Possiblt respond to askPeers
    const respondPeers = (request_time) => {
        if (request_time < time) {
            sendSocket(store, MODE_SET_VALUE, cv, time);
        }
    }

    let result = {
        subscribe, 
        receive,
        set: setSend,
        update: updateSend,
        askPeers,
        respondPeers,
    };
    socket_stores[key] = result;
    return result;
}