import { IExpression } from './IExpression'

export default class TernaryExpression implements IExpression {
  constructor(private condition: IExpression, private trueExpr: IExpression, private falseExpr: IExpression) {}

  public eval(): string | number {
    return Boolean(this.condition.eval()) ? this.trueExpr.eval() : this.falseExpr.eval()
  }
}
