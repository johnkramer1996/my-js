import Variables from '@lib/Variables'
import IExpression from './IExpression'
import IStatement from './IStatement'
import IVisitor from './IVisitor'
import IValue from '@lib/IValue'
import ContainerAccessExpression from './ContainerAccessExpression'
import { IAccessible } from './IAccessible'
import { Identifier } from './Identifier'
import BinaryExpression, { BinaryOperator } from './BinaryExpression'
import Literal from './Literal'
import UndefinedValue from '@lib/UndefinedValue'
import { Location } from 'parser/Parser'

export class VariableDeclarator implements IStatement {
  constructor(public target: Identifier, public expression: IExpression | null, public location: Location) {}

  public execute(): void {
    const result = this.expression?.eval() || UndefinedValue.UNDEFINED
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
  constructor(public declarations: VariableDeclarator[], public kind: string, public location: Location) {}

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
