import IStatement from '@ast/IStatement'
import ReturnStatement from '@ast/ReturnStatement'
import IValue from './IValue'
import BooleanValue from './BooleanValue'
import { Function } from './Functions'
import Variables from './Variables'
import { ArgumentsMismatchException } from '@exceptions/ArgumentsMismatchException'
import { ArrayPattern, AssignmentPattern, Identifier, Params } from '@ast/FunctionDefineStatement'
import ArrayValue from './ArrayValue'

export default class UserDefinedFunction implements Function {
  constructor(private args: Params, private body: IStatement) {}

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

    try {
      Variables.push()
      let i = 0
      for (const identifier of this.args.params) {
        if (!identifier) continue
        const defaultExpr = identifier instanceof AssignmentPattern ? identifier.getValueExpr() : null
        this.setValue(identifier, values[i++] ?? defaultExpr?.eval())
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

  private setValue(identifier: Identifier | AssignmentPattern | ArrayPattern, result: IValue) {
    if (identifier instanceof Identifier || identifier instanceof AssignmentPattern) {
      Variables.set(identifier.getName(), result)
      return
    }
    if (!(result instanceof ArrayValue)) throw new Error('expect array')
    identifier.elements.forEach((variable, i) => {
      const defaultExpr = variable instanceof AssignmentPattern ? variable.getValueExpr() : null
      const value = result.get(i) ?? defaultExpr?.eval()
      this.setValue(variable, value)
    })
  }

  toString() {
    return `(${this.args}) ${this.body}`
  }
}
