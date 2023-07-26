import Types from './Types'
import Value from './Value'

export default class BooleanValue extends Value<boolean> {
  public static TRUE = new BooleanValue(true)
  public static FALSE = new BooleanValue(false)

  constructor(value: boolean) {
    super(value, Types.BOOLEAN)
  }

  public asNumber(): number {
    return Number(this.value)
  }

  public asString(): string {
    return String(this.value)
  }
}
