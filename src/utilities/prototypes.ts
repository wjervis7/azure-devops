String.prototype.formatUnicorn = function (...args: any[]) {
    let str = this.toString();
    console.log(`String to format: ${str}.`);
    console.log("Arguments", args);

    if (!args.length) {
        return str;
    }

    const argType = typeof args[0];
    args = argType === "string" || argType === "number" ? Array.prototype.slice.call(args) : args[0];

    console.log("new args", args);

    for (const key in args) {
        str = str.replace(new RegExp(`\\{${key}\\}`, "gi"), args[key]);
    }

    return str;
};

Array.prototype.distinct = function () {
    const set = new Set(this);
    return [...set];
};
