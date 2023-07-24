import IValue from '@lib/IValue'
import { IExpression } from './IExpression'
import IVisitor from './IVisitor'

export default class TernaryExpression implements IExpression {
  constructor(public condition: IExpression, public trueExpr: IExpression, public falseExpr: IExpression) {}

  public eval(): IValue {
    return Boolean(this.condition.eval()) ? this.trueExpr.eval() : this.falseExpr.eval()
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return `${this.condition} ${this.trueExpr}, ${this.falseExpr}`
  }
}
