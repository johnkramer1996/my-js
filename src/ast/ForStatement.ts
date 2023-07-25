import Variables from '@lib/Variables'
import IExpression from './IExpression'
import IStatement from './IStatement'
import BreakStatement from './BreakStatement'
import ContinueStatement from './ContinueStatement'
import IVisitor from './IVisitor'

export default class ForStatement implements IStatement {
  constructor(public initialization: IStatement, public termination: IExpression, public increment: IStatement, public statement: IStatement) {}

  public execute(): void {
    Variables.push()
    for (this.initialization.execute(); this.termination.eval().asNumber() != 0; this.increment.execute()) {
      try {
        this.statement.execute()
      } catch (er) {
        if (er instanceof BreakStatement) break
        if (er instanceof ContinueStatement) continue
        throw er
      }
    }
    Variables.pop()
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return 'for ' + this.initialization + ', ' + this.termination + ', ' + this.increment + ' ' + this.statement
  }
}
