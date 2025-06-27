import type { ClassConstant, Identifier, PropertyStatement } from 'php-parser';

import { createRule } from '../utils/create-rule';

type MessageIds = 'noFinal' | 'removeFinal';
type Options = [];

export const noFinal = createRule<MessageIds, Options>({
	meta: {
		hasSuggestions: true,
		type: 'suggestion',
		docs: {
			description: 'Disallow using the `final` keyword',
		},
		messages: {
			noFinal: 'The `final` keyword is not allowed.',
			removeFinal: 'Remove the `final` keyword`.',
		},
		schema: [],
	},

	create(context) {
		return {
			'class[isFinal=true] > .name, method[isFinal=true] > .name'(
				node: Identifier,
			) {
				context.report({
					node,
					messageId: 'noFinal',
				});
			},

			'classconstant, propertystatement'(
				node: ClassConstant | PropertyStatement,
			) {
				const finalKeyword = context.sourceCode.findClosestKeyword(
					node,
					'final',
				);

				if (!finalKeyword) {
					return;
				}

				context.report({
					node,
					loc: {
						start: finalKeyword.start,
						end: context.sourceCode.getLoc(node).end,
					},
					messageId: 'noFinal',
					suggest: [
						{
							messageId: 'removeFinal',
							fix(fixer) {
								return fixer.removeRange([
									finalKeyword.start.offset,
									finalKeyword.end.offset,
								]);
							},
						},
					],
				});
			},
		};
	},
});
