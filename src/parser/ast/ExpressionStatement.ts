import { Location } from 'parser/Parser'
import IExpression from './IExpression'
import IStatement from './IStatement'
import IVisitor from './IVisitor'

export default class ExpressionStatement implements IStatement {
  start: number
  end: number
  constructor(public expr: IExpression) {
    Location.endStatement()
    this.start = Location.getStatement().start
    this.end = Location.getStatement().end
  }

  public execute(): void {
    this.expr.eval()
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return this.expr.toString()
  }
}
