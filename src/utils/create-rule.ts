import { type Rule, type RuleDefinition } from 'eslint';
import { type RuleVisitor } from '@eslint/core';

export function createRule<
	TMessageIds extends string,
	TOptions extends unknown[],
	TRuleVisitor extends RuleVisitor = RuleVisitor,
>(ruleDefinition: RuleDefinition<TMessageIds, TOptions, TRuleVisitor>) {
	return {
		meta: ruleDefinition.meta,
		create: (context) => ruleDefinition.create(context as never),
	} satisfies Rule.RuleModule;
}
