import AssignValidator from 'parser/visitors/AssignValidator'
import FunctionAdder from 'parser/visitors/FunctionAdder'
import Lexer from 'parser/Lexer'
import Parser from 'parser/Parser'
import CallStack from '@lib/CallStack'
import program from '../scope.my-js'

// for node.js
// import { readFileSync } from 'fs'
// const program = readFileSync('program.my-js', 'utf8')

try {
  const lexer = new Lexer(program)
  const tokens = lexer.tokenize()
  const parser = new Parser(tokens)
  const ast = parser.parse()
  ast.accept(new FunctionAdder())
  ast.accept(new AssignValidator())
  ast.execute()
} catch (e) {
  if (e instanceof Error) {
    console.log(e)
    console.dir(`Error: ${e.message}`)
    for (const call of CallStack.getCalls()) console.log(`\tat ${call}`)
  }
}
