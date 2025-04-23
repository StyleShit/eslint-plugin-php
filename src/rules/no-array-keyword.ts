import { createRule } from '../utils/create-rule';

type MessageIds = 'noArrayKeyword';
type Options = [];

export const noArrayKeyword = createRule<MessageIds, Options>({
	meta: {
		type: 'layout',
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
			'array[shortForm=false]'(node) {
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
