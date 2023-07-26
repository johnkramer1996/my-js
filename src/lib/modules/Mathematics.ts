import Functions from '@lib/Functions'
import IModule from '@lib/IModule'
import IValue from '@lib/IValue'
import NumberValue from '@lib/NumberValue'
import Variables from '@lib/Variables'

export default class Mathematics implements IModule {
  public init(): void {
    // Functions.set('abs', (...args: IValue[]) => new NumberValue(Math.abs(args[0].asNumber())))
    // Functions.set('sin', (...args: IValue[]) => new NumberValue(Math.sin(args[0].asNumber())))
    // Functions.set('cos', (...args: IValue[]) => new NumberValue(Math.sin(args[0].asNumber())))
    // Functions.set('sqrt', (...args: IValue[]) => new NumberValue(Math.sqrt(args[0].asNumber())))

    // Functions.set('pow', (...args: IValue[]) => new NumberValue(Math.pow(args[0].asNumber(), args[1].asNumber())))
    // Functions.set('atan2', (...args: IValue[]) => new NumberValue(Math.atan2(args[0].asNumber(), args[1].asNumber())))

    Variables.set('PI', new NumberValue(Math.PI))
    Variables.set('E', new NumberValue(Math.E))
  }
}
