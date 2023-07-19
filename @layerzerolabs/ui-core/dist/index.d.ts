import { ChainId, ChainStage } from '@layerzerolabs/lz-sdk';
export { getChainStage } from '@layerzerolabs/lz-sdk';
import { ChainKey, ChainType as ChainType$1 } from '@layerzerolabs/lz-definitions';
import { utils, BigNumber, Signer } from 'ethers';

declare enum IconTheme {
    LZ_DARK = "lz-dark",
    LZ_LIGHT = "lz-light",
    STG_LIGHT = "stargate-light"
}
declare function getCurrencyIcon(symbol: string, theme?: IconTheme): string;
declare namespace getCurrencyIcon {
    var defaultTheme: IconTheme;
}
declare function getNetworkIcon(chainIdOrSymbol: ChainId | string, theme?: IconTheme): string;
declare namespace getNetworkIcon {
    var defaultTheme: IconTheme;
}
declare function getWalletIcon(walletType: string, theme?: IconTheme): string;
declare namespace getWalletIcon {
    var defaultTheme: IconTheme;
}
declare function setIconTheme(theme: typeof getCurrencyIcon.defaultTheme): void;

/**
 * Represents an Coin with some metadata.
 */
declare class Coin extends BaseCurrency {
    constructor(chainId: number, decimals: number, symbol: string, name?: string);
    /**
     * Returns true if the two Coins are equivalent, i.e. have the same chainId
     * @param other other currency to compare
     */
    equals(other: Currency): boolean;
    static from(input: {
        chainId: number;
        decimals: number;
        symbol: string;
        name?: string;
    }): Coin;
}

/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
declare class Token extends BaseCurrency {
    /**
     * The contract address on the chain on which this token lives
     */
    readonly address: string;
    constructor(chainId: number, address: string, decimals: number, symbol: string, name?: string);
    static from(input: {
        chainId: number;
        address: string;
        decimals: number;
        symbol: string;
        name?: string;
    }): Token;
    /**
     * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
     * @param other other token to compare
     */
    equals(other: Currency): boolean;
}

type Currency = Token | Coin;

/**
 * A currency is any fungible financial instrument, including all ERC20 tokens
 */
declare abstract class BaseCurrency {
    /**
     * The layerzero chain ID on which this currency resides
     */
    readonly chainId: number;
    /**
     * The decimals used in representing currency amounts
     */
    readonly decimals: number;
    /**
     * The symbol of the currency, i.e. a short textual non-unique identifier
     */
    readonly symbol: string;
    /**
     * The name of the currency, i.e. a descriptive textual non-unique identifier
     */
    readonly name?: string;
    /**
     * Constructs an instance of the base class `BaseCurrency`.
     * @param chainId the chain ID on which this currency resides
     * @param decimals decimals of the currency
     * @param symbol symbol of the currency
     * @param name of the currency
     */
    protected constructor(chainId: number, decimals: number, symbol: string, name?: string);
    /**
     * Returns whether this currency is functionally equivalent to the other currency
     * @param other the other currency
     */
    abstract equals(other: Currency): boolean;
}

declare function isToken(value: unknown): value is Token;
declare function assertToken(value: Currency, errorMessage?: string): asserts value is Token;
declare function isCoin(value: Currency): value is Coin;
declare function isCurrency(value: unknown): value is Currency;

declare function validateAndParseAddress(address: string, chainId: number): string;

interface Network {
    name: string;
    symbol: string;
    chainId: ChainId;
    chainKey: ChainKey;
    chainType: ChainType$1;
    nativeChainId: number;
    nativeCurrency: Currency;
    averageBlockTime: number;
    blockExplorers: BlockExplorer[];
    rpcs: {
        url: string;
        weight?: number;
        timeout?: number;
    }[];
}
type NetworkInfo = {
    chainId: ChainId;
    chainKey: ChainKey;
    chainType: ChainType$1;
    nativeChainId: number;
    name: string;
    symbol: string;
    averageBlockTime: number;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
        address?: string;
    };
    blockExplorers: BlockExplorer[];
    rpcs: {
        url: string;
        weight?: number;
        timeout?: number;
    }[];
};
type BlockExplorer = {
    name: string;
    url: string;
};

