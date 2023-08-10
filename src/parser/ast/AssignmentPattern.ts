import IValue from '@lib/IValue'
import Variables from '@lib/Variables'
import IExpression from './IExpression'
import IVisitor from './IVisitor'
import { IAccessible } from './IAccessible'

export class AssignmentPattern implements IAccessible {
  constructor(public identifier: IAccessible, public valueExpr: IExpression) {}

  public eval(): IValue {
    return this.get()
  }

  public get(): IValue {
    return Variables.get(this.getName())
  }

  public set(value: IValue): IValue {
    const defaultExpr = this.getValueExpr().eval()
    return Variables.set(this.getName(), value || defaultExpr)
  }

  public define(value: IValue): IValue {
    const defaultExpr = this.getValueExpr().eval()
    return Variables.define(this.getName(), value || defaultExpr)
  }

  public getName(): string {
    return this.identifier.getName()
  }

  public getValueExpr(): IExpression {
    return this.valueExpr
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return this.identifier + (this.valueExpr == null ? '' : ' = ' + this.valueExpr)
  }
}
