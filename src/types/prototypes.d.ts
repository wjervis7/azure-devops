interface String {
    /**
     * returns a string formatted similar to C# string.Format. Source: StackExchange.
     * @param {any[]} args arguments to format string with.
     * @returns {string} formatted string.
     */
    formatUnicorn(...args: any[]): string;
}

interface GroupMap<T> {
    [key: string]: T[];
}

interface Array<T> {
    /**
     * Returns a new array with distinct items from array.
     * @param {Function} callbackFn optional callback method, passed to the array map call.
     * Used if you want distinct items based on an array of objects.
     * @returns {Array<T>} new array with distinct items.
     */
    distinct(callbackFn?: (a: T) => any): Array;

    /**
     * Returns a new array with items that are in both arrays.
     * @param {Array<T>} otherArr other array to compare items with.
     * @returns {Array<T>} new array with items that are in both arrays.
     */
    intersect(otherArr: Array<T>): Array<T>;

    /**
     * Returns an object, grouping the items of this array using the provided callback function.
     * @param {Function} callbackFn function to specify value to group items by.
     * @returns {GroupMap} object where keys are the values based on the callback function,
     *  and values are the items that match the key.
     */
    group(callbackFn: (item: T) => string): GroupMap<T>;
}

interface NumberConstructor {
    /** attempts to convert the provided value to a number, and returns true if conversion succeeds, and doesn't return NaN
     * @param {any} val value to check.
     * @returns {boolean} result of check.
     */
    isNumber: (val: string | number | boolean) => boolean;
}
