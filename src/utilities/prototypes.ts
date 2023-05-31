String.prototype.formatUnicorn = function (...args: any[]) {
    let str = this.toString();

    if (!args.length) {
        return str;
    }

    const argType = typeof args[0];
    args = argType === "string" || argType === "number" ? Array.prototype.slice.call(args) : args[0];

    for (const key in args) {
        str = str.replace(new RegExp(`\\{${key}\\}`, "gi"), args[key]);
    }

    return str;
};

Array.prototype.distinct = function () {
    const set = new Set(this);
    return [...set];
};

Array.prototype.intersect = function <T>(otherArr: T[], callback: (a: T, b: T) => boolean = (a, b) => a === b) {
    const firstArr = this;
    const intersectedItems: T[] = [];
    for (const a of firstArr) {
        for (const b of otherArr) {
            if (callback(a, b)) {
                intersectedItems.push(b);
                break;
            }
        }
    }

    return intersectedItems;
};
