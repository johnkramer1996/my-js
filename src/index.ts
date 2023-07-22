import Lexer from 'Lexer'
import Parser from 'Parser'

const program = `
log hello
log world
`

const lexer = new Lexer(program)
const tokens = lexer.tokenize()

const parser = new Parser(tokens)
const ast = parser.parse()
ast.execute()
