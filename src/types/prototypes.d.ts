interface String {
    formatUnicorn(...args: any[]): string;
}

interface Array {
    distinct(): Array;
    intersect<T>(otherArr: Array<T>, callback?: (a: T, b: T) => boolean): Array<T>;
}
