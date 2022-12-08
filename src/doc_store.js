import { TJSDocument, TJSDocumentCollection } from "@typhonjs-fvtt/runtime/svelte/store";

export function nullable_tjs_doc(initial) {
    // Our state
    let current_doc = null;
    let current_tjs_doc = null;
    let current_doc_subscription = null;

    // Our subscriptions - as [index, callback] tuples
    let subscriptions = [];
    let sub_ticker = 0;
    const subscribe = (callback) => {
        sub_ticker += 1;
        let cst = sub_ticker;
        subscriptions.push([cst, callback]);
        let rv = () => subscriptions.findSplice(x => x[0] == cst);
        callback(current_doc);
        return rv;
    };

    const set = (new_val) => {
        if(new_val == current_doc) {
            // If identical, do nothing
            return;
        } else if(new_val == null) {
            // If null, then teardown current doc
            current_doc_subscription?.();

            // Assign as null
            current_doc = null;
            current_tjs_doc = null;

            // Then call all subscribers
            subscriptions.forEach(is => is[1](null));
        } else {
            // If not null, teardown current doc. Could theoretically re-use, but no real difference
            current_doc_subscription?.();
            current_doc = null;

            // Construct a new TJSdocument, and subscribe to it, updating subscribers
            current_doc = new_val;
            current_tjs_doc = new TJSDocument(new_val);
            current_doc_subscription = current_tjs_doc.subscribe((sub_val) => {
                subscriptions.forEach(is => is[1](sub_val));
                console.log("TJS document called sub func", sub_val);
            });

            // Do not call all subscribers - the above subscription will do that
        }
    }

    // Initialize
    set(initial);
    return { set, subscribe };
}