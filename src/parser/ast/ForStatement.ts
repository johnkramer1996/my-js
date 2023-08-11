import Variables from '@lib/Variables'
import IExpression from './IExpression'
import IStatement from './IStatement'
import BreakStatement from './BreakStatement'
import ContinueStatement from './ContinueStatement'
import IVisitor from './IVisitor'
import { Location } from 'parser/Parser'

export default class ForStatement implements IStatement {
  public start: number
  public end: number
  constructor(public init: IStatement, public test: IExpression, public update: IStatement, public statement: IStatement) {
    this.start = Location.endStatement().getStart()
    this.end = Location.getPrevToken().getEnd()
  }

  public execute(): void {
    for (this.init.execute(); this.test.eval().asNumber() != 0; this.update.execute()) {
      this.statement.execute()
      try {
      } catch (er) {
        if (er instanceof BreakStatement) break
        if (er instanceof ContinueStatement) continue
        throw er
      }
    }
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return 'for ' + this.init + ', ' + this.test + ', ' + this.update + ' ' + this.statement
  }
}
