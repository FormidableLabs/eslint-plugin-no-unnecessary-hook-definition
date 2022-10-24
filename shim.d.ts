declare module "eslint-traverse" {
  declare const traverse: {
    (
      context: Rule.RuleContext,
      body: Rule.Node,
      visitor: (path: { node: Rule.Node }) => void
    ): void;
    STOP: Symbol;
    SKIP: Symbol;
  };

  export default traverse;
}
