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