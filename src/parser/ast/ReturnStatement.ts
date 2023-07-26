import IValue from '@lib/IValue'
import IStatement from './IStatement'
import IExpression from './IExpression'
import BooleanValue from '@lib/BooleanValue'
import IVisitor from './IVisitor'

export default class ReturnStatement implements IStatement {
  private result!: IValue

  constructor(public expression: IExpression) {}

  public execute(): void {
    this.result = this.expression.eval()
    throw this
  }

  public getResult(): IValue {
    return this.result || BooleanValue.FALSE
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return 'return ' + this.expression
  }
}
