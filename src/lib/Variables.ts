import IValue from './IValue'
import BooleanValue from './BooleanValue'
import FunctionValue from './FunctionValue'
import SyntaxError from '@exceptions/SyntaxError'
import ReferenceError from '@exceptions/ReferenceError'
import UndefinedValue from './UndefinedValue'

const uninitialized = '<uninitialized>'

type Variable = { value: IValue; kind: string }

export class Scope {
  public variables: Map<String, Variable | typeof uninitialized> = new Map()

  constructor(public parent: Scope | null = null) {}
}

class ScopeFindData {
  constructor(public scope: Scope, public isFound: boolean = false) {}
}

export default class Variables {
  public static scope: Scope = new Scope()
  public static kind = 'const'

  static {
    this.scope.variables.clear()
    this.scope.variables.set('true', { value: BooleanValue.TRUE, kind: 'conts' })
    this.scope.variables.set('false', { value: BooleanValue.FALSE, kind: 'conts' })
    this.scope.variables.set('undefined', { value: UndefinedValue.UNDEFINED, kind: 'conts' })
  }

  public static setKind(kind: string): void {
    this.kind = kind
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
    if (!scopeData.isFound) throw new ReferenceError(`${key} is not defined`)
    const variable = scopeData.scope.variables.get(key)
    if (variable === uninitialized) throw new ReferenceError(`"Cannot access '${key}' before initialization`)
    return (scopeData.scope.variables.get(key) as Variable).value as IValue
  }

  public static set(key: string, value: IValue): IValue {
    const scopeData = this.findScope(key)
    if (!scopeData.isFound) throw new ReferenceError(`${key} is not defined`)
    const variable = scopeData.scope.variables.get(key)
    if (variable === uninitialized) throw new ReferenceError(`"Cannot access '${key}' before initialization`)
    if (!variable) throw new ReferenceError('Varaible undefined' + key)
    if (variable.kind === 'const') throw new SyntaxError(`Cannot assign to '${key}' because it is a constant.`)
    variable.value = value
    if (value instanceof FunctionValue) value.setScope(new Scope(Variables.scope))
    return value as IValue
  }

  public static define(key: string, value: IValue): IValue {
    if (value instanceof FunctionValue) value.setScope(new Scope(Variables.scope))
    this.scope.variables.set(key, { value, kind: this.kind })
    return value
  }

  public static hoisting(key: string) {
    const variable = this.scope.variables.get(key)
    if (variable === uninitialized) throw new SyntaxError(`Identifier '${key}' has already been declared. `)
    this.scope.variables.set(key, this.kind !== 'var' ? uninitialized : { value: UndefinedValue.UNDEFINED, kind: 'var' })
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
