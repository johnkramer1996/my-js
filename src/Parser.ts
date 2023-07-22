import Token, { IToken, TokenType } from 'Token'
import { IStatement } from '@ast/IStatement'
import { IExpression } from '@ast/IExpression'
import { LogStatement } from '@ast/LogStatement'
import { ValueExpression } from '@ast/ValueExpression'
import BlockStatement from '@ast/BlockStatement'

export default class Parser {
  private tokens: IToken[]
  private position = 0

  constructor(tokens: IToken[]) {
    this.tokens = tokens
  }

  public parse(): IStatement {
    const mainBlock = new BlockStatement()
    while (this.position < this.tokens.length) {
      mainBlock.add(this.statement())
    }
    return mainBlock
  }

  private statement(): IStatement {
    if (this.match(TokenType.LOG)) return new LogStatement(this.expression())
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
