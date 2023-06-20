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

Array.prototype.distinct = function <T>(callbackFn: (a: T) => T | any = (a: T) => a) {
    const set = new Set(this.map(callbackFn));
    return [...set];
};

Array.prototype.intersect = function <T>(otherArr: T[]): Array<T> {
    const firstArr = this;
    const intersectedItems = new Set<T>();
    for (const a of firstArr) {
        for (const b of otherArr) {
            if (a === b) {
                intersectedItems.add(b);
                break;
            }
        }
    }

    return [...intersectedItems];
};

Number.isNumber = (val: string | number | boolean): boolean => {
    if (typeof val === "string" && !Number.isNaN(Number(val))) {
        return true;
    } else if (typeof val === "number") {
        return true;
    }

    return false;
};
