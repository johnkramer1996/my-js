import Functions, { Function } from '@lib/Functions'
import UserDefinedFunction from '@lib/UserDefinedFunction'
import IStatement from './IStatement'
import IVisitor from './IVisitor'
import IExpression from './IExpression'

export class Argument {
  constructor(private name: string, private valueExpr: IExpression | null = null) {}

  public getName(): string {
    return this.name
  }

  public getValueExpr(): IExpression | null {
    return this.valueExpr
  }

  public toString(): string {
    return this.name + (this.valueExpr == null ? '' : ' = ' + this.valueExpr)
  }
}

export class Arguments implements Iterable<Argument> {
  private args: Argument[] = []
  private requiredArgumentsCount = 0

  public add(name: string, expr: IExpression | null): void {
    this.args.push(new Argument(name, expr))
    !expr && ++this.requiredArgumentsCount
  }

  public get(index: number): Argument {
    return this.args[index]
  }

  public getRequiredArgumentsCount(): number {
    return this.requiredArgumentsCount
  }

  public size(): number {
    return this.args.length
  }

  public iterator(): Iterator<Argument> {
    return this[Symbol.iterator]()
  }

  public [Symbol.iterator](): Iterator<Argument> {
    return this.args[Symbol.iterator]()
  }

  public toString(): string {
    const result: (Argument | string)[] = []
    result.push('(')
    for (const arg of this.args) {
      result.push(arg)
      result.push(', ')
    }
    result.push(')')
    return result.toString()
  }
}

export default class FunctionDefineStatement implements IStatement {
  constructor(public name: string, public func: UserDefinedFunction) {}

  public execute(): void {
    Functions.set(this.name, this.func)
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return `def ${this.name} ${this.func}`
  }
}
