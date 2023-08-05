import ContainerAccessExpression from './ContainerAccessExpression'
import IExpression from './IExpression'
import IStatement from './IStatement'
import IVisitor from './IVisitor'

export default class ContainerAssignmentStatement implements IStatement {
  constructor(public array: ContainerAccessExpression, public expression: IExpression) {}

  public execute(): void {
    this.array.setValue(this.expression.eval())
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return String(`${this.array} ${this.expression}`)
  }
}
