import Variables from '@lib/Variables'
import IExpression from './IExpression'
import IStatement from './IStatement'
import IVisitor from './IVisitor'
import { IIdentifier } from './ContainerAccessExpression'

export default class AssignmentStatement implements IStatement {
  constructor(public identifier: IIdentifier, public expression: IExpression) {}

  public execute(): void {
    return this.identifier.setValue(this.expression.eval())
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString() {
    return `${this.identifier} = ${this.expression}`
  }
}
