import IValue from '@lib/IValue'
import IExpression from './IExpression'
import IVisitor from './IVisitor'
import IStatement from './IStatement'
import BooleanValue from '@lib/BooleanValue'
import ReturnStatement from './ReturnStatement'
import Variables from '@lib/Variables'

export abstract class Pattern {
  public result!: IStatement
  public optCondition: IExpression | null = null
}

export class ConstantPattern extends Pattern {
  constructor(public constant: IValue) {
    super()
  }

  public toString(): string {
    return this.constant + ': ' + this.result
  }
}

export class VariablePattern extends Pattern {
  constructor(public variable: string) {
    super()
  }

  public toString(): string {
    return this.variable + ': ' + this.result
  }
}

export default class MatchExpression implements IExpression {
  constructor(public expression: IExpression, public patterns: Pattern[]) {}

  public eval(): IValue {
    const value = this.expression.eval()

    for (const pattern of this.patterns) {
      // text | number
      if (pattern instanceof ConstantPattern) {
        if (this.match(value, pattern.constant) && this.optMatches(pattern)) return this.evalResult(pattern.result)
      }
      if (pattern instanceof VariablePattern) {
        // default
        if (pattern.variable === '_') return this.evalResult(pattern.result)
        // variable
        // isExists
        if (Variables.isExists(pattern.variable)) {
          if (this.match(value, Variables.get(pattern.variable)) && this.optMatches(pattern)) return this.evalResult(pattern.result)
          continue
        }
        //default
        // not isExists
        Variables.set(pattern.variable, value)
        if (this.optMatches(pattern)) {
          const result = this.evalResult(pattern.result)
          Variables.remove(pattern.variable)
          return result
        }
        Variables.remove(pattern.variable)
      }
    }
    throw new Error('No pattern were matched')
  }

  private match(value: IValue, constant: IValue): boolean {
    return value.type() === constant.type() && value.equals(constant)
  }

  private optMatches(pattern: Pattern): boolean {
    return !pattern.optCondition || pattern.optCondition.eval() !== BooleanValue.FALSE
  }

  private evalResult(s: IStatement): IValue {
    try {
      s.execute()
    } catch (ret) {
      if (ret instanceof ReturnStatement) return ret.getResult()
    }
    return BooleanValue.FALSE
  }

  public accept(visitor: IVisitor): void {
    visitor.visit(this)
  }

  public toString(): string {
    const buf: string[] = new Array()
    buf.push('match ')
    buf.push(String(this.expression))
    buf.push(' {')
    for (const p of this.patterns) {
      buf.push('\n  case ')
      buf.push(String(p))
    }
    buf.push('\n}')
    return buf.toString()
  }
}
