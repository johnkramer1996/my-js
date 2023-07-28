import Variables from '@lib/Variables'
import IExpression from './IExpression'
import IStatement from './IStatement'
import IVisitor from './IVisitor'
import IValue from '@lib/IValue'

export default class AssignmentExpression implements IExpression {
  constructor(public variable: string, public expression: IExpression) {}

  public eval(): IValue {
    Variables.set(this.variable, this.expression.eval())
    return Variables.get(this.variable)
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString() {
    return `${this.variable} = ${this.expression}`
  }
}
