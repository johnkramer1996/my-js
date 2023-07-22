import Token, { IToken } from 'Token'
import TokenType from 'TokenType'
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
    return this.bitwiseOr()
  }

  private bitwiseOr(): IExpression {
    const result: IExpression = this.bitwiseXor()

    if (this.match(TokenType.BAR)) return new BinaryExpression(BinaryExpression.Operator.OR, result, this.bitwiseOr())

    return result
  }

  private bitwiseXor(): IExpression {
    const result: IExpression = this.bitwiseAnd()

    if (this.match(TokenType.CARET)) return new BinaryExpression(BinaryExpression.Operator.XOR, result, this.bitwiseXor())

    return result
  }

  private bitwiseAnd(): IExpression {
    const result: IExpression = this.additive()

    if (this.match(TokenType.AMP)) return new BinaryExpression(BinaryExpression.Operator.AND, result, this.bitwiseAnd())

    return result
  }

  private additive(): IExpression {
    const result = this.multiplicative()

    if (this.match(TokenType.PLUS)) return new BinaryExpression(BinaryExpression.Operator.ADD, result, this.additive())
    if (this.match(TokenType.MINUS)) return new BinaryExpression(BinaryExpression.Operator.SUBTRACT, result, this.additive())

    return result
  }

  private multiplicative(): IExpression {
    const result: IExpression = this.primary()

    if (this.match(TokenType.STAR)) return new BinaryExpression(BinaryExpression.Operator.MULTIPLY, result, this.multiplicative())
    if (this.match(TokenType.SLASH)) return new BinaryExpression(BinaryExpression.Operator.DIVIDE, result, this.multiplicative())

    return result
  }

  private primary(): IExpression {
    const current = this.get()
    if (this.match(TokenType.TEXT)) return new ValueExpression(current.getText())
    if (this.match(TokenType.NUMBER)) return new ValueExpression(current.getText())
    throw new Error('Unknown expression')
  }

  private match(type: TokenType): boolean {
    return type === this.get().getType() ? (++this.position, true) : false
  }

  private get(relativePosition: number = 0): IToken {
    const position = this.position + relativePosition
    if (position >= this.size) return new Token(TokenType.EOF, '')

    return this.tokens[position]
  }
}
