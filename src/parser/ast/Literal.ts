import FunctionValue from '@lib/FunctionValue'
import IExpression from '@ast/IExpression'
import IValue from '@lib/IValue'
import NumberValue from '@lib/NumberValue'
import StringValue from '@lib/StringValue'
import IVisitor from './IVisitor'
import { Location } from 'parser/Parser'

export default class Literal implements IExpression {
  public start: number
  public end: number
  public value: IValue

  constructor(value: number)
  constructor(value: string)
  constructor(value: IValue)
  constructor(value: string | number | IValue) {
    if (typeof value === 'number') value = new NumberValue(value)
    else if (typeof value === 'string') value = new StringValue(value)
    this.value = value
    this.start = Location.getPosition().start
    this.end = Location.getPosition().end
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
