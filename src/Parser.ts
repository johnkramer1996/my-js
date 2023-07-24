import Token, { IToken } from 'Token'
import TokenType from 'TokenType'
import { IStatement } from '@ast/IStatement'
import { IExpression } from '@ast/IExpression'
import { LogStatement } from '@ast/LogStatement'
import { ValueExpression } from '@ast/ValueExpression'
import BlockStatement from '@ast/BlockStatement'
import BinaryExpression from '@ast/BinaryExpression'
import UnaryExpression from '@ast/UnaryExpression'
import TernaryExpression from '@ast/TernarExpression'
import ConditionalExpression from '@ast/ConditionalExpression'
import VariableExpression from '@ast/VariableExpression'
import IfStatement from '@ast/IfStatement'
import WhileStatement from '@ast/WhileStatement'
import DoWhileStatement from '@ast/DoWhileStatement'
import ForStatement from '@ast/ForStatement'
import AssignmentStatement from '@ast/AssignmentStatement'
import BreakStatement from '@ast/BreakStatement'
import ContinueStatement from '@ast/ContinueStatement'
import FunctionDefineStatement from '@ast/FunctionDefineStatement'
import FunctionStatement from '@ast/FunctionStatement'
import FunctionalExpression from '@ast/FunctionalExpression'

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
      // this.consume(TokenType.SEMIKOLON)
      while (this.match(TokenType.SEMIKOLON));
    }
    return mainBlock
  }

  private statementOrBlock(): IStatement {
    return this.lookMatch(0, TokenType.LBRACE) ? this.block() : this.statement()
  }

  private block(): IStatement {
    const block = new BlockStatement()
    this.consume(TokenType.LBRACE)
    while (!this.match(TokenType.RBRACE)) {
      block.add(this.statement())
      while (this.match(TokenType.SEMIKOLON));
    }
    return block
  }

  private statement(): IStatement {
    if (this.match(TokenType.LOG)) return new LogStatement(this.expression())
    if (this.match(TokenType.IF)) return this.ifElse()
    if (this.match(TokenType.WHILE)) return this.whileStatement()
    if (this.match(TokenType.DO)) return this.doWhileStatement()
    if (this.match(TokenType.FOR)) return this.forStatement()
    if (this.match(TokenType.BREAK)) return new BreakStatement()
    if (this.match(TokenType.CONTINUE)) return new ContinueStatement()
    if (this.match(TokenType.DEF)) return this.functionDefine()
    if (this.lookMatch(0, TokenType.WORD) && this.lookMatch(1, TokenType.LPAREN)) return new FunctionStatement(this.function())
    if (this.lookMatch(0, TokenType.WORD)) return this.assignmentStatement()
    throw new Error('Unknown statement' + this.get())
  }

  private ifElse(): IStatement {
    const condition = this.expression()
    const ifStatement = this.statementOrBlock()
    const elseStatement = this.match(TokenType.ELSE) ? this.statementOrBlock() : null

    return new IfStatement(condition, ifStatement, elseStatement)
  }

  private whileStatement(): IStatement {
    const condition = this.expression()
    const statement = this.statementOrBlock()
    return new WhileStatement(condition, statement)
  }

  private doWhileStatement(): IStatement {
    const statement = this.statementOrBlock()
    this.consume(TokenType.WHILE)
    const condition = this.expression()
    return new DoWhileStatement(condition, statement)
  }

  private forStatement(): IStatement {
    this.match(TokenType.LPAREN)
    const initialization = this.assignmentStatement()
    this.consume(TokenType.COMMA)
    const termination = this.expression()
    this.consume(TokenType.COMMA)
    const increment = this.assignmentStatement()
    this.match(TokenType.RPAREN)
    const statement = this.statementOrBlock()
    return new ForStatement(initialization, termination, increment, statement)
  }

  private assignmentStatement(): IStatement {
    const variable = this.consume(TokenType.WORD).getText()
    if (this.lookMatch(0, TokenType.EQ)) {
      this.consume(TokenType.EQ)
      return new AssignmentStatement(variable, this.expression())
    }
    return new AssignmentStatement(variable, new ValueExpression(0))
  }

  private functionDefine(): FunctionDefineStatement {
    const name = this.consume(TokenType.WORD).getText()
    this.consume(TokenType.LPAREN)
    const argNames: string[] = []
    while (!this.match(TokenType.RPAREN)) {
      argNames.push(this.consume(TokenType.WORD).getText())
      this.match(TokenType.COMMA)
    }
    return new FunctionDefineStatement(name, argNames, this.statementOrBlock())
  }

  private function(): FunctionalExpression {
    const name: string = this.consume(TokenType.WORD).getText()
    this.consume(TokenType.LPAREN)
    const args: IExpression[] = []
    while (!this.match(TokenType.RPAREN)) {
      args.push(this.expression())
      this.match(TokenType.COMMA)
    }
    return new FunctionalExpression(name, args)
  }

  private expression(): IExpression {
    return this.ternary()
  }

  private ternary(): IExpression {
    const result = this.logicalOr()

    if (this.match(TokenType.QUESTION)) {
      const trueExpr = this.expression()
      this.consume(TokenType.COLON)
      const falseExpr = this.expression()
      return new TernaryExpression(result, trueExpr, falseExpr)
    }

    return result
  }

  private logicalOr(): IExpression {
    const result = this.logicalAnd()

    if (this.match(TokenType.BARBAR)) return new ConditionalExpression(ConditionalExpression.Operator.OR, result, this.logicalOr())

    return result
  }

  private logicalAnd(): IExpression {
    const result = this.bitwiseOr()

    if (this.match(TokenType.AMPAMP)) return new ConditionalExpression(ConditionalExpression.Operator.AND, result, this.logicalAnd())

    return result
  }

  private bitwiseOr(): IExpression {
    const result = this.bitwiseXor()

    if (this.match(TokenType.BAR)) return new BinaryExpression(BinaryExpression.Operator.OR, result, this.bitwiseOr())

    return result
  }

  private bitwiseXor(): IExpression {
    const result = this.bitwiseAnd()

    if (this.match(TokenType.CARET)) return new BinaryExpression(BinaryExpression.Operator.XOR, result, this.bitwiseXor())

    return result
  }

  private bitwiseAnd(): IExpression {
    const result = this.equality()

    if (this.match(TokenType.AMP)) return new BinaryExpression(BinaryExpression.Operator.AND, result, this.bitwiseAnd())

    return result
  }

  private equality(): IExpression {
    const result = this.conditional()

    if (this.match(TokenType.EQEQ)) return new ConditionalExpression(ConditionalExpression.Operator.EQUALS, result, this.equality())
    if (this.match(TokenType.EXCLEQ)) return new ConditionalExpression(ConditionalExpression.Operator.NOT_EQUALS, result, this.equality())

    return result
  }

  private conditional(): IExpression {
    const result = this.shift()

    if (this.match(TokenType.LT)) return new ConditionalExpression(ConditionalExpression.Operator.LT, result, this.conditional())
    if (this.match(TokenType.LTEQ)) return new ConditionalExpression(ConditionalExpression.Operator.LTEQ, result, this.conditional())
    if (this.match(TokenType.GT)) return new ConditionalExpression(ConditionalExpression.Operator.GT, result, this.conditional())
    if (this.match(TokenType.GTEQ)) return new ConditionalExpression(ConditionalExpression.Operator.GTEQ, result, this.conditional())

    return result
  }

  private shift(): IExpression {
    const result = this.additive()

    if (this.match(TokenType.LTLT)) return new BinaryExpression(BinaryExpression.Operator.LSHIFT, result, this.shift())
    if (this.match(TokenType.GTGT)) return new BinaryExpression(BinaryExpression.Operator.RSHIFT, result, this.shift())
    if (this.match(TokenType.GTGTGT)) return new BinaryExpression(BinaryExpression.Operator.URSHIFT, result, this.shift())

    return result
  }

  private additive(): IExpression {
    const result = this.multiplicative()

    if (this.match(TokenType.PLUS)) return new BinaryExpression(BinaryExpression.Operator.ADD, result, this.additive())
    if (this.match(TokenType.MINUS)) return new BinaryExpression(BinaryExpression.Operator.SUBTRACT, result, this.additive())

    return result
  }

  private multiplicative(): IExpression {
    const result = this.unary()

    if (this.match(TokenType.STAR)) return new BinaryExpression(BinaryExpression.Operator.MULTIPLY, result, this.multiplicative())
    if (this.match(TokenType.SLASH)) return new BinaryExpression(BinaryExpression.Operator.DIVIDE, result, this.multiplicative())

    return result
  }

  private unary(): IExpression {
    // DELETE
    // VOID
    // TYPEOF
    if (this.match(TokenType.PLUS)) return new UnaryExpression(UnaryExpression.Operator.PLUS, this.unary())
    if (this.match(TokenType.MINUS)) return new UnaryExpression(UnaryExpression.Operator.NEGATION, this.unary())
    if (this.match(TokenType.TILDE)) return new UnaryExpression(UnaryExpression.Operator.BITWISE_NOT, this.unary())
    if (this.match(TokenType.EXCL)) return new UnaryExpression(UnaryExpression.Operator.LOGICAL_NOT, this.unary())
    // AWAIT

    return this.primary()
  }

  private primary(): IExpression {
    const current = this.get()

    if (this.match(TokenType.WORD)) return new VariableExpression(current.getText())
    if (this.match(TokenType.TEXT)) return new ValueExpression(current.getText())
    if (this.match(TokenType.NUMBER)) return new ValueExpression(Number(current.getText()))
    if (this.match(TokenType.HEX_NUMBER)) return new ValueExpression(Number.parseInt(current.getText(), 16))

    throw new Error('Unknown expression ' + current)
  }

  private consume(type: TokenType): IToken {
    const current = this.get()
    if (current.getType() !== type) throw this.error('Token ' + TokenType[current.getType()] + " doesn't match " + TokenType[type])
    ++this.position
    return current
  }

  private match(type: TokenType): boolean {
    return type === this.get().getType() ? (++this.position, true) : false
  }

  private lookMatch(pos: number, type: TokenType): boolean {
    return this.get(pos).getType() === type
  }

  private get(relativePosition: number = 0): IToken {
    const position = this.position + relativePosition
    if (position >= this.size) return new Token(TokenType.EOF, '', -1, -1)

    return this.tokens[position]
  }

  private error(text: string): Error {
    return new Error(text)
  }
}
