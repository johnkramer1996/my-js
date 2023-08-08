import Token, { IToken } from './Token'
import TokenType from './TokenType'
import IStatement from '@ast/IStatement'
import IExpression from '@ast/IExpression'
import LogStatement from '@ast/LogStatement'
import ValueExpression from '@ast/ValueExpression'
import BlockStatement from '@ast/BlockStatement'
import BinaryExpression, { BinaryOperator } from '@ast/BinaryExpression'
import UnaryExpression from '@ast/UnaryExpression'
import TernaryExpression from '@ast/TernarExpression'
import ConditionalExpression from '@ast/ConditionalExpression'
import IfStatement from '@ast/IfStatement'
import WhileStatement from '@ast/WhileStatement'
import DoWhileStatement from '@ast/DoWhileStatement'
import ForStatement from '@ast/ForStatement'
import BreakStatement from '@ast/BreakStatement'
import ContinueStatement from '@ast/ContinueStatement'
import FunctionDefineStatement from '@ast/FunctionDefineStatement'
import ExprStatement from '@ast/ExprStatement'
import CallExpression from '@ast/CallExpression'
import UseStatement from '@ast/UseStatement'
import ReturnStatement from '@ast/ReturnStatement'
import ArrayExpression from '@ast/ArrayExpression'
import ContainerAccessExpression, { IAccessible, ArrayPattern, Identifier, Params } from '@ast/ContainerAccessExpression'
import ParseException from '@exceptions/ParseException'
import CommaExpression from '@ast/CommaExpresstion'
import UserDefinedFunction from '@lib/UserDefinedFunction'
import MapExpression from '@ast/MapExpression'
import FunctionReferenceExpression from '@ast/FunctionReferenceExpression'
import ForeachStatement from '@ast/ForeachStatement'
import AssignmentExpression, { VaraibleDeclaration, VariableDeclarator } from '@ast/AssignmentExpression'
import MatchExpression, { ConstantPattern, Pattern, VariablePattern } from '@ast/MatchExpression'
import NumberValue from '@lib/NumberValue'
import StringValue from '@lib/StringValue'
import DestructuringAssignmentStatement from '@ast/DestructuringAssignmentStatement'

// TODO add AssignInicialization

type ConditionalExpressionWithoutOperatorConsturctor = new (expr1: IExpression, expr2: IExpression) => ConditionalExpression
type BinaryExpressionWithoutOperatorConsturctor = new (expr1: IExpression, expr2: IExpression) => BinaryExpression

type Binary =
  | {
      name: string
      list: { token: TokenType; class: ConditionalExpressionWithoutOperatorConsturctor }[]
    }
  | {
      name: string
      list: { token: TokenType; class: BinaryExpressionWithoutOperatorConsturctor }[]
    } // TODO make a general class

export default class Parser {
  private tokens: IToken[]
  private position = 0
  private size: number
  private brackets = [
    {
      openParent: TokenType.LPAREN,
      closeParent: TokenType.RPAREN,
    },
    {
      openParent: TokenType.LBRACKET,
      closeParent: TokenType.RBRACKET,
    },
    {
      openParent: TokenType.LBRACE,
      closeParent: TokenType.RBRACE,
    },
  ]
  private assignOperator = new Map([
    [TokenType.EQ, null],
    [TokenType.PLUSEQ, BinaryExpression.Operator.ADD],
    [TokenType.MINUSEQ, BinaryExpression.Operator.SUBTRACT],
    [TokenType.STAREQ, BinaryExpression.Operator.MULTIPLY],
    [TokenType.SLASHEQ, BinaryExpression.Operator.DIVIDE],
    [TokenType.PERCENTEQ, BinaryExpression.Operator.REMAINDER],
    [TokenType.AMPEQ, BinaryExpression.Operator.AND],
    [TokenType.CARETEQ, BinaryExpression.Operator.XOR],
    [TokenType.BAREQ, BinaryExpression.Operator.OR],
    [TokenType.COLONCOLONEQ, BinaryExpression.Operator.PUSH],
    [TokenType.LTLTEQ, BinaryExpression.Operator.LSHIFT],
    [TokenType.GTGTEQ, BinaryExpression.Operator.RSHIFT],
    [TokenType.GTGTGTEQ, BinaryExpression.Operator.URSHIFT],
  ])

  constructor(tokens: IToken[]) {
    this.tokens = tokens
    this.size = tokens.length
  }

  public parse(): IStatement {
    const mainBlock = new BlockStatement()
    while (!this.match(TokenType.EOF)) {
      mainBlock.add(this.statementOrBlock())
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
      block.add(this.statementOrBlock())
      while (this.match(TokenType.SEMIKOLON));
    }
    return block
  }

