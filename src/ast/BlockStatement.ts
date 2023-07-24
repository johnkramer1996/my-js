import Variables from '@lib/Variables'
import { IStatement } from './IStatement'
import IVisitor from './IVisitor'

export default class BlockStatement implements IStatement {
  public statements: IStatement[] = []

  public execute(): void {
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
      result.push(statement.toString())
      result.push('\n')
    }
    result.push('}')
    return result.join('')
  }
}
