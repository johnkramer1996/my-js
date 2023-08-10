import IValue from '@lib/IValue'
import IExpression from './IExpression'
import IVisitor from './IVisitor'
import FunctionValue from '@lib/FunctionValue'
import Variables from '@lib/Variables'
import { isFunction } from '@lib/Functions'

export default class FunctionReferenceExpression implements IExpression {
  constructor(public name: string) {}

  public eval(): FunctionValue {
    const func = Variables.get(this.name)
    if (!(func instanceof FunctionValue)) throw new Error('expect func')
    return func
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return '::' + this.name
  }
}
