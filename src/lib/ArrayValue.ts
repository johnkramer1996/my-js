import IValue from './IValue'
import Value from './Value'

export class MyArray<T extends IValue> extends Array<T> {
  toString() {
    return this.join(', ')
  }
}

export default class ArrayValue extends Value<IValue[]> {
  constructor(value: number)
  constructor(size: IValue[])
  constructor(value: number | IValue[]) {
    super(typeof value === 'number' ? new MyArray(value) : MyArray.from([...value]))
  }

  public get(index: number): IValue {
    return this.value[index]
  }

  public set(index: number, value: IValue) {
    this.value[index] = value
  }

  public asNumber(): number {
    throw new Error('Cannot cast array to number')
  }

  public asString(): string {
    return String(`[${this.value}]`)
  }
}
