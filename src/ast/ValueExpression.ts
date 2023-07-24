import IExpression from '@ast/IExpression'
import IValue from '@lib/IValue'
import NumberValue from '@lib/NumberValue'
import StringValue from '@lib/StringValue'
import IVisitor from './IVisitor'

export default class ValueExpression implements IExpression {
  public value: IValue

  constructor(value: number)
  constructor(value: string)
  constructor(value: string | number) {
    this.value = typeof value === 'number' ? new NumberValue(value) : new StringValue(value)
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
