import Token, { IToken, TokenType } from 'Token'
import { IStatement } from '@ast/IStatement'
import { IExpression } from '@ast/IExpression'
import { LogStatement } from '@ast/LogStatement'
import { ValueExpression } from '@ast/ValueExpression'
import BlockStatement from '@ast/BlockStatement'
import BinaryExpression from '@ast/BinaryExpression'

export default class Parser {
  private tokens: IToken[]
  private position = 0
  private size: number

  constructor(tokens: IToken[]) {
    this.tokens = tokens
    this.size = tokens.length
  }

  public parse(): IStatement {
    const mainBlock = new BlockStatement()
    while (!this.match(TokenType.EOF)) {
      mainBlock.add(this.statement())
    }
    return mainBlock
  }

  private statement(): IStatement {
    if (this.match(TokenType.LOG)) return new LogStatement(this.expression())
    throw new Error('Unknown statement' + this.get().getText())
  }

  private expression(): IExpression {
    return this.additive()
  }

  private additive(): IExpression {
    const result = this.primary()

    if (this.match(TokenType.PLUS)) return new BinaryExpression(BinaryExpression.Operator.ADD, result, this.additive())
    if (this.match(TokenType.MINUS)) return new BinaryExpression(BinaryExpression.Operator.SUBTRACT, result, this.additive())

    return result
  }

  private primary(): IExpression {
    const current = this.get()
    if (this.match(TokenType.WORD)) return new ValueExpression(current.getText())
    if (this.match(TokenType.NUMBER)) return new ValueExpression(current.getText())
    throw new Error('Unknown expression')
  }

  private match(text: TokenType): boolean {
    return text === this.get().getType() ? (++this.position, true) : false
  }

  private get(relativePosition: number = 0): IToken {
    const position = this.position + relativePosition
    if (position >= this.tokens.length) return new Token(TokenType.EOF, '')

    return this.tokens[position]
  }
}
