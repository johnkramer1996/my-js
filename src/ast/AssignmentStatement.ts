import Variables from '@lib/Variables'
import { IExpression } from './IExpression'
import { IStatement } from './IStatement'
import IVisitor from './IVisitor'

export default class AssignmentStatement implements IStatement {
  constructor(public variable: string, public expression: IExpression) {}

  public execute(): void {
    Variables.set(this.variable, this.expression.eval())
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString() {
    return `${this.variable} = ${this.expression}`
  }
}
