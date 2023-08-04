import Functions, { Function } from '@lib/Functions'
import IModule from '@lib/IModule'
import StdRand from './functions/StdRand'
import StdMultiArray from './functions/StdMultiArray'
import StdArray from './functions/StdArray'
import StdEcho from './functions/StdEcho'
import StdNewArray from './functions/StdNewArray'
import StdNextFrame from './functions/StdNextFrame'
import StdThread from './functions/StdThread'
import StdLength from './functions/StdLength'
import IValue from '@lib/IValue'
import NumberValue from '@lib/NumberValue'
import ArrayValue from '@lib/ArrayValue'
import { ArgumentsMismatchException } from '@exceptions/ArgumentsMismatchException'
import TypeException from '@exceptions/TypeException'
import FunctionValue from '@lib/FunctionValue'
import BooleanValue from '@lib/BooleanValue'
import StringValue from '@lib/StringValue'
import StdSort from './functions/StdSort'

class StdSprintf implements Function {
  execute(...args: IValue[]): IValue {
    if (args.length < 1) throw new ArgumentsMismatchException('At least one argument expected')

    const format = args[0].asString()
    const values: (number | string)[] = new Array(args.length - 1)
    for (let i = 1; i < args.length; i++) {
      values[i - 1] = args[i] instanceof NumberValue ? args[i].asNumber() : args[i].asString()
    }
    return new StringValue('')
    // return new StringValue(String.format(format, values))
  }
}

class StdSplit implements Function {
  execute(...args: IValue[]): IValue {
    if (args.length < 2 || args.length > 3) throw new ArgumentsMismatchException('Two or three arguments expected')

    const input = args[0].asString()
    const regex = args[1].asString()
    const limit = args.length == 3 ? args[2].asNumber() : 0

    const parts = input.split(regex)
    const result = new ArrayValue(parts.length)
    for (let i = 0; i < parts.length; i++) result.set(i, new StringValue(parts[i]))
    return result
  }
}

class StdJoin implements Function {
  execute(...args: IValue[]): IValue {
    if (args.length < 1) throw new ArgumentsMismatchException('At least one argument expected')
    if (!(args[0] instanceof ArrayValue)) throw new TypeException('Array expected in first argument')

    const array = args[0]
    switch (args.length) {
      case 1:
        return this.join(array, '', '', '')
      case 2:
        return this.join(array, args[1].asString(), '', '')
      case 3:
        return this.join(array, args[1].asString(), args[2].asString(), args[2].asString())
      case 4:
        return this.join(array, args[1].asString(), args[2].asString(), args[3].asString())
      default:
        throw new ArgumentsMismatchException('Wrong number of arguments')
    }
  }

  private join(array: ArrayValue, delimiter: string, prefix: string, suffix: string) {
    const sb: string[] = []
    for (const value of array) {
      if (sb.length) sb.push(delimiter)
      else sb.push(prefix)
      sb.push(value.asString())
    }
    sb.push(suffix)
    return new StringValue(sb.toString())
  }
}

export class StdIndexOf implements Function {
  public execute(...args: IValue[]): IValue {
    if (args.length < 2 || args.length > 3) throw new ArgumentsMismatchException('Two or three arguments expected')

    const input = args[0].asString()
    const what = args[1].asString()
    const index = args.length == 3 ? args[2].asNumber() : 0

    return new NumberValue(input.indexOf(what, index))
  }
}

export class StdLastIndexOf implements Function {
  public execute(...args: IValue[]): IValue {
    if (args.length < 2 || args.length > 3) throw new ArgumentsMismatchException('Two or three arguments expected')

    const input = args[0].asString()
    const what = args[1].asString()
    const index = args.length == 3 ? args[2].asNumber() : 0

    return new NumberValue(input.lastIndexOf(what, index))
  }
}

export class StdReplace implements Function {
  public execute(...args: IValue[]): IValue {
    if (args.length !== 3) throw new ArgumentsMismatchException('Three arguments expected')

    const input = args[0].asString()
    const regex = args[1].asString()
    const replacement = args[2].asString()

    return new StringValue(input.replace(regex, replacement))
  }
}

export class StdCharAt implements Function {
  execute(...args: IValue[]): IValue {
    if (args.length !== 2) throw new ArgumentsMismatchException('Two arguments expected')

    const input = args[0].asString()
    const index = args[1].asNumber()

    return new StringValue(input.charAt(index))
  }
}

export class stdToChar implements Function {
  execute(...args: IValue[]): IValue {
    if (args.length !== 1) throw new ArgumentsMismatchException('One argument expected')

    return new StringValue(String.fromCharCode(args[0].asNumber()))
  }
}

export class stdToLowercase implements Function {
  execute(...args: IValue[]): IValue {
    if (args.length !== 1) throw new ArgumentsMismatchException('One argument expected')

    return new StringValue(args[0].asString().toLowerCase())
  }
}

export class stdToUppercase implements Function {
  execute(...args: IValue[]): IValue {
    if (args.length !== 1) throw new ArgumentsMismatchException('One argument expected')

    return new StringValue(args[0].asString().toUpperCase())
  }
}

export class stdTrim implements Function {
  execute(...args: IValue[]): IValue {
    if (args.length !== 1) throw new ArgumentsMismatchException('One argument expected')

    return new StringValue(args[0].asString().trim())
  }
}

export default class Std implements IModule {
  public init(): void {
    Functions.set('echo', new StdEcho())
    Functions.set('array', new StdArray())
    Functions.set('newarray', new StdNewArray())
    Functions.set('multiArray', new StdMultiArray())
    Functions.set('length', new StdLength())
    Functions.set('rand', new StdRand())
    Functions.set('nextFrame', new StdNextFrame())
    Functions.set('thread', new StdThread())
    Functions.set('sort', new StdSort())

    // String
    Functions.set('sprintf', new StdSprintf())
    Functions.set('split', new StdSplit())
    Functions.set('join', new StdJoin())
    Functions.set('indexOf', new StdIndexOf())
    Functions.set('lastIndexOf', new StdLastIndexOf())
    Functions.set('charAt', new StdCharAt())
    Functions.set('toChar', new stdToChar())
    // Functions.set('substring', new std_substring())
    Functions.set('toLowerCase', new stdToLowercase())
    Functions.set('toUpperCase', new stdToUppercase())
    Functions.set('trim', new stdTrim())
    Functions.set('replace', new StdReplace())
    // Functions.set('replaceAll', new StdReplaceAll())
    // Functions.set('replaceFirst', new std_replacefirst())
  }
}
