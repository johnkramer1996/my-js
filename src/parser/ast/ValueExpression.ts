import IExpression from '@ast/IExpression'
import IValue from '@lib/IValue'
import NumberValue from '@lib/NumberValue'
import StringValue from '@lib/StringValue'
import IVisitor from './IVisitor'
import FunctionValue from '@lib/FunctionValue'
import { Function } from '@lib/Functions'
import Value from '@lib/Value'

export default class ValueExpression implements IExpression {
  public value: IValue

  constructor(value: number)
  constructor(value: string)
  constructor(value: IValue)
  constructor(value: string | number | IValue) {
    if (typeof value === 'number') value = new NumberValue(value)
    else if (typeof value === 'string') value = new StringValue(value)
    this.value = value
    // if (value instanceof Function) new FunctionValue(value)
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
