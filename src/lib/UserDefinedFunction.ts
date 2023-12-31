import IStatement from '@ast/IStatement'
import IValue from './IValue'
import Function from './Functions'
import Variables, { Scope } from './Variables'
import { IAccessible } from '@ast/IAccessible'
import { Params } from '@ast/Params'
import UndefinedValue from './UndefinedValue'
import CallStack from './CallStack'

export default class UserDefinedFunction implements Function {
  public outer!: Scope
  constructor(private args: Params, private body: IStatement) {}

  public execute(...values: IValue[]): IValue {
    const size = values.length
    const requiredArgsCount = this.args.getRequiredArgumentsCount()
    const totalArgsCount = this.getParamsCount()

    if (size < requiredArgsCount) {
      // throw new ArgumentsMismatchException(`Arguments count mismatch. ${size} < ${requiredArgsCount}`)
    }
    if (size > totalArgsCount) {
      if (values.length > this.getParamsCount()) values.splice(this.getParamsCount())
      // throw new ArgumentsMismatchException(`Arguments count mismatch. ${size} > ${totalArgsCount}`)
    }
    this.args.params.forEach((arg, i) => arg.define(values[i] ?? UndefinedValue.UNDEFINED))

    this.body.execute()
    return CallStack.getReturn()
  }

  public setOuter(scope: Scope) {
    this.outer = scope
  }

  public getParamsCount(): number {
    return this.args.size()
  }

  public getParam(index: number): IAccessible {
    if (index < 0 || index >= this.getParamsCount()) throw new Error("Param is'nt exist")
    return this.args.get(index)
  }

  public toString() {
    return `${this.args} ${this.body}`
  }
}
