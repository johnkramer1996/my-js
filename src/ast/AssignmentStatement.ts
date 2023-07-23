import Variables from '@lib/Variables'
import { IExpression } from './IExpression'
import { IStatement } from './IStatement'

export default class AssignmentStatement implements IStatement {
  public variable: string
  public expression: IExpression

  constructor(variable: string, expression: IExpression) {
    this.variable = variable
    this.expression = expression
  }

  public execute(): void {
    Variables.set(this.variable, this.expression.eval())
  }
}
