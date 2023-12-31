import clsx from "./src/utils/clsx"
import cssConflict from "./src/utils/cssConflict"
import {
  IModifier,
  ISelector,
  IVariant,
  Precedence,
  Prefix,
  IWind,
} from "./src/types"
import { ClassValue } from "./src/utils/clsx/clsx"

const l = console.log.bind(console)

export default function wind(...str: ClassValue[]): Wind {
  return new Wind(clsx(...str))
}

export class Wind {
  #selectors: Selector[]
  #nestedClasses: Map<string, string>

  constructor(str: string) {
    const { selectors, nestedClasses } = this.#parse(str)
    this.#selectors = Selector.sanitize(selectors) // TODO: DEDUPLICATE POTENTIAL DUPLICATE SELECTORS
    this.#nestedClasses = nestedClasses
    for (let key of nestedClasses.keys()) {
      ;(<any>this)[key] = nestedClasses.get(key)
    }
  }

  add(str: string, precedence: Precedence = "high") {
    const incomingSelectors = Selector.sanitize(this.#parse(str).selectors)
    const selectorStrings = this.#selectors.map((selector) =>
      selector.toString()
    )

    for (let incomingSelector of incomingSelectors) {
      selectorStrings.push(incomingSelector.toString())
      if (!cssConflict(selectorStrings)) {
        if (precedence === "high") {
          this.#selectors.push(incomingSelector)
        } else {
        }
      }
      selectorStrings.pop()
    }

    return this
  }

  remove(...str: ClassValue[]) {
    const incomingSelectors = this.#parse(clsx(...str)).selectors

    for (let incomingSelector of incomingSelectors) {
      this.#selectors = this.#selectors.filter(
        (selector) => !Selector.assignable(incomingSelector, selector)
      )
    }

    return this
  }

  get(str: string | string[]) {
    if (!Array.isArray(str)) {
      if (str.startsWith("$")) {
        return this.#nestedClasses.get(str)
      } else {
        const {selectors} = this.#parse(str)
      }
    } else {
      for (let key of str) {
      }
    }
  }

  toString() {
    return this.#selectors.join(" ")
  }

  #parse(str: string): {
    selectors: Selector[]
    nestedClasses: Map<string, string>
  } {
    const tokens = str.split(/\s+(?![^{]*}|[^\(]*\))/)
    const nestedClasses = new Map()

    tokens.forEach((token, index) => {
      const [match, key, classes] = token.match(/^(\$\w+){(.*?)}$/) || []
      if (match) {
        nestedClasses.set(key, classes)
        tokens.splice(index, 1)
      }
    })

    const selectors = tokens.map((token) => new Selector(token))
    return { selectors, nestedClasses }
  }
}

export class Selector {
  value?: string | undefined
  prefix: Prefix
  variant?: Variant | undefined
  modifiers?: Modifier[] | undefined

  constructor(str: string) {
    const { value, variant, modifiers, prefix } = this.#parse(str)
    this.value = value
    this.variant = variant
    this.modifiers = modifiers
    this.prefix = prefix
  }

  toString() {
    const [value, prefix, variant, modifiers] = [
      this.value ? this.value : "",
      this.prefix,
      this.variant ? `${this.variant}` : "",
      this.modifiers ? this.modifiers.join("") : "",
    ]

    return `${modifiers}${prefix}${value}${variant}`
  }

  #parse(str: string): ISelector {
    const selector: ISelector = {
      value: undefined,
      prefix: "",
      variant: undefined,
      modifiers: undefined,
    }

    let modifierEndIndex = str.lastIndexOf(":")
    const arbitraryPropMatch = str.match(/\[[^\]]+:[^\[]+\]$/)

    if (arbitraryPropMatch && modifierEndIndex > arbitraryPropMatch.index!) {
      const strWithoutArbitraryProp = str.slice(0, arbitraryPropMatch.index)
      modifierEndIndex = strWithoutArbitraryProp.lastIndexOf(":")
    }

    const hasModifier = modifierEndIndex !== -1
    if (hasModifier) {
      const modifiersString = str.slice(0, modifierEndIndex)
      const modifierStringMatches = Array.from(
        modifiersString.matchAll(/\*|\[[^\]]+:[^\[]+\]|\w+([-\/]\w+)*/g)
      )

      selector.modifiers = modifierStringMatches.map(
        ([modifierString]) => new Modifier(modifierString)
      )
    }

    const selectorStartIndex = hasModifier ? modifierEndIndex + 1 : 0
    const selectorString = str.slice(selectorStartIndex)
    const [selectorMatch, prefix = "", value] =
      selectorString.match(/^(-?)(\[[^\]]+:[^\[]+\]|\w+)/) || []
    selector.value = value ? value : undefined
    selector.prefix = prefix as Prefix

    if (selectorMatch && selector.value) {
      let [match, value, variantString = ""] =
        selector.value.match(/^([mp])([xylrtb])/) || []

      if (match) {
        selector.value = value
      }

      if (selectorMatch !== selectorString) {
        const variantStartIndex = selectorMatch.length
        variantString += selectorString.slice(variantStartIndex)
      }

      if (variantString) {
        selector.variant = new Variant(variantString)
      }
    }

    return selector
  }

  static assignable(selectorA: Selector, selectorB: Selector): boolean {
    if (selectorA.value === undefined || selectorA.value === selectorB.value) {
      return (
        Modifier.assignable(selectorA.modifiers, selectorB.modifiers) &&
        Variant.assignable(selectorA.variant, selectorB.variant)
      )
    } else {
      return false
    }
  }

  static dedupe() {}

  static sanitize(selectors: Selector[]): Selector[] {
    return selectors.filter((selector) => selector.value)
  }
}

export class Variant {
  value: string
  prefix: Prefix
  variant?: Variant | undefined
  type?: string | undefined

