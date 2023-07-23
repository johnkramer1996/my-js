import Value from './Value'

export default class BooleanValue<T extends boolean> extends Value<T> {
  public static TRUE = new BooleanValue(true)
  public static FALSE = new BooleanValue(false)

  public asNumber(): number {
    return Number(this.value)
  }

  public asString(): string {
    return String(this.value)
  }
}
