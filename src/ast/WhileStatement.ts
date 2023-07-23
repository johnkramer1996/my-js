import Variables from '@lib/Variables'
import { IExpression } from './IExpression'
import { IStatement } from './IStatement'

export default class WhileStatement implements IStatement {
  constructor(private condition: IExpression, private statement: IStatement) {}

  public execute(): void {
    Variables.push()
    while (this.condition.eval().asNumber() !== 0) {
      this.statement.execute()
    }
    Variables.pop()
  }
}
