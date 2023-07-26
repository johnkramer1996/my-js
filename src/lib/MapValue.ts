import IValue from './IValue'
import Value from './Value'

export default class MapValue implements IValue {
  public value: { [index: string]: IValue } = {}

  public get(key: string): IValue {
    if (!this.value[key]) throw new Error('error')
    return this.value[key] as IValue
  }

  public set(key: string, value: IValue) {
    this.value[key] = value
  }

  // : IterableIterator<IValue>
  public [Symbol.iterator]() {
    const entries = Object.entries(this.value)
    let index = 0
    const length = entries.length
    return {
      next() {
        if (index < length) {
          return { value: entries[index++], done: false }
        }
        return { value: entries[index], done: true }
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
