import Variables, { Scope } from '@lib/Variables'
import IStatement from './IStatement'
import IVisitor from './IVisitor'
import Hoisting from '@visitors/Hoisting'
import FunctionDefineStatement from './FunctionDefineStatement'
import { VaraibleDeclaration } from './AssignmentExpression'

export default class BlockStatement implements IStatement {
  public statements: IStatement[] = []
  public scope!: Scope

  public execute(): void {
    for (const statement of this.statements) if (statement instanceof VaraibleDeclaration || statement instanceof FunctionDefineStatement) statement.hoisting()
    for (const statement of this.statements) statement.execute()
  }

  public add(statement: IStatement) {
    this.statements.push(statement)
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    const result: string[] = ['{\n']
    for (const statement of this.statements) {
      result.push('\t' + statement.toString())
      result.push('\n')
    }
    result.push('}')
    return result.join('')
  }
}
