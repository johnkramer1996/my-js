import { Function } from './Functions'
import IValue from './IValue'

export default class FunctionValue implements IValue {
  constructor(public value: Function) {}

  public getValue(): Function {
    return this.value
  }

  public asNumber(): number {
    throw new Error('Cannot cast function to number')
  }

  public asString(): string {
    return String(this.value + ' 1')
  }

  public toString(): string {
    return this.asString()
  }
}
