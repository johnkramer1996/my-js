import Functions from '@lib/Functions'
import UserDefinedFunction from '@lib/UserDefinedFunction'
import { IStatement } from './IStatement'

export default class FunctionDefineStatement implements IStatement {
  constructor(private name: string, private argNames: string[], private body: IStatement) {}

  public execute(): void {
    Functions.set(this.name, new UserDefinedFunction(this.argNames, this.body))
  }

  public toString(): string {
    return `def ${this.name}(${this.argNames}) ${this.body}`
  }
}
