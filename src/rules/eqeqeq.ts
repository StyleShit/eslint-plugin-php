import type { Bin } from 'php-parser';

import { createRule } from '../utils/create-rule';

export const eqeqeq = createRule({
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
			"bin[type='=='], bin[type='!=']"(node: Bin) {
				context.report({
					node,
					messageId: 'unexpected',
					data: {
						expectedOperator: node.type === '==' ? '===' : '!==',
						actualOperator: node.type,
					},
				});
			},
		};
	},
});
