import { Function } from '@lib/Functions'
import IValue from '@lib/IValue'
import Types from '@lib/Types'
import ArrayValue from '@lib/ArrayValue'
import MapValue from '@lib/MapValue'
import StringValue from '@lib/StringValue'
import FunctionValue from '@lib/FunctionValue'
import UserDefinedFunction from '@lib/UserDefinedFunction'
import NumberValue from '@lib/NumberValue'

export default class StdLength implements Function {
  public execute(...args: IValue[]): IValue {
    if (args.length == 0) throw new Error('At least one arg expected')

    const val = args[0]
    let length = 0
    switch (val.type()) {
      case Types.ARRAY:
        length = (val as ArrayValue).size()
        break
      case Types.MAP:
        length = (val as MapValue).size()
        break
      case Types.STRING:
        length = (val as StringValue).length()
        break
      case Types.FUNCTION:
        const func = (val as FunctionValue).getValue()
        if (func instanceof UserDefinedFunction) length = func.getParamsCount()
        break
    }
    return new NumberValue(length)
  }
}
