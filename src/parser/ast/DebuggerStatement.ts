import CallStack from '@lib/CallStack'
import IStatement from './IStatement'
import IVisitor from './IVisitor'

export default class DebuggerStatement implements IStatement {
  public execute(): void {
    for (const call of CallStack.getCalls()) console.log(`\tat ${call}`)
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return 'debugger'
  }
}
