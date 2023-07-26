import { Function } from './Functions'
import IValue from './IValue'
import Types from './Types'
import Value from './Value'

export default class FunctionValue extends Value<Function> implements IValue {
  constructor(value: Function) {
    super(value, Types.FUNCTION)
  }

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
