import Functions, { Function } from '@lib/Functions'
import IValue from '@lib/IValue'
import UserDefinedFunction from '@lib/UserDefinedFunction'
import Variables from '@lib/Variables'
import IExpression from './IExpression'
import IVisitor from './IVisitor'
import FunctionValue from '@lib/FunctionValue'

export default class FunctionalExpression implements IExpression {
  constructor(public name: string, public args: IExpression[]) {}

  public eval(): IValue {
    const values = this.args.map((v) => v.eval())

    return this.getFunction(this.name).execute(...values)
  }

  private getFunction(key: string): Function {
    if (Functions.isExists(key)) return Functions.get(key)
    if (Variables.isExists(key)) {
      const value = Variables.get(key)
      if (value instanceof FunctionValue) return value.getValue()
    }
    throw new Error('Unknown function ' + key)
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return this.name + '(' + this.args.toString() + ')'
  }
}
