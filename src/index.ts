import Lexer from 'Lexer'
import Parser from 'Parser'

const program = `
log 'hello'
log 'world'
log 10 + 9 + 8 + 7 + 6 + 5 + 4 + 3 + 2 + 1 - 55 
`

const lexer = new Lexer(program)
const tokens = lexer.tokenize()

const parser = new Parser(tokens)
const ast = parser.parse()
ast.execute()
