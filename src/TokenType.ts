enum TokenType {
  WORD,
  NUMBER,
  TEXT,

  PLUS, // +
  MINUS, // -
  STAR, // *
  SLASH, // /
  PERCENT, // %

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
