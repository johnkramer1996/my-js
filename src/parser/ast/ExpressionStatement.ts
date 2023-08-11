import { Location } from 'parser/Parser'
import IExpression from './IExpression'
import IStatement from './IStatement'
import IVisitor from './IVisitor'

export default class ExpressionStatement implements IStatement {
  public start: number
  public end: number
  constructor(public expr: IExpression) {
    this.start = Location.endStatement().getStart()
    this.end = Location.getPrevToken().getEnd()
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
