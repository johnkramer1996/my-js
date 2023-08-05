import Functions, { Function } from '@lib/Functions'
import UserDefinedFunction from '@lib/UserDefinedFunction'
import IStatement from './IStatement'
import IVisitor from './IVisitor'
import IExpression from './IExpression'

export class Identifier {
  constructor(public name: string) {}

  public getName(): string {
    return this.name
  }

  public toString(): string {
    return this.name
  }
}

export class AssignmentPattern {
  constructor(public identifier: Identifier | ArrayPattern, public valueExpr: IExpression) {}

  public getName(): string {
    return this.identifier.getName()
  }

  public getValueExpr(): IExpression | null {
    return this.valueExpr
  }

  public toString(): string {
    return this.identifier + (this.valueExpr == null ? '' : ' = ' + this.valueExpr)
  }
}

export class ArrayPattern implements Iterable<Identifier | AssignmentPattern | ArrayPattern> {
  public elements: (Identifier | AssignmentPattern | ArrayPattern)[] = []

  public add(name: Identifier | ArrayPattern, expr: IExpression | null): void {
    this.elements.push(expr ? new AssignmentPattern(name, expr) : name)
  }

  public getName(): string {
    return ''
  }

  public [Symbol.iterator](): Iterator<Identifier | AssignmentPattern | ArrayPattern> {
    return this.elements[Symbol.iterator]()
  }
}

export class Params implements Iterable<Identifier | AssignmentPattern | ArrayPattern> {
  public params: (Identifier | AssignmentPattern | ArrayPattern)[] = []
  public requiredArgumentsCount = 0
  public hasOptionalParams = false

  public add(name: Identifier | ArrayPattern, expr: IExpression | null): void {
    this.params.push(expr ? new AssignmentPattern(name, expr) : name)
    !expr && ++this.requiredArgumentsCount

    if (!expr && this.hasOptionalParams) throw Error('Required argument cannot be after optional')
    if (expr) this.hasOptionalParams = true
  }

  public get(index: number): Identifier | AssignmentPattern | ArrayPattern {
    return this.params[index]
  }

  public getRequiredArgumentsCount(): number {
    return this.requiredArgumentsCount
  }

  public size(): number {
    return this.params.length
  }

  public iterator(): Iterator<Identifier | AssignmentPattern | ArrayPattern> {
    return this[Symbol.iterator]()
  }

  public [Symbol.iterator](): Iterator<Identifier | AssignmentPattern | ArrayPattern> {
    return this.params[Symbol.iterator]()
  }

  public toString(): string {
    const result: (Identifier | string)[] = []
    result.push('(')
    for (const arg of this.params) {
      // result.push(arg)
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
