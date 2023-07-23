import { IExpression } from '@ast/IExpression'

export class ValueExpression implements IExpression {
  constructor(private value: string | number) {}

  public eval(): string | number {
    return this.value
  }
}
