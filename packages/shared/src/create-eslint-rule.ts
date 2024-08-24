import type { ParserServices, ParserServicesWithTypeInformation } from '@typescript-eslint/utils';
import type { RuleContext, RuleListener, RuleMetaData, RuleRecommendation } from '@typescript-eslint/utils/ts-eslint';

const BASE_URL = 'https://eslint-plugin.skk.moe/src/rules/';

interface Metadata<MessageIDs extends string, PluginDocs = unknown> extends RuleMetaData<MessageIDs, PluginDocs> {
  hidden?: boolean
}

export interface RuleModule<
  TResolvedOptions,
  TOptions extends readonly unknown[],
  TMessageIDs extends string,
  TRuleListener extends RuleListener,
  TMetaDocs = unknown
> {
  readonly name: string,
  readonly meta: Metadata<TMessageIDs, TMetaDocs>,
  resolveOptions?(this: void, ...options: TOptions): TResolvedOptions,
  create(this: void, context: Readonly<RuleContext<TMessageIDs, TOptions>>, options: TResolvedOptions): TRuleListener
}

export interface ExportedRuleModule<
  TOptions extends readonly unknown[] = unknown[],
  TMessageIDs extends string = string,
  TRuleListener extends RuleListener = RuleListener
> {
  readonly name: string,
  readonly meta: Metadata<TMessageIDs>,
  create(context: Readonly<RuleContext<TMessageIDs, TOptions>>): TRuleListener
}
export type { RuleContext } from '@typescript-eslint/utils/ts-eslint';

export function createRule<
  TResolvedOptions,
  TOptions extends unknown[],
  TMessageIDs extends string,
  TRuleListener extends RuleListener = RuleListener,
  PluginDocs = { recommended: RuleRecommendation }
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
