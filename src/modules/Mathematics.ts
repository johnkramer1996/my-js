import IModule from '@lib/IModule'
import NumberValue from '@lib/NumberValue'
import Variables from '@lib/Variables'

export default class Mathematics implements IModule {
  public init(): void {
    Variables.set('PI', new NumberValue(Math.PI))
    Variables.set('E', new NumberValue(Math.E))
  }
}
