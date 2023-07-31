import Variables from '@lib/Variables'
import IExpression from './IExpression'
import IStatement from './IStatement'
import IVisitor from './IVisitor'
import IValue from '@lib/IValue'
import ArrayAccessExpression from './ArrayAccessExpression'

export default class AssignmentExpression implements IExpression {
  constructor(public variable: string | ArrayAccessExpression, public expression: IExpression) {}

  public eval(): IValue {
    if (this.variable instanceof ArrayAccessExpression) {
      this.variable.setValue(this.expression.eval())
      return this.variable.eval()
    }
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
