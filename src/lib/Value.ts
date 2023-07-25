import IValue from './IValue'

export default abstract class Value<T extends string | number | boolean | IValue[]> implements IValue {
  constructor(protected value: T) {}

  public abstract asNumber(): number

  public abstract asString(): string

  public toString() {
    return this.asString()
  }
}
