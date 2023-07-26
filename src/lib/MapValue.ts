import IValue from './IValue'
import Types from './Types'
import Value from './Value'

export type Object = { [index: string]: IValue }

export default class MapValue extends Value<Object> implements Iterable<[string, IValue]> {
  constructor() {
    super({}, Types.OBJECT)
  }

  public size(): number {
    return Object.keys(this.value).length
  }

  public get(key: string): IValue {
    console.log(this.value, key)
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
    throw new Error('Cannot cast array to number')
  }

  public asString(): string {
    return String(`[${JSON.stringify(this.value)}]`)
  }
}
