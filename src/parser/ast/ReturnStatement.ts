import IValue from '@lib/IValue'
import IStatement from './IStatement'
import IExpression from './IExpression'
import BooleanValue from '@lib/BooleanValue'
import IVisitor from './IVisitor'
import CallStack from '@lib/CallStack'

export default class ReturnStatement implements IStatement {
  constructor(public expression: IExpression) {}

  public execute(): void {
    CallStack.setReturn(this.expression.eval())
  }

  // public getResult(): IValue {
  //   return this.result || BooleanValue.FALSE
  // }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return 'return ' + this.expression
  }
}
