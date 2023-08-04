import { Function } from '@lib/Functions'
import IValue from '@lib/IValue'
import StringValue from '@lib/StringValue'
import Types from '@lib/Types'
import ArrayValue from '@lib/ArrayValue'
import FunctionValue from '@lib/FunctionValue'
import MapValue from '@lib/MapValue'
import { ArgumentsMismatchException } from '@exceptions/ArgumentsMismatchException'

export default class FunctionalMap implements Function {
  public execute(...args: IValue[]): IValue {
    if (args.length < 2) throw new ArgumentsMismatchException('At least two args expected')
    if (args[1].type() != Types.FUNCTION) throw new Error('Function expected in second arg')

    const container = args[0]
    const consumer = (args[1] as FunctionValue).getValue()
    if (container instanceof ArrayValue) return this.mapArray(container, consumer)
    if (container instanceof MapValue) return this.mapMap(container, consumer)

    throw new Error('Invalid first argument. Array or map exprected')
  }

  private mapArray(array: ArrayValue, predicate: Function): IValue {
    const values: IValue[] = new Array()
    for (const value of array) values.push(predicate.execute(value))
    return new ArrayValue([...values])
  }

  private mapMap(map: MapValue, predicate: Function): IValue {
    const result = new MapValue()
    for (const [key, value] of map) result.set(key, predicate.execute(new StringValue(key), value))
    return result
  }
}
