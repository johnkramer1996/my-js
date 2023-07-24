import IValue from './IValue'

export default class ArrayValue implements IValue {
  private elements: IValue[]

  constructor(value: number)
  constructor(size: IValue[])
  constructor(value: number | IValue[]) {
    this.elements = typeof value === 'number' ? new Array(value) : [...value]
  }

  public get(index: number): IValue {
    return this.elements[index]
  }

  public set(index: number, value: IValue) {
    this.elements[index] = value
  }

  public asNumber(): number {
    throw new Error('Cannot cast array to number')
  }

  public asString(): string {
    return String(`[${this.elements}]`)
  }
}
