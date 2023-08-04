import Functions, { Function } from '@lib/Functions'
import IValue from '@lib/IValue'
import Variables from '@lib/Variables'
import IExpression from './IExpression'
import IVisitor from './IVisitor'
import FunctionValue from '@lib/FunctionValue'
import { UnknownFunctionException } from '@exceptions/UnknownFunctionException'
import VariableDoesNotExistsException from '@exceptions/VariableDoesNotExistsException'
import CallStack from '@lib/CallStack'

export default class FunctionalExpression implements IExpression {
  constructor(public functionExpr: IExpression, public args: IExpression[]) {}

  public eval(): IValue {
    const f = this.consumeFunction(this.functionExpr)
    CallStack.enter(this.functionExpr.toString(), f)
    const result = f.execute(...this.args.map((v) => v.eval()))
    CallStack.exit()
    return result
  }

  private consumeFunction(expr: IExpression): Function {
    try {
      const value = expr.eval()
      return value instanceof FunctionValue ? value.getValue() : this.getFunction(value.asString())
    } catch (e) {
      if (e instanceof VariableDoesNotExistsException) return this.getFunction(e.getVariable())
      throw e
    }
  }

  private getFunction(key: string): Function {
    if (Functions.isExists(key)) return Functions.get(key)
    const variable = Variables.get(key)
    if (variable instanceof FunctionValue) return variable.getValue()
    throw new UnknownFunctionException(key)
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return this.functionExpr + '(' + this.args.toString() + ')'
  }
}
