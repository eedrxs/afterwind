import { IModifier, IPrefix, ISelector, IVariant, IWind } from "./src/types"
let l = console.log.bind(console)

export default function wind(str: string): Wind {
  return new Wind(str)
}

class Wind implements IWind {
  selectors: ISelector[]

  constructor(str: string) {
    this.selectors = this.parse(str)
  }

  toString() {
    return this.selectors.join(' ')
  }

  private parse(str: string): ISelector[] {
    return str.split(" ").map((str) => new Selector(str))
  }
}

class Selector implements ISelector {
  value: string
  prefix: IPrefix
  variant?: IVariant | undefined
  modifiers?: IModifier[] | undefined

  constructor(str: string) {
    const { value, variant, modifiers, prefix } = this.parse(str)
    this.value = value
    this.variant = variant
    this.modifiers = modifiers
    this.prefix = prefix
  }

  private toString() {
    const [value, prefix, variant, modifiers] = [
      this.value,
      this.prefix,
      this.variant ? `${this.variant}` : "",
      this.modifiers ? this.modifiers.join("") : "",
    ]

    return `${modifiers}${prefix}${value}${variant}`
  }

  private parse(str: string): ISelector {
    const selector: ISelector = {
      value: "",
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
        modifiersString.matchAll(/\[[^\]]+:[^\[]+\]|\w+(-\w+)?/g)
      )
      selector.modifiers = modifierStringMatches.map(
        ([modifierString]) => new Modifier(modifierString)
      )
    }

    const selectorStartIndex = hasModifier ? modifierEndIndex + 1 : 0
    const selectorString = str.slice(selectorStartIndex)
    const [selectorMatch, prefix, value] =
      selectorString.match(/^(-?)(\[[^\]]+:[^\[]+\]|\w+)/) || []
    selector.value = value
    selector.prefix = prefix as IPrefix

    if (selectorMatch) {
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
}

class Variant implements IVariant {
  value: string
  prefix: IPrefix
  variant?: IVariant | undefined
  type?: string | undefined

  constructor(str: string) {
    const { value, prefix, variant, type } = this.parse(str)
    this.value = value
    this.prefix = prefix
    this.variant = variant
    this.type = type
  }

  private toString() {
    const [prefix, value, variant] = [
      this.prefix,
      this.value,
      this.variant ? `${this.variant}` : "",
    ]

    return `${prefix}${value}${variant}`
  }

  private parse(str: string): IVariant {
    const variant: IVariant = {
      value: "",
      prefix: "",
      variant: undefined,
      type: "",
    }

    const [match, prefix, value] = str.match(/(-?)(\[.+?\]|[^-]+)/) || []
    variant.value = value
    variant.prefix = prefix as IPrefix

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
}

class Modifier implements IModifier {
  value: string
  variant?: IVariant | undefined

  constructor(str: string) {
    const { value, variant } = this.parse(str)
    this.value = value
    this.variant = variant
  }

  private toString() {
    const [value, variant] = [this.value, this.variant ? `${this.variant}` : ""]

    return `${value}${variant}:`
  }

  private parse(str: string): IModifier {
    const modifier: IModifier = {
      value: "",
      variant: undefined,
    }

    const modifierMatch = str.match(/^(\[[^\]]+:[^\[]+\]|\w+)/)

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
}

let style = wind(
  "[@supports(display:grid)]:hover:grid [@media(any-hover:hover){&:hover}]:opacity-100 dark:md:group-hover:-px-5 md:peer-focus:text-[2rem] [&:nth-child(3)]:hover:underline hover:[&:nth-child(3)]:text-[length:var(--my-var)] [mask-type:luminance] hover:[mask-type:alpha] [--scroll-offset:56px] lg:[--scroll-offset:44px]"
)
l(style.selectors.map(s => s.modifiers))
// l(style.selectors.map(({ modifiers }) => modifiers))

// TODO: HANDLE NAMED GROUP/PEER e.g. group-hover/edit:text-gray-700
// TODO: HANDLE STYLED DIRECT CHILDREN e.g. *:rounded-full
// TODO: ADD SUPPORT FOR FORWARD SLASH PREFIX e.g bg-black/75
// TODO: ADD MORE SUPPORT FOR ARBITRARY VARIANTS e.g [@supports(display:grid)]:grid [@media(any-hover:hover){&:hover}]:opacity-100