  private statement(): IStatement {
    if (this.match(TokenType.LOG)) return new LogStatement(this.expression())
    if (this.match(TokenType.PRINT)) return new LogStatement(this.expression())
    if (this.match(TokenType.PRINTLN)) return new LogStatement(this.expression(), true)
    if (this.match(TokenType.IF)) return this.ifElseStatement()
    if (this.match(TokenType.WHILE)) return this.whileStatement()
    if (this.match(TokenType.DO)) return this.doWhileStatement()
    if (this.match(TokenType.FOR)) return this.forStatement()
    if (this.match(TokenType.BREAK)) return new BreakStatement()
    if (this.match(TokenType.CONTINUE)) return new ContinueStatement()
    if (this.match(TokenType.DEF)) return this.functionDefine()
    if (this.match(TokenType.FUNCTION)) return this.functionDefine()
    if (this.match(TokenType.RETURN)) return new ReturnStatement(this.expression())
    if (this.match(TokenType.USE)) return new UseStatement(this.expression())
    if (this.match(TokenType.MATCH)) return new ExprStatement(this.matchExpression())
    if (this.match(TokenType.EXTRACT)) return this.destructuringAssignment()
    if (this.match(TokenType.CONST) || this.match(TokenType.LET) || this.match(TokenType.VAR)) return this.variableDeclaration()
    const current = this.get()
    try {
      return new ExprStatement(this.expression())
    } catch (e) {
      // console.error(e)
      throw this.error('Unknown statement ' + current)
    }
  }

  public variableDeclaration() {
    const kind = this.get(-1).getText()
    const declarations: VariableDeclarator[] = []
    do {
      const identifier = new Identifier(this.consume(TokenType.WORD).getText())
      if (this.match(TokenType.EQ)) {
        declarations.push(new VariableDeclarator(identifier, this.expression()))
      } else if (kind === 'let') {
        declarations.push(new VariableDeclarator(identifier, new ValueExpression(0)))
      } else throw new SyntaxError('Missing initializer in const declaration')
    } while (this.match(TokenType.COMMA))

    return new VaraibleDeclaration(declarations, kind)
  }

  private callExpression(qualifiedNameExpr: IExpression): CallExpression {
    this.consume(TokenType.LPAREN)
    const args: IExpression[] = []
    while (!this.match(TokenType.RPAREN)) {
      args.push(this.expression())
      this.match(TokenType.COMMA)
    }

    const call = new CallExpression(qualifiedNameExpr, args)
    return this.lookMatch(0, TokenType.LPAREN) ? this.callExpression(call) : call
  }

  private ifElseStatement(): IStatement {
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
    const foreachIndex = this.lookMatch(0, TokenType.LPAREN) ? 1 : 0
    if (this.lookMatch(foreachIndex, TokenType.WORD) && this.lookMatch(foreachIndex + 1, TokenType.COLON)) return this.foreachArrayStatement()
    if (
      this.lookMatch(foreachIndex, TokenType.WORD) &&
      this.lookMatch(foreachIndex + 1, TokenType.COMMA) &&
      this.lookMatch(foreachIndex + 2, TokenType.WORD) &&
      this.lookMatch(foreachIndex + 3, TokenType.COLON)
    )
      return this.foreachMapStatement()

    return this.simpleForStatement()
  }

  private foreachArrayStatement(): ForeachStatement {
    const openParen = this.match(TokenType.LPAREN)
    const variable = this.consume(TokenType.WORD).getText()
    this.consume(TokenType.COLON)
    const container = this.expression()
    if (openParen) this.consume(TokenType.RPAREN)
    const statement = this.statementOrBlock()
    return new ForeachStatement(container, statement, variable)
  }

  private foreachMapStatement(): ForeachStatement {
    const openParen = this.match(TokenType.LPAREN)
    const key = this.consume(TokenType.WORD).getText()
    this.consume(TokenType.COMMA)
    const value = this.consume(TokenType.WORD).getText()
    this.consume(TokenType.COLON)
    const container = this.expression()
    if (openParen) this.consume(TokenType.RPAREN)
    const statement = this.statementOrBlock()
    return new ForeachStatement(container, statement, key, value)
  }

  private simpleForStatement(): ForStatement {
    const openParen = this.match(TokenType.LPAREN)
    const initialization = new ExprStatement(this.assignmentExpression())
    this.consume(TokenType.COMMA)
    const termination = this.expression()
    this.consume(TokenType.COMMA)
    const increment = new ExprStatement(this.assignmentExpression())
    if (openParen) this.consume(TokenType.RPAREN)
    const statement = this.statementOrBlock()
    return new ForStatement(initialization, termination, increment, statement)
  }

