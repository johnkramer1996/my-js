import Functions from '@lib/Functions'
import IValue from '@lib/IValue'
import UserDefinedFunction from '@lib/UserDefinedFunction'
import Variables from '@lib/Variables'
import IExpression from './IExpression'
import IVisitor from './IVisitor'

export default class FunctionalExpression implements IExpression {
  constructor(public name: string, public args: IExpression[]) {}

  public eval(): IValue {
    const size = this.args.length
    const values = this.args.map((v) => v.eval())
    const func = Functions.get(this.name)

    if (func instanceof UserDefinedFunction) {
      if (size != func.getArgsCount()) throw new Error('Args count mismatch')

      Variables.push()
      values.forEach((v: IValue, i: number) => Variables.set(func.getArgsName(i), v))
      const result = func.execute()
      Variables.pop()
      return result
    }
    return func(...values)
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return this.name + '(' + this.args.toString() + ')'
  }
}
