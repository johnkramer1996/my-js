enum TokenType {
  WORD,
  NUMBER,
  TEXT,

  PLUS, // +
  MINUS, // -
  STAR, // *
  SLASH, // /
  PERCENT, // %

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

  LOG,

  EOF,
}

export default TokenType