declare function toEvmChainId(chainId: ChainId): number;
declare function isSupportedEvmChainId(evmChainId: any): boolean;
declare function fromEvmChainId(evmChainId: number | string, sandbox?: boolean): ChainId;
declare function tryFromEvmChainId(evmChainId: number | string, sandbox?: boolean): ChainId | undefined;

declare enum AptosChainId {
    TESTNET = 2,
    MAINNET = 1
}
declare enum SolanaChainId {
    MAINNET = 1,
    TESTNET = 2
}
declare function fromAptosChainId(aptosChainId: number | string): ChainId | undefined;

declare const NETWORKS: Network[];
declare const isEvmAddress: typeof utils.isAddress;
declare function getNetwork(chainId: ChainId): Network;
declare function tryGetNetwork(chainId?: ChainId): Network | undefined;
declare function getNativeCurrency(chainId: ChainId): Currency;
declare function isNativeCurrency(currency: Currency): boolean;

declare function isChainOnStage(chainId: ChainId, chainStage: ChainStage): boolean;
declare function getBlockLink(chainId: ChainId, blockOrHash: string | number): string;
declare function getAddressLink(chainId: ChainId, address: string): string;
declare function getTransactionLink(chainId: ChainId, hash: string): string;
declare function getScanLink(chainId: ChainId, hash: string): string;
declare function getBlockExplorer(chainId: ChainId): BlockExplorer;
declare function tryGetBlockExplorer(chainId: ChainId): BlockExplorer | undefined;

declare enum ChainType {
    EVM = "EVM",
    APTOS = "APTOS",
    SOLANA = "SOLANA"
}
declare function isChainType(chainId: ChainId, chainType: ChainType): boolean;
declare function getChainType(chainId: ChainId): ChainType;
declare function isEvmChainId(chainId: ChainId): boolean;
declare function isAptosChainId(chainId: ChainId): boolean;
declare function isSolanaChainId(chainId: ChainId): boolean;

declare function toULNv2(chainId: ChainId): ChainId;

type BigintIsh = string | number | bigint;
declare enum Rounding {
    ROUND_DOWN = 0,
    ROUND_HALF_UP = 1,
    ROUND_UP = 2
}
declare const MaxUint256: bigint;

declare class Fraction {
    readonly numerator: bigint;
    readonly denominator: bigint;
    constructor(numerator: BigintIsh, denominator?: BigintIsh);
    private static tryParseFraction;
    get quotient(): bigint;
    get remainder(): Fraction;
    invert(): Fraction;
    add(other: Fraction | BigintIsh): Fraction;
    subtract(other: Fraction | BigintIsh): Fraction;
    lessThan(other: Fraction | BigintIsh): boolean;
    equalTo(other: Fraction | BigintIsh): boolean;
    greaterThan(other: Fraction | BigintIsh): boolean;
    multiply(other: Fraction | BigintIsh): Fraction;
    divide(other: Fraction | BigintIsh): Fraction;
    toSignificant(significantDigits: number, format?: object, rounding?: Rounding): string;
    toFixed(decimalPlaces: number, format?: object, rounding?: Rounding): string;
    /**
     * Helper method for converting any super class back to a fraction
     */
    get asFraction(): Fraction;
}

