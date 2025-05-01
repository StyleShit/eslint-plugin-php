import { type Node } from 'php-parser';

import { createRule } from '../utils/create-rule';

export const noArrayKeyword = createRule({
	meta: {
		type: 'suggestion',
		fixable: 'code',
		docs: {
			description: 'disallow the use of the array keyword',
		},
		messages: {
			noArrayKeyword: 'The array keyword is not allowed. Use [] instead.',
		},
		schema: [],
	},

	create(context) {
		return {
			'array[shortForm=false]'(node: Node) {
				context.report({
					node,
					messageId: 'noArrayKeyword',
					fix(fixer) {
						const nodeText = context.sourceCode.getText(node);

						return fixer.replaceText(
							node,
							nodeText.replace(/^array\((.*?)\)$/s, '[$1]'),
						);
					},
				});
			},
		};
	},
});
