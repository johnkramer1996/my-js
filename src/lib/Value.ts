import { Function } from './Functions'
import IValue from './IValue'
import { Object } from './MapValue'
import Types from './Types'

export default abstract class Value<T extends string | number | boolean | undefined | IValue[] | Object | Function> implements IValue {
  constructor(protected value: T, protected typeValue: Types) {}

  public type() {
    return this.typeValue
  }

  public abstract equals(value: IValue): boolean
  public abstract compareTo(o: IValue): number

  public asNumber(): number {
    return Number(this.value)
  }

  public asString(): string {
    return String(this.value)
  }

  public toString() {
    return this.asString()
  }
}
