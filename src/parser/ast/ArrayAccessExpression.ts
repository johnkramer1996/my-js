import ArrayValue from '@lib/ArrayValue'
import IValue from '@lib/IValue'
import Variables from '@lib/Variables'
import IExpression from './IExpression'
import IVisitor from './IVisitor'
import MapValue from '@lib/MapValue'

export default class ArrayAccessExpression implements IExpression {
  constructor(public variable: string, public indices: IExpression[]) {}

  public eval(): IValue {
    const value = this.getValue()
    if (value instanceof ArrayValue) return value.get(this.lastIndex())
    return value.get(this.indices[0].eval().asString())
  }

  public getValue(): ArrayValue | MapValue {
    const variable = Variables.get(this.variable)
    return variable instanceof ArrayValue ? this.getArray(variable) : this.getObj(variable)
  }

  public setValue(value: IValue) {
    const arrOrObj = this.getValue()
    if (arrOrObj instanceof ArrayValue) return arrOrObj.set(this.lastIndex(), value)
    arrOrObj.set(this.indices[0].eval().asString(), value)
  }

  private getArray(array: ArrayValue, i: number = 0): ArrayValue {
    if (i === this.indices.length - 1) return array
    return this.getArray(this.isArrayValue(array.get(this.index(i))), ++i)
  }

  private getObj(variable: IValue): MapValue {
    return this.isMapValue(variable)
  }

  private lastIndex(): number {
    return this.index(this.indices.length - 1)
  }

  private index(index: number): number {
    return this.indices[index].eval().asNumber()
  }

  private isArrayValue(value: IValue): ArrayValue {
    if (value instanceof ArrayValue) return value
    throw new Error('Array expected')
  }

  private isMapValue(value: IValue): MapValue {
    if (value instanceof MapValue) return value
    throw new Error('Map expected')
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return String(`${this.variable} ${this.indices}`)
  }
}
