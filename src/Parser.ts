import Token, { IToken, TokenType } from 'Token'
import { IStatement } from '@ast/IStatement'
import { IExpression } from '@ast/IExpression'
import { LogStatement } from '@ast/LogStatement'
import { ValueExpression } from '@ast/ValueExpression'

export default class Parser {
  private tokens: IToken[]
  private position = 0

  constructor(tokens: IToken[]) {
    this.tokens = tokens
  }

  public parse(): IStatement {
    return this.statement()
  }

  private statement(): IStatement {
    if (this.match(TokenType.WORD)) return new LogStatement(this.expression())
    throw new Error('Unknown statement')
  }

  private expression(): IExpression {
    if (this.match(TokenType.WORD)) return new ValueExpression(this.get(-1).getText())
    throw new Error('Unknown expression')
  }

  private match(text: TokenType): boolean {
    return text === this.get().getType() ? (++this.position, true) : false
  }

  private get(relativePosition: number = 0): IToken {
    return this.tokens[this.position + relativePosition]
  }
}
