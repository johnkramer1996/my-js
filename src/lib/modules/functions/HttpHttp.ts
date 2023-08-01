import { Function } from '@lib/Functions'
import NumberValue from '@lib/NumberValue'
import IValue from '@lib/IValue'
import StringValue from '@lib/StringValue'
import BooleanValue from '@lib/BooleanValue'
import FunctionValue from '@lib/FunctionValue'
import MapValue from '@lib/MapValue'
import ArrayValue from '@lib/ArrayValue'

export const decode = (data: any): IValue => {
  if (typeof data === 'string') return new StringValue(data)
  if (typeof data === 'number') return new NumberValue(data)
  if (data instanceof Array) return data.reduce((prev, el, i) => (prev.set(i, decode(el)), prev), new ArrayValue(data.length))
  if (data && typeof data === 'object') return Object.entries(data).reduce((prev, [key, value]) => (prev.set(key, decode(value)), prev), new MapValue())
  if (data === null) return BooleanValue.FALSE
  throw new Error('not expect data')
}

export const encode = (data: IValue): any => {
  if (data instanceof StringValue) return data.asString()
  if (data instanceof NumberValue) return data.asNumber()
  if (data instanceof ArrayValue) return new Array(data.size()).fill(null).map((_, i) => encode(data.get(i)))
  if (data instanceof MapValue) return [...data].reduce((prev, [key, value]) => ((prev[key] = encode(value)), prev), {} as { [key: string]: any })
  throw new Error('not expect data')
}

export class HttpHttp implements Function {
  public execute(...args: IValue[]): IValue {
    const url = args[0].asString()
    const method = args.length === 1 || args[1] instanceof FunctionValue ? 'GET' : args[1].asString()

    switch (args.length) {
      case 1: // http(url)
        return this.process(url, method)

      case 2: // http(url, method) || http(url, callback)
        if (args[1] instanceof FunctionValue) return this.process(url, method, MapValue.EMPTY, MapValue.EMPTY, args[1])
        return this.process(url, args[1].asString())

      case 3: // http(url, method, params) || http(url, method, callback)
        if (args[2] instanceof FunctionValue) return this.process(url, method, MapValue.EMPTY, MapValue.EMPTY, args[2])
        if (!(args[2] instanceof MapValue)) throw new Error('Second arg must be a map')
        return this.process(url, method, args[2])

      case 4: // http(url, method, params, callback)
        if (!(args[2] instanceof MapValue)) throw new Error('Second arg must be a map')
        if (!(args[3] instanceof FunctionValue)) throw new Error('Fourth arg must be a function callback')
        return this.process(url, method, args[2], MapValue.EMPTY, args[3])

      case 5: // http(url, method, params, headerParams, callback)
        if (!(args[2] instanceof MapValue)) throw new Error('Second arg must be a map')
        if (!(args[3] instanceof MapValue)) throw new Error('Third arg must be a map')
        if (!(args[4] instanceof FunctionValue)) throw new Error('Fifth arg must be a function callback')
        return this.process(url, method, args[2], args[3], args[4])

      default:
        throw new Error('Wrong number of arguments')
    }
  }

  public process(url: string, method: string): IValue
  public process(url: string, method: string, requestParams: MapValue, options: MapValue, func: FunctionValue): IValue
  public process(url: string, method: string, requestParams: MapValue): IValue
  public process(url: string, method: string, requestParams: MapValue = MapValue.EMPTY, options: MapValue = MapValue.EMPTY, func: FunctionValue = FunctionValue.EMPTY): IValue {
    const callback = func.getValue()
    try {
      const params =
        method === 'GET'
          ? { method }
          : {
              method: method.toUpperCase(),
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(JSON.parse(requestParams.asString())),
            }

      fetch(url, params)
        .then((data) => data.json())
        .then((data) => callback.execute(decode(data)))
        .catch(console.log)

      return BooleanValue.TRUE
    } catch (e) {
      debugger
      console.log(e)
      return BooleanValue.FALSE
    }
  }
}
