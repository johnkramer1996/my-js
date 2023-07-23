import Value from './Value'

export default class NumberValue<T extends number> extends Value<T> {
  public asNumber(): number {
    return this.value
  }

  public asString(): string {
    return String(this.value)
  }
}
