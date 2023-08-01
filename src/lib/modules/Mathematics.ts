import Functions from '@lib/Functions'
import IModule from '@lib/IModule'
import IValue from '@lib/IValue'
import NumberValue from '@lib/NumberValue'
import Variables from '@lib/Variables'
import { ArgumentsMismatchException } from 'exceptions/ArgumentsMismatchException'

export default class Mathematics implements IModule {
  public init(): void {
    const binaryFunc = ['atan2', 'pow', 'max', 'min']
    for (const key of Object.getOwnPropertyNames(Math)) {
      const isBinary = binaryFunc.includes(key)
      const countArgs = isBinary ? 2 : 1
      const item = Object.getOwnPropertyDescriptor(Math, key)?.value
      if (typeof item === 'function') {
        Functions.set(key, {
          execute: (...args: IValue[]) => {
            if (args.length != countArgs) throw new ArgumentsMismatchException('Invalid number of arguments, expected ' + countArgs)

            return new NumberValue(!isBinary ? item(args[0].asNumber()) : item(args[0].asNumber(), args[1].asNumber()))
          },
        })
        continue
      }

      Variables.set(key, new NumberValue(item))
    }
  }
}
