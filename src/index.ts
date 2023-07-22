import { readFileSync } from 'fs'
import Lexer from 'Lexer'
import Parser from 'Parser'

const program = readFileSync('program.my-js', 'utf8')

const lexer = new Lexer(program)
const tokens = lexer.tokenize()

const parser = new Parser(tokens)
const ast = parser.parse()
ast.execute()
