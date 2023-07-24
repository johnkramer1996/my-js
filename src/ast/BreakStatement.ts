import { IStatement } from './IStatement'
import IVisitor from './IVisitor'

export default class BreakStatement implements IStatement {
  public execute(): void {
    throw this
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return 'break'
  }
}
