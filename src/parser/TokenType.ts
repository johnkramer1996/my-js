enum TokenType {
  WORD,
  NUMBER,
  TEXT,
  HEX_NUMBER,

  // keyword
  PRINT,
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

  LPAREN, // (
  RPAREN, // )
  LBRACKET, // [
  RBRACKET, // ]
  LBRACE, // {
  RBRACE, // }
  COMMA, // ,
  COLONCOLON, // ::

  LOG,

  EOF,
}

export default TokenType
