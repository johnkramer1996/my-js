import Types from './Types'
import Value from './Value'

export default class StringValue extends Value<string> {
  constructor(value: string) {
    super(value, Types.STRING)
  }

  public asNumber(): number {
    return Number.parseFloat(this.value)
  }

  public asString(): string {
    return this.value
  }
}
