import Functions from '@lib/Functions'
import IModule from '@lib/IModule'
import NumberValue from '@lib/NumberValue'
import Variables from '@lib/Variables'
import TypesEnum from '@lib/Types'
import IValue from '@lib/IValue'
import StringValue from '@lib/StringValue'

export default class Types implements IModule {
  public init(): void {
    Variables.set('OBJECT', new NumberValue(TypesEnum.OBJECT))
    Variables.set('NUMBER', new NumberValue(TypesEnum.NUMBER))
    Variables.set('STRING', new NumberValue(TypesEnum.STRING))
    Variables.set('ARRAY', new NumberValue(TypesEnum.ARRAY))
    Variables.set('MAP', new NumberValue(TypesEnum.MAP))
    Variables.set('FUNCTION', new NumberValue(TypesEnum.FUNCTION))

    // Functions.set('typeof', {
    //   execute: (value: IValue) => new StringValue(TypesEnum[value.type()]),
    // })
    // Functions.set('string', {
    //   execute: (value: IValue) => new StringValue(value.asString()),
    // })
    // Functions.set('number', {
    //   execute: (value: IValue) => new NumberValue(value.asNumber()),
    // })
  }
}
