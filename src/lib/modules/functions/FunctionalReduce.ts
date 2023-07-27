import { Function } from '@lib/Functions'
import IValue from '@lib/IValue'
import StringValue from '@lib/StringValue'
import Types from '@lib/Types'
import ArrayValue from '@lib/ArrayValue'
import BooleanValue from '@lib/BooleanValue'
import FunctionValue from '@lib/FunctionValue'
import MapValue from '@lib/MapValue'

export default class FunctionalReduce implements Function {
  public execute(...args: IValue[]): IValue {
    if (args.length !== 3) throw new Error('At least two args expected')
    if (args[2].type() != Types.FUNCTION) throw new Error('Function expected in second arg')

    const [container, identity] = args
    const consumer = (args[2] as FunctionValue).getValue()
    if (container instanceof ArrayValue) {
      let result: IValue = identity
      for (const value of container) result = consumer.execute(result, value)
      return result
    }

    if (container instanceof MapValue) {
      for (const [key, value] of container) consumer.execute(new StringValue(key), value)
      return BooleanValue.FALSE
    }

    throw new Error('Invalid first argument. Array or map exprected')
  }
}
