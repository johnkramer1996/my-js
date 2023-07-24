import Variables from '@lib/Variables'
import { IExpression } from './IExpression'
import { IStatement } from './IStatement'
import BreakStatement from './BreakStatement'
import ContinueStatement from './ContinueStatement'

export default class WhileStatement implements IStatement {
  constructor(private condition: IExpression, private statement: IStatement) {}

  public execute(): void {
    Variables.push()
    while (this.condition.eval().asNumber() !== 0) {
      try {
        this.statement.execute()
      } catch (statement) {
        if (statement instanceof BreakStatement) break
        if (statement instanceof ContinueStatement) continue
      }
    }
    Variables.pop()
  }

  public toString(): string {
    return 'while ' + this.condition + ' ' + this.statement
  }
}
