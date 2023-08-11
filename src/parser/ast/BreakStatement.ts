import { Location } from 'parser/Parser'
import IStatement from './IStatement'
import IVisitor from './IVisitor'

export default class BreakStatement implements IStatement {
  public start: number
  public end: number
  constructor() {
    this.start = Location.endStatement().getStart()
    this.end = Location.getPrevToken().getEnd()
  }

  public execute(): void {
    // throw this
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return 'break'
  }
}
