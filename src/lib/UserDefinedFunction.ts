import IStatement from '@ast/IStatement'
import ReturnStatement from '@ast/ReturnStatement'
import IValue from './IValue'
import BooleanValue from './BooleanValue'
import { Function } from './Functions'
import Variables, { Scope } from './Variables'
import { ArgumentsMismatchException } from '@exceptions/ArgumentsMismatchException'
import { Params } from '@ast/ContainerAccessExpression'
import FunctionValue from './FunctionValue'

export default class UserDefinedFunction implements Function {
  scope!: Scope
  constructor(private args: Params, private body: IStatement) {}

  public setScope(scope: Scope) {
    this.scope = scope
  }

  public getParamsCount(): number {
    return this.args.size()
  }

  public getParam(index: number) {
    if (index < 0 || index >= this.getParamsCount()) return ''
    return this.args.get(index)
  }

  public execute(...values: IValue[]): IValue {
    const size = values.length
    const requiredArgsCount = this.args.getRequiredArgumentsCount()
    const totalArgsCount = this.getParamsCount()

    if (size < requiredArgsCount) throw new ArgumentsMismatchException(`Arguments count mismatch. ${size} < ${requiredArgsCount}`)
    if (size > totalArgsCount) throw new ArgumentsMismatchException(`Arguments count mismatch. ${size} > ${totalArgsCount}`)

    const oldScope = Variables.scope
    Variables.push(this.scope)
    this.scope.variables = new Map()
    try {
      let i = 0
      for (const identifier of this.args.params) {
        if (!identifier) continue
        identifier.set(values[i++])
      }

      this.body.execute()
    } catch (rt) {
      if (rt instanceof ReturnStatement) {
        const value = rt.getResult()
        if (value instanceof FunctionValue) {
          const func = value.getValue()
          if (func instanceof UserDefinedFunction) {
            const scope = new Scope(this.scope)
            func.setScope(scope)
          }
        }
        return value
      }
      throw rt
    } finally {
      Variables.scope = oldScope
      // Variables.pop()
    }

    return BooleanValue.FALSE
  }

  toString() {
    return `(${this.args}) ${this.body}`
  }
}
