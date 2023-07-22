import { IStatement } from './IStatement'

export default class BlockStatement implements IStatement {
  public statements: IStatement[] = []

  public execute(): void {
    for (const statement of this.statements) statement.execute()
  }

  public add(statement: IStatement) {
    this.statements.push(statement)
  }
}
