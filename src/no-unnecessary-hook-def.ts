import { Rule } from "eslint";

export const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "disallow unnecessary React hook function definitions",
      url: "https://github.com/FormidableLabs/eslint-plugin-no-unnecessary-hook-definition/",
    },
  },
  create(context) {
    const allVisitorKeys = context.getSourceCode().visitorKeys;

    const hasCalledHook = (node: Rule.Node): boolean | "NA" => {
      let fnName: string | undefined;
      // Check for a standard fn call, like useEffect();
      if (node.type === "CallExpression" && node.callee.type === "Identifier")
        fnName = node.callee.name;
      // Check for a first-level method call, like React.useEffect();
      else if (
        node.type === "CallExpression" &&
        node.callee.type === "MemberExpression" &&
        node.callee.property.type === "Identifier"
      )
        fnName = node.callee.property.name;

      // If we've got a fn call at this point, we can break.
      if (fnName && isHookName(fnName)) {
        return true;
      }

      const visitorKeys = allVisitorKeys[node.type];
      if (!visitorKeys) return "NA";

      for (const key of visitorKeys) {
        const child = node[key as keyof typeof node] as Rule.Node | Rule.Node[];

        if (!child) continue;
        else if (Array.isArray(child)) {
          for (const item of child) {
            const h = hasCalledHook(item);
            if (h === true) return true;
          }
        } else {
          return hasCalledHook(child);
        }
      }

      return false;
    };

    return {
      /**
       * We'll check Identifier nodes that have hook-like names, and then make sure they call another hook.
       */
      Identifier(node: IdentifierNode) {
        // First check if we have a use* name
        if (!isHookName(node.name)) return;

        // Then try to get back the associated function body
        const body = getPotentialHookBody(node);
        if (!body) return;

        // No hook call? Naughty naughty
        if (!hasCalledHook(body)) {
          context.report({
            node,
            message: `This function does not call another hook. Avoiding the \`use\` prefix; consider the name \`${stripUsePrefix(
              node.name
            )}\` instead.`,
          });
        }
      },
    };
  },
};

type IdentifierNode = Parameters<
  NonNullable<Rule.NodeListener["Identifier"]>
>[0];
type VariableDeclaratorNode = Parameters<
  NonNullable<Rule.NodeListener["VariableDeclarator"]>
>[0];
type BodyType = NonNullable<ReturnType<typeof getPotentialHookBody>>;

/**
 * same logic that Facebook uses: https://github.com/facebook/react/blob/e7c5af45ceb8fa2b64d39ec68345254ce9abd65e/packages/eslint-plugin-react-hooks/src/RulesOfHooks.js#L18-L23
 */
function isHookName(s?: string) {
  return typeof s === "string" && /^use[A-Z0-9]/.test(s);
}

/**
 * If an Identifier node has a hook name, try to grab the associated fn body (to check if it calls a hook)
 */
function getPotentialHookBody(node: IdentifierNode) {
  if (
    isVariableDeclaratorNode(node.parent) &&
    ["ArrowFunctionExpression", "FunctionExpression"].includes(
      node?.parent?.init?.type || ""
    )
  ) {
    return node.parent.init;
  }
  if (
    node?.parent?.type === "FunctionDeclaration" &&
    node?.parent?.body?.type === "BlockStatement"
  ) {
    return node.parent.body;
  }
}

const isVariableDeclaratorNode = (
  node: Rule.Node
): node is VariableDeclaratorNode => node?.type === "VariableDeclarator";

const stripUsePrefix = (name: string) => {
  const stripped = name.replace(/^use([A-Z0-9].*)$/, "$1");
  return stripped[0].toLowerCase() + stripped.substring(1);
};
