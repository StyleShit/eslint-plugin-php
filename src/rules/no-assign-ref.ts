import type { Bin } from 'php-parser';
import { createRule } from '../utils/create-rule';

type MessageIds = 'noAssignRef';
type Options = [];

export const noAssignRef = createRule<MessageIds, Options>({
    meta: {
        type: 'suggestion',
        fixable: 'code',
        docs: {
            description: 'Disallow assigning by reference',
        },
        messages: {
            noAssignRef:
                "Assigning by reference is not allowed.",
        },
        schema: [],
    },

    create(context) {
        return {
            "assignref"(_node) {
                // TODO: Fix the types.
                const node = _node as Bin;

                context.report({
                    node,
                    messageId: 'noAssignRef',
                    fix(fixer) {
                        const nodeText = context.sourceCode.getText(node);

                        return fixer.replaceText(
                            node,
                            nodeText.replace(/&/g, ''),
                        );
                    },
                });
            },
        };
    },
});
