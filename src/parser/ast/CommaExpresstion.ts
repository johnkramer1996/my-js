import IValue from '@lib/IValue'
import IExpression from './IExpression'
import IVisitor from './IVisitor'

export default class CommaExpression implements IExpression {
  constructor(public left: IExpression, public right: IExpression) {}

  public eval(): IValue {
    return this.left.eval(), this.right.eval()
  }

  public accept(visitor: IVisitor): void {
    // visitor.visit(this)
  }

  public toString(): string {
    return `(${this.left}, ${this.right})`
  }
}
