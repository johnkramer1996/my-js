import Functions from '@lib/Functions'
import IModule from '@lib/IModule'
import StdRand from './functions/StdRand'
import StdMultiArray from './functions/StdMultiArray'
import StdArray from './functions/StdArray'
import StdEcho from './functions/StdEcho'

export default class Std implements IModule {
  public init(): void {
    Functions.set('echo', new StdEcho())
    Functions.set('array', new StdArray())
    Functions.set('multiArray', new StdMultiArray())
    Functions.set('rand', new StdRand())
  }
}
