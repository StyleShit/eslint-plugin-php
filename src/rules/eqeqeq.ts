import type { Bin } from 'php-parser';
import { createRule } from '../utils/create-rule';

type MessageIds = 'unexpected';
type Options = [];

export const eqeqeq = createRule<MessageIds, Options>({
	meta: {
		type: 'layout',
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
			"bin[type='=='], bin[type='!=']"(_node) {
				// TODO: Fix the types.
				const node = _node as Bin;

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
