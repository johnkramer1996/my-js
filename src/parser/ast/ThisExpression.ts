import IExpression from '@ast/IExpression'
import IValue from '@lib/IValue'
import NumberValue from '@lib/NumberValue'
import StringValue from '@lib/StringValue'
import IVisitor from './IVisitor'
import FunctionValue from '@lib/FunctionValue'
import Function from '@lib/Functions'
import Value from '@lib/Value'
import Variables from '@lib/Variables'
import { Location } from 'parser/Parser'

export default class ThisExpression implements IExpression {
  public start: number
  public end: number
  constructor() {
    this.start = Location.getPrevToken().start
    this.end = Location.getPrevToken().end
  }

  public eval(): IValue {
    return Variables.get('this')
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return 'this'
  }
}
