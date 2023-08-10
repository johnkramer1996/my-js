import IValue from '@lib/IValue'
import IVisitor from './IVisitor'
import { Params } from './Params'
import IStatement from './IStatement'
import FunctionValue from '@lib/FunctionValue'
import IExpression from './IExpression'

export default class FunctionExpression implements IExpression {
  constructor(public params: Params, public body: IStatement) {}

  public eval(): IValue {
    return new FunctionValue(this.body, this.params)
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return this.params.toString() + this.body
  }
}
