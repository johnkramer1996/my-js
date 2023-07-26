import IValue from './IValue'
import Types from './Types'
import Value from './Value'

export class MyArray<T extends IValue> extends Array<T> implements Iterable<IValue> {
  toString() {
    return this.join(', ')
  }
}

export default class ArrayValue extends Value<IValue[]> {
  constructor(value: number)
  constructor(size: IValue[])
  constructor(value: number | IValue[]) {
    super(typeof value === 'number' ? new MyArray(value) : MyArray.from([...value]), Types.ARRAY)
  }

  public size(): number {
    return this.value.length
  }

  public get(index: number): IValue {
    return this.value[index]
  }

  public set(index: number, value: IValue) {
    this.value[index] = value
  }

  public static add(array: ArrayValue, value: IValue): ArrayValue {
    return new ArrayValue([...array, value])
  }

  public static merge(array1: ArrayValue, array2: ArrayValue): ArrayValue {
    return new ArrayValue([...array1, ...array2])
  }

  public [Symbol.iterator](): Iterator<IValue> {
    return this.value[Symbol.iterator]()
  }

  public asNumber(): number {
    throw new Error('Cannot cast array to number')
  }

  public asString(): string {
    return String(`[${this.value}]`)
  }
}
