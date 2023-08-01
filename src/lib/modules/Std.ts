import Functions, { Function } from '@lib/Functions'
import IModule from '@lib/IModule'
import IValue from '@lib/IValue'
import Types from '@lib/Types'
import ArrayValue from '@lib/ArrayValue'
import MapValue from '@lib/MapValue'
import StringValue from '@lib/StringValue'
import FunctionValue from '@lib/FunctionValue'
import UserDefinedFunction from '@lib/UserDefinedFunction'
import NumberValue from '@lib/NumberValue'
import StdRand from './functions/StdRand'
import StdMultiArray from './functions/StdMultiArray'
import StdArray from './functions/StdArray'
import StdEcho from './functions/StdEcho'
import StdNewArray from './functions/StdNewArray'
import StdNextFrame from './functions/StdNextFrame'
import StdThread from './functions/StdThread'

class StdLength implements Function {
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
        if (func instanceof UserDefinedFunction) length = func.getArgsCount()
        break
    }
    return new NumberValue(length)
  }
}

export default class Std implements IModule {
  public init(): void {
    Functions.set('echo', new StdEcho())
    Functions.set('array', new StdArray())
    Functions.set('newarray', new StdNewArray())
    Functions.set('multiArray', new StdMultiArray())
    Functions.set('length', new StdLength())
    Functions.set('rand', new StdRand())
    Functions.set('nextFrame', new StdNextFrame())
    Functions.set('thread', new StdThread())
  }
}
