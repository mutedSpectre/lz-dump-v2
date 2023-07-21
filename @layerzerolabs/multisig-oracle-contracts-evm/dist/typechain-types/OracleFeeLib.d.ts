import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common";
export interface OracleFeeLibInterface extends utils.Interface {
    functions: {
        "getFee(address,uint16,uint64,uint64,uint128,uint128,uint128)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "getFee"): FunctionFragment;
    encodeFunctionData(functionFragment: "getFee", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    decodeFunctionResult(functionFragment: "getFee", data: BytesLike): Result;
    events: {};
}
export interface OracleFeeLib extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: OracleFeeLibInterface;
    queryFilter<TEvent extends TypedEvent>(event: TypedEventFilter<TEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TEvent>>;
    listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
    listeners(eventName?: string): Array<Listener>;
    removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
    removeAllListeners(eventName?: string): this;
    off: OnEvent<this>;
    on: OnEvent<this>;
    once: OnEvent<this>;
    removeListener: OnEvent<this>;
    functions: {
        getFee(_priceFeed: PromiseOrValue<string>, _dstChainId: PromiseOrValue<BigNumberish>, _baseGas: PromiseOrValue<BigNumberish>, _quorum: PromiseOrValue<BigNumberish>, _defaultMultiplier: PromiseOrValue<BigNumberish>, _multiplier: PromiseOrValue<BigNumberish>, _floorMarginUSD: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
    };
    getFee(_priceFeed: PromiseOrValue<string>, _dstChainId: PromiseOrValue<BigNumberish>, _baseGas: PromiseOrValue<BigNumberish>, _quorum: PromiseOrValue<BigNumberish>, _defaultMultiplier: PromiseOrValue<BigNumberish>, _multiplier: PromiseOrValue<BigNumberish>, _floorMarginUSD: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    callStatic: {
        getFee(_priceFeed: PromiseOrValue<string>, _dstChainId: PromiseOrValue<BigNumberish>, _baseGas: PromiseOrValue<BigNumberish>, _quorum: PromiseOrValue<BigNumberish>, _defaultMultiplier: PromiseOrValue<BigNumberish>, _multiplier: PromiseOrValue<BigNumberish>, _floorMarginUSD: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    filters: {};
    estimateGas: {
        getFee(_priceFeed: PromiseOrValue<string>, _dstChainId: PromiseOrValue<BigNumberish>, _baseGas: PromiseOrValue<BigNumberish>, _quorum: PromiseOrValue<BigNumberish>, _defaultMultiplier: PromiseOrValue<BigNumberish>, _multiplier: PromiseOrValue<BigNumberish>, _floorMarginUSD: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        getFee(_priceFeed: PromiseOrValue<string>, _dstChainId: PromiseOrValue<BigNumberish>, _baseGas: PromiseOrValue<BigNumberish>, _quorum: PromiseOrValue<BigNumberish>, _defaultMultiplier: PromiseOrValue<BigNumberish>, _multiplier: PromiseOrValue<BigNumberish>, _floorMarginUSD: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=OracleFeeLib.d.ts.map