import IValue from './IValue'
import Types from './Types'
import Value from './Value'

export default class BooleanValue extends Value<boolean> {
  public static TRUE = new BooleanValue(true)
  public static FALSE = new BooleanValue(false)

  constructor(value: boolean) {
    super(value, Types.BOOLEAN)
  }

  public compareTo(o: IValue): number {
    return this.asString().localeCompare(o.asString())
  }

  public equals(value: IValue): boolean {
    if (this === value) return true
    if (!(value instanceof BooleanValue)) return false
    return this.value === value.value
  }

  public asNumber(): number {
    return Number(this.value)
  }

  public asString(): string {
    return String(this.value)
  }
}
