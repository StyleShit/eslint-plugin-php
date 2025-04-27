import type { Location, Node } from 'php-parser';
import { simpleTraverse } from '../utils/simple-traverse';
import {
	type SourceRange,
	type TraversalStep,
	VisitNodeStep,
} from '@eslint/plugin-kit';
import type { Position } from '@eslint/core';
import { LINE_START } from './php-language';
import { TextSourceCodeWithComments } from './text-source-code-with-comments';

export class PHPSourceCode extends TextSourceCodeWithComments {
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
		const ast = this.ast;
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

	findClosestKeyword(
		node: Node,
		keyword: string,
	): Omit<Location, 'source'> | null {
		const lines = this.lines;
		const nodeLoc = this.getLoc(node);

		for (let line = nodeLoc.start.line; line >= 0; line--) {
			const startColumn =
				line === nodeLoc.start.line
					? nodeLoc.start.column
					: lines[line]?.length;

			for (let column = startColumn ?? 0; column >= 0; column--) {
				const sliceStart = Math.max(0, column - keyword.length);
				const sliceEnd = sliceStart + keyword.length;

				if (lines[line]?.slice(sliceStart, sliceEnd) === keyword) {
					const locLine = line + LINE_START;

					return {
						start: {
							line: locLine,
							column: sliceStart,
							offset: this.getOffset({
								line: locLine,
								column: sliceStart,
							}),
						},
						end: {
							line: locLine,
							column: sliceEnd,
							offset: this.getOffset({
								line: locLine,
								column: sliceEnd,
							}),
						},
					};
				}
			}
		}

		return null;
	}

	getOffset(position: Position) {
		return (
			this.lines.reduce((acc, currentLine, index) => {
				return index + LINE_START < position.line
					? acc + currentLine.length + 1 // +1 for newline character.
					: acc;
			}, 0) + position.column
		);
	}
}
