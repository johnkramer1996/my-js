import IValue from './IValue'

export default class MapValue implements IValue, Iterable<[string, IValue]> {
  public value: { [index: string]: IValue } = {}

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
    throw new Error('Cannot cast array to number')
  }

  public asString(): string {
    return String(`[${this.value}]`)
  }
}
