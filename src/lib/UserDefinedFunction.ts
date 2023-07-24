import { IStatement } from '@ast/IStatement'

export default class UserDefinedFunction {
  constructor(private argNames: string[], private body: IStatement) {}

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
