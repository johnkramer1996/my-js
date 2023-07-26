import FunctionalExpression from './FunctionalExpression'
import IStatement from './IStatement'
import IVisitor from './IVisitor'

export default class FunctionStatement implements IStatement {
  constructor(public func: FunctionalExpression) {}

  public execute(): void {
    this.func.eval()
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return this.func.toString()
  }
}
