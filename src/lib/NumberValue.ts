import Types from './Types'
import Value from './Value'

export default class NumberValue extends Value<number> {
  constructor(value: number) {
    super(value, Types.NUMBER)
  }

  public asNumber(): number {
    return this.value
  }

  public asString(): string {
    return String(this.value)
  }
}
