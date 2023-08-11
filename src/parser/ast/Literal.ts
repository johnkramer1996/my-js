import FunctionValue from '@lib/FunctionValue'
import IExpression from '@ast/IExpression'
import IValue from '@lib/IValue'
import NumberValue from '@lib/NumberValue'
import StringValue from '@lib/StringValue'
import IVisitor from './IVisitor'
import Function from '@lib/Functions'
import { Location } from 'parser/Parser'

export default class Literal implements IExpression {
  public value: IValue

  constructor(value: number, location?: Location)
  constructor(value: string, location?: Location)
  constructor(value: IValue, location?: Location)
  constructor(value: string | number | IValue, public location?: Location) {
    if (typeof value === 'number') value = new NumberValue(value)
    else if (typeof value === 'string') value = new StringValue(value)
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
