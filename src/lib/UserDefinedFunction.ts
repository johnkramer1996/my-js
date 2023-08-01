import IStatement from '@ast/IStatement'
import ReturnStatement from '@ast/ReturnStatement'
import IValue from './IValue'
import BooleanValue from './BooleanValue'
import { Function } from './Functions'
import Variables from './Variables'
import { ArgumentsMismatchException } from 'exceptions/ArgumentsMismatchException'

export default class UserDefinedFunction implements Function {
  constructor(private argNames: string[], private body: IStatement) {}

  public getArgsCount(): number {
    return this.argNames.length
  }

  public getArgsName(index: number): string {
    if (index < 0 || index >= this.getArgsCount()) return ''
    return this.argNames[index]
  }

  public execute(...values: IValue[]): IValue {
    try {
      if (values.length != this.getArgsCount()) throw new ArgumentsMismatchException('Arguments count mismatch')
      // Variables.push()
      // console.log(Variables)

      values.forEach((v: IValue, i: number) => Variables.set(this.getArgsName(i), v))
      this.body.execute()
    } catch (rt) {
      if (rt instanceof ReturnStatement) return rt.getResult()
      throw rt
    } finally {
      // Variables.pop()
    }

    return BooleanValue.FALSE
  }

  toString() {
    return `(${this.argNames}) ${this.body}`
  }
}
