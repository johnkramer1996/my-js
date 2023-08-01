import { TypeException } from 'exceptions/ArgumentsMismatchException'
import IValue from './IValue'
import NumberValue from './NumberValue'
import Types from './Types'
import Value from './Value'

export type Object = { [index: string]: IValue }

export default class MapValue extends Value<Object> implements Iterable<[string, IValue]> {
  public static EMPTY: MapValue = new MapValue()

  constructor() {
    super({}, Types.OBJECT)
  }

  public size(): number {
    return Object.keys(this.value).length
  }

  public containsKey(key: string): boolean {
    return key in this.value
  }

  public get(key: string): IValue {
    if (!this.value[key]) throw new Error('error')
    return this.value[key] as IValue
  }

  public set(key: string, value: IValue) {
    this.value[key] = value
  }

  public [Symbol.iterator](): Iterator<[string, IValue]> {
    const entries = Object.entries(this.value)

    const length = entries.length
    let index = 0
    return {
      next(): IteratorResult<[string, IValue]> {
        return index < length ? { value: entries[index++], done: false } : { value: entries[index], done: true }
      },
    }
  }

  public asNumber(): number {
    throw new TypeException('Cannot cast array to number')
  }

  public asString(): string {
    return String(
      `{${Object.entries(this.value).map(([key, value]) => {
        const primitive = value instanceof NumberValue ? value.asNumber() : `"${value.asString()}"`
        return `"${key}": ${primitive}`
      })}}`
    )
  }
}
