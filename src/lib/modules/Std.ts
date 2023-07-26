import BooleanValue from '@lib/BooleanValue'
import Functions from '@lib/Functions'
import IModule from '@lib/IModule'
import IValue from '@lib/IValue'
import NumberValue from '@lib/NumberValue'

export default class Std implements IModule {
  public init(): void {
    // Functions.set('echo', (...args: IValue[]) => {
    //   process.stdout.write('\n')
    //   process.stdout.write(args.map((val) => val.asString()).join(' '))
    //   process.stdout.write('\n')
    //   return BooleanValue.FALSE
    // })
    // Functions.set('rand', (...args: IValue[]) => {
    //   let min = 0
    //   let max = 100
    //   if (args.length === 1) {
    //     max = args[0].asNumber()
    //   } else if (args.length == 2) {
    //     min = Math.ceil(args[0].asNumber())
    //     max = Math.floor(args[1].asNumber())
    //   }
    //   return new NumberValue(Math.floor(Math.random() * (max - min) + min))
    // })
  }
}
