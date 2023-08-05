import ArrayValue from '@lib/ArrayValue'
import IExpression from './IExpression'
import IStatement from './IStatement'
import MapValue from '@lib/MapValue'
import IVisitor from './IVisitor'
import Variables from '@lib/Variables'

export default class DestructuringAssignmentStatement implements IStatement {
  constructor(public variables: string[], public containerExpression: IExpression) {}

  public execute(): void {
    const container = this.containerExpression.eval()
    let i = 0
    const isArray = container instanceof ArrayValue
    const isObj = container instanceof MapValue
    if (!(isArray || isObj)) throw new Error('Expect array or object')

    for (const variable of this.variables) {
      if (!variable) continue
      const value = isArray ? container.get(i++) : container.get(variable)
      Variables.set(variable, value)
    }
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return this.variables.toString()
  }
}
