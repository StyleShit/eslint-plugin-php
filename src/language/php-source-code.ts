import type { Node, Program } from 'php-parser';
import { simpleTraverse } from '../utils/simple-traverse';
import {
	type SourceRange,
	type TraversalStep,
	TextSourceCodeBase,
	VisitNodeStep,
} from '@eslint/plugin-kit';

export class PHPSourceCode extends TextSourceCodeBase {
	#parents = new WeakMap<Node, Node>();

	override getParent(node: Node) {
		return this.#parents.get(node);
	}

	override getRange(nodeOrToken: Node): SourceRange {
		if (!nodeOrToken.loc) {
			throw new Error('Node does not have a location');
		}

		return [nodeOrToken.loc.start.offset, nodeOrToken.loc.end.offset];
	}

	override traverse() {
		const ast = this.ast as Program;
		const steps: TraversalStep[] = [];

		simpleTraverse(ast, (current, phase) => {
			if (phase === 'enter' && current.parent) {
				this.#parents.set(current.node, current.parent);
			}

			steps.push(
				new VisitNodeStep({
					phase: phase === 'enter' ? 1 : 2,
					args: [current.node],
					target: current.node,
				}),
			);
		});

		return steps;
	}
}
