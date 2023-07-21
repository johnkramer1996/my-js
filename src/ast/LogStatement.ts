import { IStatement } from '@ast/IStatement'
import { IExpression } from '@ast/IExpression'

export class LogStatement implements IStatement {
  constructor(public expression: IExpression) {}

  public execute(): void {
    process.stdout.write(String(this.expression.eval()))
    process.stdout.write('\n')
  }
}