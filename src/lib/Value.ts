import IValue from './IValue'
import { Object } from './MapValue'

export default abstract class Value<T extends string | number | boolean | IValue[] | Object> implements IValue {
  constructor(protected value: T) {}

  public abstract asNumber(): number

  public abstract asString(): string

  public toString() {
    return this.asString()
  }
}
