import type { ParserServices, ParserServicesWithTypeInformation } from '@typescript-eslint/utils';
import type { TSESLint } from '@typescript-eslint/utils';
import type { RuleMetaData } from '@typescript-eslint/utils/ts-eslint';
export type { RuleContext } from '@typescript-eslint/utils/ts-eslint';

const BASE_URL = 'https://eslint-plugin.skk.moe/src/rules/';

interface Metadata<MessageIDs extends string, PluginDocs = unknown> extends RuleMetaData<MessageIDs, PluginDocs> {
  hidden?: boolean
}

export interface RuleModule<
  TResolvedOptions,
  TOptions extends readonly unknown[],
  TMessageIDs extends string,
  TRuleListener extends TSESLint.RuleListener,
  TMetaDocs = unknown
> {
  readonly name: string,
  readonly meta: Metadata<TMessageIDs, TMetaDocs>,
  resolveOptions?(this: void, ...options: TOptions): TResolvedOptions,
  create(this: void, context: Readonly<TSESLint.RuleContext<TMessageIDs, TOptions>>, options: TResolvedOptions): TRuleListener
}

export interface ExportedRuleModule<
  TOptions extends readonly unknown[] = unknown[],
  TMessageIDs extends string = string,
  TRuleListener extends TSESLint.RuleListener = TSESLint.RuleListener
> {
  readonly name: string,
  readonly meta: Metadata<TMessageIDs>,
  create(context: Readonly<TSESLint.RuleContext<TMessageIDs, TOptions>>): TRuleListener
}
export type { TSESLint } from '@typescript-eslint/utils';

export function createRule<
  TResolvedOptions,
  TOptions extends unknown[],
  TMessageIDs extends string,
  TRuleListener extends TSESLint.RuleListener = TSESLint.RuleListener,
  PluginDocs = { recommended: TSESLint.RuleRecommendation }
>({ name, meta, create, resolveOptions }: RuleModule<TResolvedOptions, TOptions, TMessageIDs, TRuleListener, PluginDocs>): any {
  if (meta.docs) {
    meta.docs.url ??= new URL(name, BASE_URL).toString();
  }
  return {
    name,
    meta,
    create(context) {
      const options = resolveOptions?.(...context.options) ?? (context.options[0] as TResolvedOptions);
      const listener = Object.entries(create(context, options));
      return Object.fromEntries(listener.filter((pair) => pair[1])) as TRuleListener;
    }
  } satisfies ExportedRuleModule<TOptions, TMessageIDs, TRuleListener>;
}

export function ensureParserWithTypeInformation(
  parserServices: Partial<ParserServices> | undefined
): asserts parserServices is ParserServicesWithTypeInformation {
  if (!parserServices?.program) {
    throw new Error('see https://typescript-eslint.io/docs/linting/type-linting');
  }
}
