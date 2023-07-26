import { Function } from '@lib/Functions'
import IValue from '@lib/IValue'
import StringValue from '@lib/StringValue'
import Types from '@lib/Types'
import ArrayValue from '@lib/ArrayValue'
import BooleanValue from '@lib/BooleanValue'
import FunctionValue from '@lib/FunctionValue'
import MapValue from '@lib/MapValue'

export default class FunctionalForEach implements Function {
  public execute(...args: IValue[]): IValue {
    if (args.length !== 2) throw new Error('At least two args expected')
    if (args[1].type() != Types.FUNCTION) throw new Error('Function expected in second arg')

    const container = args[0]
    const consumer = (args[1] as FunctionValue).getValue()
    if (container instanceof ArrayValue) {
      for (const value of container) consumer.execute(value)
      return BooleanValue.FALSE
    }

    if (container instanceof MapValue) {
      for (const [key, value] of container) consumer.execute(new StringValue(key), value)
      return BooleanValue.FALSE
    }

    throw new Error('Invalid first argument. Array or map exprected')
  }
}
