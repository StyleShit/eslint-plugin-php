import type { Node } from 'php-parser';
import {
	type RuleContext,
	type RulesMeta,
	type RuleVisitor,
} from '@eslint/core';

import type { PHPSourceCode } from './language/php-source-code';

declare module 'eslint' {
	export interface RuleDefinition<
		TMessageIds extends string = string,
		TOptions extends unknown[] = [],
		TRuleVisitor extends RuleVisitor = RuleVisitor,
	> {
		meta?: RulesMeta<TMessageIds, TOptions>;

		create(
			context: RuleContext<{
				LangOptions: Record<string, unknown>;
				Code: PHPSourceCode;
				RuleOptions: TOptions;
				Node: Node;
				MessageIds: TMessageIds;
			}>,
		): TRuleVisitor;
	}
}
