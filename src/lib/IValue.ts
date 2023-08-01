import Types from './Types'

export default interface IValue {
  asNumber(): number
  asString(): string
  type(): Types
  equals(value: IValue): boolean
}
