import IValue from '@lib/IValue'
import IExpression from './IExpression'
import IVisitor from './IVisitor'
import FunctionValue from '@lib/FunctionValue'
import CallStack from '@lib/CallStack'

export default class CallExpression implements IExpression {
  constructor(public functionExpr: IExpression, public args: IExpression[]) {}

  public eval(): IValue {
    const value = this.functionExpr.eval()
    if (!(value instanceof FunctionValue)) throw new Error('expect function ' + value)
    const f = value.getValue()
    CallStack.enter(this.functionExpr.toString(), f)
    const result = f.execute(...this.args.map((v) => v.eval()))
    CallStack.exit()
    return result
  }

  public accept(visitor: IVisitor): void {
    // visitor.visit(this)
  }

  public toString(): string {
    return this.functionExpr + '(' + this.args.toString() + ')'
  }
}