  constructor(str: string) {
    const { value, prefix, variant, type } = this.#parse(str)
    this.value = value
    this.prefix = prefix
    this.variant = variant
    this.type = type
  }

  toString() {
    const [prefix, value, variant] = [
      this.prefix,
      this.value,
      this.variant ? `${this.variant}` : "",
    ]

    return `${prefix}${value}${variant}`
  }

  #parse(str: string): IVariant {
    const variant: IVariant = {
      value: "",
      prefix: "",
      variant: undefined,
      type: "",
    }

    const [match, prefix, value] = str.match(/(-?)(\[.+?\]|[^-]+)/) || []
    variant.value = value
    variant.prefix = prefix as Prefix

    if (match) {
      const hasVariant = str.length !== match.length
      if (hasVariant) {
        const variantStartIndex = match.length
        const variantString = str.slice(variantStartIndex)
        variant.variant = new Variant(variantString)
      }
    }

    return variant
  }

  static assignable(variantA?: Variant, variantB?: Variant): boolean {
    if (variantA === undefined || variantB === undefined) {
      if (variantA !== undefined) {
        return false
      }

      return true
    } else {
      if (variantA.value !== variantB.value) {
        // TODO: TAKE NOTE OF PREFIX --> && variantA.prefix !== variantB.prefix
        return false
      }

      return Variant.assignable(variantA.variant, variantB.variant)
    }
  }
}

export class Modifier {
  value: string
  variant?: Variant | undefined

  constructor(str: string) {
    const { value, variant } = this.#parse(str)
    this.value = value
    this.variant = variant
  }

  toString() {
    const [value, variant] = [this.value, this.variant ? `${this.variant}` : ""]

    return `${value}${variant}:`
  }

  #parse(str: string): IModifier {
    const modifier: IModifier = {
      value: "",
      variant: undefined,
    }

    const modifierMatch = str.match(/^\*|(\[[^\]]+:[^\[]+\]|\w+)/)

    if (modifierMatch) {
      modifier.value = modifierMatch[0]

      if (modifier.value !== modifierMatch.input) {
        const variantStartIndex = modifier.value.length
        const variantString = str.slice(variantStartIndex)
        modifier.variant = new Variant(variantString)
      }
    }

    return modifier
  }

  static assignable(modifiersA?: Modifier[], modifiersB?: Modifier[]): boolean {
    if (modifiersA === undefined || modifiersB === undefined) {
      if (modifiersA !== undefined) {
        return false
      }

      return true
    }

    const sequenceFirstModifier = modifiersA[0]
    const sequenceStartIndex = modifiersB.findIndex(
      (modifierB) =>
        sequenceFirstModifier.value === modifierB.value &&
        Variant.assignable(sequenceFirstModifier.variant, modifierB.variant)
    )

    if (sequenceStartIndex === -1) {
      return false
    }

    const sequenceEndIndex = sequenceStartIndex + modifiersA.length
    const modifierSequence = modifiersB.slice(
      sequenceStartIndex,
      sequenceEndIndex
    )

    if (modifierSequence.length !== modifiersA.length) {
      return false
    }

    const nonMatchingModifier = modifierSequence.find(
      (sequence, index) =>
        modifiersA[index].value !== sequence.value ||
        !Variant.assignable(modifiersA[index].variant, sequence.variant)
    )

    return nonMatchingModifier === undefined
  }
}
// ^(\$\w+){(.*?)}$
let style = wind(
  "text-blue-600 font-bold md:(bg-blue-100 text-lg) $icon{size-2 px-4}"
)

let $icon = style.get("$icon")
// l(style.$icon)
// style.get(["$icon", "bg", "md:"])

// l(style.toString())

// TODO: FIX TYPINGS e.g. ISelector vs Selector, etc
// TODO: HANDLE CASE OF SUPPLYING EMPTY STRING TO wind
// TODO: HANDLE NAMED GROUP/PEER e.g. group-hover/edit:text-gray-700 => ADD Slash CLASS TO HANDLE THIS
// TODO: ADD SUPPORT FOR FORWARD SLASH PREFIX e.g bg-black/75
// TODO: ADD MORE SUPPORT FOR ARBITRARY VARIANTS e.g [@supports(display:grid)]:grid [@media(any-hover:hover){&:hover}]:opacity-100
// TODO: MAKE IT POSSIBLE TO SPECIFY SELECTOR TYPES WHEN REMOVING SELECTORS e.g. remove('text{color}')
// TODO: TAKE ! MODIFIER INTO COGNINZANCE
// TODO: ADD ArbitraryValue CLASS TO HANDLE ARBITRARY VALUES WHERE SELECTOR VALUES CAN BE THIS OR STRINGS OR UNDEFINED

// let style = wind(
//   "[@supports(display:grid)]:hover:grid [@media(any-hover:hover){&:hover}]:opacity-100 dark:md:group-hover:-px-5 md:peer-focus:text-[2rem] [&:nth-child(3)]:hover:underline hover:[&:nth-child(3)]:text-[length:var(--my-var)] [mask-type:luminance] hover:[mask-type:alpha] [--scroll-offset:56px] lg:[--scroll-offset:44px]"
// )
// l(style.selectors.map((s) => s.modifiers))
// l(style.selectors.map(({ modifiers }) => modifiers))

// l(tailwindOrWindiCN_EFS('border border-1 border-red border-dashed text-lg md:text-2xl md:text-sm p-2 pl-3 px-4'))
// l(twMerge('border border-1 border-red border-dashed text-lg md:text-2xl md:text-sm p-2 pl-3 px-4'))
// l(overrideTailwindClasses('border border-1 border-red border-dashed text-lg md:text-2xl md:text-sm p-2 pl-3 px-4'))
