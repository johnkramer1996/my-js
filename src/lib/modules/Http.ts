import Functions from '@lib/Functions'
import IModule from '@lib/IModule'
import { HttpUrlencode } from './functions/HttpUrlencode'
import { HttpHttp } from './functions/HttpHttp'

export default class Http implements IModule {
  public init(): void {
    Functions.set('urlencode', new HttpUrlencode())
    Functions.set('http', new HttpHttp())
  }
}
