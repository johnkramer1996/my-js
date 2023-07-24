import Variables from '@lib/Variables'
import { IExpression } from './IExpression'
import { IStatement } from './IStatement'

export default class AssignmentStatement implements IStatement {
  constructor(private variable: string, private expression: IExpression) {}

  public execute(): void {
    Variables.set(this.variable, this.expression.eval())
  }
}