  private assignmentExpression(qualifiedNameExpr: IAccessible = this.qualifiedName()): IExpression {
    // this.consume(TokenType.EQ)
    const binary = this.assignOperator.get(this.get(0).getType())
    if (binary === undefined) throw new Error('undefiner')
    this.match(this.get(0).getType())
    return new AssignmentExpression(binary, qualifiedNameExpr, this.expression())
  }

  private destructuringAssignment(): DestructuringAssignmentStatement {
    const variables = this.variableNames()
    this.consume(TokenType.EQ)
    return new DestructuringAssignmentStatement(variables, this.expression())
  }

  private variableNames(): string[] {
    this.consume(TokenType.LPAREN)
    const variables: string[] = []
    while (!this.match(TokenType.RPAREN)) {
      variables.push(this.lookMatch(0, TokenType.WORD) ? this.consume(TokenType.WORD).getText() : '')
      this.match(TokenType.COMMA)
    }

    return variables
  }

  private functionDefine(): FunctionDefineStatement {
    const name = new Identifier(this.consume(TokenType.WORD).getText())
    return new FunctionDefineStatement(name, new UserDefinedFunction(this.params(), this.body()))
  }

  private array(): IExpression {
    let index = 1
    let bracket = 0
    let type = this.get(index).getType()
    for (; (type !== TokenType.RBRACKET && type !== TokenType.EOF) || bracket !== 0; type = this.get(++index).getType()) {
      if (type === TokenType.LBRACKET) ++bracket
      if (type === TokenType.RBRACKET) --bracket
    }
    if (this.get(index + 1).getType() !== TokenType.EQ) return this.arrayExprestion()
    const arrayPattern = this.arrayPattern()
    this.consume(TokenType.EQ)

    const arrayExprestion = this.expression()
    return new AssignmentExpression(null, arrayPattern, arrayExprestion)
  }

  private arrayPattern(): ArrayPattern {
    this.consume(TokenType.LBRACKET)
    const arrayPattern = new ArrayPattern()
    while (!this.match(TokenType.RBRACKET)) {
      arrayPattern.add(this.identifier(), this.match(TokenType.EQ) ? this.expression() : null)
      this.match(TokenType.COMMA)
    }

    return arrayPattern
  }

  private identifier(): IAccessible {
    if (this.lookMatch(0, TokenType.WORD)) return new Identifier(this.consume(TokenType.WORD).getText())
    return this.arrayPattern()
  }

  private arrayExprestion(): IExpression {
    this.consume(TokenType.LBRACKET)
    const elements: IExpression[] = []
    while (!this.match(TokenType.RBRACKET)) {
      elements.push(this.expression())
      this.match(TokenType.COMMA)
    }

    return new ArrayExpression(elements)
  }

  private map(): IExpression {
    this.consume(TokenType.LBRACE)
    const elements: Map<IExpression, IExpression> = new Map()
    while (!this.match(TokenType.RBRACE)) {
      const key = this.value()
      this.consume(TokenType.COLON)
      elements.set(key, this.expression())
      this.match(TokenType.COMMA)
    }
    return new MapExpression(elements)
  }

  private dotOrBracketNotation(): IExpression[] {
    const indices: IExpression[] = []
    while (this.lookMatch(0, TokenType.DOT) || this.lookMatch(0, TokenType.LBRACKET)) {
      if (this.match(TokenType.DOT)) {
        const key = new ValueExpression(this.consume(TokenType.WORD).getText())
        indices.push(key)
      }
      if (this.match(TokenType.LBRACKET)) {
        indices.push(this.expression())
        this.consume(TokenType.RBRACKET)
      }
    }
    return indices
  }

  private matchExpression(): MatchExpression {
    // match expression {
    //  case pattern1: result1
    //  case pattern2 if extr: result2
    // }
    const expression = this.expression()
    this.consume(TokenType.LBRACE)
    const patterns: Pattern[] = []
    do {
      this.consume(TokenType.CASE)
      let pattern: Pattern | null = null
      const current = this.get(0)
      if (this.match(TokenType.NUMBER)) pattern = new ConstantPattern(new NumberValue(Number(current.getText())))
      else if (this.match(TokenType.HEX_NUMBER)) pattern = new ConstantPattern(new NumberValue(Number.parseInt(current.getText(), 16)))
      else if (this.match(TokenType.TEXT)) pattern = new ConstantPattern(new StringValue(current.getText()))
      else if (this.match(TokenType.WORD)) pattern = new VariablePattern(current.getText())
      if (pattern === null) throw this.error('Wrong pattern in match expression: ' + current)
      if (this.match(TokenType.IF)) pattern.optCondition = this.expression()
      this.consume(TokenType.COLON)
      pattern.result = new ReturnStatement(this.expression())
      patterns.push(pattern)
    } while (!this.match(TokenType.RBRACE))

    return new MatchExpression(expression, patterns)
  }

