import { LogStatement, ValueExpression, IStatement, IExpression } from 'ast'
import { Token } from 'Token'

export default class Parser {
  private tokens: Token[]
  private position = 0

  constructor(tokens: Token[]) {
    this.tokens = tokens
  }

  public parse(): IStatement {
    return this.statement()
  }

  private statement(): IStatement {
    if (this.match('word')) return new LogStatement(this.expression())
    throw new Error('Unknown statement')
  }

  private expression(): IExpression {
    if (this.match('word')) return new ValueExpression(this.get(-1).text)
    throw new Error('Unknown expression')
  }

  private match(text: string): boolean {
    return text === this.get().type ? (++this.position, true) : false
  }

  private get(relativePosition: number = 0): Token {
    return this.tokens[this.position + relativePosition]
  }
}
