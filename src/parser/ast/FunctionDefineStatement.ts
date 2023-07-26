import Functions from '@lib/Functions'
import UserDefinedFunction from '@lib/UserDefinedFunction'
import IStatement from './IStatement'
import IVisitor from './IVisitor'

export default class FunctionDefineStatement implements IStatement {
  constructor(public name: string, public argNames: string[], public body: IStatement) {}

  public execute(): void {
    Functions.set(this.name, new UserDefinedFunction(this.argNames, this.body))
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return `def ${this.name}(${this.argNames}) ${this.body}`
  }
}
