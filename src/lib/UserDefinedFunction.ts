import IStatement from '@ast/IStatement'
import ReturnStatement from '@ast/ReturnStatement'
import IValue from './IValue'
import BooleanValue from './BooleanValue'
import { Function } from './Functions'
import Variables, { Scope } from './Variables'
import { ArgumentsMismatchException } from '@exceptions/ArgumentsMismatchException'
import { IAccessible, Identifier, Params } from '@ast/ContainerAccessExpression'
import FunctionValue from './FunctionValue'
import ArrayValue from './ArrayValue'
import UndefinedValue from './UndefinedValue'
import MapValue from './MapValue'

export default class UserDefinedFunction implements Function {
  scope!: Scope
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

    const oldScope = Variables.scope
    Variables.push(this.scope)
    this.scope.variables = new Map()
    this.args.params.forEach((arg, i) => arg.define(values[i] ?? UndefinedValue.UNDEFINED))
    this.setArguments(values)

    try {
      this.body.execute()
    } catch (rt) {
      if (rt instanceof ReturnStatement) {
        const value = rt.getResult()
        if (value instanceof FunctionValue) {
          const func = value.getValue()
          if (func instanceof UserDefinedFunction) func.setScope(new Scope(this.scope))
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

  public setScope(scope: Scope) {
    this.scope = scope
  }

  public getParamsCount(): number {
    return this.args.size()
  }

  public getParam(index: number): IAccessible {
    // if (index < 0 || index >= this.getParamsCount()) return ''
    return this.args.get(index)
  }

  public setArguments(values: IValue[]) {
    // for (let i = values.length; i < this.getParamsCount(); i++) values[i] = this.getParam(i).get()
    this.scope.variables.set('arguments', { value: new MapValue(values), kind: 'const' })
  }

  public toString() {
    return `${this.args} ${this.body}`
  }
}
