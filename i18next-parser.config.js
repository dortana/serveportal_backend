module.exports = {
  input: undefined,
  output: "src/messages/$LOCALE.json",
  locales: ["en-US"],
  defaultValue: (lng, ns, key) => key,
  namespaceSeparator: false,
  keySeparator: false,
  keepRemoved: false,
  createOldCatalogs: false,
  lexers: {
    js: [
      {
        lexer: "JavascriptLexer",
        functions: ["t", "t.rich", "__"],
      },
    ],
    ts: [
      {
        lexer: "JavascriptLexer",
        functions: ["t", "t.rich", "__"],
      },
    ],
    tsx: [
      {
        lexer: "JsxLexer",
        functions: ["t", "t.rich", "__"],
      },
    ],
  },
};
