import { createRule } from '../utils/create-rule';

type MessageIds = 'noAssignRef';
type Options = [];

export const disallowReferences = createRule<MessageIds, Options>({
	meta: {
		type: 'layout',
		fixable: 'code',
		hasSuggestions: true,
		docs: {
			description: 'Disallow assigning by reference',
		},
		messages: {
			noAssignRef: 'Assigning by reference is not allowed.',
		},
		schema: [],
	},

	create(context) {
		return {
			'assignref, parameter[byref="true"], function[byref="true"], variable[byref="true"]'(
				node,
			) {
				context.report({
					node,
					messageId: 'noAssignRef',
					suggest: [
						{
							desc: 'Remove reference assignment',
							fix(fixer) {
								const nodeText =
									context.sourceCode.getText(node);

								return fixer.replaceText(
									node,
									nodeText.replace(/&/g, ''),
								);
							},
						},
					],
				});
			},
		};
	},
});
