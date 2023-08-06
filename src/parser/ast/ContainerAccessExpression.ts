import ArrayValue from '@lib/ArrayValue'
import IValue from '@lib/IValue'
import Variables from '@lib/Variables'
import IExpression from './IExpression'
import IVisitor from './IVisitor'
import MapValue from '@lib/MapValue'
import BooleanValue from '@lib/BooleanValue'
import TypeException from '@exceptions/TypeException'

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

export default class ContainerAccessExpression implements IIdentifier, IExpression {
  constructor(public variable: string, public indices: IExpression[]) {}

  public eval(): IValue {
    const value = this.getValue()
    const item = this.getItem(value)
    return item
  }

  public getValue(): ArrayValue | MapValue {
    const variable = Variables.get(this.variable)
    this.isArrayOrMapValue(variable)
    const container = this.getContainer(variable)
    this.isArrayOrMapValue(container)
    return container
  }

  public getName(): string {
    return this.variable
  }

  public setValue(value: IValue): void {
    const arrOrObj = this.getValue()
    if (arrOrObj instanceof ArrayValue) return arrOrObj.set(this.lastIndex().asNumber(), value)
    arrOrObj.set(this.lastIndex().asString(), value)
  }

  private getContainer(container: ArrayValue | MapValue, i: number = 0): ArrayValue | MapValue {
    if (i === this.indices.length - 1) return container
    const value = this.getItem(container, i)
    this.isArrayOrMapValue(value)
    return this.getContainer(value, ++i)
  }

  private getItem(container: ArrayValue | MapValue, i: number = this.indices.length - 1) {
    return container instanceof ArrayValue ? container.get(this.index(i).asNumber()) : container.get(this.index(i).asString())
  }

  private lastIndex(): IValue {
    return this.index(this.indices.length - 1)
  }

  private index(index: number): IValue {
    return this.indices[index].eval()
  }

  private isArrayOrMapValue(value: IValue): asserts value is ArrayValue | MapValue {
    if (!(value instanceof ArrayValue || value instanceof MapValue)) throw new TypeException('Expect map or array')
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return String(`${this.variable} ${this.indices}`)
  }
}
