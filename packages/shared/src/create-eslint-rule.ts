import type { ParserServices, ParserServicesWithTypeInformation } from '@typescript-eslint/utils';
import type { RuleMetaData, RuleRecommendation, RuleContext, RuleListener } from '@typescript-eslint/utils/ts-eslint';

export type { RuleContext };

const BASE_URL = 'https://eslint-plugin.skk.moe/src/rules/';

interface Metadata<
  MessageIDs extends string, PluginDocs = unknown> extends RuleMetaData<MessageIDs, PluginDocs & { recommended?: RuleRecommendation }> {
  hidden?: boolean
}

export interface RuleModule<
  TResolvedOptions,
  TOptions extends readonly unknown[],
  TMessageIDs extends string,
  TMetaDocs = unknown
> {
  readonly name: string,
  readonly meta: Metadata<TMessageIDs, TMetaDocs>,
  resolveOptions?(this: void, ...options: TOptions): TResolvedOptions,
  create(this: void, context: Readonly<RuleContext<TMessageIDs, TOptions>>, options: TResolvedOptions): RuleListener
}

export interface ExportedRuleModule<
  TOptions extends readonly unknown[] = unknown[],
  TMessageIDs extends string = string
> {
  readonly name: string,
  readonly meta: Metadata<TMessageIDs>,
  create(context: Readonly<RuleContext<TMessageIDs, TOptions>>): RuleListener
}

export function createRule<
  TResolvedOptions,
  TOptions extends unknown[],
  TMessageIDs extends string,
  PluginDocs = unknown
>({ name, meta, create, resolveOptions }: RuleModule<TResolvedOptions, TOptions, TMessageIDs, PluginDocs>): ExportedRuleModule<TOptions, TMessageIDs> {
  if (meta.docs) {
    meta.docs.url ??= new URL(name, BASE_URL).href;
  }
  return {
    name,
    meta,
    create(context) {
      const options = resolveOptions?.(...context.options) ?? (context.options[0] as TResolvedOptions);

      const listener: RuleListener = {};

      const rawListener = create(context, options);

      for (const key in rawListener) {
        if (Object.hasOwn(rawListener, key)) {
          const value = rawListener[key];
          if (value) {
            listener[key] = value;
          }
        }
      }

      return listener;
    }
  };
}

export function isParserWithTypeInformation(
  parserServices: Partial<ParserServices> | undefined
): parserServices is ParserServicesWithTypeInformation {
  return !!parserServices?.program;
}

export function ensureParserWithTypeInformation(
  parserServices: Partial<ParserServices> | undefined
): asserts parserServices is ParserServicesWithTypeInformation {
  if (!parserServices?.program) {
    throw new Error('see https://typescript-eslint.io/docs/linting/type-linting');
  }
}
