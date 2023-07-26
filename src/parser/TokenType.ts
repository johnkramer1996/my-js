enum TokenType {
  WORD,
  NUMBER,
  TEXT,
  HEX_NUMBER,

  // keyword
  PRINT,
  PRINTLN,
  IF,
  ELSE,
  WHILE,
  FOR,
  DO,
  BREAK,
  CONTINUE,
  DEF,
  RETURN,
  USE,

  PLUS, // +
  MINUS, // -
  STAR, // *
  SLASH, // /
  PERCENT, // %
  EQ, // =
  EQEQ, // ==
  EXCLEQ, // !=
  LTEQ, // <=
  LT, // <
  GT, // >
  GTEQ, // >=

  LTLT, // <<
  GTGT, // >>
  GTGTGT, // >>>

  EXCL, // !
  TILDE, // ~
  CARET, // ^
  BAR, // |
  BARBAR, // ||
  AMP, // &
  AMPAMP, // &&

  SEMIKOLON, // ;
  QUESTION, // ?
  COLON, // :
  COLONCOLON, // ::

  LPAREN, // (
  RPAREN, // )
  LBRACKET, // [
  RBRACKET, // ]
  LBRACE, // {
  RBRACE, // }
  COMMA, // ,
  DOT, // .

  LOG,

  EOF,
}

export default TokenType
