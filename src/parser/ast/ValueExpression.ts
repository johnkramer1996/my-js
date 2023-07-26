import IExpression from '@ast/IExpression'
import IValue from '@lib/IValue'
import NumberValue from '@lib/NumberValue'
import StringValue from '@lib/StringValue'
import IVisitor from './IVisitor'
import FunctionValue from '@lib/FunctionValue'
import { Function } from '@lib/Functions'

export default class ValueExpression implements IExpression {
  public value: IValue

  constructor(value: number)
  constructor(value: string)
  constructor(value: Function)
  constructor(value: string | number | Function) {
    this.value = typeof value === 'number' ? new NumberValue(value) : typeof value === 'string' ? new StringValue(value) : new FunctionValue(value)
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
