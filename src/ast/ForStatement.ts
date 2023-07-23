import Variables from '@lib/Variables'
import { IExpression } from './IExpression'
import { IStatement } from './IStatement'

export default class ForStatement implements IStatement {
  constructor(private initialization: IStatement, private termination: IExpression, private increment: IStatement, private statement: IStatement) {}

  public execute(): void {
    Variables.push()
    for (this.initialization.execute(); this.termination.eval().asNumber() != 0; this.increment.execute()) {
      this.statement.execute()
    }
    Variables.pop()
  }
}
