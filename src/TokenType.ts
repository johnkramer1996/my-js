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

  LOG,

  EOF,
}

export default TokenType
