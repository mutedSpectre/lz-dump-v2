import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common";
export declare namespace MultiSigOracle {
    type DstFeeConfigStruct = {
        chainId: PromiseOrValue<BigNumberish>;
        multiplier: PromiseOrValue<BigNumberish>;
        floorMarginUSD: PromiseOrValue<BigNumberish>;
    };
    type DstFeeConfigStructOutput = [number, BigNumber, BigNumber] & {
        chainId: number;
        multiplier: BigNumber;
        floorMarginUSD: BigNumber;
    };
}
export interface MultiSigOracleInterface extends utils.Interface {
    functions: {
        "admins(address)": FunctionFragment;
        "allowlist(address)": FunctionFragment;
        "allowlistSize()": FunctionFragment;
        "assignJob(uint16,uint16,uint64,address)": FunctionFragment;
        "checkPermission(address)": FunctionFragment;
        "denylist(address)": FunctionFragment;
        "dstGasLookup(uint16,uint16)": FunctionFragment;
        "dstPriceLookup(uint16)": FunctionFragment;
        "execute(address,bytes,uint256,bytes)": FunctionFragment;
        "feeConfigUpdaters(address)": FunctionFragment;
        "feeConfigs(uint16)": FunctionFragment;
        "getFee(uint16,uint16,uint64,address)": FunctionFragment;
        "hashCallData(address,bytes,uint256)": FunctionFragment;
        "multiplierBps()": FunctionFragment;
        "oracleFeeLib()": FunctionFragment;
        "priceFeed()": FunctionFragment;
        "quorum()": FunctionFragment;
        "setAdmin(address,bool)": FunctionFragment;
        "setAllowlist(address,bool)": FunctionFragment;
        "setDenylist(address,bool)": FunctionFragment;
        "setDstGas(uint16,uint16,uint64)": FunctionFragment;
        "setFeeConfigUpdater(address,bool)": FunctionFragment;
        "setFeeConfigs((uint16,uint128,uint128)[])": FunctionFragment;
        "setOracleFeeLib(address)": FunctionFragment;
        "setPriceFeed(address)": FunctionFragment;
        "setPriceMultiplierBps(uint128)": FunctionFragment;
        "setQuorum(uint64)": FunctionFragment;
        "setSigner(address,bool)": FunctionFragment;
        "setUln(address,bool)": FunctionFragment;
        "signerSize()": FunctionFragment;
        "signers(address)": FunctionFragment;
        "ulns(address)": FunctionFragment;
        "usedHashes(bytes32)": FunctionFragment;
        "verifySignatures(bytes32,bytes)": FunctionFragment;
        "withdrawFee(address,uint256)": FunctionFragment;
        "withdrawFeeFromUlnV2Like(address,address,uint256)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "admins" | "allowlist" | "allowlistSize" | "assignJob" | "checkPermission" | "denylist" | "dstGasLookup" | "dstPriceLookup" | "execute" | "feeConfigUpdaters" | "feeConfigs" | "getFee" | "hashCallData" | "multiplierBps" | "oracleFeeLib" | "priceFeed" | "quorum" | "setAdmin" | "setAllowlist" | "setDenylist" | "setDstGas" | "setFeeConfigUpdater" | "setFeeConfigs" | "setOracleFeeLib" | "setPriceFeed" | "setPriceMultiplierBps" | "setQuorum" | "setSigner" | "setUln" | "signerSize" | "signers" | "ulns" | "usedHashes" | "verifySignatures" | "withdrawFee" | "withdrawFeeFromUlnV2Like"): FunctionFragment;
    encodeFunctionData(functionFragment: "admins", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "allowlist", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "allowlistSize", values?: undefined): string;
    encodeFunctionData(functionFragment: "assignJob", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "checkPermission", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "denylist", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "dstGasLookup", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "dstPriceLookup", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "execute", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "feeConfigUpdaters", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "feeConfigs", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getFee", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "hashCallData", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "multiplierBps", values?: undefined): string;
    encodeFunctionData(functionFragment: "oracleFeeLib", values?: undefined): string;
    encodeFunctionData(functionFragment: "priceFeed", values?: undefined): string;
    encodeFunctionData(functionFragment: "quorum", values?: undefined): string;
    encodeFunctionData(functionFragment: "setAdmin", values: [PromiseOrValue<string>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "setAllowlist", values: [PromiseOrValue<string>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "setDenylist", values: [PromiseOrValue<string>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "setDstGas", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "setFeeConfigUpdater", values: [PromiseOrValue<string>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "setFeeConfigs", values: [MultiSigOracle.DstFeeConfigStruct[]]): string;
    encodeFunctionData(functionFragment: "setOracleFeeLib", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "setPriceFeed", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "setPriceMultiplierBps", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setQuorum", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setSigner", values: [PromiseOrValue<string>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "setUln", values: [PromiseOrValue<string>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "signerSize", values?: undefined): string;
    encodeFunctionData(functionFragment: "signers", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "ulns", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "usedHashes", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "verifySignatures", values: [PromiseOrValue<BytesLike>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "withdrawFee", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "withdrawFeeFromUlnV2Like", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>
    ]): string;
    decodeFunctionResult(functionFragment: "admins", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "allowlist", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "allowlistSize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "assignJob", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "checkPermission", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "denylist", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "dstGasLookup", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "dstPriceLookup", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "execute", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "feeConfigUpdaters", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "feeConfigs", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hashCallData", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "multiplierBps", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "oracleFeeLib", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "priceFeed", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "quorum", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setAdmin", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setAllowlist", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setDenylist", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setDstGas", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setFeeConfigUpdater", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setFeeConfigs", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setOracleFeeLib", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPriceFeed", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPriceMultiplierBps", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setQuorum", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setSigner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setUln", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "signerSize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "signers", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "ulns", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "usedHashes", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "verifySignatures", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdrawFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdrawFeeFromUlnV2Like", data: BytesLike): Result;
    events: {
        "AssignJob(uint16,uint16,uint256,address,uint256)": EventFragment;
        "Execute(address,bytes32,bool,bytes)": EventFragment;
        "SetDstGas(uint16,uint16,uint64)": EventFragment;
        "SetFeeConfigUpdater(address,bool)": EventFragment;
        "SetUln(address,bool)": EventFragment;
        "UpdateAdmin(address,bool)": EventFragment;
        "UpdateAllowlist(address,bool)": EventFragment;
        "UpdateDenylist(address,bool)": EventFragment;
        "UpdateOracleFeeLib(address)": EventFragment;
        "UpdatePriceFeed(address)": EventFragment;
        "UpdatePriceMultiplierBps(uint128)": EventFragment;
        "UpdateQuorum(uint64)": EventFragment;
        "UpdateSigner(address,bool)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "AssignJob"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Execute"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "SetDstGas"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "SetFeeConfigUpdater"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "SetUln"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "UpdateAdmin"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "UpdateAllowlist"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "UpdateDenylist"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "UpdateOracleFeeLib"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "UpdatePriceFeed"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "UpdatePriceMultiplierBps"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "UpdateQuorum"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "UpdateSigner"): EventFragment;
}
export interface AssignJobEventObject {
    _dstChainId: number;
    _outboundProofType: number;
    _outboundBlockConfirmations: BigNumber;
    _userApplication: string;
    _fee: BigNumber;
}
export type AssignJobEvent = TypedEvent<[
    number,
    number,
    BigNumber,
    string,
    BigNumber
], AssignJobEventObject>;
export type AssignJobEventFilter = TypedEventFilter<AssignJobEvent>;
export interface ExecuteEventObject {
    _target: string;
    _callDataHash: string;
    _success: boolean;
    _data: string;
}
export type ExecuteEvent = TypedEvent<[
    string,
    string,
    boolean,
    string
], ExecuteEventObject>;
export type ExecuteEventFilter = TypedEventFilter<ExecuteEvent>;
export interface SetDstGasEventObject {
    _dstChainId: number;
    _outboundProofType: number;
    _gas: BigNumber;
}
export type SetDstGasEvent = TypedEvent<[
    number,
    number,
    BigNumber
], SetDstGasEventObject>;
export type SetDstGasEventFilter = TypedEventFilter<SetDstGasEvent>;
export interface SetFeeConfigUpdaterEventObject {
    feeConfigUpdater: string;
    allow: boolean;
}
export type SetFeeConfigUpdaterEvent = TypedEvent<[
    string,
    boolean
], SetFeeConfigUpdaterEventObject>;
export type SetFeeConfigUpdaterEventFilter = TypedEventFilter<SetFeeConfigUpdaterEvent>;
export interface SetUlnEventObject {
    _addr: string;
    _active: boolean;
}
export type SetUlnEvent = TypedEvent<[string, boolean], SetUlnEventObject>;
export type SetUlnEventFilter = TypedEventFilter<SetUlnEvent>;
export interface UpdateAdminEventObject {
    _addr: string;
    _active: boolean;
}
export type UpdateAdminEvent = TypedEvent<[
    string,
    boolean
], UpdateAdminEventObject>;
export type UpdateAdminEventFilter = TypedEventFilter<UpdateAdminEvent>;
export interface UpdateAllowlistEventObject {
    _addr: string;
    _active: boolean;
}
export type UpdateAllowlistEvent = TypedEvent<[
    string,
    boolean
], UpdateAllowlistEventObject>;
export type UpdateAllowlistEventFilter = TypedEventFilter<UpdateAllowlistEvent>;
export interface UpdateDenylistEventObject {
    _addr: string;
    _active: boolean;
}
export type UpdateDenylistEvent = TypedEvent<[
    string,
    boolean
], UpdateDenylistEventObject>;
export type UpdateDenylistEventFilter = TypedEventFilter<UpdateDenylistEvent>;
export interface UpdateOracleFeeLibEventObject {
    _oracleFeeLib: string;
}
export type UpdateOracleFeeLibEvent = TypedEvent<[
    string
], UpdateOracleFeeLibEventObject>;
export type UpdateOracleFeeLibEventFilter = TypedEventFilter<UpdateOracleFeeLibEvent>;
export interface UpdatePriceFeedEventObject {
    _priceFeed: string;
}
export type UpdatePriceFeedEvent = TypedEvent<[
    string
], UpdatePriceFeedEventObject>;
export type UpdatePriceFeedEventFilter = TypedEventFilter<UpdatePriceFeedEvent>;
export interface UpdatePriceMultiplierBpsEventObject {
    _multiplierBps: BigNumber;
}
export type UpdatePriceMultiplierBpsEvent = TypedEvent<[
    BigNumber
], UpdatePriceMultiplierBpsEventObject>;
export type UpdatePriceMultiplierBpsEventFilter = TypedEventFilter<UpdatePriceMultiplierBpsEvent>;
export interface UpdateQuorumEventObject {
    _quorum: BigNumber;
}
export type UpdateQuorumEvent = TypedEvent<[
    BigNumber
], UpdateQuorumEventObject>;
export type UpdateQuorumEventFilter = TypedEventFilter<UpdateQuorumEvent>;
export interface UpdateSignerEventObject {
    _signer: string;
    _active: boolean;
}
export type UpdateSignerEvent = TypedEvent<[
    string,
    boolean
], UpdateSignerEventObject>;
export type UpdateSignerEventFilter = TypedEventFilter<UpdateSignerEvent>;
export interface MultiSigOracle extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: MultiSigOracleInterface;
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
        admins(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        allowlist(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        allowlistSize(overrides?: CallOverrides): Promise<[BigNumber]>;
        assignJob(_dstChainId: PromiseOrValue<BigNumberish>, _outboundProofType: PromiseOrValue<BigNumberish>, _outboundBlockConfirmation: PromiseOrValue<BigNumberish>, _userApplication: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        checkPermission(_address: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        denylist(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        dstGasLookup(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        dstPriceLookup(_dstChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber
        ] & {
            dstPriceRatio: BigNumber;
            dstGasPriceInWei: BigNumber;
        }>;
        execute(_target: PromiseOrValue<string>, _callData: PromiseOrValue<BytesLike>, _expiration: PromiseOrValue<BigNumberish>, _signatures: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        feeConfigUpdaters(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        feeConfigs(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber
        ] & {
            multiplier: BigNumber;
            floorMarginUSD: BigNumber;
        }>;
        getFee(_dstChainId: PromiseOrValue<BigNumberish>, _outboundProofType: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<BigNumberish>, _userApplication: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        hashCallData(_target: PromiseOrValue<string>, _callData: PromiseOrValue<BytesLike>, _expiration: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        multiplierBps(overrides?: CallOverrides): Promise<[BigNumber]>;
        oracleFeeLib(overrides?: CallOverrides): Promise<[string]>;
        priceFeed(overrides?: CallOverrides): Promise<[string]>;
        quorum(overrides?: CallOverrides): Promise<[BigNumber]>;
        setAdmin(_admin: PromiseOrValue<string>, _active: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setAllowlist(_userApplication: PromiseOrValue<string>, _allowed: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setDenylist(_userApplication: PromiseOrValue<string>, _denied: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setDstGas(_dstChainId: PromiseOrValue<BigNumberish>, _proofType: PromiseOrValue<BigNumberish>, _gas: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setFeeConfigUpdater(_feeConfigUpdater: PromiseOrValue<string>, _allow: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setFeeConfigs(_feeConfigs: MultiSigOracle.DstFeeConfigStruct[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setOracleFeeLib(_oracleFeeLib: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPriceFeed(_priceFeed: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPriceMultiplierBps(_multiplierBps: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setQuorum(_quorum: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setSigner(_signer: PromiseOrValue<string>, _active: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setUln(_uln: PromiseOrValue<string>, _active: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        signerSize(overrides?: CallOverrides): Promise<[BigNumber]>;
        signers(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        ulns(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        usedHashes(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
        verifySignatures(_hash: PromiseOrValue<BytesLike>, _signatures: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[void]>;
        withdrawFee(_to: PromiseOrValue<string>, _amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[void]>;
        withdrawFeeFromUlnV2Like(_uln: PromiseOrValue<string>, _to: PromiseOrValue<string>, _amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    admins(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    allowlist(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    allowlistSize(overrides?: CallOverrides): Promise<BigNumber>;
    assignJob(_dstChainId: PromiseOrValue<BigNumberish>, _outboundProofType: PromiseOrValue<BigNumberish>, _outboundBlockConfirmation: PromiseOrValue<BigNumberish>, _userApplication: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    checkPermission(_address: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    denylist(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    dstGasLookup(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    dstPriceLookup(_dstChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
        BigNumber,
        BigNumber
    ] & {
        dstPriceRatio: BigNumber;
        dstGasPriceInWei: BigNumber;
    }>;
    execute(_target: PromiseOrValue<string>, _callData: PromiseOrValue<BytesLike>, _expiration: PromiseOrValue<BigNumberish>, _signatures: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    feeConfigUpdaters(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    feeConfigs(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
        BigNumber,
        BigNumber
    ] & {
        multiplier: BigNumber;
        floorMarginUSD: BigNumber;
    }>;
    getFee(_dstChainId: PromiseOrValue<BigNumberish>, _outboundProofType: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<BigNumberish>, _userApplication: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    hashCallData(_target: PromiseOrValue<string>, _callData: PromiseOrValue<BytesLike>, _expiration: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    multiplierBps(overrides?: CallOverrides): Promise<BigNumber>;
    oracleFeeLib(overrides?: CallOverrides): Promise<string>;
    priceFeed(overrides?: CallOverrides): Promise<string>;
    quorum(overrides?: CallOverrides): Promise<BigNumber>;
    setAdmin(_admin: PromiseOrValue<string>, _active: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setAllowlist(_userApplication: PromiseOrValue<string>, _allowed: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setDenylist(_userApplication: PromiseOrValue<string>, _denied: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setDstGas(_dstChainId: PromiseOrValue<BigNumberish>, _proofType: PromiseOrValue<BigNumberish>, _gas: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setFeeConfigUpdater(_feeConfigUpdater: PromiseOrValue<string>, _allow: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setFeeConfigs(_feeConfigs: MultiSigOracle.DstFeeConfigStruct[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setOracleFeeLib(_oracleFeeLib: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPriceFeed(_priceFeed: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPriceMultiplierBps(_multiplierBps: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setQuorum(_quorum: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setSigner(_signer: PromiseOrValue<string>, _active: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setUln(_uln: PromiseOrValue<string>, _active: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    signerSize(overrides?: CallOverrides): Promise<BigNumber>;
    signers(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    ulns(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    usedHashes(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    verifySignatures(_hash: PromiseOrValue<BytesLike>, _signatures: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
    withdrawFee(_to: PromiseOrValue<string>, _amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
    withdrawFeeFromUlnV2Like(_uln: PromiseOrValue<string>, _to: PromiseOrValue<string>, _amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        admins(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        allowlist(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        allowlistSize(overrides?: CallOverrides): Promise<BigNumber>;
        assignJob(_dstChainId: PromiseOrValue<BigNumberish>, _outboundProofType: PromiseOrValue<BigNumberish>, _outboundBlockConfirmation: PromiseOrValue<BigNumberish>, _userApplication: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        checkPermission(_address: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        denylist(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        dstGasLookup(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        dstPriceLookup(_dstChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber
        ] & {
            dstPriceRatio: BigNumber;
            dstGasPriceInWei: BigNumber;
        }>;
        execute(_target: PromiseOrValue<string>, _callData: PromiseOrValue<BytesLike>, _expiration: PromiseOrValue<BigNumberish>, _signatures: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        feeConfigUpdaters(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        feeConfigs(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber
        ] & {
            multiplier: BigNumber;
            floorMarginUSD: BigNumber;
        }>;
        getFee(_dstChainId: PromiseOrValue<BigNumberish>, _outboundProofType: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<BigNumberish>, _userApplication: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        hashCallData(_target: PromiseOrValue<string>, _callData: PromiseOrValue<BytesLike>, _expiration: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        multiplierBps(overrides?: CallOverrides): Promise<BigNumber>;
        oracleFeeLib(overrides?: CallOverrides): Promise<string>;
        priceFeed(overrides?: CallOverrides): Promise<string>;
        quorum(overrides?: CallOverrides): Promise<BigNumber>;
        setAdmin(_admin: PromiseOrValue<string>, _active: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        setAllowlist(_userApplication: PromiseOrValue<string>, _allowed: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        setDenylist(_userApplication: PromiseOrValue<string>, _denied: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        setDstGas(_dstChainId: PromiseOrValue<BigNumberish>, _proofType: PromiseOrValue<BigNumberish>, _gas: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setFeeConfigUpdater(_feeConfigUpdater: PromiseOrValue<string>, _allow: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        setFeeConfigs(_feeConfigs: MultiSigOracle.DstFeeConfigStruct[], overrides?: CallOverrides): Promise<void>;
        setOracleFeeLib(_oracleFeeLib: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setPriceFeed(_priceFeed: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setPriceMultiplierBps(_multiplierBps: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setQuorum(_quorum: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setSigner(_signer: PromiseOrValue<string>, _active: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        setUln(_uln: PromiseOrValue<string>, _active: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        signerSize(overrides?: CallOverrides): Promise<BigNumber>;
        signers(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        ulns(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        usedHashes(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        verifySignatures(_hash: PromiseOrValue<BytesLike>, _signatures: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        withdrawFee(_to: PromiseOrValue<string>, _amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        withdrawFeeFromUlnV2Like(_uln: PromiseOrValue<string>, _to: PromiseOrValue<string>, _amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "AssignJob(uint16,uint16,uint256,address,uint256)"(_dstChainId?: null, _outboundProofType?: null, _outboundBlockConfirmations?: null, _userApplication?: null, _fee?: null): AssignJobEventFilter;
        AssignJob(_dstChainId?: null, _outboundProofType?: null, _outboundBlockConfirmations?: null, _userApplication?: null, _fee?: null): AssignJobEventFilter;
        "Execute(address,bytes32,bool,bytes)"(_target?: null, _callDataHash?: null, _success?: null, _data?: null): ExecuteEventFilter;
        Execute(_target?: null, _callDataHash?: null, _success?: null, _data?: null): ExecuteEventFilter;
        "SetDstGas(uint16,uint16,uint64)"(_dstChainId?: null, _outboundProofType?: null, _gas?: null): SetDstGasEventFilter;
        SetDstGas(_dstChainId?: null, _outboundProofType?: null, _gas?: null): SetDstGasEventFilter;
        "SetFeeConfigUpdater(address,bool)"(feeConfigUpdater?: null, allow?: null): SetFeeConfigUpdaterEventFilter;
        SetFeeConfigUpdater(feeConfigUpdater?: null, allow?: null): SetFeeConfigUpdaterEventFilter;
        "SetUln(address,bool)"(_addr?: null, _active?: null): SetUlnEventFilter;
        SetUln(_addr?: null, _active?: null): SetUlnEventFilter;
        "UpdateAdmin(address,bool)"(_addr?: null, _active?: null): UpdateAdminEventFilter;
        UpdateAdmin(_addr?: null, _active?: null): UpdateAdminEventFilter;
        "UpdateAllowlist(address,bool)"(_addr?: null, _active?: null): UpdateAllowlistEventFilter;
        UpdateAllowlist(_addr?: null, _active?: null): UpdateAllowlistEventFilter;
        "UpdateDenylist(address,bool)"(_addr?: null, _active?: null): UpdateDenylistEventFilter;
        UpdateDenylist(_addr?: null, _active?: null): UpdateDenylistEventFilter;
        "UpdateOracleFeeLib(address)"(_oracleFeeLib?: null): UpdateOracleFeeLibEventFilter;
        UpdateOracleFeeLib(_oracleFeeLib?: null): UpdateOracleFeeLibEventFilter;
        "UpdatePriceFeed(address)"(_priceFeed?: null): UpdatePriceFeedEventFilter;
        UpdatePriceFeed(_priceFeed?: null): UpdatePriceFeedEventFilter;
        "UpdatePriceMultiplierBps(uint128)"(_multiplierBps?: null): UpdatePriceMultiplierBpsEventFilter;
        UpdatePriceMultiplierBps(_multiplierBps?: null): UpdatePriceMultiplierBpsEventFilter;
        "UpdateQuorum(uint64)"(_quorum?: null): UpdateQuorumEventFilter;
        UpdateQuorum(_quorum?: null): UpdateQuorumEventFilter;
        "UpdateSigner(address,bool)"(_signer?: null, _active?: null): UpdateSignerEventFilter;
        UpdateSigner(_signer?: null, _active?: null): UpdateSignerEventFilter;
    };
    estimateGas: {
        admins(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        allowlist(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        allowlistSize(overrides?: CallOverrides): Promise<BigNumber>;
        assignJob(_dstChainId: PromiseOrValue<BigNumberish>, _outboundProofType: PromiseOrValue<BigNumberish>, _outboundBlockConfirmation: PromiseOrValue<BigNumberish>, _userApplication: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        checkPermission(_address: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        denylist(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        dstGasLookup(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        dstPriceLookup(_dstChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        execute(_target: PromiseOrValue<string>, _callData: PromiseOrValue<BytesLike>, _expiration: PromiseOrValue<BigNumberish>, _signatures: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        feeConfigUpdaters(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        feeConfigs(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getFee(_dstChainId: PromiseOrValue<BigNumberish>, _outboundProofType: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<BigNumberish>, _userApplication: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        hashCallData(_target: PromiseOrValue<string>, _callData: PromiseOrValue<BytesLike>, _expiration: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        multiplierBps(overrides?: CallOverrides): Promise<BigNumber>;
        oracleFeeLib(overrides?: CallOverrides): Promise<BigNumber>;
        priceFeed(overrides?: CallOverrides): Promise<BigNumber>;
        quorum(overrides?: CallOverrides): Promise<BigNumber>;
        setAdmin(_admin: PromiseOrValue<string>, _active: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setAllowlist(_userApplication: PromiseOrValue<string>, _allowed: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setDenylist(_userApplication: PromiseOrValue<string>, _denied: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setDstGas(_dstChainId: PromiseOrValue<BigNumberish>, _proofType: PromiseOrValue<BigNumberish>, _gas: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setFeeConfigUpdater(_feeConfigUpdater: PromiseOrValue<string>, _allow: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setFeeConfigs(_feeConfigs: MultiSigOracle.DstFeeConfigStruct[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setOracleFeeLib(_oracleFeeLib: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPriceFeed(_priceFeed: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPriceMultiplierBps(_multiplierBps: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setQuorum(_quorum: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setSigner(_signer: PromiseOrValue<string>, _active: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setUln(_uln: PromiseOrValue<string>, _active: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        signerSize(overrides?: CallOverrides): Promise<BigNumber>;
        signers(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        ulns(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        usedHashes(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        verifySignatures(_hash: PromiseOrValue<BytesLike>, _signatures: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        withdrawFee(_to: PromiseOrValue<string>, _amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        withdrawFeeFromUlnV2Like(_uln: PromiseOrValue<string>, _to: PromiseOrValue<string>, _amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        admins(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        allowlist(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        allowlistSize(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        assignJob(_dstChainId: PromiseOrValue<BigNumberish>, _outboundProofType: PromiseOrValue<BigNumberish>, _outboundBlockConfirmation: PromiseOrValue<BigNumberish>, _userApplication: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        checkPermission(_address: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        denylist(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        dstGasLookup(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        dstPriceLookup(_dstChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        execute(_target: PromiseOrValue<string>, _callData: PromiseOrValue<BytesLike>, _expiration: PromiseOrValue<BigNumberish>, _signatures: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        feeConfigUpdaters(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        feeConfigs(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getFee(_dstChainId: PromiseOrValue<BigNumberish>, _outboundProofType: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<BigNumberish>, _userApplication: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        hashCallData(_target: PromiseOrValue<string>, _callData: PromiseOrValue<BytesLike>, _expiration: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        multiplierBps(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        oracleFeeLib(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        priceFeed(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        quorum(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        setAdmin(_admin: PromiseOrValue<string>, _active: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setAllowlist(_userApplication: PromiseOrValue<string>, _allowed: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setDenylist(_userApplication: PromiseOrValue<string>, _denied: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setDstGas(_dstChainId: PromiseOrValue<BigNumberish>, _proofType: PromiseOrValue<BigNumberish>, _gas: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setFeeConfigUpdater(_feeConfigUpdater: PromiseOrValue<string>, _allow: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setFeeConfigs(_feeConfigs: MultiSigOracle.DstFeeConfigStruct[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setOracleFeeLib(_oracleFeeLib: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPriceFeed(_priceFeed: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPriceMultiplierBps(_multiplierBps: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setQuorum(_quorum: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setSigner(_signer: PromiseOrValue<string>, _active: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setUln(_uln: PromiseOrValue<string>, _active: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        signerSize(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        signers(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        ulns(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        usedHashes(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        verifySignatures(_hash: PromiseOrValue<BytesLike>, _signatures: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        withdrawFee(_to: PromiseOrValue<string>, _amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        withdrawFeeFromUlnV2Like(_uln: PromiseOrValue<string>, _to: PromiseOrValue<string>, _amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=MultiSigOracle.d.ts.map