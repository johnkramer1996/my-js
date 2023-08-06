import Variables from '@lib/Variables'
import IExpression from './IExpression'
import IStatement from './IStatement'
import IVisitor from './IVisitor'
import IValue from '@lib/IValue'
import ContainerAccessExpression, { IIdentifier } from './ContainerAccessExpression'

export default class AssignmentExpression implements IExpression {
  constructor(public identifier: IIdentifier, public expression: IExpression) {}

  public eval(): IValue {
    const result = this.expression.eval()
    return this.identifier.setValue(result), result
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString() {
    return `${this.identifier} = ${this.expression}`
  }
}
