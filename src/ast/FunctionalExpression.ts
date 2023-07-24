import Functions from '@lib/Functions'
import IValue from '@lib/IValue'
import UserDefinedFunction from '@lib/UserDefinedFunction'
import Variables from '@lib/Variables'
import { IExpression } from './IExpression'
import BooleanValue from '@lib/BooleanValue'
import ReturnStatement from './ReturnStatement'

export default class FunctionalExpression implements IExpression {
  constructor(private name: string, private args: IExpression[]) {}

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
    throw new Error('never')
    // return func(...values)
  }
}
