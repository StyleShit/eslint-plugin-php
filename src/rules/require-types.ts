import {
	type Closure,
	type Function,
	type Method,
	type Parameter,
	type Property,
} from 'php-parser';

import { createRule } from '../utils/create-rule';
import { extractName } from '../utils/extract-names';

export const requireTypes = createRule({
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
				"Type must be declared on method return type '{{name}}'.",
			requireTypesForFunctionReturnType:
				"Type must be declared on function return type '{{name}}'.",
			requireTypesForClosureReturnType:
				'Type must be declared on closure return type.',
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
			'closure[type=null]'(node: Closure) {
				context.report({
					node,
					messageId: 'requireTypesForClosureReturnType',
				});
			},
		};
	},
});
