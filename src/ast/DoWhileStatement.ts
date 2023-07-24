import Variables from '@lib/Variables'
import { IExpression } from './IExpression'
import { IStatement } from './IStatement'

export default class DoWhileStatement implements IStatement {
  constructor(private condition: IExpression, private statement: IStatement) {}

  public execute(): void {
    Variables.push()
    do {
      this.statement.execute()
    } while (this.condition.eval().asNumber() !== 0)
    Variables.pop()
  }
}
