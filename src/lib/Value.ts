import IValue from './IValue'

export default abstract class Value<T extends string | number | boolean> implements IValue {
  constructor(protected value: T) {}

  public asNumber(): number {
    throw new Error('Not implementation')
  }

  public asString(): string {
    throw new Error('Not implementation')
  }

  public toString() {
    return this.asString()
  }
}