declare class CurrencyAmount<T extends Currency = Currency> extends Fraction {
    readonly currency: T;
    readonly decimalScale: bigint;
    /**
     * Returns a new currency amount instance from the unitless amount of token, i.e. the raw amount
     * @param currency the currency in the amount
     * @param rawAmount the raw token or ether amount
     */
    static fromRawAmount<T extends Currency>(currency: T, rawAmount: BigintIsh): CurrencyAmount<T>;
    /**
     * Construct a currency amount with a denominator that is not equal to 1
     * @param currency the currency
     * @param numerator the numerator of the fractional token amount
     * @param denominator the denominator of the fractional token amount
     */
    static fromFractionalAmount<T extends Currency>(currency: T, numerator: BigintIsh, denominator: BigintIsh): CurrencyAmount<T>;
    protected constructor(currency: T, numerator: BigintIsh, denominator?: BigintIsh);
    add(other: CurrencyAmount<T>): CurrencyAmount<T>;
    subtract(other: CurrencyAmount<T>): CurrencyAmount<T>;
    multiply(other: Fraction | BigintIsh): CurrencyAmount<T>;
    divide(other: Fraction | BigintIsh): CurrencyAmount<T>;
    toSignificant(significantDigits?: number, format?: object, rounding?: Rounding): string;
    toFixed(decimalPlaces?: number, format?: object, rounding?: Rounding): string;
    toExact(format?: object): string;
}

declare class Percent extends Fraction {
    /**
     * This boolean prevents a fraction from being interpreted as a Percent
     */
    readonly isPercent: true;
    add(other: Fraction | BigintIsh): Percent;
    subtract(other: Fraction | BigintIsh): Percent;
    multiply(other: Fraction | BigintIsh): Percent;
    divide(other: Fraction | BigintIsh): Percent;
    toSignificant(significantDigits?: number, format?: object, rounding?: Rounding): string;
    toFixed(decimalPlaces?: number, format?: object, rounding?: Rounding): string;
}

declare class Price<TBase extends Currency = Currency, TQuote extends Currency = Currency> extends Fraction {
    readonly baseCurrency: TBase;
    readonly quoteCurrency: TQuote;
    readonly scalar: Fraction;
    /**
     * Construct a price, either with the base and quote currency amount, or the
     * @param args
     */
    constructor(...args: [TBase, TQuote, BigintIsh, BigintIsh] | [{
        baseAmount: CurrencyAmount<TBase>;
        quoteAmount: CurrencyAmount<TQuote>;
    }]);
    /**
     * Flip the price, switching the base and quote currency
     */
    invert(): Price<TQuote, TBase>;
    /**
     * Multiply the price by another price, returning a new price. The other price must have the same base currency as this price's quote currency
     * @param other the other price
     */
    multiply<TOtherQuote extends Currency>(other: Price<TQuote, TOtherQuote>): Price<TBase, TOtherQuote>;
    /**
     * Return the amount of quote currency corresponding to a given amount of the base currency
     * @param currencyAmount the amount of base currency to quote against the price
     */
    quote(currencyAmount: CurrencyAmount<TBase>): CurrencyAmount<TQuote>;
    /**
     * Get the value scaled by decimals for formatting
     * @private
     */
    private get adjustedForDecimals();
    toSignificant(significantDigits?: number, format?: object, rounding?: Rounding): string;
    toFixed(decimalPlaces?: number, format?: object, rounding?: Rounding): string;
}

interface FiatAmount {
    value: number;
    currency: string;
}

declare function bpToFraction(bp: BigNumber, decimals?: number): Fraction;

declare function castCurrencyAmountUnsafe(input: CurrencyAmount, dstCurrency: Currency): CurrencyAmount;

declare function formatAmount(amount: FiatAmount | CurrencyAmount): string | undefined;
declare namespace formatAmount {
    var nice: (amount?: FiatAmount | CurrencyAmount<Currency> | undefined) => string | undefined;
}
declare function formatCurrencyAmount(value: CurrencyAmount): string;
declare namespace formatCurrencyAmount {
    var short: (value?: CurrencyAmount<Currency> | undefined, dp?: number) => string;
    var nice: (value?: CurrencyAmount<Currency> | undefined, dp?: number) => string;
}
declare function formatFiatAmount(amount: FiatAmount): string;
declare namespace formatFiatAmount {
    var nice: (amount: FiatAmount | undefined) => string;
    var short: (value: number, currency?: string) => string;
}

