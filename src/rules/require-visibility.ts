import type { ClassConstant, Method, PropertyStatement } from 'php-parser';

import { createRule } from '../utils/create-rule';
import { extractNames } from '../utils/extract-names';

export const visibilityOptions = ['private', 'protected', 'public'];

export const requireVisibility = createRule({
	meta: {
		type: 'layout',
		fixable: 'code',
		hasSuggestions: true,
		docs: {
			description: 'Require visibility for class methods and properties',
		},
		messages: {
			requireVisibilityForMethod:
				"Visibility must be declared on method '{{name}}'.",

			requireVisibilityForClassConstant:
				"Visibility must be declared on class constant '{{name}}'.",

			requireVisibilityForClassConstants:
				"Visibility must be declared on class constants '{{name}}'.",

			requireVisibilityForProperty:
				"Visibility must be declared on property '{{name}}'.",

			requireVisibilityForProperties:
				"Visibility must be declared on properties '{{name}}'.",

			addVisibility: "Add '{{visibility}}' visibility.",
		},
		schema: [],
	},

	create(context) {
		return {
			'method[visibility=""]'(node: Method) {
				context.report({
					node,
					messageId: 'requireVisibilityForMethod',
					data: {
						name:
							typeof node.name === 'string'
								? node.name
								: node.name.name,
					},
					suggest: visibilityOptions.map((visibility) => ({
						messageId: 'addVisibility',
						data: { visibility },
						fix(fixer) {
							const nodeText = context.sourceCode.getText(node);

							return fixer.replaceText(
								node,
								`${visibility} ${nodeText}`,
							);
						},
					})),
				});
			},

			'classconstant[visibility=""]'(node: ClassConstant) {
				const constKeywordLoc = context.sourceCode.findClosestKeyword(
					node,
					'const',
				);

				if (!constKeywordLoc) {
					return;
				}

				const constantsNames = extractNames(node.constants);

				context.report({
					node,
					loc: {
						start: constKeywordLoc.start,
						end: context.sourceCode.getLoc(node).end,
					},
					messageId:
						constantsNames.length === 1
							? 'requireVisibilityForClassConstant'
							: 'requireVisibilityForClassConstants',
					data: {
						name: constantsNames.join(', '),
					},
					suggest: visibilityOptions.map((visibility) => ({
						messageId: 'addVisibility',
						data: { visibility },
						fix(fixer) {
							return fixer.insertTextBeforeRange(
								[
									constKeywordLoc.start.offset,
									constKeywordLoc.end.offset,
								],
								`${visibility} `,
							);
						},
					})),
				});
			},

			'propertystatement[visibility=""]'(node: PropertyStatement) {
				const propertiesNames = extractNames(node.properties);

				context.report({
					node,
					messageId:
						propertiesNames.length === 1
							? 'requireVisibilityForProperty'
							: 'requireVisibilityForProperties',
					data: {
						name: propertiesNames.join(', '),
					},
					suggest: visibilityOptions.map((visibility) => ({
						messageId: 'addVisibility',
						data: { visibility },
						fix: (fixer) => {
							const nodeText = context.sourceCode.getText(node);

							return fixer.replaceText(
								node,
								`${visibility} ${nodeText}`,
							);
						},
					})),
				});
			},
		};
	},
});
