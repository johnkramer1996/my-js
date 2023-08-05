import ArrayValue from '@lib/ArrayValue'
import IValue from '@lib/IValue'
import Variables from '@lib/Variables'
import IExpression from './IExpression'
import IVisitor from './IVisitor'
import MapValue from '@lib/MapValue'
import BooleanValue from '@lib/BooleanValue'
import TypeException from '@exceptions/TypeException'

export default class ContainerAccessExpression implements IExpression {
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