declare function parseCurrencyAmount<T extends Currency>(currency: T, value: string): CurrencyAmount<T>;
declare function tryParseCurrencyAmount<T extends Currency>(currency?: T, value?: string): CurrencyAmount<T> | undefined;

declare function parseFraction(value: string, decimals: number): Fraction;
declare function tryParseFraction(value?: string, decimals?: number): Fraction | undefined;

declare function parsePercent(value: string, decimals: number): Percent;
declare function tryParsePercent(value?: string, decimals?: number): Percent | undefined;

declare function sumUnsafe(amounts?: (CurrencyAmount | undefined)[], asCurrency?: Currency): CurrencyAmount<Coin | Token> | undefined;
declare function sumFiat(amounts?: (FiatAmount | undefined)[]): FiatAmount | undefined;

declare function toBigNumber(amount: CurrencyAmount): BigNumber;
declare function toBigInt(amount: CurrencyAmount): bigint;

declare function toCurrencyAmount<T extends Currency>(token: T, value: BigintIsh | BigNumber): CurrencyAmount<T>;

declare function removeDust(amount: CurrencyAmount, sharedDecimals: number): CurrencyAmount<Currency>;

type TransactionResult = {
    txHash: string;
    wait(): Promise<{
        txHash: string;
    }>;
};
type Transaction<Signer> = {
    signAndSubmitTransaction(signer: Signer): Promise<TransactionResult>;
    estimateGas(signer: Signer): Promise<bigint>;
    estimateNative(signer: Signer): Promise<CurrencyAmount>;
};

interface WaitForPromise extends Promise<void> {
    cancel(): void;
}
declare function waitFor(condition: () => boolean | undefined | null, { timeout, interval }: {
    timeout?: number | undefined;
    interval?: number | undefined;
}): WaitForPromise;

declare const DEFAULT_BLOCK_TIME_SECONDS = 15;
declare const DEFAULT_BLOCK_CONFIRMATIONS = 1;
declare const BLOCK_CONFIRMATIONS: Record<ChainId, number>;
/**
 *
 * @param chainId
 * @returns seconds
 */
declare function getBlockTime(chainId: ChainId): number;
declare function getRequiredBlockConfirmations(chainId: ChainId): number;
/**
 *
 * @param chainId
 * @returns seconds
 */
declare function getEstimatedTransactionTime(chainId: ChainId): number;
declare function getDefaultMessageDuration(srcChainId: ChainId, dstChainId: ChainId): number;
declare function timeStamp(): number;
/**
 *
 * @param srcChainId
 * @param dstChainId
 * @param nowTimestamp
 * @returns seconds
 */
declare function getExpectedDate(srcChainId: ChainId, dstChainId?: ChainId, nowTimestamp?: number): number;

declare const tryParseNumber: (value: string) => string | undefined;
declare const parseNumber: (value: string) => string;
declare function escapeRegExp(string: string): string;

declare function convertToPaddedUint8Array(str: string, length: number): Uint8Array;

declare function interpolateString(str: string, variables: Record<string, string | number>): string;

type BalanceProvider = {
    supports(token: Currency): boolean;
    getBalance(token: Currency, address: string): Promise<CurrencyAmount>;
};

type UA = {
    address: string;
    chainId: ChainId;
};
interface UAConfigProvider {
    supports(chainId: ChainId): boolean;
    getInboundBlockConfirmations(ua: UA, srcChainId: ChainId): Promise<number>;
    getOutboundBlockConfirmations(ua: UA, dstChainId: ChainId): Promise<number>;
}

interface DefaultAirdropProvider {
    supports(dstChainId: ChainId): boolean;
    estimateDefaultAirdrop(dstChainId: ChainId): Promise<CurrencyAmount>;
}

type DstConfig = {
    dstNativeAmtCap: CurrencyAmount;
    baseGas: Fraction;
    gasPerByte: Fraction;
};

