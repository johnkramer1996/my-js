import { Location } from 'parser/Parser'
import IExpression from './IExpression'
import IStatement from './IStatement'
import IVisitor from './IVisitor'

export default class ExprStatement implements IStatement {
  public location: Location
  constructor(public expr: IExpression) {
    this.location = expr.location
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
