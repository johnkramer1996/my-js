import Value from './Value'

export default class StringValue<T extends string> extends Value<T> {
  public asNumber(): number {
    return Number.parseFloat(this.value)
  }

  public asString(): string {
    return this.value
  }
}
