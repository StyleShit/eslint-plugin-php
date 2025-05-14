import {
	type ArrowFunc,
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
					node: typeof node.name === 'string' ? node : node.name,
					messageId: 'requireTypesForMethodReturnType',
					data: { name: extractName(node) },
				});
			},
			'function[type=null]'(node: Function) {
				context.report({
					node: typeof node.name === 'string' ? node : node.name,
					messageId: 'requireTypesForFunctionReturnType',
					data: { name: extractName(node) },
				});
			},
			'closure[type=null], arrowfunc[type=null]'(
				node: Closure | ArrowFunc,
			) {
				const nodeLoc = context.sourceCode.getLoc(node);

				const endColumn =
					node.kind === 'closure'
						? nodeLoc.start.column + 'function'.length
						: nodeLoc.start.column + 'fn'.length;

				context.report({
					node,
					loc: {
						start: nodeLoc.start,
						end: {
							line: nodeLoc.start.line,
							column: endColumn,
						},
					},
					messageId: 'requireTypesForClosureReturnType',
				});
			},
		};
	},
});
