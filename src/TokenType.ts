enum TokenType {
  WORD,
  NUMBER,
  TEXT,
  HEX_NUMBER,

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
