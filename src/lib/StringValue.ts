import Types from './Types'
import Value from './Value'

export default class StringValue extends Value<string> {
  static EMPTY = new StringValue('')

  constructor(value: string) {
    super(value, Types.STRING)
  }

  public length(): number {
    return this.value.length
  }

  public asNumber(): number {
    return Number.parseFloat(this.value)
  }

  public asString(): string {
    return this.value
  }
}
