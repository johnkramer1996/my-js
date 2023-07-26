import Variables from '@lib/Variables'
import IExpression from './IExpression'
import IStatement from './IStatement'
import BreakStatement from './BreakStatement'
import ContinueStatement from './ContinueStatement'
import IVisitor from './IVisitor'
import ArrayValue from '@lib/ArrayValue'
import MapValue from '@lib/MapValue'
import StringValue from '@lib/StringValue'

export default class ForeachStatement implements IStatement {
  constructor(public container: IExpression, public body: IStatement, public variable1: string, public variable2?: string) {}

  public execute(): void {
    const iterator = this.container.eval()
    if (!(iterator instanceof ArrayValue) && !(iterator instanceof MapValue)) return
    Variables.push()
    for (const value of iterator) {
      if (!Array.isArray(value)) {
        Variables.set(this.variable1, value)
      } else if (this.variable2) {
        Variables.set(this.variable1, new StringValue(value[0]))
        Variables.set(this.variable2, value[1])
      } else throw new Error('expect 2 arguments')

      try {
        this.body.execute()
      } catch (er) {
        if (er instanceof BreakStatement) break
        if (er instanceof ContinueStatement) continue
        throw er
      }
    }
    Variables.pop()
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return 'for ' + this.variable1 + (this.variable2 ? ', ' + this.variable2 : '') + ': ' + this.container + ', ' + this.body
  }
}
