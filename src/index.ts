import AssignValidator from 'parser/visitors/AssignValidator'
import FunctionAdder from 'parser/visitors/FunctionAdder'
import Lexer from 'parser/Lexer'
import Parser from 'parser/Parser'
import program from '../program.my-js'

// for node.js
// import { readFileSync } from 'fs'
// const program = readFileSync('program.my-js', 'utf8')

const lexer = new Lexer(program)
const tokens = lexer.tokenize()

const parser = new Parser(tokens)
const ast = parser.parse()
ast.accept(new FunctionAdder())
ast.accept(new AssignValidator())
try {
  ast.execute()
} catch (e) {
  console.log(e)
}

// fetch('https://jsonplaceholder.typicode.com/users', {
//   method: 'POST',
//   body: JSON.stringify({
//     title: 'foo',
//     body: 'bar',
//     userId: 1,
//   }),
//   headers: {
//     'Content-type': 'application/json; charset=UTF-8',
//   },
// })
//   .then((response) => response.json())
//   .then((json) => console.log(json))
