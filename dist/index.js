"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// let l = console.log.bind(console)
function wind(str) {
    return new Wind(str);
}
exports.default = wind;
class Wind {
    constructor(str) {
        this.selectors = this.parse(str);
    }
    toString() {
        return this.selectors.join(' ');
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
    toString() {
        const [value, prefix, variant, modifiers] = [
            this.value,
            this.prefix,
            this.variant ? `${this.variant}` : "",
            this.modifiers ? this.modifiers.join("") : "",
        ];
        return `${modifiers}${prefix}${value}${variant}`;
    }
    parse(str) {
        const selector = {
            value: "",
            prefix: "",
            variant: undefined,
            modifiers: undefined,
        };
        let modifierEndIndex = str.lastIndexOf(":");
        const arbitraryPropMatch = str.match(/\[[^\]]+:[^\[]+\]$/);
        if (arbitraryPropMatch && modifierEndIndex > arbitraryPropMatch.index) {
            const strWithoutArbitraryProp = str.slice(0, arbitraryPropMatch.index);
            modifierEndIndex = strWithoutArbitraryProp.lastIndexOf(":");
        }
        const hasModifier = modifierEndIndex !== -1;
        if (hasModifier) {
            const modifiersString = str.slice(0, modifierEndIndex);
            const modifierStringMatches = Array.from(modifiersString.matchAll(/\[[^\]]+:[^\[]+\]|\w+(-\w+)?/g));
            selector.modifiers = modifierStringMatches.map(([modifierString]) => new Modifier(modifierString));
        }
        const selectorStartIndex = hasModifier ? modifierEndIndex + 1 : 0;
        const selectorString = str.slice(selectorStartIndex);
        const [selectorMatch, prefix, value] = selectorString.match(/^(-?)(\[[^\]]+:[^\[]+\]|\w+)/) || [];
        selector.value = value;
        selector.prefix = prefix;
        if (selectorMatch) {
            let [match, value, variantString = ""] = selector.value.match(/^([mp])([xylrtb])/) || [];
            if (match) {
                selector.value = value;
            }
            if (selectorMatch !== selectorString) {
                const variantStartIndex = selectorMatch.length;
                variantString += selectorString.slice(variantStartIndex);
            }
            if (variantString) {
                selector.variant = new Variant(variantString);
            }
        }
        return selector;
    }
}
class Variant {
    constructor(str) {
        const { value, prefix, variant, type } = this.parse(str);
        this.value = value;
        this.prefix = prefix;
        this.variant = variant;
        this.type = type;
    }
    toString() {
        const [prefix, value, variant] = [
            this.prefix,
            this.value,
            this.variant ? `${this.variant}` : "",
        ];
        return `${prefix}${value}${variant}`;
    }
    parse(str) {
        const variant = {
            value: "",
            prefix: "",
            variant: undefined,
            type: "",
        };
        const [match, prefix, value] = str.match(/(-?)(\[.+?\]|[^-]+)/) || [];
        variant.value = value;
        variant.prefix = prefix;
        if (match) {
            const hasVariant = str.length !== match.length;
            if (hasVariant) {
                const variantStartIndex = match.length;
                const variantString = str.slice(variantStartIndex);
                variant.variant = new Variant(variantString);
            }
        }
        return variant;
    }
}
class Modifier {
    constructor(str) {
        const { value, variant } = this.parse(str);
        this.value = value;
        this.variant = variant;
    }
    toString() {
        const [value, variant] = [this.value, this.variant ? `${this.variant}` : ""];
        return `${value}${variant}:`;
    }
    parse(str) {
        const modifier = {
            value: "",
            variant: undefined,
        };
        const modifierMatch = str.match(/^(\[[^\]]+:[^\[]+\]|\w+)/);
        if (modifierMatch) {
            modifier.value = modifierMatch[0];
            if (modifier.value !== modifierMatch.input) {
                const variantStartIndex = modifier.value.length;
                const variantString = str.slice(variantStartIndex);
                modifier.variant = new Variant(variantString);
            }
        }
        return modifier;
    }
}
// let style = wind(
//   "dark:md:group-hover:-px-5 md:peer-focus:text-[2rem] [&:nth-child(3)]:hover:underline hover:[&:nth-child(3)]:text-[length:var(--my-var)] [mask-type:luminance] hover:[mask-type:alpha] [--scroll-offset:56px] lg:[--scroll-offset:44px]"
// )
// l(style.toString())
// l(style.selectors.map(({ modifiers }) => modifiers))
