import ArrayValue from '@lib/ArrayValue'
import IValue from '@lib/IValue'
import Variables from '@lib/Variables'
import IExpression from './IExpression'
import IVisitor from './IVisitor'
import MapValue from '@lib/MapValue'
import BooleanValue from '@lib/BooleanValue'
import TypeException from '@exceptions/TypeException'
import FunctionValue from '@lib/FunctionValue'
import CallStack from '@lib/CallStack'

export const instanceOfIAccessible = (object: any): object is IAccessible => {
  return 'set' in object
}

export interface IAccessible extends IExpression {
  get(): IValue
  set(value: IValue): IValue
  define(value: IValue): IValue
  getName(): string
}

export class Identifier implements IAccessible {
  constructor(public name: string) {}

  public eval(): IValue {
    return Variables.get(this.getName())
  }

  public get(): IValue {
    return Variables.get(this.getName())
  }

  public set(value: IValue): IValue {
    return Variables.set(this.getName(), value), value
  }

  public define(value: IValue): IValue {
    return Variables.define(this.getName(), value), value
  }

  public getName(): string {
    return this.name
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return this.name
  }
}

export class AssignmentPattern implements IAccessible {
  constructor(public identifier: IAccessible, public valueExpr: IExpression) {}

  public eval(): IValue {
    return this.get()
  }

  public get(): IValue {
    return Variables.get(this.getName())
  }

  public set(value: IValue): IValue {
    const defaultExpr = this.getValueExpr().eval()
    return Variables.set(this.getName(), value || defaultExpr)
  }

  public define(value: IValue): IValue {
    const defaultExpr = this.getValueExpr().eval()
    return Variables.define(this.getName(), value || defaultExpr)
  }

  public getName(): string {
    return this.identifier.getName()
  }

  public getValueExpr(): IExpression {
    return this.valueExpr
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return this.identifier + (this.valueExpr == null ? '' : ' = ' + this.valueExpr)
  }
}

export class ArrayPattern implements IAccessible, Iterable<IAccessible> {
  public elements: IAccessible[] = []

  public eval(): IValue {
    return this.get()
  }

  public get(): IValue {
    return Variables.get(this.getName())
  }

  public set(value: IValue): IValue {
    if (!(value instanceof ArrayValue)) throw new Error('expect array')
    this.elements.forEach((variable, i) => variable.set(value.get(i)))
    return BooleanValue.FALSE
  }

  public define(value: IValue): IValue {
    if (!(value instanceof ArrayValue)) throw new Error('expect array')
    this.elements.forEach((variable, i) => variable.define(value.get(i)))
    return BooleanValue.FALSE
  }

  public add(name: IAccessible, expr: IExpression | null): void {
    this.elements.push(expr ? new AssignmentPattern(name, expr) : name)
  }

  public getName(): string {
    return ''
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public [Symbol.iterator](): Iterator<IAccessible> {
    return this.elements[Symbol.iterator]()
  }
}

export class Params implements Iterable<IAccessible> {
  public params: IAccessible[] = []
  public requiredArgumentsCount = 0
  public hasOptionalParams = false

  public add(name: IAccessible, expr: IExpression | null): void {
    this.params.push(expr ? new AssignmentPattern(name, expr) : name)
    !expr && ++this.requiredArgumentsCount

    if (!expr && this.hasOptionalParams) throw Error('Required argument cannot be after optional')
    if (expr) this.hasOptionalParams = true
  }

  public get(index: number): IAccessible {
    return this.params[index]
  }

  public getRequiredArgumentsCount(): number {
    return this.requiredArgumentsCount
  }

  public size(): number {
    return this.params.length
  }

  public iterator(): Iterator<IAccessible> {
    return this[Symbol.iterator]()
  }

  public [Symbol.iterator](): Iterator<IAccessible> {
    return this.params[Symbol.iterator]()
  }

  public toString(): string {
    return `(${this.params.join(', ')})`
  }
}

export default class ContainerAccessExpression implements IAccessible, IExpression {
  constructor(public variable: string, public indices: IExpression[]) {}

  public eval(): IValue {
    return this.getItem(this.get())
  }

  public get(): ArrayValue | MapValue {
    const variable = Variables.get(this.variable)
    this.isArrayOrMapValue(variable)
    const container = this.getContainer(variable)
    this.isArrayOrMapValue(container)
    return container
  }

  public getName(): string {
    return this.variable
  }

  public set(value: IValue): IValue {
    const arrOrObj = this.get()
    if (arrOrObj instanceof ArrayValue) return arrOrObj.set(this.lastIndex().asNumber(), value), value
    return arrOrObj.set(this.lastIndex().asString(), value), value
  }

  public define(value: IValue): IValue {
    throw new Error('the container member cannot be defined')
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
