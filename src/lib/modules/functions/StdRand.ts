import { Function } from '@lib/Functions'
import IValue from '@lib/IValue'
import NumberValue from '@lib/NumberValue'

export default class StdRand implements Function {
  execute(...args: IValue[]): IValue {
    let min = 0
    let max = 100
    if (args.length === 1) {
      max = args[0].asNumber()
    } else if (args.length == 2) {
      min = Math.ceil(args[0].asNumber())
      max = Math.floor(args[1].asNumber())
    }
    return new NumberValue(Math.floor(Math.random() * (max - min) + min))
  }
}
