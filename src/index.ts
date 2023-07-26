import AssignValidator from 'parser/visitors/AssignValidator'
import FunctionAdder from 'parser/visitors/FunctionAdder'
import { readFileSync } from 'fs'
import Lexer from 'parser/Lexer'
import Parser from 'parser/Parser'

const program = readFileSync('program.my-js', 'utf8')

const lexer = new Lexer(program)
const tokens = lexer.tokenize()

const parser = new Parser(tokens)
const ast = parser.parse()
ast.accept(new FunctionAdder())
ast.accept(new AssignValidator())
ast.execute()
