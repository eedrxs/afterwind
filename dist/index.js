"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wind = void 0;
let l = console.log.bind(console);
function wind(str) {
    return new Wind(str);
}
exports.wind = wind;
class Wind {
    constructor(str) {
        this.selectors = this.parse(str);
    }
    parse(str) {
        return str.split(" ").map((str) => new Selector(str));
    }
}
class Selector {
    constructor(str) {
        const { value, variant, modifiers, prefix } = this.parse(str);
        this.value = value;
        this.variant = variant;
        this.modifiers = modifiers;
        this.prefix = prefix;
    }
    parse(str) {
        const token = {
            value: "",
            variant: undefined,
            modifiers: undefined,
            prefix: "",
        };
        const modifierEndIndex = str.lastIndexOf(":");
        const hasModifier = modifierEndIndex !== -1;
        if (hasModifier) {
            const modifierString = str.substring(0, modifierEndIndex);
            // TODO: HANDLE lg:[--scroll-offset:44px]
            // console.log(modifierString)
        }
        const selectorStartIndex = hasModifier ? modifierEndIndex + 1 : 0;
        const selectorString = str.substring(selectorStartIndex);
        const match = str.match(/([\w]+)-?/) || [];
        const selector = match[1];
        l(selector);
        // console.log(selectorString)
        return token;
    }
}
class Variant {
    constructor(value, prefix) {
        this.value = value;
        this.prefix = prefix;
    }
}
let style = wind('hover:bg-red md:focus:text-[2rem] [&:nth-child(3)]:hover:underline');
//  lg:[--scroll-offset:44px]
// console.log(style)
