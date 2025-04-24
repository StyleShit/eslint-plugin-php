import { createRule } from '../utils/create-rule';
import { ClassConstant, Method, PropertyStatement } from 'php-parser';

type MessageIds =
	| 'requireVisibilityForMethod'
	| 'requireVisibilityForClassConstant'
	| 'requireVisibilityForProperty'
	| 'addVisibility';
type Options = [];

const visibilityOptions = ['private', 'protected', 'public'];

export const requireVisibility = createRule<MessageIds, Options>({
	meta: {
		type: 'layout',
		fixable: 'code',
		hasSuggestions: true,
		docs: {
			description: 'Require visibility to be declared on methods',
		},
		messages: {
			requireVisibilityForMethod:
				'Visibility must be declared on method "{{name}}"',
			requireVisibilityForClassConstant:
				'Visibility must be declared on class constants "{{name}}"',
			requireVisibilityForProperty:
				'Visibility must be declared on properties "{{name}}"',
			addVisibility: 'Add "{{visibility}}" visibility',
		},
		schema: [],
	},

	create(context) {
		return {
			'method[visibility=""]'(_node) {
				const node = _node as Method;

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
								nodeText.replace(
									/^function /,
									`${visibility} function `,
								),
							);
						},
					})),
				});
			},
			'classconstant[visibility=""]'(_node) {
				const node = _node as ClassConstant;

				context.report({
					node,
					messageId: 'requireVisibilityForClassConstant',
					data: {
						name: node.constants.map(({ name }) => name).join(', '),
					},
					suggest: visibilityOptions.map((visibility) => ({
						messageId: 'addVisibility',
						data: { visibility },
						fix(fixer) {
							const nodeText = context.sourceCode.getText(node);

							return fixer.replaceText(
								node,
								nodeText.replace(
									/const /,
									`${visibility} const `,
								),
							);
						},
					})),
				});
			},
			'propertystatement[visibility=null]'(_node) {
				const node = _node as PropertyStatement;

				context.report({
					node,
					messageId: 'requireVisibilityForProperty',
					data: {
						name: node.properties
							.map(({ name }) => name)
							.join(', '),
					},
					suggest: visibilityOptions.map((visibility) => ({
						messageId: 'addVisibility',
						data: { visibility },
						fix(fixer) {
							const nodeText = context.sourceCode.getText(node);

							return fixer.replaceText(
								node,
								nodeText.replace(/var /, `${visibility} `),
							);
						},
					})),
				});
			},
		};
	},
});
