import Variables from '@lib/Variables'
import IExpression from './IExpression'
import IStatement from './IStatement'
import IVisitor from './IVisitor'
import IValue from '@lib/IValue'
import ContainerAccessExpression, { IIdentifier, Identifier } from './ContainerAccessExpression'
import BooleanValue from '@lib/BooleanValue'

export class VariableDeclarator implements IStatement {
  constructor(public identifier: Identifier, public expression: IExpression) {}

  public execute(): void {
    const result = this.expression.eval()
    this.identifier.defineValue(result)
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }
}

export class VaraibleDeclaration implements IStatement {
  constructor(public declarations: VariableDeclarator[], public kind: string) {}

  public execute(): void {
    for (const decl of this.declarations) decl.execute()
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString() {
    return `${this.kind} ${this.declarations}`
  }
}

export default class AssignmentExpression implements IExpression {
  constructor(public identifier: IIdentifier, public expression: IExpression) {}

  public eval(): IValue {
    const result = this.expression.eval()
    return this.identifier.setValue(result), result
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString() {
    return `${this.identifier} = ${this.expression}`
  }
}
