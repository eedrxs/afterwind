import { Modifier, Variant } from "../.."

export interface IVariant {
  value: string
  prefix: Prefix
  variant?: Variant
  type?: string
}

export interface IModifier {
  value: string
  variant?: Variant
}

export interface ISelector {
  value?: string
  variant?: Variant
  modifiers?: Modifier[]
  prefix: Prefix
}

export interface IWind {
  selectors: ISelector[]
}

export type Prefix = '' | '-'
export type Precedence = 'high' | 'low'