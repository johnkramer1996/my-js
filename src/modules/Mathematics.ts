import Functions from '@lib/Functions'
import IModule from '@lib/IModule'
import IValue from '@lib/IValue'
import NumberValue from '@lib/NumberValue'
import Variables from '@lib/Variables'

export default class Mathematics implements IModule {
  public init(): void {
    Functions.set('sin', (...args: IValue[]) => new NumberValue(Math.sin(args[0].asNumber())))
    Functions.set('cos', (...args: IValue[]) => new NumberValue(Math.sin(args[0].asNumber())))

    Variables.set('PI', new NumberValue(Math.PI))
    Variables.set('E', new NumberValue(Math.E))
  }
}
