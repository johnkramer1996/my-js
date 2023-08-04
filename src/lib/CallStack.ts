import { Function } from './Functions'

export class CallInfo {
  constructor(public name: string, public func: Function) {}

  public toString(): string {
    return `${this.name}: ${this.func.toString().trim()}`
  }
}

export default class CallStack {
  private static calls: CallInfo[] = []

  public static enter(name: string, func: Function): void {
    this.calls.push(new CallInfo(name, func))
  }

  public static exit(): void {
    this.calls.pop()
  }

  public static getCalls() {
    return this.calls.reverse()
  }
}
