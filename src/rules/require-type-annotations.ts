import {
	type Closure,
	type Function,
	type Method,
	type Parameter,
	type Property,
} from 'php-parser';

import { createRule } from '../utils/create-rule';
import { extractName } from '../utils/extract-names';

type MessageIds =
	| 'requireTypesForProperty'
	| 'requireTypesForParameter'
	| 'requireTypesForMethodReturnType'
	| 'requireTypesForFunctionReturnType'
	| 'requireTypesForClosureReturnType';

type Options = [];

export const requireTypeAnnotations = createRule<MessageIds, Options>({
	meta: {
		type: 'suggestion',
		docs: {
			description:
				'Require types for properties, parameters, methods return types, and closures return types',
		},
		messages: {
			requireTypesForProperty:
				"Type must be declared on property '{{name}}'.",
			requireTypesForParameter:
				"Type must be declared on parameter '{{name}}'.",
			requireTypesForMethodReturnType:
				"Return type must be declared on method '{{name}}'.",
			requireTypesForFunctionReturnType:
				"Return type must be declared on function '{{name}}'.",
			requireTypesForClosureReturnType:
				'Return type must be declared on closure.',
		},
		schema: [],
	},
	create(context) {
		return {
			'property[type=null]'(node: Property) {
				context.report({
					node,
					messageId: 'requireTypesForProperty',
					data: { name: extractName(node) },
				});
			},
			'parameter[type=null]'(node: Parameter) {
				context.report({
					node,
					messageId: 'requireTypesForParameter',
					data: { name: extractName(node) },
				});
			},
			'method[type=null][name.name!=__construct]'(node: Method) {
				context.report({
					node,
					messageId: 'requireTypesForMethodReturnType',
					data: { name: extractName(node) },
				});
			},
			'function[type=null]'(node: Function) {
				context.report({
					node,
					messageId: 'requireTypesForFunctionReturnType',
					data: { name: extractName(node) },
				});
			},
			'closure[type=null], arrowfunc[type=null]'(node: Closure) {
				context.report({
					node,
					messageId: 'requireTypesForClosureReturnType',
				});
			},
		};
	},
});
