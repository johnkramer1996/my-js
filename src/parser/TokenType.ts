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
  FUNCTION,
  RETURN,
  USE,
  MATCH,
  CASE,
  EXTRACT,
  CONST,
  LET,
  VAR,

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

  PLUSEQ, // +=
  MINUSEQ, // -=
  STAREQ, // *=
  SLASHEQ, // /=
  PERCENTEQ, // %=
  AMPEQ, // &=
  CARETEQ, // ^=
  BAREQ, // |=
  COLONCOLONEQ, // ::=
  LTLTEQ, // <<=
  GTGTEQ, // >>=
  GTGTGTEQ, // >>>=

  PLUSPLUS, // ++
  MINUSMINUS, // --

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
