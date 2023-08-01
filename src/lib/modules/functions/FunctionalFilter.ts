import { Function } from '@lib/Functions'
import IValue from '@lib/IValue'
import StringValue from '@lib/StringValue'
import Types from '@lib/Types'
import ArrayValue from '@lib/ArrayValue'
import BooleanValue from '@lib/BooleanValue'
import FunctionValue from '@lib/FunctionValue'
import MapValue from '@lib/MapValue'
import { ArgumentsMismatchException, TypeException } from 'exceptions/ArgumentsMismatchException'

export default class FunctionalFilter implements Function {
  public execute(...args: IValue[]): IValue {
    if (args.length < 2) throw new ArgumentsMismatchException('At least two args expected')
    if (args[1].type() != Types.FUNCTION) throw new TypeException('Function expected in second arg')

    const container = args[0]
    const consumer = (args[1] as FunctionValue).getValue()
    if (container instanceof ArrayValue) return this.filterArray(container, consumer)
    if (container instanceof MapValue) return this.filterMap(container, consumer)

    throw new TypeException('Invalid first argument. Array or map exprected')
  }

  private filterArray(array: ArrayValue, predicate: Function): IValue {
    const values: IValue[] = new Array()
    for (const value of array) {
      if (predicate.execute(value) == BooleanValue.FALSE) continue
      values.push(value)
    }
    return new ArrayValue([...values])
  }

  private filterMap(map: MapValue, predicate: Function): IValue {
    const result = new MapValue()
    for (const [key, value] of map) {
      if (predicate.execute(new StringValue(key), value) == BooleanValue.FALSE) continue
      result.set(key, value)
    }
    return result
  }
}
