/** Creates a callback to toggle the presence of `value` in the given store `in_store` 
 * 
 * @param {Writeable} in_store 
 * @param {Any} value 
 * @returns A callback
 */
export function presenceToggler(in_store, value) {
    return () => {
        in_store.update(current => {
            if(current.includes(value)) {
            return current.filter(x => x != value);
            } else {
            return [...current, value];
            }
        });
    };
}

/** Creates a callback to set the specified path,
 * in the specified actor, to the specified number, if its number.
 * 
 * Processes change events
 * 
 */
export function numericSetter(in_doc, at_path) {
    return (evt) => {
        let num = Number.parseInt(evt.target.value);
        if(Number.isInteger(num)) {
            in_doc.update({[at_path]: num});
        }
    }
}