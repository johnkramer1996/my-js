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
    if (container instanceof ArrayValue) {
      const size = this.variables.length
      for (let i = 0; i < size; i++) {
        const variable = this.variables[i]
        if (variable) Variables.set(variable, container.get(i))
      }
      return
    }
    if (container instanceof MapValue) {
      for (const [key, value] of container) {
        const variable = this.variables.find((el) => el === key)
        if (variable) Variables.set(variable, value)
      }
      return
    }
    throw new Error('Expect array or object')
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return this.variables.toString()
  }
}
