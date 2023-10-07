import { createRule } from '../../../../../lib/create-eslint-rule';
export default createRule({
  name: 'import-dedupe',
  meta: {
    type: 'problem',
    docs: {
      description: 'Fix duplication in imports'
    },
    fixable: 'code',
    schema: [],
    messages: {
      'import-dedupe': 'Expect no duplication in imports'
    }
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.specifiers.length <= 1) { return; }

        const names = new Set<string>();
        node.specifiers.forEach((n) => {
          const id = n.local.name;
          if (names.has(id)) {
            context.report({
              node,
              loc: {
                start: n.loc.end,
                end: n.loc.start
              },
              messageId: 'import-dedupe',
              fix(fixer) {
                const s = n.range[0];
                let e = n.range[1];
                if (context.getSourceCode().text[e] === ',') { e += 1; }
                return fixer.removeRange([s, e]);
              }
            });
          }
          names.add(id);
        });
      }
    };
  }
});
