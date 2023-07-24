import IStatement from '@ast/IStatement'
import ReturnStatement from '@ast/ReturnStatement'
import IValue from './IValue'
import BooleanValue from './BooleanValue'

export default class UserDefinedFunction {
  constructor(private argNames: string[], private body: IStatement) {}

  public getArgsCount(): number {
    return this.argNames.length
  }

  public getArgsName(index: number): string {
    if (index < 0 || index >= this.getArgsCount()) return ''
    return this.argNames[index]
  }

  public execute(): IValue {
    try {
      this.body.execute()
    } catch (rt) {
      if (rt instanceof ReturnStatement) return rt.getResult()
    }

    return BooleanValue.FALSE
  }
}
