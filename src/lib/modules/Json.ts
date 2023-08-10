import ArrayValue from '@lib/ArrayValue'
import BooleanValue from '@lib/BooleanValue'
import Function from '@lib/Functions'
import IModule from '@lib/IModule'
import IValue from '@lib/IValue'
import MapValue from '@lib/MapValue'
import NumberValue from '@lib/NumberValue'
import StringValue from '@lib/StringValue'
import { decode, encode } from './functions/HttpHttp'
import { ArgumentsMismatchException } from '@exceptions/ArgumentsMismatchException'

class JsonDecode implements Function {
  public execute(...args: IValue[]): IValue {
    if (args.length != 1) throw new ArgumentsMismatchException('One argument expected')
    try {
      return decode(JSON.parse(args[0].asString()))
    } catch (er) {
      return MapValue.EMPTY
    }
  }
}

class JsonEncode implements Function {
  public execute(...args: IValue[]): IValue {
    if (args.length != 1) throw new ArgumentsMismatchException('One argument expected')
    try {
      return new StringValue(JSON.stringify(encode(args[0])))
    } catch (er) {
      return StringValue.EMPTY
    }
  }
}

export default class Json implements IModule {
  public init(): void {
    // Functions.set('jsonencode', new JsonEncode())
    // Functions.set('jsondecode', new JsonDecode())
  }
}
