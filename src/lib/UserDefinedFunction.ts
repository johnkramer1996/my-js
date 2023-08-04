import IStatement from '@ast/IStatement'
import ReturnStatement from '@ast/ReturnStatement'
import IValue from './IValue'
import BooleanValue from './BooleanValue'
import { Function } from './Functions'
import Variables from './Variables'
import { ArgumentsMismatchException } from 'exceptions/ArgumentsMismatchException'
import { Arguments } from '@ast/FunctionDefineStatement'

export default class UserDefinedFunction implements Function {
  constructor(private args: Arguments, private body: IStatement) {}

  public getArgsCount(): number {
    return this.args.size()
  }

  public getArgsName(index: number): string {
    if (index < 0 || index >= this.getArgsCount()) return ''
    return this.args.get(index).getName()
  }

  public execute(...values: IValue[]): IValue {
    const size = values.length
    const requiredArgsCount = this.args.getRequiredArgumentsCount()
    const totalArgsCount = this.getArgsCount()

    if (size < requiredArgsCount) throw new ArgumentsMismatchException(`Arguments count mismatch. ${size} < ${requiredArgsCount}`)
    if (size > totalArgsCount) throw new ArgumentsMismatchException(`Arguments count mismatch. ${size} > ${totalArgsCount}`)

    try {
      Variables.push()
      values.forEach((v: IValue, i: number) => Variables.define(this.getArgsName(i), v))

      // Optional args if exists
      for (let i = size; i < totalArgsCount; i++) {
        const arg = this.args.get(i)
        const defaultExpr = arg.getValueExpr()
        if (defaultExpr) Variables.set(arg.getName(), defaultExpr.eval())
      }

      this.body.execute()
    } catch (rt) {
      if (rt instanceof ReturnStatement) return rt.getResult()
      throw rt
    } finally {
      Variables.pop()
    }

    return BooleanValue.FALSE
  }

  toString() {
    return `(${this.args}) ${this.body}`
  }
}
