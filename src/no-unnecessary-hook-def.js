import traverse from "eslint-traverse";

export default {
	meta: {
		type: 'problem'
	},

	create(context) {
		return {
			Identifier(node) {
				// First check if we have a use* name
				if (!isHookName(node?.name)) return;

				// Then try to get back the associated function body
				const body = getPotentialHookBody(node);
				if (!body) return;



				// Traverse the fn body to see if we called another hook
				let hasCalledHook = false;
				traverse(context, body, path => {
					if (path?.node?.type === "CallExpression" && isHookName(path?.node?.callee?.name)) {
						hasCalledHook = true;
						return traverse.STOP;
					}
				})

				// No hook call? Naughty naughty
				if (!hasCalledHook) {
					context.report({ node, message: "Bad boy"})
				}
			}
		}
	}
}

/**
 * same logic that Facebook uses: https://github.com/facebook/react/blob/e7c5af45ceb8fa2b64d39ec68345254ce9abd65e/packages/eslint-plugin-react-hooks/src/RulesOfHooks.js#L18-L23
 */
function isHookName(s) {
	return /^use[A-Z0-9]/.test(s);
}

function getPotentialHookBody(node) {
	if (node?.parent?.type === "VariableDeclarator" && ["ArrowFunctionExpression", "FunctionExpression"].includes(node?.parent?.init?.type)) {
		return node.parent.init;
	}
	if (node?.parent?.type === "FunctionDeclaration" && node?.parent?.body?.type === "BlockStatement") {
		return node.parent.body;
	}
}
