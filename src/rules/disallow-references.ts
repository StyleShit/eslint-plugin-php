import { type Node } from 'php-parser';

import { createRule } from '../utils/create-rule';

export const disallowReferences = createRule({
	meta: {
		type: 'suggestion',
		fixable: 'code',
		hasSuggestions: true,
		docs: {
			description: 'Disallow the use of references',
		},
		messages: {
			disallowReferences: 'Do not use references (&).',
			removeAmp: 'Remove the reference operator (&).',
		},
		schema: [],
	},

	create(context) {
		return {
			[selectors.join(', ')](node: Node) {
				const ampKeyWord = context.sourceCode.findClosestKeyword(
					node,
					'&',
				);

				if (!ampKeyWord) {
					return;
				}

				context.report({
					node,
					loc: {
						start: ampKeyWord.start,
						end: context.sourceCode.getLoc(node).end,
					},
					messageId: 'disallowReferences',
					suggest: [
						{
							messageId: 'removeAmp',
							fix(fixer) {
								return fixer.removeRange([
									ampKeyWord.start.offset,
									ampKeyWord.end.offset,
								]);
							},
						},
					],
				});
			},
		};
	},
});

const selectors = [
	'assignref > .right',
	'closure[byref="true"]',
	'variable[byref="true"]',
	'parameter[byref="true"]',
	'method[byref="true"] > .name',
	'function[byref="true"] > .name',
];
