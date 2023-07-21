import { IExpression } from '@ast/IExpression'

export class ValueExpression implements IExpression {
  constructor(private value: string) {}

  public eval(): string {
    return this.value
  }
}
