import IValue from '@lib/IValue'
import IExpression from './IExpression'
import IVisitor from './IVisitor'
import Functions from '@lib/Functions'
import FunctionValue from '@lib/FunctionValue'

export default class FunctionReferenceExpression implements IExpression {
  constructor(public name: string) {}

  public eval(): FunctionValue {
    return new FunctionValue(Functions.get(this.name))
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return '::' + this.name
  }
}
