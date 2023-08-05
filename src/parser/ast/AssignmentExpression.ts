import Variables from '@lib/Variables'
import IExpression from './IExpression'
import IStatement from './IStatement'
import IVisitor from './IVisitor'
import IValue from '@lib/IValue'
import ContainerAccessExpression from './ContainerAccessExpression'
import { ArrayPattern, AssignmentPattern, Identifier } from './FunctionDefineStatement'
import ArrayValue from '@lib/ArrayValue'

export default class AssignmentExpression implements IExpression {
  constructor(public identifier: Identifier | ArrayPattern | ContainerAccessExpression, public expression: IExpression) {}

  public eval(): IValue {
    const result = this.expression.eval()
    if (this.identifier instanceof ContainerAccessExpression) return this.identifier.setValue(result), result

    return this.setValue(this.identifier, result), result
  }

  public setValue(identifier: Identifier | ArrayPattern | AssignmentPattern, result: IValue) {
    if (identifier instanceof Identifier || identifier instanceof AssignmentPattern) {
      Variables.set(identifier.getName(), result)
      return
    }
    if (!(result instanceof ArrayValue)) throw new Error('expect array')
    identifier.elements.forEach((variable, i) => {
      const defaultExpr = variable instanceof AssignmentPattern ? variable.getValueExpr() : null
      const value = result.get(i) ?? defaultExpr?.eval()
      this.setValue(variable, value)
    })
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString() {
    return `${this.identifier} = ${this.expression}`
  }
}
