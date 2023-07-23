import Variables from '@lib/Variables'
import { IExpression } from './IExpression'
import { IStatement } from './IStatement'

export default class DoWhileStatement implements IStatement {
  public condition: IExpression
  public statement: IStatement

  constructor(condition: IExpression, statement: IStatement) {
    this.condition = condition
    this.statement = statement
  }

  public execute(): void {
    Variables.push()
    do {
      this.statement.execute()
    } while (this.condition.eval().asNumber() !== 0)
    Variables.pop()
  }
}
