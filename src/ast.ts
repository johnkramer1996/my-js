export interface INode {}

export interface IExpression extends INode {
  eval(): string
}
export interface IStatement extends INode {
  execute(): void
}

export class LogStatement implements IStatement {
  constructor(public expression: IExpression) {}

  public execute(): void {
    process.stdout.write(String(this.expression.eval()))
    process.stdout.write('\n')
  }
}

export class ValueExpression implements IExpression {
  constructor(private value: string) {}

  public eval(): string {
    return this.value
  }
}
