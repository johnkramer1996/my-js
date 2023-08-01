import Functions, { Function } from '@lib/Functions'
import IValue from '@lib/IValue'
import UserDefinedFunction from '@lib/UserDefinedFunction'
import Variables from '@lib/Variables'
import IExpression from './IExpression'
import IVisitor from './IVisitor'
import FunctionValue from '@lib/FunctionValue'
import { UnknownFunctionException, VariableDoesNotExistsException } from 'exceptions/ArgumentsMismatchException'

export default class FunctionalExpression implements IExpression {
  constructor(public functionExpr: IExpression, public args: IExpression[]) {}

  public eval(): IValue {
    return this.consumeFunction(this.functionExpr).execute(...this.args.map((v) => v.eval()))
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
