import Variables, { Scope } from '@lib/Variables'
import IStatement from './IStatement'
import IVisitor from './IVisitor'
import Hoisting from '@visitors/Hoisting'
import FunctionDefineStatement from './FunctionDefineStatement'
import { VaraibleDeclaration } from './AssignmentExpression'
import { Location } from 'parser/Parser'

export default class BlockStatement implements IStatement {
  public start: number
  public end: number
  public scope!: Scope

  constructor(public body: IStatement[]) {
    this.start = Location.endBlock().getStart()
    this.end = Location.getPrevToken().getEnd()
  }

  public execute(): void {
    for (const statement of this.body) if (statement instanceof VaraibleDeclaration || statement instanceof FunctionDefineStatement) statement.hoisting()
    for (const statement of this.body) statement.execute()
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    const result: string[] = ['{\n']
    for (const statement of this.body) {
      result.push('\t' + statement.toString())
      result.push('\n')
    }
    result.push('}')
    return result.join('')
  }
}
