export interface IVariant {
  value: string
  prefix: IPrefix
  variant?: IVariant
  type?: string
}

export interface IModifier {
  value: string
  variant?: IVariant
}

export interface ISelector {
  value: string
  variant?: IVariant
  modifiers?: IModifier[]
  prefix: IPrefix
}

export interface IWind {
  selectors: ISelector[]
}

export type IPrefix = '' | '-'