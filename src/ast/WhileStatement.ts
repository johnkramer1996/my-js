import Variables from '@lib/Variables'
import { IExpression } from './IExpression'
import { IStatement } from './IStatement'
import BreakStatement from './BreakStatement'
import ContinueStatement from './ContinueStatement'
import IVisitor from './IVisitor'

export default class WhileStatement implements IStatement {
  constructor(public condition: IExpression, public statement: IStatement) {}

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

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return 'while ' + this.condition + ' ' + this.statement
  }
}
