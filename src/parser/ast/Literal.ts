import FunctionValue from '@lib/FunctionValue'
import IExpression from '@ast/IExpression'
import IValue from '@lib/IValue'
import NumberValue from '@lib/NumberValue'
import StringValue from '@lib/StringValue'
import IVisitor from './IVisitor'
import { Function } from '@lib/Functions'

function isFunction(func: any): func is Function {
  return 'execute' in func
}

export default class Literal implements IExpression {
  public value: IValue

  constructor(value: number)
  constructor(value: string)
  constructor(value: IValue)
  constructor(value: string | number | IValue) {
    if (typeof value === 'number') value = new NumberValue(value)
    else if (typeof value === 'string') value = new StringValue(value)
    const a = FunctionValue.EMPTY
    this.value = value
  }

  public eval(): IValue {
    return this.value
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return this.value.asString()
  }
}
