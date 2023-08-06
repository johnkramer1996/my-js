import Functions, { Function } from '@lib/Functions'
import UserDefinedFunction from '@lib/UserDefinedFunction'
import IStatement from './IStatement'
import IVisitor from './IVisitor'
import IExpression from './IExpression'
import Variables from '@lib/Variables'
import IValue from '@lib/IValue'
import ArrayValue from '@lib/ArrayValue'

export interface IIdentifier {
  setValue(value: IValue): void
  getName(): string
}

export class Identifier implements IIdentifier {
  constructor(public name: string) {}

  public setValue(value: IValue): void {
    Variables.set(this.getName(), value)
  }

  public getName(): string {
    return this.name
  }

  public toString(): string {
    return this.name
  }
}

export class AssignmentPattern implements IIdentifier {
  constructor(public identifier: IIdentifier, public valueExpr: IExpression) {}

  public setValue(value: IValue): void {
    const defaultExpr = this.getValueExpr().eval()
    Variables.set(this.getName(), value || defaultExpr)
  }

  public getName(): string {
    return this.identifier.getName()
  }

  public getValueExpr(): IExpression {
    return this.valueExpr
  }

  public toString(): string {
    return this.identifier + (this.valueExpr == null ? '' : ' = ' + this.valueExpr)
  }
}

export class ArrayPattern implements IIdentifier, Iterable<IIdentifier> {
  public elements: IIdentifier[] = []

  public setValue(value: IValue): void {
    if (!(value instanceof ArrayValue)) throw new Error('expect array')
    this.elements.forEach((variable, i) => variable.setValue(value.get(i)))
  }

  public add(name: IIdentifier, expr: IExpression | null): void {
    this.elements.push(expr ? new AssignmentPattern(name, expr) : name)
  }

  public getName(): string {
    return ''
  }

  public [Symbol.iterator](): Iterator<IIdentifier> {
    return this.elements[Symbol.iterator]()
  }
}

export class Params implements Iterable<IIdentifier> {
  public params: IIdentifier[] = []
  public requiredArgumentsCount = 0
  public hasOptionalParams = false

  public add(name: IIdentifier, expr: IExpression | null): void {
    this.params.push(expr ? new AssignmentPattern(name, expr) : name)
    !expr && ++this.requiredArgumentsCount

    if (!expr && this.hasOptionalParams) throw Error('Required argument cannot be after optional')
    if (expr) this.hasOptionalParams = true
  }

  public get(index: number): IIdentifier {
    return this.params[index]
  }

  public getRequiredArgumentsCount(): number {
    return this.requiredArgumentsCount
  }

  public size(): number {
    return this.params.length
  }

  public iterator(): Iterator<IIdentifier> {
    return this[Symbol.iterator]()
  }

  public [Symbol.iterator](): Iterator<IIdentifier> {
    return this.params[Symbol.iterator]()
  }

  public toString(): string {
    const result: (IIdentifier | string)[] = []
    result.push('(')
    for (const arg of this.params) {
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