  private expression(): IExpression {
    const expr = this.comma()
    return expr
  }

  private comma(): IExpression {
    const result = this.assignment()

    if (this.lookMatch(0, TokenType.COMMA) && this.lookMatch(1, TokenType.COMMA)) {
      this.consume(TokenType.COMMA)
      this.consume(TokenType.COMMA)
      const right = this.expression()
      return new CommaExpression(result, right)
    }

    return result
  }

  private assignment(): IExpression {
    const pos = this.position
    if (this.lookMatch(0, TokenType.WORD)) {
      const identifier = this.qualifiedName()
      if (this.assignOperator.has(this.get().getType())) return this.assignmentExpression(identifier)
    }
    this.position = pos

    return this.ternary()
  }

  private ternary(): IExpression {
    const result = this.binary()

    if (this.match(TokenType.QUESTION)) {
      const trueExpr = this.expression()
      this.consume(TokenType.COLON)
      const falseExpr = this.expression()
      return new TernaryExpression(result, trueExpr, falseExpr)
    }

    return result
  }

  private binary(priority: number = 0): IExpression {
    const currentPriority = priority++
    const binary: Binary[] = [
      {
        name: 'logicalOr',
        list: [{ token: TokenType.BARBAR, class: ConditionalExpression.bind(null, ConditionalExpression.Operator.OR) }],
      },
      {
        name: 'logicalAnd',
        list: [{ token: TokenType.AMPAMP, class: ConditionalExpression.bind(null, ConditionalExpression.Operator.AND) }],
      },
      {
        name: 'bitwiseOr',
        list: [{ token: TokenType.BAR, class: BinaryExpression.bind(null, BinaryExpression.Operator.OR) }],
      },
      {
        name: 'bitwiseXor',
        list: [{ token: TokenType.CARET, class: BinaryExpression.bind(null, BinaryExpression.Operator.XOR) }],
      },
      {
        name: 'bitwiseAnd',
        list: [{ token: TokenType.AMP, class: BinaryExpression.bind(null, BinaryExpression.Operator.AND) }],
      },
      {
        name: 'equality',
        list: [
          { token: TokenType.EQEQ, class: ConditionalExpression.bind(null, ConditionalExpression.Operator.EQUALS) },
          { token: TokenType.EXCLEQ, class: ConditionalExpression.bind(null, ConditionalExpression.Operator.NOT_EQUALS) },
        ],
      },
      {
        name: 'conditional',
        list: [
          { token: TokenType.LT, class: ConditionalExpression.bind(null, ConditionalExpression.Operator.LT) },
          { token: TokenType.LTEQ, class: ConditionalExpression.bind(null, ConditionalExpression.Operator.LTEQ) },
          { token: TokenType.GT, class: ConditionalExpression.bind(null, ConditionalExpression.Operator.GT) },
          { token: TokenType.GTEQ, class: ConditionalExpression.bind(null, ConditionalExpression.Operator.GTEQ) },
        ],
      },
      {
        name: 'shift',
        list: [
          { token: TokenType.LTLT, class: BinaryExpression.bind(null, BinaryExpression.Operator.LSHIFT) },
          { token: TokenType.GTGT, class: BinaryExpression.bind(null, BinaryExpression.Operator.RSHIFT) },
          { token: TokenType.GTGTGT, class: BinaryExpression.bind(null, BinaryExpression.Operator.URSHIFT) },
        ],
      },
      {
        name: 'additive',
        list: [
          { token: TokenType.PLUS, class: BinaryExpression.bind(null, BinaryExpression.Operator.ADD) },
          { token: TokenType.MINUS, class: BinaryExpression.bind(null, BinaryExpression.Operator.SUBTRACT) },
          { token: TokenType.COLONCOLON, class: BinaryExpression.bind(null, BinaryExpression.Operator.PUSH) },
        ],
      },
      {
        name: 'multiplicative',
        list: [
          { token: TokenType.STAR, class: BinaryExpression.bind(null, BinaryExpression.Operator.MULTIPLY) },
          { token: TokenType.SLASH, class: BinaryExpression.bind(null, BinaryExpression.Operator.DIVIDE) },
          { token: TokenType.PERCENT, class: BinaryExpression.bind(null, BinaryExpression.Operator.REMAINDER) },
        ],
      },
    ]
    const current = binary[currentPriority]
    const isLast = currentPriority === binary.length - 1
    const next = !isLast ? this.binary.bind(this, priority) : this.unary.bind(this)
    let result = next()

    while (true) {
      const coincidence = current.list.some((i) => {
        return this.match(i.token) ? ((result = new i.class(result, next())), true) : false
      })
      if (coincidence) continue
      break
    }

    return result
  }

