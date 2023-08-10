import FunctionValue from './FunctionValue'
import Function from './Functions'
import IValue from './IValue'
import UndefinedValue from './UndefinedValue'
import UserDefinedFunction from './UserDefinedFunction'
import Variables, { Scope } from './Variables'

export class CallInfo {
  // constructor(public name: string, public func: Function) {}
  constructor(public name: string) {}

  public toString(): string {
    return `${this.name}`
  }
}

// 54. hoisting in JavaScript.
// During the creation phase, the JavaScript engine moves the variable and function declarations to the top of your code.

export default class CallStack {
  private static calls: CallInfo[] = []
  private static oldScope: Scope
  private static return: IValue

  public static enter(name: string): void {
    this.calls.push(new CallInfo(name))
  }

  public static exit(): void {
    this.calls.pop()
  }

  public static getCalls() {
    return this.calls.reverse()
  }

  public static setReturn(value: IValue) {
    this.return = value
  }

  public static getReturn(): IValue {
    const result = this.return
    this.return = UndefinedValue.UNDEFINED
    return result
  }
}
