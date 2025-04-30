import { type Node } from 'php-parser';

type Visitor = (
	current: { node: Node; parent?: Node },
	phase: 'enter' | 'exit',
) => void;

export function simpleTraverse(node: Node, visitor: Visitor, parent?: Node) {
	visitor({ node, parent }, 'enter');

	Object.values(node).forEach((value) => {
		if (isNode(value)) {
			simpleTraverse(value, visitor, node);

			return;
		}

		if (Array.isArray(value)) {
			value.forEach((child) => {
				if (isNode(child)) {
					simpleTraverse(child, visitor, node);
				}
			});
		}
	});

	visitor({ node, parent }, 'exit');
}

function isNode(node: unknown): node is Node {
	return (
		typeof node === 'object' &&
		node !== null &&
		'kind' in node &&
		'loc' in node
	);
}
