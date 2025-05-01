import { Rule, type RuleDefinition } from 'eslint';
import RuleModule = Rule.RuleModule;

export function createRule<
	TMessageIds extends string,
	TOptions extends unknown[],
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TRuleVisitor extends Record<string, (...args: any[]) => void>,
>(ruleDefinition: RuleDefinition<TMessageIds, TOptions, TRuleVisitor>) {
	return {
		meta: ruleDefinition.meta,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
		create: (context) => ruleDefinition.create(context as any),
	} satisfies RuleModule;
}
