import Lexer from 'Lexer'
import Parser from 'Parser'

const lexer = new Lexer('log helloWorld')
const tokens = lexer.tokenize()

const parser = new Parser(tokens)
const ast = parser.parse()
ast.execute()
