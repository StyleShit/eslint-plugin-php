import type { Bin } from 'php-parser';

import { createRule } from '../utils/create-rule';

type MessageIds = 'unexpected';
type Options = [];

export const eqeqeq = createRule<MessageIds, Options>({
	meta: {
		type: 'suggestion',
		fixable: 'code',
		docs: {
			description: 'Require the use of `===` and `!==`',
		},
		messages: {
			unexpected:
				"Expected '{{expectedOperator}}' and instead saw '{{actualOperator}}'.",
		},
		schema: [],
	},

	create(context) {
		return {
			'Expr_BinaryOp_Equal, Expr_BinaryOp_NotEqual'(node) {
				const operator =
					node.nodeType === 'Expr_BinaryOp_Equal' ? '==' : '!=';

				context.report({
					node,
					messageId: 'unexpected',
					data: {
						expectedOperator: operator === '==' ? '===' : '!==',
						actualOperator: operator,
					},
				});
			},
		};
	},
});
