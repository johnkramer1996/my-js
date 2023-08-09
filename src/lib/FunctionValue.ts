import TypeException from '@exceptions/TypeException'
import BooleanValue from './BooleanValue'
import { Function } from './Functions'
import IValue from './IValue'
import Types from './Types'
import Value from './Value'
import UserDefinedFunction from './UserDefinedFunction'
import { Scope } from './Variables'

export default class FunctionValue extends Value<Function> implements IValue {
  public static EMPTY: FunctionValue = new FunctionValue({ execute: () => BooleanValue.FALSE })

  constructor(value: Function) {
    super(value, Types.FUNCTION)
  }

  public getValue(): Function {
    return this.value
  }

  public setScope(scope: Scope) {
    if (this.value instanceof UserDefinedFunction) this.value.outer = scope
  }

  public compareTo(o: IValue): number {
    return this.asString().localeCompare(o.asString())
  }

  public equals(value: IValue): boolean {
    if (this === value) return true
    if (!(value instanceof FunctionValue)) return false
    return this.value === value.value
  }

  public asNumber(): number {
    throw new TypeException('Cannot cast function to number')
  }

  public asString(): string {
    return String(this.value)
  }

  public toString(): string {
    return this.asString()
  }
}
