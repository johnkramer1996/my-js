import Variables from '@lib/Variables'
import IExpression from './IExpression'
import IStatement from './IStatement'
import IVisitor from './IVisitor'
import IValue from '@lib/IValue'
import ContainerAccessExpression, { IAccessible, Identifier } from './ContainerAccessExpression'
import BooleanValue from '@lib/BooleanValue'
import BinaryExpression, { BinaryOperator } from './BinaryExpression'
import Literal from './Literal'

export class VariableDeclarator implements IStatement {
  constructor(public target: Identifier, public expression: IExpression) {}

  public execute(): void {
    const result = this.expression.eval()
    this.target.define(result)
  }

  public hoisting(kind: string): void {
    Variables.hoisting(this.target.getName(), kind)
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString() {
    return `${this.target} = ${this.expression}`
  }
}

export class VaraibleDeclaration implements IStatement {
  constructor(public declarations: VariableDeclarator[], public kind: string) {}

  public execute(): void {
    for (const decl of this.declarations) decl.execute()
  }

  public hoisting(): void {
    for (const decl of this.declarations) decl.hoisting(this.kind)
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString() {
    return `${this.kind} ${this.declarations}`
  }
}

export default class AssignmentExpression implements IExpression {
  constructor(public operation: BinaryOperator | null, public target: IAccessible, public expression: IExpression) {}

  public eval(): IValue {
    if (this.operation === null) return this.target.set(this.expression.eval())
    return this.target.set(new BinaryExpression(this.operation, new Literal(this.target.get()), new Literal(this.expression.eval())).eval())
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString() {
    return `${this.target} = ${this.expression}`
  }
}