  private unary(): IExpression {
    // DELETE
    // VOID
    // TYPEOF
    if (this.match(TokenType.PLUSPLUS)) return new UnaryExpression(UnaryExpression.Operator.INCREMENT_PREFIX, this.primary())
    if (this.match(TokenType.MINUSMINUS)) return new UnaryExpression(UnaryExpression.Operator.DECREMENT_PREFIX, this.primary())
    if (this.match(TokenType.PLUS)) return new UnaryExpression(UnaryExpression.Operator.PLUS, this.primary())
    if (this.match(TokenType.MINUS)) return new UnaryExpression(UnaryExpression.Operator.NEGATION, this.primary())
    if (this.match(TokenType.TILDE)) return new UnaryExpression(UnaryExpression.Operator.BITWISE_NOT, this.primary())
    if (this.match(TokenType.EXCL)) return new UnaryExpression(UnaryExpression.Operator.LOGICAL_NOT, this.primary())
    // AWAIT

    return this.primary()
  }

  private primary(): IExpression {
    if (this.match(TokenType.COLONCOLON)) return new FunctionReferenceExpression(this.consume(TokenType.WORD).getText())
    if (this.match(TokenType.MATCH)) return this.matchExpression()
    if (this.lookMatch(0, TokenType.LPAREN)) {
      return this.nested()
    }

    return this.variable()
  }

  private variable(): IExpression {
    // variable(args)
    if (this.lookMatch(0, TokenType.WORD)) {
      // arr["key"](args) || obj.key(args) || arr || obj
      const qualifiedNameExpr = this.qualifiedName()
      if (this.lookMatch(0, TokenType.LPAREN)) return this.callExpression(qualifiedNameExpr)
      if (this.match(TokenType.PLUSPLUS)) return new UnaryExpression(UnaryExpression.Operator.INCREMENT_POSTFIX, qualifiedNameExpr)
      if (this.match(TokenType.MINUSMINUS)) return new UnaryExpression(UnaryExpression.Operator.DECREMENT_POSTFIX, qualifiedNameExpr)
      return qualifiedNameExpr
    }

    return this.value()
  }

  private value(): IExpression {
    const current = this.get()

    if (this.lookMatch(0, TokenType.LBRACKET)) return this.array()
    if (this.lookMatch(0, TokenType.LBRACE)) return this.map()
    // if (this.match(TokenType.DEF)) return new ValueExpression(new UserDefinedFunction(this.params(), this.body()))
    if (this.match(TokenType.NUMBER)) return new ValueExpression(Number(current.getText()))
    if (this.match(TokenType.HEX_NUMBER)) return new ValueExpression(Number.parseInt(current.getText(), 16))
    if (this.match(TokenType.TEXT)) return new ValueExpression(current.getText())

    throw this.error('Unknown expression ' + current)
  }

  private qualifiedName(): IAccessible {
    if (this.lookMatch(0, TokenType.WORD) && (this.lookMatch(1, TokenType.LBRACKET) || this.lookMatch(1, TokenType.DOT)))
      return new ContainerAccessExpression(this.consume(TokenType.WORD).getText(), this.dotOrBracketNotation())
    return new Identifier(this.consume(TokenType.WORD).getText())
  }

  private nested(): IExpression {
    this.consume(TokenType.LPAREN)
    const result = this.expression()
    this.consume(TokenType.RPAREN)
    return result
  }

  private params(): Params {
    this.consume(TokenType.LPAREN)
    const paramsNames = new Params()
    while (!this.match(TokenType.RPAREN)) {
      const value = this.identifier()

      paramsNames.add(value, this.match(TokenType.EQ) ? this.expression() : null)
      this.match(TokenType.COMMA)
    }
    return paramsNames
  }

  private body(): IStatement {
    return this.match(TokenType.EQ) ? new ReturnStatement(this.expression()) : this.statementOrBlock()
  }

  private consume(type: TokenType): IToken {
    const current = this.get()
    if (current.getType() !== type) throw this.error('Token ' + current + " doesn't match " + TokenType[type])
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
    return new ParseException(text)
  }
}
