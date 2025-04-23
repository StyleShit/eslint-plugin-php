import type { Node } from 'php-parser';
import type { RuleDefinition } from '@eslint/core';
import type { PHPSourceCode } from '../language/php-source-code';

type Rule<
	TMessageIds extends string = string,
	TOptions extends unknown[] = [],
> = RuleDefinition<{
	LangOptions: Record<string, unknown>;
	Code: PHPSourceCode;
	RuleOptions: TOptions;
	Visitor: Record<string, (node: Node) => void>;
	Node: Node;
	MessageIds: TMessageIds;
	ExtRuleDocs: unknown;
}>;

export function createRule<
	TMessageIds extends string,
	TOptions extends unknown[],
>(ruleDefinition: Rule<TMessageIds, TOptions>) {
	return ruleDefinition;
}
