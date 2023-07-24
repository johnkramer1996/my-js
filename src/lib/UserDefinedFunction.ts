import { IStatement } from '@ast/IStatement'

// todo implements IFunction
export default class UserDefinedFunction {
  private argNames: string[]
  private body: IStatement

  constructor(argNames: string[], body: IStatement) {
    this.argNames = argNames
    this.body = body
  }

  public getArgsCount(): number {
    return this.argNames.length
  }

  public getArgsName(index: number): string {
    if (index < 0 || index >= this.getArgsCount()) return ''
    return this.argNames[index]
  }

  public execute(): void {
    this.body.execute()
  }
}
