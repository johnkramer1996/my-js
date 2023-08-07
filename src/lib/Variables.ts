import IValue from './IValue'
import BooleanValue from './BooleanValue'
import FunctionValue from './FunctionValue'

export const uninitialized = {}

type Variable = { value: IValue | typeof uninitialized; kind: string }

export class Scope {
  public variables: Map<String, Variable> = new Map()

  constructor(public parent: Scope | null = null) {}
}

class ScopeFindData {
  constructor(public scope: Scope, public isFound: boolean = false) {}
}

export default class Variables {
  public static scope: Scope = new Scope()

  static {
    this.scope.variables.clear()
    this.scope.variables.set('true', { value: BooleanValue.TRUE, kind: 'conts' })
    this.scope.variables.set('false', { value: BooleanValue.FALSE, kind: 'conts' })
  }

  public static push(scope?: Scope): void {
    this.scope = scope ?? new Scope(this.scope)
  }

  public static pop(): void {
    if (this.scope.parent) this.scope = this.scope.parent
  }

  public static isExists(key: string): boolean {
    return this.findScope(key).isFound
  }

  public static get(key: string): IValue {
    const scopeData = this.findScope(key)
    if (scopeData.isFound) {
      const variable = scopeData.scope.variables.get(key)
      if (variable === uninitialized) throw new Error(`"ReferenceError: Cannot access '${key}' before initialization`)
      return (scopeData.scope.variables.get(key) as Variable).value as IValue
    }
    return BooleanValue.FALSE
  }

  public static set(key: string, value: IValue): void {
    const scopeData = this.findScope(key)
    if (!scopeData.isFound) {
      debugger
      throw new Error('Varaible undefined' + key)
    }
    scopeData.scope.variables.set(key, { value, kind: 'const' })
    if (value instanceof FunctionValue) value.setScope(new Scope(Variables.scope))
  }

  public static define(key: string, value: IValue | typeof uninitialized = uninitialized): void {
    const variable = this.scope.variables.get(key)
    if (variable && variable.value !== uninitialized) {
      throw new Error(`Cannot redeclare block-scoped variable '${key}'`)
    }
    if (value instanceof FunctionValue) value.setScope(new Scope(Variables.scope))
    this.scope.variables.set(key, { value, kind: 'const' })
  }

  public static remove(key: string) {
    this.findScope(key).scope.variables.delete(key)
  }

  private static findScope(variable: string): ScopeFindData {
    const result = new ScopeFindData(this.scope)

    let current: Scope | null = this.scope
    do {
      if (!current.variables.has(variable)) continue
      result.isFound = true
      result.scope = current
      return result
    } while ((current = current.parent))

    return result
  }
}
