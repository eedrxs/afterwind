import { IModifier, IPrefix, ISelector, IVariant, IWind } from "./src/types"
let l = console.log.bind(console)

export function wind(str: string): Wind {
  return new Wind(str)
}

class Wind implements IWind {
  selectors: ISelector[]

  constructor(str: string) {
    this.selectors = this.parse(str)
  }

  private parse(str: string): ISelector[] {
    return str.split(" ").map((str) => new Selector(str))
  }
}

class Selector implements ISelector {
  value: string
  variant?: IVariant | undefined
  modifiers?: IModifier[] | undefined
  prefix: IPrefix

  constructor(str: string) {
    const { value, variant, modifiers, prefix } = this.parse(str)
    this.value = value
    this.variant = variant
    this.modifiers = modifiers
    this.prefix = prefix
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
        modifiersString.matchAll(/\[[^\]]+:[^\[]+\]|\w+/g)
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
      let [match, value, variantString = ''] = selector.value.match(/^([mp])([xylrtb])/) || []

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

      // l(variantString)
    }

    // console.log(selectorString)

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

  private parse(str: string): IModifier {
    const modifier: IModifier = {
      value: "",
      variant: undefined,
    }

    return modifier
  }
}

let style = wind(
  "dark:md:hover:-px-5 md:focus:text-[2rem] [&:nth-child(3)]:hover:underline hover:[&:nth-child(3)]:text-[length:var(--my-var)] [mask-type:luminance] hover:[mask-type:alpha] [--scroll-offset:56px] lg:[--scroll-offset:44px]"
)
l(style.selectors)
