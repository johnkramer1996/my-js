import ArrayAccessExpression from './ArrayAccessExpression'
import { IExpression } from './IExpression'
import { IStatement } from './IStatement'

export default class ArrayAssignmentStatement implements IStatement {
  constructor(private array: ArrayAccessExpression, private expression: IExpression) {}

  public execute(): void {
    this.array.getArray().set(this.array.lastIndex(), this.expression.eval())
  }

  public toString(): string {
    return String(`${this.array} ${this.expression}`)
  }
}