interface DstPrice {
    dstGasPriceInWei: CurrencyAmount;
    dstPriceRatio: Fraction;
}

interface DstConfigProvider {
    dstPriceLookup(srcChainId: ChainId, dstChainId: ChainId): Promise<DstPrice>;
    dstConfigLookup(srcChainId: ChainId, dstChainId: ChainId): Promise<DstConfig>;
    isApplicable(srcChainId: ChainId): boolean;
}

type AbstractResource = {
    chainId: ChainId;
};
type ResourceProvider<Signer = unknown, Resource extends AbstractResource = AbstractResource> = {
    supports(resource: unknown): resource is Resource;
    register(resource: Resource): Promise<Transaction<Signer>>;
    isRegistered(resource: Resource, address: string): Promise<boolean>;
    getType(resource: Resource): string;
};

declare class ResourceProvider__currency_evm implements ResourceProvider<Signer, Currency> {
    supports(resource: unknown): resource is Currency;
    register(resource: Currency): Promise<Transaction<Signer>>;
    isRegistered(resource: Currency, address: string): Promise<boolean>;
    getType(resource: Currency): string;
}

declare class AdapterParams {
    readonly version: number;
    readonly extraGas: number;
    readonly dstNativeAmount?: CurrencyAmount<Currency> | undefined;
    readonly dstNativeAddress?: string | undefined;
    private constructor();
    static forV1(extraGas?: number): AdapterParams;
    static forV2(input: {
        extraGas?: number;
        dstNativeAmount: CurrencyAmount;
        dstNativeAddress: string;
    }): AdapterParams;
    create(input: {
        extraGas?: number | undefined;
        dstNativeAmount?: CurrencyAmount;
        dstNativeAddress?: string;
    }): AdapterParams;
}

type FeeQuote = {
    zroFee: CurrencyAmount;
    nativeFee: CurrencyAmount;
};

export { AbstractResource, AdapterParams, AptosChainId, BLOCK_CONFIRMATIONS, BalanceProvider, BaseCurrency, BigintIsh, BlockExplorer, ChainType, Coin, Currency, CurrencyAmount, DEFAULT_BLOCK_CONFIRMATIONS, DEFAULT_BLOCK_TIME_SECONDS, DefaultAirdropProvider, DstConfig, DstConfigProvider, DstPrice, FeeQuote, FiatAmount, Fraction, IconTheme, MaxUint256, NETWORKS, Network, NetworkInfo, Percent, Price, ResourceProvider, ResourceProvider__currency_evm, Rounding, SolanaChainId, Token, Transaction, TransactionResult, UA, UAConfigProvider, assertToken, bpToFraction, castCurrencyAmountUnsafe, convertToPaddedUint8Array, escapeRegExp, formatAmount, formatCurrencyAmount, formatFiatAmount, fromAptosChainId, fromEvmChainId, getAddressLink, getBlockExplorer, getBlockLink, getBlockTime, getChainType, getCurrencyIcon, getDefaultMessageDuration, getEstimatedTransactionTime, getExpectedDate, getNativeCurrency, getNetwork, getNetworkIcon, getRequiredBlockConfirmations, getScanLink, getTransactionLink, getWalletIcon, interpolateString, isAptosChainId, isChainOnStage, isChainType, isCoin, isCurrency, isEvmAddress, isEvmChainId, isNativeCurrency, isSolanaChainId, isSupportedEvmChainId, isToken, parseCurrencyAmount, parseFraction, parseNumber, parsePercent, removeDust, setIconTheme, sumFiat, sumUnsafe, timeStamp, toBigInt, toBigNumber, toCurrencyAmount, toEvmChainId, toULNv2, tryFromEvmChainId, tryGetBlockExplorer, tryGetNetwork, tryParseCurrencyAmount, tryParseFraction, tryParseNumber, tryParsePercent, validateAndParseAddress, waitFor };
