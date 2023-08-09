import IStatement from '@ast/IStatement'
import ReturnStatement from '@ast/ReturnStatement'
import IValue from './IValue'
import BooleanValue from './BooleanValue'
import { Function } from './Functions'
import Variables, { Scope } from './Variables'
import { ArgumentsMismatchException } from '@exceptions/ArgumentsMismatchException'
import { IAccessible, Identifier, Params } from '@ast/ContainerAccessExpression'
import FunctionValue from './FunctionValue'
import UndefinedValue from './UndefinedValue'
import MapValue from './MapValue'
import CallStack from './CallStack'

export default class UserDefinedFunction implements Function {
  // The non-null assertion operator is an exclamation mark
  // If you intend to definitely initialize a field through means other than the constructor
  // strictPropertyInitialization
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

  public hoisting() {
    for (const param of this.args.params) Variables.hoisting(param.getName(), 'var')
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
