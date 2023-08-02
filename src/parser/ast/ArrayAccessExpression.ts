import ArrayValue from '@lib/ArrayValue'
import IValue from '@lib/IValue'
import Variables from '@lib/Variables'
import IExpression from './IExpression'
import IVisitor from './IVisitor'
import MapValue from '@lib/MapValue'
import BooleanValue from '@lib/BooleanValue'
import { TypeException } from 'exceptions/ArgumentsMismatchException'

export default class ArrayAccessExpression implements IExpression {
  constructor(public variable: string, public indices: IExpression[]) {}

  public eval(): IValue {
    const value = this.getValue()
    if (value instanceof ArrayValue) return value.get(this.lastIndex().asNumber())
    return value.get(this.lastIndex().asString())
  }

  public getValue(): ArrayValue | MapValue {
    const variable = Variables.get(this.variable)
    if (variable instanceof ArrayValue) return this.getArray(variable)
    if (variable instanceof MapValue) return this.getObj(variable)
    throw new TypeException('Expect map or array')
  }

  public setValue(value: IValue): void {
    const arrOrObj = this.getValue()
    if (arrOrObj instanceof ArrayValue) return arrOrObj.set(this.lastIndex().asNumber(), value)
    arrOrObj.set(this.lastIndex().asString(), value)
  }

  private getArray(array: ArrayValue, i: number = 0): ArrayValue {
    if (i === this.indices.length - 1) return array
    return this.getArray(this.isArrayValue(array.get(this.index(i).asNumber())), ++i)
  }

  private getObj(map: MapValue, i: number = 0): MapValue {
    if (i === this.indices.length - 1) return map
    return this.getObj(this.isMapValue(map.get(this.index(i).asString())), ++i)
  }

  private lastIndex(): IValue {
    return this.index(this.indices.length - 1)
  }

  private index(index: number): IValue {
    return this.indices[index].eval()
  }

  private isArrayValue(value: IValue): ArrayValue {
    if (value instanceof ArrayValue) return value
    debugger
    throw new TypeException('Array expected')
  }

  private isMapValue(value: IValue): MapValue {
    if (value instanceof MapValue) return value
    throw new TypeException('Map expected')
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    return String(`${this.variable} ${this.indices}`)
  }
}
