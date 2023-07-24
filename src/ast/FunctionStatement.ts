import FunctionalExpression from './FunctionalExpression'
import { IStatement } from './IStatement'

export default class FunctionStatement implements IStatement {
  constructor(private func: FunctionalExpression) {}

  public execute(): void {
    this.func.eval()
  }

  public toString(): string {
    return this.func.toString()
  }
}
