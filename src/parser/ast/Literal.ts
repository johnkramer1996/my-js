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
  public raw: string

  constructor(value: number, raw: string)
  constructor(value: string, raw: string)
  constructor(value: IValue, raw: string)
  constructor(value: string | number | IValue, raw: string) {
    if (typeof value === 'number') value = new NumberValue(value)
    else if (typeof value === 'string') value = new StringValue(value)
    this.value = value
    this.start = Location.getPrevToken().getStart()
    this.end = Location.getPrevToken().getEnd()
    this.raw = `"${raw}"`
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
