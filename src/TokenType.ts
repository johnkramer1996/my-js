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

  LOG,

  EOF,
}

export default TokenType
