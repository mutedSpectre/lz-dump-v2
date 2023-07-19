import { Event, EventFilter, BaseContract, Signer, BigNumberish, BytesLike, CallOverrides, BigNumber, Overrides, ContractTransaction, PayableOverrides, PopulatedTransaction, utils, ContractFactory } from 'ethers';
import { FunctionFragment, Result, EventFragment } from '@ethersproject/abi';
import { Listener, Provider, TransactionRequest } from '@ethersproject/providers';

interface TypedEvent<TArgsArray extends Array<any> = any, TArgsObject = any> extends Event {
    args: TArgsArray & TArgsObject;
}
interface TypedEventFilter<_TEvent extends TypedEvent> extends EventFilter {
}
interface TypedListener<TEvent extends TypedEvent> {
    (...listenerArg: [...__TypechainArgsArray<TEvent>, TEvent]): void;
}
type __TypechainArgsArray<T> = T extends TypedEvent<infer U> ? U : never;
interface OnEvent<TRes> {
    <TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>, listener: TypedListener<TEvent>): TRes;
    (eventName: string, listener: Listener): TRes;
}
type PromiseOrValue<T> = T | Promise<T>;

interface ILayerZeroEndpointInterface extends utils.Interface {
    functions: {
        "estimateFees(uint16,address,bytes,bool,bytes)": FunctionFragment;
        "forceResumeReceive(uint16,bytes)": FunctionFragment;
        "getChainId()": FunctionFragment;
        "getConfig(uint16,uint16,address,uint256)": FunctionFragment;
        "getInboundNonce(uint16,bytes)": FunctionFragment;
        "getOutboundNonce(uint16,address)": FunctionFragment;
        "getReceiveLibraryAddress(address)": FunctionFragment;
        "getReceiveVersion(address)": FunctionFragment;
        "getSendLibraryAddress(address)": FunctionFragment;
        "getSendVersion(address)": FunctionFragment;
        "hasStoredPayload(uint16,bytes)": FunctionFragment;
        "isReceivingPayload()": FunctionFragment;
        "isSendingPayload()": FunctionFragment;
        "receivePayload(uint16,bytes,address,uint64,uint256,bytes)": FunctionFragment;
        "retryPayload(uint16,bytes,bytes)": FunctionFragment;
        "send(uint16,bytes,bytes,address,address,bytes)": FunctionFragment;
        "setConfig(uint16,uint16,uint256,bytes)": FunctionFragment;
        "setReceiveVersion(uint16)": FunctionFragment;
        "setSendVersion(uint16)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "estimateFees" | "forceResumeReceive" | "getChainId" | "getConfig" | "getInboundNonce" | "getOutboundNonce" | "getReceiveLibraryAddress" | "getReceiveVersion" | "getSendLibraryAddress" | "getSendVersion" | "hasStoredPayload" | "isReceivingPayload" | "isSendingPayload" | "receivePayload" | "retryPayload" | "send" | "setConfig" | "setReceiveVersion" | "setSendVersion"): FunctionFragment;
    encodeFunctionData(functionFragment: "estimateFees", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<boolean>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "forceResumeReceive", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "getChainId", values?: undefined): string;
    encodeFunctionData(functionFragment: "getConfig", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "getInboundNonce", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "getOutboundNonce", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getReceiveLibraryAddress", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getReceiveVersion", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getSendLibraryAddress", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getSendVersion", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "hasStoredPayload", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "isReceivingPayload", values?: undefined): string;
    encodeFunctionData(functionFragment: "isSendingPayload", values?: undefined): string;
    encodeFunctionData(functionFragment: "receivePayload", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "retryPayload", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "send", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "setConfig", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "setReceiveVersion", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setSendVersion", values: [PromiseOrValue<BigNumberish>]): string;
    decodeFunctionResult(functionFragment: "estimateFees", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "forceResumeReceive", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getConfig", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getInboundNonce", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getOutboundNonce", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getReceiveLibraryAddress", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getReceiveVersion", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSendLibraryAddress", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSendVersion", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hasStoredPayload", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isReceivingPayload", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isSendingPayload", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "receivePayload", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "retryPayload", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "send", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setConfig", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setReceiveVersion", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setSendVersion", data: BytesLike): Result;
    events: {};
}
interface ILayerZeroEndpoint extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: ILayerZeroEndpointInterface;
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
        estimateFees(_dstChainId: PromiseOrValue<BigNumberish>, _userApplication: PromiseOrValue<string>, _payload: PromiseOrValue<BytesLike>, _payInZRO: PromiseOrValue<boolean>, _adapterParam: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber
        ] & {
            nativeFee: BigNumber;
            zroFee: BigNumber;
        }>;
        forceResumeReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getChainId(overrides?: CallOverrides): Promise<[number]>;
        getConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, _userApplication: PromiseOrValue<string>, _configType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        getInboundNonce(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[BigNumber]>;
        getOutboundNonce(_dstChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        getReceiveLibraryAddress(_userApplication: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[string]>;
        getReceiveVersion(_userApplication: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[number]>;
        getSendLibraryAddress(_userApplication: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[string]>;
        getSendVersion(_userApplication: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[number]>;
        hasStoredPayload(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
        isReceivingPayload(overrides?: CallOverrides): Promise<[boolean]>;
        isSendingPayload(overrides?: CallOverrides): Promise<[boolean]>;
        receivePayload(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _dstAddress: PromiseOrValue<string>, _nonce: PromiseOrValue<BigNumberish>, _gasLimit: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        retryPayload(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        send(_dstChainId: PromiseOrValue<BigNumberish>, _destination: PromiseOrValue<BytesLike>, _payload: PromiseOrValue<BytesLike>, _refundAddress: PromiseOrValue<string>, _zroPaymentAddress: PromiseOrValue<string>, _adapterParams: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, _configType: PromiseOrValue<BigNumberish>, _config: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setReceiveVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setSendVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    estimateFees(_dstChainId: PromiseOrValue<BigNumberish>, _userApplication: PromiseOrValue<string>, _payload: PromiseOrValue<BytesLike>, _payInZRO: PromiseOrValue<boolean>, _adapterParam: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[
        BigNumber,
        BigNumber
    ] & {
        nativeFee: BigNumber;
        zroFee: BigNumber;
    }>;
    forceResumeReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getChainId(overrides?: CallOverrides): Promise<number>;
    getConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, _userApplication: PromiseOrValue<string>, _configType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    getInboundNonce(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
    getOutboundNonce(_dstChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    getReceiveLibraryAddress(_userApplication: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
    getReceiveVersion(_userApplication: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number>;
    getSendLibraryAddress(_userApplication: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
    getSendVersion(_userApplication: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number>;
    hasStoredPayload(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    isReceivingPayload(overrides?: CallOverrides): Promise<boolean>;
    isSendingPayload(overrides?: CallOverrides): Promise<boolean>;
    receivePayload(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _dstAddress: PromiseOrValue<string>, _nonce: PromiseOrValue<BigNumberish>, _gasLimit: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    retryPayload(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    send(_dstChainId: PromiseOrValue<BigNumberish>, _destination: PromiseOrValue<BytesLike>, _payload: PromiseOrValue<BytesLike>, _refundAddress: PromiseOrValue<string>, _zroPaymentAddress: PromiseOrValue<string>, _adapterParams: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, _configType: PromiseOrValue<BigNumberish>, _config: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setReceiveVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setSendVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        estimateFees(_dstChainId: PromiseOrValue<BigNumberish>, _userApplication: PromiseOrValue<string>, _payload: PromiseOrValue<BytesLike>, _payInZRO: PromiseOrValue<boolean>, _adapterParam: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber
        ] & {
            nativeFee: BigNumber;
            zroFee: BigNumber;
        }>;
        forceResumeReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        getChainId(overrides?: CallOverrides): Promise<number>;
        getConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, _userApplication: PromiseOrValue<string>, _configType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        getInboundNonce(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        getOutboundNonce(_dstChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getReceiveLibraryAddress(_userApplication: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        getReceiveVersion(_userApplication: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number>;
        getSendLibraryAddress(_userApplication: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        getSendVersion(_userApplication: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number>;
        hasStoredPayload(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        isReceivingPayload(overrides?: CallOverrides): Promise<boolean>;
        isSendingPayload(overrides?: CallOverrides): Promise<boolean>;
        receivePayload(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _dstAddress: PromiseOrValue<string>, _nonce: PromiseOrValue<BigNumberish>, _gasLimit: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        retryPayload(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _payload: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        send(_dstChainId: PromiseOrValue<BigNumberish>, _destination: PromiseOrValue<BytesLike>, _payload: PromiseOrValue<BytesLike>, _refundAddress: PromiseOrValue<string>, _zroPaymentAddress: PromiseOrValue<string>, _adapterParams: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        setConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, _configType: PromiseOrValue<BigNumberish>, _config: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        setReceiveVersion(_version: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setSendVersion(_version: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {};
    estimateGas: {
        estimateFees(_dstChainId: PromiseOrValue<BigNumberish>, _userApplication: PromiseOrValue<string>, _payload: PromiseOrValue<BytesLike>, _payInZRO: PromiseOrValue<boolean>, _adapterParam: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        forceResumeReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getChainId(overrides?: CallOverrides): Promise<BigNumber>;
        getConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, _userApplication: PromiseOrValue<string>, _configType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getInboundNonce(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        getOutboundNonce(_dstChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getReceiveLibraryAddress(_userApplication: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getReceiveVersion(_userApplication: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getSendLibraryAddress(_userApplication: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getSendVersion(_userApplication: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        hasStoredPayload(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        isReceivingPayload(overrides?: CallOverrides): Promise<BigNumber>;
        isSendingPayload(overrides?: CallOverrides): Promise<BigNumber>;
        receivePayload(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _dstAddress: PromiseOrValue<string>, _nonce: PromiseOrValue<BigNumberish>, _gasLimit: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        retryPayload(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        send(_dstChainId: PromiseOrValue<BigNumberish>, _destination: PromiseOrValue<BytesLike>, _payload: PromiseOrValue<BytesLike>, _refundAddress: PromiseOrValue<string>, _zroPaymentAddress: PromiseOrValue<string>, _adapterParams: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, _configType: PromiseOrValue<BigNumberish>, _config: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setReceiveVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setSendVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        estimateFees(_dstChainId: PromiseOrValue<BigNumberish>, _userApplication: PromiseOrValue<string>, _payload: PromiseOrValue<BytesLike>, _payInZRO: PromiseOrValue<boolean>, _adapterParam: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        forceResumeReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getChainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, _userApplication: PromiseOrValue<string>, _configType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getInboundNonce(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getOutboundNonce(_dstChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getReceiveLibraryAddress(_userApplication: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getReceiveVersion(_userApplication: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getSendLibraryAddress(_userApplication: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getSendVersion(_userApplication: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        hasStoredPayload(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isReceivingPayload(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isSendingPayload(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        receivePayload(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _dstAddress: PromiseOrValue<string>, _nonce: PromiseOrValue<BigNumberish>, _gasLimit: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        retryPayload(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        send(_dstChainId: PromiseOrValue<BigNumberish>, _destination: PromiseOrValue<BytesLike>, _payload: PromiseOrValue<BytesLike>, _refundAddress: PromiseOrValue<string>, _zroPaymentAddress: PromiseOrValue<string>, _adapterParams: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, _configType: PromiseOrValue<BigNumberish>, _config: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setReceiveVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setSendVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}

interface ILayerZeroReceiverInterface extends utils.Interface {
    functions: {
        "lzReceive(uint16,bytes,uint64,bytes)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "lzReceive"): FunctionFragment;
    encodeFunctionData(functionFragment: "lzReceive", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    decodeFunctionResult(functionFragment: "lzReceive", data: BytesLike): Result;
    events: {};
}
interface ILayerZeroReceiver extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: ILayerZeroReceiverInterface;
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
        lzReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _nonce: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    lzReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _nonce: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        lzReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _nonce: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {};
    estimateGas: {
        lzReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _nonce: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        lzReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _nonce: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}

interface ILayerZeroUserApplicationConfigInterface extends utils.Interface {
    functions: {
        "forceResumeReceive(uint16,bytes)": FunctionFragment;
        "setConfig(uint16,uint16,uint256,bytes)": FunctionFragment;
        "setReceiveVersion(uint16)": FunctionFragment;
        "setSendVersion(uint16)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "forceResumeReceive" | "setConfig" | "setReceiveVersion" | "setSendVersion"): FunctionFragment;
    encodeFunctionData(functionFragment: "forceResumeReceive", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "setConfig", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "setReceiveVersion", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setSendVersion", values: [PromiseOrValue<BigNumberish>]): string;
    decodeFunctionResult(functionFragment: "forceResumeReceive", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setConfig", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setReceiveVersion", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setSendVersion", data: BytesLike): Result;
    events: {};
}
interface ILayerZeroUserApplicationConfig extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: ILayerZeroUserApplicationConfigInterface;
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
        forceResumeReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, _configType: PromiseOrValue<BigNumberish>, _config: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setReceiveVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setSendVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    forceResumeReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, _configType: PromiseOrValue<BigNumberish>, _config: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setReceiveVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setSendVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        forceResumeReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        setConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, _configType: PromiseOrValue<BigNumberish>, _config: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        setReceiveVersion(_version: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setSendVersion(_version: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {};
    estimateGas: {
        forceResumeReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, _configType: PromiseOrValue<BigNumberish>, _config: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setReceiveVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setSendVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        forceResumeReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, _configType: PromiseOrValue<BigNumberish>, _config: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setReceiveVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setSendVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}

type index$k_ILayerZeroEndpoint = ILayerZeroEndpoint;
type index$k_ILayerZeroReceiver = ILayerZeroReceiver;
type index$k_ILayerZeroUserApplicationConfig = ILayerZeroUserApplicationConfig;
declare namespace index$k {
  export {
    index$k_ILayerZeroEndpoint as ILayerZeroEndpoint,
    index$k_ILayerZeroReceiver as ILayerZeroReceiver,
    index$k_ILayerZeroUserApplicationConfig as ILayerZeroUserApplicationConfig,
  };
}

declare namespace index$j {
  export {
    index$k as interfaces,
  };
}

declare namespace index$i {
  export {
    index$j as contracts,
  };
}

declare namespace index$h {
  export {
    index$i as lzEvmV107,
  };
}

interface OwnableInterface extends utils.Interface {
    functions: {
        "owner()": FunctionFragment;
        "renounceOwnership()": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "owner" | "renounceOwnership" | "transferOwnership"): FunctionFragment;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    events: {
        "OwnershipTransferred(address,address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}
interface OwnershipTransferredEventObject$2 {
    previousOwner: string;
    newOwner: string;
}
type OwnershipTransferredEvent$2 = TypedEvent<[
    string,
    string
], OwnershipTransferredEventObject$2>;
type OwnershipTransferredEventFilter$2 = TypedEventFilter<OwnershipTransferredEvent$2>;
interface Ownable extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: OwnableInterface;
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
        owner(overrides?: CallOverrides): Promise<[string]>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    owner(overrides?: CallOverrides): Promise<string>;
    renounceOwnership(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        owner(overrides?: CallOverrides): Promise<string>;
        renounceOwnership(overrides?: CallOverrides): Promise<void>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "OwnershipTransferred(address,address)"(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter$2;
        OwnershipTransferred(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter$2;
    };
    estimateGas: {
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}

type index$g_Ownable = Ownable;
declare namespace index$g {
  export {
    index$g_Ownable as Ownable,
  };
}

declare namespace index$f {
  export {
    index$g as access,
  };
}

declare namespace index$e {
  export {
    index$f as contracts,
  };
}

interface LzAppInterface extends utils.Interface {
    functions: {
        "forceResumeReceive(uint16,bytes)": FunctionFragment;
        "getConfig(uint16,uint16,address,uint256)": FunctionFragment;
        "getTrustedRemoteAddress(uint16)": FunctionFragment;
        "isTrustedRemote(uint16,bytes)": FunctionFragment;
        "lzEndpoint()": FunctionFragment;
        "lzReceive(uint16,bytes,uint64,bytes)": FunctionFragment;
        "minDstGasLookup(uint16,uint16)": FunctionFragment;
        "owner()": FunctionFragment;
        "precrime()": FunctionFragment;
        "renounceOwnership()": FunctionFragment;
        "setConfig(uint16,uint16,uint256,bytes)": FunctionFragment;
        "setMinDstGas(uint16,uint16,uint256)": FunctionFragment;
        "setPrecrime(address)": FunctionFragment;
        "setReceiveVersion(uint16)": FunctionFragment;
        "setSendVersion(uint16)": FunctionFragment;
        "setTrustedRemote(uint16,bytes)": FunctionFragment;
        "setTrustedRemoteAddress(uint16,bytes)": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "trustedRemoteLookup(uint16)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "forceResumeReceive" | "getConfig" | "getTrustedRemoteAddress" | "isTrustedRemote" | "lzEndpoint" | "lzReceive" | "minDstGasLookup" | "owner" | "precrime" | "renounceOwnership" | "setConfig" | "setMinDstGas" | "setPrecrime" | "setReceiveVersion" | "setSendVersion" | "setTrustedRemote" | "setTrustedRemoteAddress" | "transferOwnership" | "trustedRemoteLookup"): FunctionFragment;
    encodeFunctionData(functionFragment: "forceResumeReceive", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "getConfig", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "getTrustedRemoteAddress", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "isTrustedRemote", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "lzEndpoint", values?: undefined): string;
    encodeFunctionData(functionFragment: "lzReceive", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "minDstGasLookup", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "precrime", values?: undefined): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "setConfig", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "setMinDstGas", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "setPrecrime", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "setReceiveVersion", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setSendVersion", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setTrustedRemote", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "setTrustedRemoteAddress", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "trustedRemoteLookup", values: [PromiseOrValue<BigNumberish>]): string;
    decodeFunctionResult(functionFragment: "forceResumeReceive", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getConfig", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getTrustedRemoteAddress", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isTrustedRemote", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lzEndpoint", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lzReceive", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "minDstGasLookup", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "precrime", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setConfig", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setMinDstGas", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPrecrime", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setReceiveVersion", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setSendVersion", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setTrustedRemote", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setTrustedRemoteAddress", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "trustedRemoteLookup", data: BytesLike): Result;
    events: {
        "OwnershipTransferred(address,address)": EventFragment;
        "SetMinDstGas(uint16,uint16,uint256)": EventFragment;
        "SetPrecrime(address)": EventFragment;
        "SetTrustedRemote(uint16,bytes)": EventFragment;
        "SetTrustedRemoteAddress(uint16,bytes)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "SetMinDstGas"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "SetPrecrime"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "SetTrustedRemote"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "SetTrustedRemoteAddress"): EventFragment;
}
interface OwnershipTransferredEventObject$1 {
    previousOwner: string;
    newOwner: string;
}
type OwnershipTransferredEvent$1 = TypedEvent<[
    string,
    string
], OwnershipTransferredEventObject$1>;
type OwnershipTransferredEventFilter$1 = TypedEventFilter<OwnershipTransferredEvent$1>;
interface SetMinDstGasEventObject$1 {
    _dstChainId: number;
    _type: number;
    _minDstGas: BigNumber;
}
type SetMinDstGasEvent$1 = TypedEvent<[
    number,
    number,
    BigNumber
], SetMinDstGasEventObject$1>;
type SetMinDstGasEventFilter$1 = TypedEventFilter<SetMinDstGasEvent$1>;
interface SetPrecrimeEventObject$1 {
    precrime: string;
}
type SetPrecrimeEvent$1 = TypedEvent<[string], SetPrecrimeEventObject$1>;
type SetPrecrimeEventFilter$1 = TypedEventFilter<SetPrecrimeEvent$1>;
interface SetTrustedRemoteEventObject$1 {
    _remoteChainId: number;
    _path: string;
}
type SetTrustedRemoteEvent$1 = TypedEvent<[
    number,
    string
], SetTrustedRemoteEventObject$1>;
type SetTrustedRemoteEventFilter$1 = TypedEventFilter<SetTrustedRemoteEvent$1>;
interface SetTrustedRemoteAddressEventObject$1 {
    _remoteChainId: number;
    _remoteAddress: string;
}
type SetTrustedRemoteAddressEvent$1 = TypedEvent<[
    number,
    string
], SetTrustedRemoteAddressEventObject$1>;
type SetTrustedRemoteAddressEventFilter$1 = TypedEventFilter<SetTrustedRemoteAddressEvent$1>;
interface LzApp extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: LzAppInterface;
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
        forceResumeReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<string>, _configType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        getTrustedRemoteAddress(_remoteChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        isTrustedRemote(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
        lzEndpoint(overrides?: CallOverrides): Promise<[string]>;
        lzReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _nonce: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        minDstGasLookup(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        precrime(overrides?: CallOverrides): Promise<[string]>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, _configType: PromiseOrValue<BigNumberish>, _config: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setMinDstGas(_dstChainId: PromiseOrValue<BigNumberish>, _packetType: PromiseOrValue<BigNumberish>, _minGas: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPrecrime(_precrime: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setReceiveVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setSendVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setTrustedRemote(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setTrustedRemoteAddress(_remoteChainId: PromiseOrValue<BigNumberish>, _remoteAddress: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        trustedRemoteLookup(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
    };
    forceResumeReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<string>, _configType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    getTrustedRemoteAddress(_remoteChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    isTrustedRemote(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    lzEndpoint(overrides?: CallOverrides): Promise<string>;
    lzReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _nonce: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    minDstGasLookup(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    owner(overrides?: CallOverrides): Promise<string>;
    precrime(overrides?: CallOverrides): Promise<string>;
    renounceOwnership(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, _configType: PromiseOrValue<BigNumberish>, _config: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setMinDstGas(_dstChainId: PromiseOrValue<BigNumberish>, _packetType: PromiseOrValue<BigNumberish>, _minGas: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPrecrime(_precrime: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setReceiveVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setSendVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setTrustedRemote(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setTrustedRemoteAddress(_remoteChainId: PromiseOrValue<BigNumberish>, _remoteAddress: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    trustedRemoteLookup(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    callStatic: {
        forceResumeReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        getConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<string>, _configType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        getTrustedRemoteAddress(_remoteChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        isTrustedRemote(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        lzEndpoint(overrides?: CallOverrides): Promise<string>;
        lzReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _nonce: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        minDstGasLookup(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<string>;
        precrime(overrides?: CallOverrides): Promise<string>;
        renounceOwnership(overrides?: CallOverrides): Promise<void>;
        setConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, _configType: PromiseOrValue<BigNumberish>, _config: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        setMinDstGas(_dstChainId: PromiseOrValue<BigNumberish>, _packetType: PromiseOrValue<BigNumberish>, _minGas: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setPrecrime(_precrime: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setReceiveVersion(_version: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setSendVersion(_version: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setTrustedRemote(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        setTrustedRemoteAddress(_remoteChainId: PromiseOrValue<BigNumberish>, _remoteAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        trustedRemoteLookup(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    };
    filters: {
        "OwnershipTransferred(address,address)"(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter$1;
        OwnershipTransferred(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter$1;
        "SetMinDstGas(uint16,uint16,uint256)"(_dstChainId?: null, _type?: null, _minDstGas?: null): SetMinDstGasEventFilter$1;
        SetMinDstGas(_dstChainId?: null, _type?: null, _minDstGas?: null): SetMinDstGasEventFilter$1;
        "SetPrecrime(address)"(precrime?: null): SetPrecrimeEventFilter$1;
        SetPrecrime(precrime?: null): SetPrecrimeEventFilter$1;
        "SetTrustedRemote(uint16,bytes)"(_remoteChainId?: null, _path?: null): SetTrustedRemoteEventFilter$1;
        SetTrustedRemote(_remoteChainId?: null, _path?: null): SetTrustedRemoteEventFilter$1;
        "SetTrustedRemoteAddress(uint16,bytes)"(_remoteChainId?: null, _remoteAddress?: null): SetTrustedRemoteAddressEventFilter$1;
        SetTrustedRemoteAddress(_remoteChainId?: null, _remoteAddress?: null): SetTrustedRemoteAddressEventFilter$1;
    };
    estimateGas: {
        forceResumeReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<string>, _configType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getTrustedRemoteAddress(_remoteChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        isTrustedRemote(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        lzEndpoint(overrides?: CallOverrides): Promise<BigNumber>;
        lzReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _nonce: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        minDstGasLookup(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        precrime(overrides?: CallOverrides): Promise<BigNumber>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, _configType: PromiseOrValue<BigNumberish>, _config: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setMinDstGas(_dstChainId: PromiseOrValue<BigNumberish>, _packetType: PromiseOrValue<BigNumberish>, _minGas: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPrecrime(_precrime: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setReceiveVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setSendVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setTrustedRemote(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setTrustedRemoteAddress(_remoteChainId: PromiseOrValue<BigNumberish>, _remoteAddress: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        trustedRemoteLookup(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        forceResumeReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<string>, _configType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getTrustedRemoteAddress(_remoteChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isTrustedRemote(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        lzEndpoint(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        lzReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _nonce: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        minDstGasLookup(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        precrime(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, _configType: PromiseOrValue<BigNumberish>, _config: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setMinDstGas(_dstChainId: PromiseOrValue<BigNumberish>, _packetType: PromiseOrValue<BigNumberish>, _minGas: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPrecrime(_precrime: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setReceiveVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setSendVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setTrustedRemote(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setTrustedRemoteAddress(_remoteChainId: PromiseOrValue<BigNumberish>, _remoteAddress: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        trustedRemoteLookup(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}

interface NonblockingLzAppInterface extends utils.Interface {
    functions: {
        "failedMessages(uint16,bytes,uint64)": FunctionFragment;
        "forceResumeReceive(uint16,bytes)": FunctionFragment;
        "getConfig(uint16,uint16,address,uint256)": FunctionFragment;
        "getTrustedRemoteAddress(uint16)": FunctionFragment;
        "isTrustedRemote(uint16,bytes)": FunctionFragment;
        "lzEndpoint()": FunctionFragment;
        "lzReceive(uint16,bytes,uint64,bytes)": FunctionFragment;
        "minDstGasLookup(uint16,uint16)": FunctionFragment;
        "nonblockingLzReceive(uint16,bytes,uint64,bytes)": FunctionFragment;
        "owner()": FunctionFragment;
        "precrime()": FunctionFragment;
        "renounceOwnership()": FunctionFragment;
        "retryMessage(uint16,bytes,uint64,bytes)": FunctionFragment;
        "setConfig(uint16,uint16,uint256,bytes)": FunctionFragment;
        "setMinDstGas(uint16,uint16,uint256)": FunctionFragment;
        "setPrecrime(address)": FunctionFragment;
        "setReceiveVersion(uint16)": FunctionFragment;
        "setSendVersion(uint16)": FunctionFragment;
        "setTrustedRemote(uint16,bytes)": FunctionFragment;
        "setTrustedRemoteAddress(uint16,bytes)": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "trustedRemoteLookup(uint16)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "failedMessages" | "forceResumeReceive" | "getConfig" | "getTrustedRemoteAddress" | "isTrustedRemote" | "lzEndpoint" | "lzReceive" | "minDstGasLookup" | "nonblockingLzReceive" | "owner" | "precrime" | "renounceOwnership" | "retryMessage" | "setConfig" | "setMinDstGas" | "setPrecrime" | "setReceiveVersion" | "setSendVersion" | "setTrustedRemote" | "setTrustedRemoteAddress" | "transferOwnership" | "trustedRemoteLookup"): FunctionFragment;
    encodeFunctionData(functionFragment: "failedMessages", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "forceResumeReceive", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "getConfig", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "getTrustedRemoteAddress", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "isTrustedRemote", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "lzEndpoint", values?: undefined): string;
    encodeFunctionData(functionFragment: "lzReceive", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "minDstGasLookup", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "nonblockingLzReceive", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "precrime", values?: undefined): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "retryMessage", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "setConfig", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "setMinDstGas", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "setPrecrime", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "setReceiveVersion", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setSendVersion", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setTrustedRemote", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "setTrustedRemoteAddress", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "trustedRemoteLookup", values: [PromiseOrValue<BigNumberish>]): string;
    decodeFunctionResult(functionFragment: "failedMessages", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "forceResumeReceive", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getConfig", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getTrustedRemoteAddress", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isTrustedRemote", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lzEndpoint", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lzReceive", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "minDstGasLookup", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "nonblockingLzReceive", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "precrime", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "retryMessage", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setConfig", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setMinDstGas", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPrecrime", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setReceiveVersion", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setSendVersion", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setTrustedRemote", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setTrustedRemoteAddress", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "trustedRemoteLookup", data: BytesLike): Result;
    events: {
        "MessageFailed(uint16,bytes,uint64,bytes,bytes)": EventFragment;
        "OwnershipTransferred(address,address)": EventFragment;
        "RetryMessageSuccess(uint16,bytes,uint64,bytes32)": EventFragment;
        "SetMinDstGas(uint16,uint16,uint256)": EventFragment;
        "SetPrecrime(address)": EventFragment;
        "SetTrustedRemote(uint16,bytes)": EventFragment;
        "SetTrustedRemoteAddress(uint16,bytes)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "MessageFailed"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "RetryMessageSuccess"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "SetMinDstGas"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "SetPrecrime"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "SetTrustedRemote"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "SetTrustedRemoteAddress"): EventFragment;
}
interface MessageFailedEventObject {
    _srcChainId: number;
    _srcAddress: string;
    _nonce: BigNumber;
    _payload: string;
    _reason: string;
}
type MessageFailedEvent = TypedEvent<[
    number,
    string,
    BigNumber,
    string,
    string
], MessageFailedEventObject>;
type MessageFailedEventFilter = TypedEventFilter<MessageFailedEvent>;
interface OwnershipTransferredEventObject {
    previousOwner: string;
    newOwner: string;
}
type OwnershipTransferredEvent = TypedEvent<[
    string,
    string
], OwnershipTransferredEventObject>;
type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;
interface RetryMessageSuccessEventObject {
    _srcChainId: number;
    _srcAddress: string;
    _nonce: BigNumber;
    _payloadHash: string;
}
type RetryMessageSuccessEvent = TypedEvent<[
    number,
    string,
    BigNumber,
    string
], RetryMessageSuccessEventObject>;
type RetryMessageSuccessEventFilter = TypedEventFilter<RetryMessageSuccessEvent>;
interface SetMinDstGasEventObject {
    _dstChainId: number;
    _type: number;
    _minDstGas: BigNumber;
}
type SetMinDstGasEvent = TypedEvent<[
    number,
    number,
    BigNumber
], SetMinDstGasEventObject>;
type SetMinDstGasEventFilter = TypedEventFilter<SetMinDstGasEvent>;
interface SetPrecrimeEventObject {
    precrime: string;
}
type SetPrecrimeEvent = TypedEvent<[string], SetPrecrimeEventObject>;
type SetPrecrimeEventFilter = TypedEventFilter<SetPrecrimeEvent>;
interface SetTrustedRemoteEventObject {
    _remoteChainId: number;
    _path: string;
}
type SetTrustedRemoteEvent = TypedEvent<[
    number,
    string
], SetTrustedRemoteEventObject>;
type SetTrustedRemoteEventFilter = TypedEventFilter<SetTrustedRemoteEvent>;
interface SetTrustedRemoteAddressEventObject {
    _remoteChainId: number;
    _remoteAddress: string;
}
type SetTrustedRemoteAddressEvent = TypedEvent<[
    number,
    string
], SetTrustedRemoteAddressEventObject>;
type SetTrustedRemoteAddressEventFilter = TypedEventFilter<SetTrustedRemoteAddressEvent>;
interface NonblockingLzApp extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: NonblockingLzAppInterface;
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
        failedMessages(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, arg2: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        forceResumeReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<string>, _configType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        getTrustedRemoteAddress(_remoteChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        isTrustedRemote(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
        lzEndpoint(overrides?: CallOverrides): Promise<[string]>;
        lzReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _nonce: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        minDstGasLookup(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        nonblockingLzReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _nonce: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        precrime(overrides?: CallOverrides): Promise<[string]>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        retryMessage(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _nonce: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, _configType: PromiseOrValue<BigNumberish>, _config: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setMinDstGas(_dstChainId: PromiseOrValue<BigNumberish>, _packetType: PromiseOrValue<BigNumberish>, _minGas: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPrecrime(_precrime: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setReceiveVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setSendVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setTrustedRemote(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setTrustedRemoteAddress(_remoteChainId: PromiseOrValue<BigNumberish>, _remoteAddress: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        trustedRemoteLookup(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
    };
    failedMessages(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, arg2: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    forceResumeReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<string>, _configType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    getTrustedRemoteAddress(_remoteChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    isTrustedRemote(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    lzEndpoint(overrides?: CallOverrides): Promise<string>;
    lzReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _nonce: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    minDstGasLookup(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    nonblockingLzReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _nonce: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    owner(overrides?: CallOverrides): Promise<string>;
    precrime(overrides?: CallOverrides): Promise<string>;
    renounceOwnership(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    retryMessage(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _nonce: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, _configType: PromiseOrValue<BigNumberish>, _config: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setMinDstGas(_dstChainId: PromiseOrValue<BigNumberish>, _packetType: PromiseOrValue<BigNumberish>, _minGas: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPrecrime(_precrime: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setReceiveVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setSendVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setTrustedRemote(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setTrustedRemoteAddress(_remoteChainId: PromiseOrValue<BigNumberish>, _remoteAddress: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    trustedRemoteLookup(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    callStatic: {
        failedMessages(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, arg2: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        forceResumeReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        getConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<string>, _configType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        getTrustedRemoteAddress(_remoteChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        isTrustedRemote(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        lzEndpoint(overrides?: CallOverrides): Promise<string>;
        lzReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _nonce: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        minDstGasLookup(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        nonblockingLzReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _nonce: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        owner(overrides?: CallOverrides): Promise<string>;
        precrime(overrides?: CallOverrides): Promise<string>;
        renounceOwnership(overrides?: CallOverrides): Promise<void>;
        retryMessage(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _nonce: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        setConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, _configType: PromiseOrValue<BigNumberish>, _config: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        setMinDstGas(_dstChainId: PromiseOrValue<BigNumberish>, _packetType: PromiseOrValue<BigNumberish>, _minGas: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setPrecrime(_precrime: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setReceiveVersion(_version: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setSendVersion(_version: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setTrustedRemote(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        setTrustedRemoteAddress(_remoteChainId: PromiseOrValue<BigNumberish>, _remoteAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        trustedRemoteLookup(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    };
    filters: {
        "MessageFailed(uint16,bytes,uint64,bytes,bytes)"(_srcChainId?: null, _srcAddress?: null, _nonce?: null, _payload?: null, _reason?: null): MessageFailedEventFilter;
        MessageFailed(_srcChainId?: null, _srcAddress?: null, _nonce?: null, _payload?: null, _reason?: null): MessageFailedEventFilter;
        "OwnershipTransferred(address,address)"(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        OwnershipTransferred(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        "RetryMessageSuccess(uint16,bytes,uint64,bytes32)"(_srcChainId?: null, _srcAddress?: null, _nonce?: null, _payloadHash?: null): RetryMessageSuccessEventFilter;
        RetryMessageSuccess(_srcChainId?: null, _srcAddress?: null, _nonce?: null, _payloadHash?: null): RetryMessageSuccessEventFilter;
        "SetMinDstGas(uint16,uint16,uint256)"(_dstChainId?: null, _type?: null, _minDstGas?: null): SetMinDstGasEventFilter;
        SetMinDstGas(_dstChainId?: null, _type?: null, _minDstGas?: null): SetMinDstGasEventFilter;
        "SetPrecrime(address)"(precrime?: null): SetPrecrimeEventFilter;
        SetPrecrime(precrime?: null): SetPrecrimeEventFilter;
        "SetTrustedRemote(uint16,bytes)"(_remoteChainId?: null, _path?: null): SetTrustedRemoteEventFilter;
        SetTrustedRemote(_remoteChainId?: null, _path?: null): SetTrustedRemoteEventFilter;
        "SetTrustedRemoteAddress(uint16,bytes)"(_remoteChainId?: null, _remoteAddress?: null): SetTrustedRemoteAddressEventFilter;
        SetTrustedRemoteAddress(_remoteChainId?: null, _remoteAddress?: null): SetTrustedRemoteAddressEventFilter;
    };
    estimateGas: {
        failedMessages(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, arg2: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        forceResumeReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<string>, _configType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getTrustedRemoteAddress(_remoteChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        isTrustedRemote(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        lzEndpoint(overrides?: CallOverrides): Promise<BigNumber>;
        lzReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _nonce: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        minDstGasLookup(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        nonblockingLzReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _nonce: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        precrime(overrides?: CallOverrides): Promise<BigNumber>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        retryMessage(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _nonce: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, _configType: PromiseOrValue<BigNumberish>, _config: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setMinDstGas(_dstChainId: PromiseOrValue<BigNumberish>, _packetType: PromiseOrValue<BigNumberish>, _minGas: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPrecrime(_precrime: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setReceiveVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setSendVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setTrustedRemote(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setTrustedRemoteAddress(_remoteChainId: PromiseOrValue<BigNumberish>, _remoteAddress: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        trustedRemoteLookup(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        failedMessages(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, arg2: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        forceResumeReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<string>, _configType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getTrustedRemoteAddress(_remoteChainId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isTrustedRemote(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        lzEndpoint(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        lzReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _nonce: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        minDstGasLookup(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        nonblockingLzReceive(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _nonce: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        precrime(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        retryMessage(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, _nonce: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setConfig(_version: PromiseOrValue<BigNumberish>, _chainId: PromiseOrValue<BigNumberish>, _configType: PromiseOrValue<BigNumberish>, _config: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setMinDstGas(_dstChainId: PromiseOrValue<BigNumberish>, _packetType: PromiseOrValue<BigNumberish>, _minGas: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPrecrime(_precrime: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setReceiveVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setSendVersion(_version: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setTrustedRemote(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setTrustedRemoteAddress(_remoteChainId: PromiseOrValue<BigNumberish>, _remoteAddress: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        trustedRemoteLookup(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}

type index$d_LzApp = LzApp;
type index$d_NonblockingLzApp = NonblockingLzApp;
declare namespace index$d {
  export {
    index$d_LzApp as LzApp,
    index$d_NonblockingLzApp as NonblockingLzApp,
  };
}

interface LZEndpointMockInterface extends utils.Interface {
    functions: {
        "blockNextMsg()": FunctionFragment;
        "defaultAdapterParams()": FunctionFragment;
        "estimateFees(uint16,address,bytes,bool,bytes)": FunctionFragment;
        "forceResumeReceive(uint16,bytes)": FunctionFragment;
        "getChainId()": FunctionFragment;
        "getConfig(uint16,uint16,address,uint256)": FunctionFragment;
        "getInboundNonce(uint16,bytes)": FunctionFragment;
        "getLengthOfQueue(uint16,bytes)": FunctionFragment;
        "getOutboundNonce(uint16,address)": FunctionFragment;
        "getReceiveLibraryAddress(address)": FunctionFragment;
        "getReceiveVersion(address)": FunctionFragment;
        "getSendLibraryAddress(address)": FunctionFragment;
        "getSendVersion(address)": FunctionFragment;
        "hasStoredPayload(uint16,bytes)": FunctionFragment;
        "inboundNonce(uint16,bytes)": FunctionFragment;
        "isReceivingPayload()": FunctionFragment;
        "isSendingPayload()": FunctionFragment;
        "lzEndpointLookup(address)": FunctionFragment;
        "mockChainId()": FunctionFragment;
        "msgsToDeliver(uint16,bytes,uint256)": FunctionFragment;
        "nextMsgBlocked()": FunctionFragment;
        "oracleFee()": FunctionFragment;
        "outboundNonce(uint16,address)": FunctionFragment;
        "protocolFeeConfig()": FunctionFragment;
        "receivePayload(uint16,bytes,address,uint64,uint256,bytes)": FunctionFragment;
        "relayerFeeConfig()": FunctionFragment;
        "retryPayload(uint16,bytes,bytes)": FunctionFragment;
        "send(uint16,bytes,bytes,address,address,bytes)": FunctionFragment;
        "setConfig(uint16,uint16,uint256,bytes)": FunctionFragment;
        "setDefaultAdapterParams(bytes)": FunctionFragment;
        "setDestLzEndpoint(address,address)": FunctionFragment;
        "setOracleFee(uint256)": FunctionFragment;
        "setProtocolFee(uint256,uint256)": FunctionFragment;
        "setReceiveVersion(uint16)": FunctionFragment;
        "setRelayerPrice(uint128,uint128,uint128,uint64,uint64)": FunctionFragment;
        "setSendVersion(uint16)": FunctionFragment;
        "storedPayload(uint16,bytes)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "blockNextMsg" | "defaultAdapterParams" | "estimateFees" | "forceResumeReceive" | "getChainId" | "getConfig" | "getInboundNonce" | "getLengthOfQueue" | "getOutboundNonce" | "getReceiveLibraryAddress" | "getReceiveVersion" | "getSendLibraryAddress" | "getSendVersion" | "hasStoredPayload" | "inboundNonce" | "isReceivingPayload" | "isSendingPayload" | "lzEndpointLookup" | "mockChainId" | "msgsToDeliver" | "nextMsgBlocked" | "oracleFee" | "outboundNonce" | "protocolFeeConfig" | "receivePayload" | "relayerFeeConfig" | "retryPayload" | "send" | "setConfig" | "setDefaultAdapterParams" | "setDestLzEndpoint" | "setOracleFee" | "setProtocolFee" | "setReceiveVersion" | "setRelayerPrice" | "setSendVersion" | "storedPayload"): FunctionFragment;
    encodeFunctionData(functionFragment: "blockNextMsg", values?: undefined): string;
    encodeFunctionData(functionFragment: "defaultAdapterParams", values?: undefined): string;
    encodeFunctionData(functionFragment: "estimateFees", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<boolean>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "forceResumeReceive", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "getChainId", values?: undefined): string;
    encodeFunctionData(functionFragment: "getConfig", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "getInboundNonce", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "getLengthOfQueue", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "getOutboundNonce", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getReceiveLibraryAddress", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getReceiveVersion", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getSendLibraryAddress", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getSendVersion", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "hasStoredPayload", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "inboundNonce", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "isReceivingPayload", values?: undefined): string;
    encodeFunctionData(functionFragment: "isSendingPayload", values?: undefined): string;
    encodeFunctionData(functionFragment: "lzEndpointLookup", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "mockChainId", values?: undefined): string;
    encodeFunctionData(functionFragment: "msgsToDeliver", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "nextMsgBlocked", values?: undefined): string;
    encodeFunctionData(functionFragment: "oracleFee", values?: undefined): string;
    encodeFunctionData(functionFragment: "outboundNonce", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "protocolFeeConfig", values?: undefined): string;
    encodeFunctionData(functionFragment: "receivePayload", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "relayerFeeConfig", values?: undefined): string;
    encodeFunctionData(functionFragment: "retryPayload", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "send", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "setConfig", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "setDefaultAdapterParams", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "setDestLzEndpoint", values: [PromiseOrValue<string>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "setOracleFee", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setProtocolFee", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setReceiveVersion", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setRelayerPrice", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "setSendVersion", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "storedPayload", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]): string;
    decodeFunctionResult(functionFragment: "blockNextMsg", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "defaultAdapterParams", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "estimateFees", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "forceResumeReceive", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getConfig", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getInboundNonce", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getLengthOfQueue", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getOutboundNonce", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getReceiveLibraryAddress", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getReceiveVersion", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSendLibraryAddress", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getSendVersion", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "hasStoredPayload", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "inboundNonce", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isReceivingPayload", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isSendingPayload", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lzEndpointLookup", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mockChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "msgsToDeliver", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "nextMsgBlocked", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "oracleFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "outboundNonce", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "protocolFeeConfig", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "receivePayload", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "relayerFeeConfig", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "retryPayload", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "send", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setConfig", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setDefaultAdapterParams", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setDestLzEndpoint", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setOracleFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setProtocolFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setReceiveVersion", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setRelayerPrice", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setSendVersion", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "storedPayload", data: BytesLike): Result;
    events: {
        "PayloadCleared(uint16,bytes,uint64,address)": EventFragment;
        "PayloadStored(uint16,bytes,address,uint64,bytes,bytes)": EventFragment;
        "UaForceResumeReceive(uint16,bytes)": EventFragment;
        "ValueTransferFailed(address,uint256)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "PayloadCleared"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "PayloadStored"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "UaForceResumeReceive"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "ValueTransferFailed"): EventFragment;
}
interface PayloadClearedEventObject {
    srcChainId: number;
    srcAddress: string;
    nonce: BigNumber;
    dstAddress: string;
}
type PayloadClearedEvent = TypedEvent<[
    number,
    string,
    BigNumber,
    string
], PayloadClearedEventObject>;
type PayloadClearedEventFilter = TypedEventFilter<PayloadClearedEvent>;
interface PayloadStoredEventObject {
    srcChainId: number;
    srcAddress: string;
    dstAddress: string;
    nonce: BigNumber;
    payload: string;
    reason: string;
}
type PayloadStoredEvent = TypedEvent<[
    number,
    string,
    string,
    BigNumber,
    string,
    string
], PayloadStoredEventObject>;
type PayloadStoredEventFilter = TypedEventFilter<PayloadStoredEvent>;
interface UaForceResumeReceiveEventObject {
    chainId: number;
    srcAddress: string;
}
type UaForceResumeReceiveEvent = TypedEvent<[
    number,
    string
], UaForceResumeReceiveEventObject>;
type UaForceResumeReceiveEventFilter = TypedEventFilter<UaForceResumeReceiveEvent>;
interface ValueTransferFailedEventObject {
    to: string;
    quantity: BigNumber;
}
type ValueTransferFailedEvent = TypedEvent<[
    string,
    BigNumber
], ValueTransferFailedEventObject>;
type ValueTransferFailedEventFilter = TypedEventFilter<ValueTransferFailedEvent>;
interface LZEndpointMock extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: LZEndpointMockInterface;
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
        blockNextMsg(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        defaultAdapterParams(overrides?: CallOverrides): Promise<[string]>;
        estimateFees(_dstChainId: PromiseOrValue<BigNumberish>, _userApplication: PromiseOrValue<string>, _payload: PromiseOrValue<BytesLike>, _payInZRO: PromiseOrValue<boolean>, _adapterParams: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber
        ] & {
            nativeFee: BigNumber;
            zroFee: BigNumber;
        }>;
        forceResumeReceive(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getChainId(overrides?: CallOverrides): Promise<[number]>;
        getConfig(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<string>, arg3: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        getInboundNonce(_chainID: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[BigNumber]>;
        getLengthOfQueue(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[BigNumber]>;
        getOutboundNonce(_chainID: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        getReceiveLibraryAddress(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[string]>;
        getReceiveVersion(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[number]>;
        getSendLibraryAddress(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[string]>;
        getSendVersion(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[number]>;
        hasStoredPayload(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
        inboundNonce(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[BigNumber]>;
        isReceivingPayload(overrides?: CallOverrides): Promise<[boolean]>;
        isSendingPayload(overrides?: CallOverrides): Promise<[boolean]>;
        lzEndpointLookup(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[string]>;
        mockChainId(overrides?: CallOverrides): Promise<[number]>;
        msgsToDeliver(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, arg2: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            string,
            BigNumber,
            string
        ] & {
            dstAddress: string;
            nonce: BigNumber;
            payload: string;
        }>;
        nextMsgBlocked(overrides?: CallOverrides): Promise<[boolean]>;
        oracleFee(overrides?: CallOverrides): Promise<[BigNumber]>;
        outboundNonce(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        protocolFeeConfig(overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber
        ] & {
            zroFee: BigNumber;
            nativeBP: BigNumber;
        }>;
        receivePayload(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, _dstAddress: PromiseOrValue<string>, _nonce: PromiseOrValue<BigNumberish>, _gasLimit: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        relayerFeeConfig(overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber,
            BigNumber,
            BigNumber,
            BigNumber
        ] & {
            dstPriceRatio: BigNumber;
            dstGasPriceInWei: BigNumber;
            dstNativeAmtCap: BigNumber;
            baseGas: BigNumber;
            gasPerByte: BigNumber;
        }>;
        retryPayload(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        send(_chainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, _payload: PromiseOrValue<BytesLike>, _refundAddress: PromiseOrValue<string>, _zroPaymentAddress: PromiseOrValue<string>, _adapterParams: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setConfig(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<BigNumberish>, arg3: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setDefaultAdapterParams(_adapterParams: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setDestLzEndpoint(destAddr: PromiseOrValue<string>, lzEndpointAddr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setOracleFee(_oracleFee: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setProtocolFee(_zroFee: PromiseOrValue<BigNumberish>, _nativeBP: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setReceiveVersion(arg0: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setRelayerPrice(_dstPriceRatio: PromiseOrValue<BigNumberish>, _dstGasPriceInWei: PromiseOrValue<BigNumberish>, _dstNativeAmtCap: PromiseOrValue<BigNumberish>, _baseGas: PromiseOrValue<BigNumberish>, _gasPerByte: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setSendVersion(arg0: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        storedPayload(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[
            BigNumber,
            string,
            string
        ] & {
            payloadLength: BigNumber;
            dstAddress: string;
            payloadHash: string;
        }>;
    };
    blockNextMsg(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    defaultAdapterParams(overrides?: CallOverrides): Promise<string>;
    estimateFees(_dstChainId: PromiseOrValue<BigNumberish>, _userApplication: PromiseOrValue<string>, _payload: PromiseOrValue<BytesLike>, _payInZRO: PromiseOrValue<boolean>, _adapterParams: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[
        BigNumber,
        BigNumber
    ] & {
        nativeFee: BigNumber;
        zroFee: BigNumber;
    }>;
    forceResumeReceive(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getChainId(overrides?: CallOverrides): Promise<number>;
    getConfig(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<string>, arg3: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    getInboundNonce(_chainID: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
    getLengthOfQueue(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
    getOutboundNonce(_chainID: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    getReceiveLibraryAddress(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
    getReceiveVersion(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number>;
    getSendLibraryAddress(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
    getSendVersion(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number>;
    hasStoredPayload(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    inboundNonce(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
    isReceivingPayload(overrides?: CallOverrides): Promise<boolean>;
    isSendingPayload(overrides?: CallOverrides): Promise<boolean>;
    lzEndpointLookup(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
    mockChainId(overrides?: CallOverrides): Promise<number>;
    msgsToDeliver(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, arg2: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
        string,
        BigNumber,
        string
    ] & {
        dstAddress: string;
        nonce: BigNumber;
        payload: string;
    }>;
    nextMsgBlocked(overrides?: CallOverrides): Promise<boolean>;
    oracleFee(overrides?: CallOverrides): Promise<BigNumber>;
    outboundNonce(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    protocolFeeConfig(overrides?: CallOverrides): Promise<[
        BigNumber,
        BigNumber
    ] & {
        zroFee: BigNumber;
        nativeBP: BigNumber;
    }>;
    receivePayload(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, _dstAddress: PromiseOrValue<string>, _nonce: PromiseOrValue<BigNumberish>, _gasLimit: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    relayerFeeConfig(overrides?: CallOverrides): Promise<[
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber
    ] & {
        dstPriceRatio: BigNumber;
        dstGasPriceInWei: BigNumber;
        dstNativeAmtCap: BigNumber;
        baseGas: BigNumber;
        gasPerByte: BigNumber;
    }>;
    retryPayload(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    send(_chainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, _payload: PromiseOrValue<BytesLike>, _refundAddress: PromiseOrValue<string>, _zroPaymentAddress: PromiseOrValue<string>, _adapterParams: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setConfig(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<BigNumberish>, arg3: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setDefaultAdapterParams(_adapterParams: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setDestLzEndpoint(destAddr: PromiseOrValue<string>, lzEndpointAddr: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setOracleFee(_oracleFee: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setProtocolFee(_zroFee: PromiseOrValue<BigNumberish>, _nativeBP: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setReceiveVersion(arg0: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setRelayerPrice(_dstPriceRatio: PromiseOrValue<BigNumberish>, _dstGasPriceInWei: PromiseOrValue<BigNumberish>, _dstNativeAmtCap: PromiseOrValue<BigNumberish>, _baseGas: PromiseOrValue<BigNumberish>, _gasPerByte: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setSendVersion(arg0: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    storedPayload(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[
        BigNumber,
        string,
        string
    ] & {
        payloadLength: BigNumber;
        dstAddress: string;
        payloadHash: string;
    }>;
    callStatic: {
        blockNextMsg(overrides?: CallOverrides): Promise<void>;
        defaultAdapterParams(overrides?: CallOverrides): Promise<string>;
        estimateFees(_dstChainId: PromiseOrValue<BigNumberish>, _userApplication: PromiseOrValue<string>, _payload: PromiseOrValue<BytesLike>, _payInZRO: PromiseOrValue<boolean>, _adapterParams: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber
        ] & {
            nativeFee: BigNumber;
            zroFee: BigNumber;
        }>;
        forceResumeReceive(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        getChainId(overrides?: CallOverrides): Promise<number>;
        getConfig(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<string>, arg3: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        getInboundNonce(_chainID: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        getLengthOfQueue(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        getOutboundNonce(_chainID: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getReceiveLibraryAddress(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        getReceiveVersion(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number>;
        getSendLibraryAddress(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        getSendVersion(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number>;
        hasStoredPayload(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        inboundNonce(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        isReceivingPayload(overrides?: CallOverrides): Promise<boolean>;
        isSendingPayload(overrides?: CallOverrides): Promise<boolean>;
        lzEndpointLookup(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        mockChainId(overrides?: CallOverrides): Promise<number>;
        msgsToDeliver(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, arg2: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            string,
            BigNumber,
            string
        ] & {
            dstAddress: string;
            nonce: BigNumber;
            payload: string;
        }>;
        nextMsgBlocked(overrides?: CallOverrides): Promise<boolean>;
        oracleFee(overrides?: CallOverrides): Promise<BigNumber>;
        outboundNonce(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        protocolFeeConfig(overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber
        ] & {
            zroFee: BigNumber;
            nativeBP: BigNumber;
        }>;
        receivePayload(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, _dstAddress: PromiseOrValue<string>, _nonce: PromiseOrValue<BigNumberish>, _gasLimit: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        relayerFeeConfig(overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber,
            BigNumber,
            BigNumber,
            BigNumber
        ] & {
            dstPriceRatio: BigNumber;
            dstGasPriceInWei: BigNumber;
            dstNativeAmtCap: BigNumber;
            baseGas: BigNumber;
            gasPerByte: BigNumber;
        }>;
        retryPayload(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, _payload: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        send(_chainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, _payload: PromiseOrValue<BytesLike>, _refundAddress: PromiseOrValue<string>, _zroPaymentAddress: PromiseOrValue<string>, _adapterParams: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        setConfig(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<BigNumberish>, arg3: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        setDefaultAdapterParams(_adapterParams: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        setDestLzEndpoint(destAddr: PromiseOrValue<string>, lzEndpointAddr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setOracleFee(_oracleFee: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setProtocolFee(_zroFee: PromiseOrValue<BigNumberish>, _nativeBP: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setReceiveVersion(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setRelayerPrice(_dstPriceRatio: PromiseOrValue<BigNumberish>, _dstGasPriceInWei: PromiseOrValue<BigNumberish>, _dstNativeAmtCap: PromiseOrValue<BigNumberish>, _baseGas: PromiseOrValue<BigNumberish>, _gasPerByte: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setSendVersion(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        storedPayload(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[
            BigNumber,
            string,
            string
        ] & {
            payloadLength: BigNumber;
            dstAddress: string;
            payloadHash: string;
        }>;
    };
    filters: {
        "PayloadCleared(uint16,bytes,uint64,address)"(srcChainId?: null, srcAddress?: null, nonce?: null, dstAddress?: null): PayloadClearedEventFilter;
        PayloadCleared(srcChainId?: null, srcAddress?: null, nonce?: null, dstAddress?: null): PayloadClearedEventFilter;
        "PayloadStored(uint16,bytes,address,uint64,bytes,bytes)"(srcChainId?: null, srcAddress?: null, dstAddress?: null, nonce?: null, payload?: null, reason?: null): PayloadStoredEventFilter;
        PayloadStored(srcChainId?: null, srcAddress?: null, dstAddress?: null, nonce?: null, payload?: null, reason?: null): PayloadStoredEventFilter;
        "UaForceResumeReceive(uint16,bytes)"(chainId?: null, srcAddress?: null): UaForceResumeReceiveEventFilter;
        UaForceResumeReceive(chainId?: null, srcAddress?: null): UaForceResumeReceiveEventFilter;
        "ValueTransferFailed(address,uint256)"(to?: PromiseOrValue<string> | null, quantity?: PromiseOrValue<BigNumberish> | null): ValueTransferFailedEventFilter;
        ValueTransferFailed(to?: PromiseOrValue<string> | null, quantity?: PromiseOrValue<BigNumberish> | null): ValueTransferFailedEventFilter;
    };
    estimateGas: {
        blockNextMsg(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        defaultAdapterParams(overrides?: CallOverrides): Promise<BigNumber>;
        estimateFees(_dstChainId: PromiseOrValue<BigNumberish>, _userApplication: PromiseOrValue<string>, _payload: PromiseOrValue<BytesLike>, _payInZRO: PromiseOrValue<boolean>, _adapterParams: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        forceResumeReceive(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getChainId(overrides?: CallOverrides): Promise<BigNumber>;
        getConfig(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<string>, arg3: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getInboundNonce(_chainID: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        getLengthOfQueue(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        getOutboundNonce(_chainID: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getReceiveLibraryAddress(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getReceiveVersion(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getSendLibraryAddress(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getSendVersion(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        hasStoredPayload(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        inboundNonce(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        isReceivingPayload(overrides?: CallOverrides): Promise<BigNumber>;
        isSendingPayload(overrides?: CallOverrides): Promise<BigNumber>;
        lzEndpointLookup(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        mockChainId(overrides?: CallOverrides): Promise<BigNumber>;
        msgsToDeliver(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, arg2: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        nextMsgBlocked(overrides?: CallOverrides): Promise<BigNumber>;
        oracleFee(overrides?: CallOverrides): Promise<BigNumber>;
        outboundNonce(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        protocolFeeConfig(overrides?: CallOverrides): Promise<BigNumber>;
        receivePayload(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, _dstAddress: PromiseOrValue<string>, _nonce: PromiseOrValue<BigNumberish>, _gasLimit: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        relayerFeeConfig(overrides?: CallOverrides): Promise<BigNumber>;
        retryPayload(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        send(_chainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, _payload: PromiseOrValue<BytesLike>, _refundAddress: PromiseOrValue<string>, _zroPaymentAddress: PromiseOrValue<string>, _adapterParams: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setConfig(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<BigNumberish>, arg3: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setDefaultAdapterParams(_adapterParams: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setDestLzEndpoint(destAddr: PromiseOrValue<string>, lzEndpointAddr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setOracleFee(_oracleFee: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setProtocolFee(_zroFee: PromiseOrValue<BigNumberish>, _nativeBP: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setReceiveVersion(arg0: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setRelayerPrice(_dstPriceRatio: PromiseOrValue<BigNumberish>, _dstGasPriceInWei: PromiseOrValue<BigNumberish>, _dstNativeAmtCap: PromiseOrValue<BigNumberish>, _baseGas: PromiseOrValue<BigNumberish>, _gasPerByte: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setSendVersion(arg0: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        storedPayload(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        blockNextMsg(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        defaultAdapterParams(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        estimateFees(_dstChainId: PromiseOrValue<BigNumberish>, _userApplication: PromiseOrValue<string>, _payload: PromiseOrValue<BytesLike>, _payInZRO: PromiseOrValue<boolean>, _adapterParams: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        forceResumeReceive(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getChainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getConfig(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<string>, arg3: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getInboundNonce(_chainID: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getLengthOfQueue(_srcChainId: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getOutboundNonce(_chainID: PromiseOrValue<BigNumberish>, _srcAddress: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getReceiveLibraryAddress(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getReceiveVersion(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getSendLibraryAddress(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getSendVersion(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        hasStoredPayload(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        inboundNonce(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isReceivingPayload(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isSendingPayload(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        lzEndpointLookup(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        mockChainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        msgsToDeliver(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, arg2: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        nextMsgBlocked(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        oracleFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        outboundNonce(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        protocolFeeConfig(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        receivePayload(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, _dstAddress: PromiseOrValue<string>, _nonce: PromiseOrValue<BigNumberish>, _gasLimit: PromiseOrValue<BigNumberish>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        relayerFeeConfig(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        retryPayload(_srcChainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, _payload: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        send(_chainId: PromiseOrValue<BigNumberish>, _path: PromiseOrValue<BytesLike>, _payload: PromiseOrValue<BytesLike>, _refundAddress: PromiseOrValue<string>, _zroPaymentAddress: PromiseOrValue<string>, _adapterParams: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setConfig(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<BigNumberish>, arg3: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setDefaultAdapterParams(_adapterParams: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setDestLzEndpoint(destAddr: PromiseOrValue<string>, lzEndpointAddr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setOracleFee(_oracleFee: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setProtocolFee(_zroFee: PromiseOrValue<BigNumberish>, _nativeBP: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setReceiveVersion(arg0: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setRelayerPrice(_dstPriceRatio: PromiseOrValue<BigNumberish>, _dstGasPriceInWei: PromiseOrValue<BigNumberish>, _dstNativeAmtCap: PromiseOrValue<BigNumberish>, _baseGas: PromiseOrValue<BigNumberish>, _gasPerByte: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setSendVersion(arg0: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        storedPayload(arg0: PromiseOrValue<BigNumberish>, arg1: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}

type index$c_LZEndpointMock = LZEndpointMock;
declare namespace index$c {
  export {
    index$c_LZEndpointMock as LZEndpointMock,
  };
}

declare namespace index$b {
  export {
    index$d as lzApp,
    index$c as mocks,
  };
}

declare class ILayerZeroEndpoint__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_dstChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "address";
            readonly name: "_userApplication";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "_payload";
            readonly type: "bytes";
        }, {
            readonly internalType: "bool";
            readonly name: "_payInZRO";
            readonly type: "bool";
        }, {
            readonly internalType: "bytes";
            readonly name: "_adapterParam";
            readonly type: "bytes";
        }];
        readonly name: "estimateFees";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "nativeFee";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "zroFee";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_srcChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "_srcAddress";
            readonly type: "bytes";
        }];
        readonly name: "forceResumeReceive";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getChainId";
        readonly outputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_version";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint16";
            readonly name: "_chainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "address";
            readonly name: "_userApplication";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_configType";
            readonly type: "uint256";
        }];
        readonly name: "getConfig";
        readonly outputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_srcChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "_srcAddress";
            readonly type: "bytes";
        }];
        readonly name: "getInboundNonce";
        readonly outputs: readonly [{
            readonly internalType: "uint64";
            readonly name: "";
            readonly type: "uint64";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_dstChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "address";
            readonly name: "_srcAddress";
            readonly type: "address";
        }];
        readonly name: "getOutboundNonce";
        readonly outputs: readonly [{
            readonly internalType: "uint64";
            readonly name: "";
            readonly type: "uint64";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_userApplication";
            readonly type: "address";
        }];
        readonly name: "getReceiveLibraryAddress";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_userApplication";
            readonly type: "address";
        }];
        readonly name: "getReceiveVersion";
        readonly outputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_userApplication";
            readonly type: "address";
        }];
        readonly name: "getSendLibraryAddress";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_userApplication";
            readonly type: "address";
        }];
        readonly name: "getSendVersion";
        readonly outputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_srcChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "_srcAddress";
            readonly type: "bytes";
        }];
        readonly name: "hasStoredPayload";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "isReceivingPayload";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "isSendingPayload";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_srcChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "_srcAddress";
            readonly type: "bytes";
        }, {
            readonly internalType: "address";
            readonly name: "_dstAddress";
            readonly type: "address";
        }, {
            readonly internalType: "uint64";
            readonly name: "_nonce";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint256";
            readonly name: "_gasLimit";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "_payload";
            readonly type: "bytes";
        }];
        readonly name: "receivePayload";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_srcChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "_srcAddress";
            readonly type: "bytes";
        }, {
            readonly internalType: "bytes";
            readonly name: "_payload";
            readonly type: "bytes";
        }];
        readonly name: "retryPayload";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_dstChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "_destination";
            readonly type: "bytes";
        }, {
            readonly internalType: "bytes";
            readonly name: "_payload";
            readonly type: "bytes";
        }, {
            readonly internalType: "address payable";
            readonly name: "_refundAddress";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_zroPaymentAddress";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "_adapterParams";
            readonly type: "bytes";
        }];
        readonly name: "send";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_version";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint16";
            readonly name: "_chainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint256";
            readonly name: "_configType";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "_config";
            readonly type: "bytes";
        }];
        readonly name: "setConfig";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_version";
            readonly type: "uint16";
        }];
        readonly name: "setReceiveVersion";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_version";
            readonly type: "uint16";
        }];
        readonly name: "setSendVersion";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): ILayerZeroEndpointInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): ILayerZeroEndpoint;
}

declare class ILayerZeroReceiver__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_srcChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "_srcAddress";
            readonly type: "bytes";
        }, {
            readonly internalType: "uint64";
            readonly name: "_nonce";
            readonly type: "uint64";
        }, {
            readonly internalType: "bytes";
            readonly name: "_payload";
            readonly type: "bytes";
        }];
        readonly name: "lzReceive";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): ILayerZeroReceiverInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): ILayerZeroReceiver;
}

declare class ILayerZeroUserApplicationConfig__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_srcChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "_srcAddress";
            readonly type: "bytes";
        }];
        readonly name: "forceResumeReceive";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_version";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint16";
            readonly name: "_chainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint256";
            readonly name: "_configType";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "_config";
            readonly type: "bytes";
        }];
        readonly name: "setConfig";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_version";
            readonly type: "uint16";
        }];
        readonly name: "setReceiveVersion";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_version";
            readonly type: "uint16";
        }];
        readonly name: "setSendVersion";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): ILayerZeroUserApplicationConfigInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): ILayerZeroUserApplicationConfig;
}

type index$a_ILayerZeroEndpoint__factory = ILayerZeroEndpoint__factory;
declare const index$a_ILayerZeroEndpoint__factory: typeof ILayerZeroEndpoint__factory;
type index$a_ILayerZeroReceiver__factory = ILayerZeroReceiver__factory;
declare const index$a_ILayerZeroReceiver__factory: typeof ILayerZeroReceiver__factory;
type index$a_ILayerZeroUserApplicationConfig__factory = ILayerZeroUserApplicationConfig__factory;
declare const index$a_ILayerZeroUserApplicationConfig__factory: typeof ILayerZeroUserApplicationConfig__factory;
declare namespace index$a {
  export {
    index$a_ILayerZeroEndpoint__factory as ILayerZeroEndpoint__factory,
    index$a_ILayerZeroReceiver__factory as ILayerZeroReceiver__factory,
    index$a_ILayerZeroUserApplicationConfig__factory as ILayerZeroUserApplicationConfig__factory,
  };
}

declare namespace index$9 {
  export {
    index$a as interfaces,
  };
}

declare namespace index$8 {
  export {
    index$9 as contracts,
  };
}

declare namespace index$7 {
  export {
    index$8 as lzEvmV107,
  };
}

declare class Ownable__factory {
    static readonly abi: readonly [{
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "previousOwner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "OwnershipTransferred";
        readonly type: "event";
    }, {
        readonly inputs: readonly [];
        readonly name: "owner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "renounceOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "transferOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): OwnableInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): Ownable;
}

type index$6_Ownable__factory = Ownable__factory;
declare const index$6_Ownable__factory: typeof Ownable__factory;
declare namespace index$6 {
  export {
    index$6_Ownable__factory as Ownable__factory,
  };
}

declare namespace index$5 {
  export {
    index$6 as access,
  };
}

declare namespace index$4 {
  export {
    index$5 as contracts,
  };
}

declare class LzApp__factory {
    static readonly abi: readonly [{
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "previousOwner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "OwnershipTransferred";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint16";
            readonly name: "_dstChainId";
            readonly type: "uint16";
        }, {
            readonly indexed: false;
            readonly internalType: "uint16";
            readonly name: "_type";
            readonly type: "uint16";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "_minDstGas";
            readonly type: "uint256";
        }];
        readonly name: "SetMinDstGas";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "precrime";
            readonly type: "address";
        }];
        readonly name: "SetPrecrime";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint16";
            readonly name: "_remoteChainId";
            readonly type: "uint16";
        }, {
            readonly indexed: false;
            readonly internalType: "bytes";
            readonly name: "_path";
            readonly type: "bytes";
        }];
        readonly name: "SetTrustedRemote";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint16";
            readonly name: "_remoteChainId";
            readonly type: "uint16";
        }, {
            readonly indexed: false;
            readonly internalType: "bytes";
            readonly name: "_remoteAddress";
            readonly type: "bytes";
        }];
        readonly name: "SetTrustedRemoteAddress";
        readonly type: "event";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_srcChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "_srcAddress";
            readonly type: "bytes";
        }];
        readonly name: "forceResumeReceive";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_version";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint16";
            readonly name: "_chainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_configType";
            readonly type: "uint256";
        }];
        readonly name: "getConfig";
        readonly outputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_remoteChainId";
            readonly type: "uint16";
        }];
        readonly name: "getTrustedRemoteAddress";
        readonly outputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_srcChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "_srcAddress";
            readonly type: "bytes";
        }];
        readonly name: "isTrustedRemote";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "lzEndpoint";
        readonly outputs: readonly [{
            readonly internalType: "contract ILayerZeroEndpoint";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_srcChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "_srcAddress";
            readonly type: "bytes";
        }, {
            readonly internalType: "uint64";
            readonly name: "_nonce";
            readonly type: "uint64";
        }, {
            readonly internalType: "bytes";
            readonly name: "_payload";
            readonly type: "bytes";
        }];
        readonly name: "lzReceive";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }];
        readonly name: "minDstGasLookup";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "owner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "precrime";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "renounceOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_version";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint16";
            readonly name: "_chainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint256";
            readonly name: "_configType";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "_config";
            readonly type: "bytes";
        }];
        readonly name: "setConfig";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_dstChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint16";
            readonly name: "_packetType";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint256";
            readonly name: "_minGas";
            readonly type: "uint256";
        }];
        readonly name: "setMinDstGas";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_precrime";
            readonly type: "address";
        }];
        readonly name: "setPrecrime";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_version";
            readonly type: "uint16";
        }];
        readonly name: "setReceiveVersion";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_version";
            readonly type: "uint16";
        }];
        readonly name: "setSendVersion";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_srcChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "_path";
            readonly type: "bytes";
        }];
        readonly name: "setTrustedRemote";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_remoteChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "_remoteAddress";
            readonly type: "bytes";
        }];
        readonly name: "setTrustedRemoteAddress";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "transferOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }];
        readonly name: "trustedRemoteLookup";
        readonly outputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): LzAppInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): LzApp;
}

declare class NonblockingLzApp__factory {
    static readonly abi: readonly [{
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint16";
            readonly name: "_srcChainId";
            readonly type: "uint16";
        }, {
            readonly indexed: false;
            readonly internalType: "bytes";
            readonly name: "_srcAddress";
            readonly type: "bytes";
        }, {
            readonly indexed: false;
            readonly internalType: "uint64";
            readonly name: "_nonce";
            readonly type: "uint64";
        }, {
            readonly indexed: false;
            readonly internalType: "bytes";
            readonly name: "_payload";
            readonly type: "bytes";
        }, {
            readonly indexed: false;
            readonly internalType: "bytes";
            readonly name: "_reason";
            readonly type: "bytes";
        }];
        readonly name: "MessageFailed";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "previousOwner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "OwnershipTransferred";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint16";
            readonly name: "_srcChainId";
            readonly type: "uint16";
        }, {
            readonly indexed: false;
            readonly internalType: "bytes";
            readonly name: "_srcAddress";
            readonly type: "bytes";
        }, {
            readonly indexed: false;
            readonly internalType: "uint64";
            readonly name: "_nonce";
            readonly type: "uint64";
        }, {
            readonly indexed: false;
            readonly internalType: "bytes32";
            readonly name: "_payloadHash";
            readonly type: "bytes32";
        }];
        readonly name: "RetryMessageSuccess";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint16";
            readonly name: "_dstChainId";
            readonly type: "uint16";
        }, {
            readonly indexed: false;
            readonly internalType: "uint16";
            readonly name: "_type";
            readonly type: "uint16";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "_minDstGas";
            readonly type: "uint256";
        }];
        readonly name: "SetMinDstGas";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "precrime";
            readonly type: "address";
        }];
        readonly name: "SetPrecrime";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint16";
            readonly name: "_remoteChainId";
            readonly type: "uint16";
        }, {
            readonly indexed: false;
            readonly internalType: "bytes";
            readonly name: "_path";
            readonly type: "bytes";
        }];
        readonly name: "SetTrustedRemote";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint16";
            readonly name: "_remoteChainId";
            readonly type: "uint16";
        }, {
            readonly indexed: false;
            readonly internalType: "bytes";
            readonly name: "_remoteAddress";
            readonly type: "bytes";
        }];
        readonly name: "SetTrustedRemoteAddress";
        readonly type: "event";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }, {
            readonly internalType: "uint64";
            readonly name: "";
            readonly type: "uint64";
        }];
        readonly name: "failedMessages";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_srcChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "_srcAddress";
            readonly type: "bytes";
        }];
        readonly name: "forceResumeReceive";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_version";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint16";
            readonly name: "_chainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_configType";
            readonly type: "uint256";
        }];
        readonly name: "getConfig";
        readonly outputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_remoteChainId";
            readonly type: "uint16";
        }];
        readonly name: "getTrustedRemoteAddress";
        readonly outputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_srcChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "_srcAddress";
            readonly type: "bytes";
        }];
        readonly name: "isTrustedRemote";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "lzEndpoint";
        readonly outputs: readonly [{
            readonly internalType: "contract ILayerZeroEndpoint";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_srcChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "_srcAddress";
            readonly type: "bytes";
        }, {
            readonly internalType: "uint64";
            readonly name: "_nonce";
            readonly type: "uint64";
        }, {
            readonly internalType: "bytes";
            readonly name: "_payload";
            readonly type: "bytes";
        }];
        readonly name: "lzReceive";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }];
        readonly name: "minDstGasLookup";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_srcChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "_srcAddress";
            readonly type: "bytes";
        }, {
            readonly internalType: "uint64";
            readonly name: "_nonce";
            readonly type: "uint64";
        }, {
            readonly internalType: "bytes";
            readonly name: "_payload";
            readonly type: "bytes";
        }];
        readonly name: "nonblockingLzReceive";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "owner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "precrime";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "renounceOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_srcChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "_srcAddress";
            readonly type: "bytes";
        }, {
            readonly internalType: "uint64";
            readonly name: "_nonce";
            readonly type: "uint64";
        }, {
            readonly internalType: "bytes";
            readonly name: "_payload";
            readonly type: "bytes";
        }];
        readonly name: "retryMessage";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_version";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint16";
            readonly name: "_chainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint256";
            readonly name: "_configType";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "_config";
            readonly type: "bytes";
        }];
        readonly name: "setConfig";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_dstChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint16";
            readonly name: "_packetType";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint256";
            readonly name: "_minGas";
            readonly type: "uint256";
        }];
        readonly name: "setMinDstGas";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_precrime";
            readonly type: "address";
        }];
        readonly name: "setPrecrime";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_version";
            readonly type: "uint16";
        }];
        readonly name: "setReceiveVersion";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_version";
            readonly type: "uint16";
        }];
        readonly name: "setSendVersion";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_srcChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "_path";
            readonly type: "bytes";
        }];
        readonly name: "setTrustedRemote";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_remoteChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "_remoteAddress";
            readonly type: "bytes";
        }];
        readonly name: "setTrustedRemoteAddress";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "transferOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }];
        readonly name: "trustedRemoteLookup";
        readonly outputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): NonblockingLzAppInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): NonblockingLzApp;
}

type index$3_LzApp__factory = LzApp__factory;
declare const index$3_LzApp__factory: typeof LzApp__factory;
type index$3_NonblockingLzApp__factory = NonblockingLzApp__factory;
declare const index$3_NonblockingLzApp__factory: typeof NonblockingLzApp__factory;
declare namespace index$3 {
  export {
    index$3_LzApp__factory as LzApp__factory,
    index$3_NonblockingLzApp__factory as NonblockingLzApp__factory,
  };
}

type LZEndpointMockConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
declare class LZEndpointMock__factory extends ContractFactory {
    constructor(...args: LZEndpointMockConstructorParams);
    deploy(_chainId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<LZEndpointMock>;
    getDeployTransaction(_chainId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): LZEndpointMock;
    connect(signer: Signer): LZEndpointMock__factory;
    static readonly bytecode = "0x6080604052600c805461ffff19166101011790553480156200002057600080fd5b5060405162003b7f38038062003b7f83398101604081905262000043916200013d565b6001805461ffff191661ffff83161781556040805160a0810182526402540be400808252602080830191909152678ac7230489e8000082840152606460608301526080909101929092527402540be400000000000000000000000002540be4006002557801000000000000006400000000000000008ac7230489e800006003558051808201909152670de0b6b3a76400008082526103e891909201819052600491909155600555662386f26fc100006006556200012662030d4060408051600160f01b602082015260228082019390935281518082039093018352604201905290565b6007906200013590826200020f565b5050620002db565b6000602082840312156200015057600080fd5b815161ffff811681146200016357600080fd5b9392505050565b634e487b7160e01b600052604160045260246000fd5b600181811c908216806200019557607f821691505b602082108103620001b657634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200020a57600081815260208120601f850160051c81016020861015620001e55750805b601f850160051c820191505b818110156200020657828155600101620001f1565b5050505b505050565b81516001600160401b038111156200022b576200022b6200016a565b62000243816200023c845462000180565b84620001bc565b602080601f8311600181146200027b5760008415620002625750858301515b600019600386901b1c1916600185901b17855562000206565b600085815260208120601f198616915b82811015620002ac578886015182559484019460019091019084016200028b565b5085821015620002cb5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b61389480620002eb6000396000f3fe60806040526004361061026a5760003560e01c80639924d33b11610153578063ca066b35116100cb578063e97a448a1161007f578063f9cd3ceb11610064578063f9cd3ceb146109b2578063fbba623b146109c8578063fdc07c70146109e857600080fd5b8063e97a448a14610964578063f5ecbdbc1461098057600080fd5b8063d23104f1116100b0578063d23104f11461090a578063da1a7c9a146102c4578063db14f3051461094957600080fd5b8063ca066b35146108c8578063cbed8b9c146108e957600080fd5b8063b6d9ef6011610122578063c2fa481311610107578063c2fa481314610852578063c580310014610872578063c81b383a1461088557600080fd5b8063b6d9ef60146107c4578063c08f15a1146107e457600080fd5b80639924d33b1461070f5780639c729da1146104e3578063aaff5f1614610762578063b20864991461078257600080fd5b80633408e470116101e657806371ba2fd6116101b55780637a1457481161019a5780637a145748146105e25780637f6df8e61461061b578063907c5e7e1461064957600080fd5b806371ba2fd6146104e357806376a386dc1461052857600080fd5b80633408e4701461046a5780633e0dd83e1461048357806340a7bb10146104a357806342d65a8d146104c357600080fd5b806310ddb1371161023d578063240de27711610222578063240de27714610357578063272bd3841461037d5780632c365e251461039f57600080fd5b806310ddb137146102a457806312a9ee6b1461032857600080fd5b806307d3277f1461026f57806307e0db17146102a4578063096568f6146102c45780630eaf6ea6146102f8575b600080fd5b34801561027b57600080fd5b5060045460055461028a919082565b604080519283526020830191909152015b60405180910390f35b3480156102b057600080fd5b506102c26102bf366004612969565b50565b005b3480156102d057600080fd5b506102e56102df3660046129a6565b50600190565b60405161ffff909116815260200161029b565b34801561030457600080fd5b50610318610313366004612a0c565b610a08565b604051901515815260200161029b565b34801561033457600080fd5b50610348610343366004612b39565b610a4e565b60405161029b93929190612bf4565b34801561036357600080fd5b506102c2610372366004612c3c565b600491909155600555565b34801561038957600080fd5b50610392610b6a565b60405161029b9190612c5e565b3480156103ab57600080fd5b506102c26103ba366004612ca9565b6fffffffffffffffffffffffffffffffff94851670010000000000000000000000000000000094861685021760025560038054939095167fffffffffffffffff0000000000000000000000000000000000000000000000009093169290921767ffffffffffffffff9182169093029290921777ffffffffffffffffffffffffffffffffffffffffffffffff1678010000000000000000000000000000000000000000000000009190921602179055565b34801561047657600080fd5b5060015461ffff166102e5565b34801561048f57600080fd5b506001546103189062010000900460ff1681565b3480156104af57600080fd5b5061028a6104be366004612d0e565b610bf8565b3480156104cf57600080fd5b506102c26104de366004612a0c565b610cf7565b3480156104ef57600080fd5b506105036104fe3660046129a6565b503090565b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200161029b565b34801561053457600080fd5b506105a7610543366004612daf565b600a60209081526000928352604090922081518083018401805192815290840192909301919091209152805460019091015467ffffffffffffffff82169168010000000000000000900473ffffffffffffffffffffffffffffffffffffffff169083565b6040805167ffffffffffffffff909416845273ffffffffffffffffffffffffffffffffffffffff90921660208401529082015260600161029b565b3480156105ee57600080fd5b506106026105fd366004612dfd565b610e9c565b60405167ffffffffffffffff909116815260200161029b565b34801561062757600080fd5b5061063b610636366004612a0c565b610ee2565b60405190815260200161029b565b34801561065557600080fd5b506002546003546106c1916fffffffffffffffffffffffffffffffff80821692700100000000000000000000000000000000928390048216929181169167ffffffffffffffff908204811691780100000000000000000000000000000000000000000000000090041685565b604080516fffffffffffffffffffffffffffffffff96871681529486166020860152929094169183019190915267ffffffffffffffff9081166060830152909116608082015260a00161029b565b34801561071b57600080fd5b5061060261072a366004612daf565b6008602090815260009283526040909220815180830184018051928152908401929093019190912091525467ffffffffffffffff1681565b34801561076e57600080fd5b506102c261077d366004612e34565b610f1e565b34801561078e57600080fd5b5061060261079d366004612dfd565b600960209081526000928352604080842090915290825290205467ffffffffffffffff1681565b3480156107d057600080fd5b506102c26107df366004612eb5565b600655565b3480156107f057600080fd5b506102c26107ff366004612ece565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260208190526040902080547fffffffffffffffffffffffff00000000000000000000000000000000000000001691909216179055565b34801561085e57600080fd5b506102c261086d366004612eec565b6111ba565b6102c2610880366004612f9c565b611b53565b34801561089157600080fd5b506105036108a03660046129a6565b60006020819052908152604090205473ffffffffffffffffffffffffffffffffffffffff1681565b3480156108d457600080fd5b50610318600c54610100900460ff1660021490565b3480156108f557600080fd5b506102c2610904366004613064565b50505050565b34801561091657600080fd5b506102c2600180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ffff1662010000179055565b34801561095557600080fd5b506001546102e59061ffff1681565b34801561097057600080fd5b50610318600c5460ff1660021490565b34801561098c57600080fd5b5061039261099b3660046130cc565b604080516020810190915260008152949350505050565b3480156109be57600080fd5b5061063b60065481565b3480156109d457600080fd5b506102c26109e3366004613119565b612251565b3480156109f457600080fd5b50610602610a03366004612a0c565b612261565b61ffff83166000908152600a60205260408082209051829190610a2e9086908690613156565b9081526040519081900360200190206001015415159150505b9392505050565b600b6020908152600084815260409020835180850183018051928152908301928501929092209152805482908110610a8557600080fd5b60009182526020909120600290910201805460018201805473ffffffffffffffffffffffffffffffffffffffff831696507401000000000000000000000000000000000000000090920467ffffffffffffffff169450919250610ae790613166565b80601f0160208091040260200160405190810160405280929190818152602001828054610b1390613166565b8015610b605780601f10610b3557610100808354040283529160200191610b60565b820191906000526020600020905b815481529060010190602001808311610b4357829003601f168201915b5050505050905083565b60078054610b7790613166565b80601f0160208091040260200160405190810160405280929190818152602001828054610ba390613166565b8015610bf05780601f10610bc557610100808354040283529160200191610bf0565b820191906000526020600020905b815481529060010190602001808311610bd357829003601f168201915b505050505081565b600080600080845111610c955760078054610c1290613166565b80601f0160208091040260200160405190810160405280929190818152602001828054610c3e90613166565b8015610c8b5780601f10610c6057610100808354040283529160200191610c8b565b820191906000526020600020905b815481529060010190602001808311610c6e57829003601f168201915b5050505050610c97565b835b90506000610caa8960018a8a51866122a7565b90506000610cbb87836006546124dc565b905086610ccb5780945084610cd0565b809350835b50600654610cde83876131e8565b610ce891906131e8565b94505050509550959350505050565b61ffff83166000908152600a60205260408082209051610d1a9085908590613156565b9081526040519081900360200190206001810154909150610d9c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f4c617965725a65726f4d6f636b3a206e6f2073746f726564207061796c6f616460448201526064015b60405180910390fd5b805468010000000000000000900473ffffffffffffffffffffffffffffffffffffffff163314610e28576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f4c617965725a65726f4d6f636b3a20696e76616c69642063616c6c65720000006044820152606401610d93565b80547fffffffff00000000000000000000000000000000000000000000000000000000168155600060018201556040517f23d2684f396e92a6e2ff2d16f98e6fea00d50cb27a64b531bc0748f730211f9890610e8990869086908690613244565b60405180910390a1610904848484612519565b61ffff8216600090815260096020908152604080832073ffffffffffffffffffffffffffffffffffffffff8516845290915290205467ffffffffffffffff165b92915050565b61ffff83166000908152600b60205260408082209051610f059085908590613156565b9081526040519081900360200190205490509392505050565b61ffff85166000908152600a60205260408082209051610f419087908790613156565b9081526040519081900360200190206001810154909150610fbe576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f4c617965725a65726f4d6f636b3a206e6f2073746f726564207061796c6f61646044820152606401610d93565b805467ffffffffffffffff1682148015610ff2575080600101548383604051610fe8929190613156565b6040518091039020145b611058576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f4c617965725a65726f4d6f636b3a20696e76616c6964207061796c6f616400006044820152606401610d93565b80547fffffffff000000000000000000000000000000000000000000000000000000008116825560006001830181905561ffff881681526008602052604080822090516801000000000000000090930473ffffffffffffffffffffffffffffffffffffffff16926110cc9089908990613156565b908152604051908190036020018120547e1d356700000000000000000000000000000000000000000000000000000000825267ffffffffffffffff16915073ffffffffffffffffffffffffffffffffffffffff831690621d35679061113f908b908b908b9087908c908c90600401613262565b600060405180830381600087803b15801561115957600080fd5b505af115801561116d573d6000803e3d6000fd5b505050507f612434f39581c8e7d99746c9c20c6eb0ce8c0eb99f007c5719d620841370957d88888884866040516111a89594939291906132b0565b60405180910390a15050505050505050565b600c54610100900460ff16600114611253576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f4c617965725a65726f4d6f636b3a206e6f2072656365697665207265656e747260448201527f616e6379000000000000000000000000000000000000000000000000000000006064820152608401610d93565b600c80547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff1661020017905561ffff88166000908152600a602052604080822090516112a2908a908a90613156565b90815260200160405180910390209050600860008a61ffff1661ffff16815260200190815260200160002088886040516112dd929190613156565b90815260405190819003602001902080546000906113049067ffffffffffffffff16613306565b91906101000a81548167ffffffffffffffff021916908367ffffffffffffffff160217905567ffffffffffffffff168567ffffffffffffffff16146113a5576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601a60248201527f4c617965725a65726f4d6f636b3a2077726f6e67206e6f6e63650000000000006044820152606401610d93565b6001810154156117795761ffff89166000908152600b602052604080822090516113d2908b908b90613156565b90815260200160405180910390209050600060405180606001604052808973ffffffffffffffffffffffffffffffffffffffff1681526020018867ffffffffffffffff16815260200186868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050509152508254909150156116d3578154600181810184556000848152602090819020845160029094020180549185015167ffffffffffffffff1674010000000000000000000000000000000000000000027fffffffff0000000000000000000000000000000000000000000000000000000090921673ffffffffffffffffffffffffffffffffffffffff9094169390931717825560408301518392918201906114f8908261337c565b50505060005b825461150c90600190613496565b81101561162157828181548110611525576115256134a9565b90600052602060002090600202018382600161154191906131e8565b81548110611551576115516134a9565b600091825260209091208254600290920201805473ffffffffffffffffffffffffffffffffffffffff9092167fffffffffffffffffffffffff000000000000000000000000000000000000000083168117825583547fffffffff0000000000000000000000000000000000000000000000000000000090931617740100000000000000000000000000000000000000009283900467ffffffffffffffff1690920291909117815560018082019061160a908401826134d8565b5090505080806116199061360d565b9150506114fe565b508082600081548110611636576116366134a9565b6000918252602091829020835160029092020180549284015167ffffffffffffffff1674010000000000000000000000000000000000000000027fffffffff0000000000000000000000000000000000000000000000000000000090931673ffffffffffffffffffffffffffffffffffffffff90921691909117919091178155604082015160018201906116ca908261337c565b50905050611772565b8154600181810184556000848152602090819020845160029094020180549185015167ffffffffffffffff1674010000000000000000000000000000000000000000027fffffffff0000000000000000000000000000000000000000000000000000000090921673ffffffffffffffffffffffffffffffffffffffff90941693909317178255604083015183929182019061176e908261337c565b5050505b5050611b1c565b60015462010000900460ff16156118fc5760405180606001604052808484905067ffffffffffffffff1681526020018773ffffffffffffffffffffffffffffffffffffffff16815260200184846040516117d4929190613156565b604080519182900390912090915261ffff8b166000908152600a6020528190209051611803908b908b90613156565b908152604080519182900360209081018320845181548684015173ffffffffffffffffffffffffffffffffffffffff1668010000000000000000027fffffffff0000000000000000000000000000000000000000000000000000000090911667ffffffffffffffff909216919091171781559382015160019094019390935591810182526000815290517f0f9e4d95b62f08222d612b5ab92039cd8fbbbea550a95e8df9f927436bbdf5db916118c7918c918c918c918c918c918b918b9190613645565b60405180910390a1600180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ffff169055611b1c565b6040517e1d356700000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff871690621d3567908690611958908d908d908d908c908b908b90600401613262565b600060405180830381600088803b15801561197257600080fd5b5087f193505050508015611984575060015b611b1c573d8080156119b2576040519150601f19603f3d011682016040523d82523d6000602084013e6119b7565b606091505b5060405180606001604052808585905067ffffffffffffffff1681526020018873ffffffffffffffffffffffffffffffffffffffff1681526020018585604051611a02929190613156565b604080519182900390912090915261ffff8c166000908152600a6020528190209051611a31908c908c90613156565b908152604080519182900360209081018320845181549286015173ffffffffffffffffffffffffffffffffffffffff1668010000000000000000027fffffffff0000000000000000000000000000000000000000000000000000000090931667ffffffffffffffff909116179190911781559201516001909201919091557f0f9e4d95b62f08222d612b5ab92039cd8fbbbea550a95e8df9f927436bbdf5db90611aea908c908c908c908c908c908b908b908a90613645565b60405180910390a150600180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ffff1690555b5050600c80547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff1661010017905550505050505050565b600c5460ff16600114611be8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602160248201527f4c617965725a65726f4d6f636b3a206e6f2073656e64207265656e7472616e6360448201527f79000000000000000000000000000000000000000000000000000000000000006064820152608401610d93565b600c80547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001660021790558551602814611ca4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602c60248201527f4c617965725a65726f4d6f636b3a20696e636f72726563742072656d6f74652060448201527f616464726573732073697a6500000000000000000000000000000000000000006064820152608401610d93565b601486015173ffffffffffffffffffffffffffffffffffffffff8082166000908152602081905260409020541680611d5e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603760248201527f4c617965725a65726f4d6f636b3a2064657374696e6174696f6e204c6179657260448201527f5a65726f20456e64706f696e74206e6f7420666f756e640000000000000000006064820152608401610d93565b600080845111611df85760078054611d7590613166565b80601f0160208091040260200160405190810160405280929190818152602001828054611da190613166565b8015611dee5780601f10611dc357610100808354040283529160200191611dee565b820191906000526020600020905b815481529060010190602001808311611dd157829003601f168201915b5050505050611dfa565b835b90506000611e588b338b8b8080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050505073ffffffffffffffffffffffffffffffffffffffff8a16151586610bf8565b50905080341015611eeb576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602960248201527f4c617965725a65726f4d6f636b3a206e6f7420656e6f756768206e617469766560448201527f20666f72206665657300000000000000000000000000000000000000000000006064820152608401610d93565b61ffff8b166000908152600960209081526040808320338452909152812080548290611f209067ffffffffffffffff16613306565b91906101000a81548167ffffffffffffffff021916908367ffffffffffffffff1602179055905060008234611f559190613496565b905080156120295760008973ffffffffffffffffffffffffffffffffffffffff168260405160006040518083038185875af1925050503d8060008114611fb7576040519150601f19603f3d011682016040523d82523d6000602084013e611fbc565b606091505b5050905080612027576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f4c617965725a65726f4d6f636b3a206661696c656420746f20726566756e64006044820152606401610d93565b505b600080600061203787612772565b919550935091505081156120f35760008173ffffffffffffffffffffffffffffffffffffffff168360405160006040518083038185875af1925050503d806000811461209f576040519150601f19603f3d011682016040523d82523d6000602084013e6120a4565b606091505b50509050806120f157604051839073ffffffffffffffffffffffffffffffffffffffff8416907f2c7a964ca3de5ec1d42d9822f9bbd0eb142a59cc9f855e9d93813b773192c7a390600090a35b505b6040517fffffffffffffffffffffffffffffffffffffffff00000000000000000000000033606090811b821660208401528b901b166034820152600090604801604051602081830303815290604052905060008f8f8080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505090508973ffffffffffffffffffffffffffffffffffffffff1663c2fa4813600160009054906101000a900461ffff16848e8b8a876040518763ffffffff1660e01b81526004016121e0969594939291906136c5565b600060405180830381600087803b1580156121fa57600080fd5b505af115801561220e573d6000803e3d6000fd5b5050600c80547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001660011790555050505050505050505050505050505050505050565b600761225d828261337c565b5050565b61ffff831660009081526008602052604080822090516122849085908590613156565b9081526040519081900360200190205467ffffffffffffffff1690509392505050565b6000806000806122b685612772565b5092509250925060008361ffff1660020361237c576003546fffffffffffffffffffffffffffffffff1682111561236f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f4c617965725a65726f4d6f636b3a206473744e6174697665416d7420746f6f2060448201527f6c617267652000000000000000000000000000000000000000000000000000006064820152608401610d93565b61237982826131e8565b90505b6003546000906123ab908590700100000000000000000000000000000000900467ffffffffffffffff166131e8565b6002546123de919070010000000000000000000000000000000090046fffffffffffffffffffffffffffffffff16613726565b90506123ea81836131e8565b6002549092506000906402540be40090612416906fffffffffffffffffffffffffffffffff1685613726565b612420919061376c565b6002546003549192506000916402540be400916fffffffffffffffffffffffffffffffff8082169261248f92780100000000000000000000000000000000000000000000000090910467ffffffffffffffff169170010000000000000000000000000000000090910416613780565b6124999190613780565b6124a391906137b4565b6fffffffffffffffffffffffffffffffff1690506124c1818b613726565b6124cb90836131e8565b9d9c50505050505050505050505050565b600083156124ed5750600454610a47565b600554612710906124fe84866131e8565b6125089190613726565b612512919061376c565b9050610a47565b61ffff83166000908152600b6020526040808220905161253c9085908590613156565b908152602001604051809103902090505b805415610904578054600090829061256790600190613496565b81548110612577576125776134a9565b6000918252602091829020604080516060810182526002909302909101805473ffffffffffffffffffffffffffffffffffffffff8116845267ffffffffffffffff740100000000000000000000000000000000000000009091041693830193909352600183018054929392918401916125ef90613166565b80601f016020809104026020016040519081016040528092919081815260200182805461261b90613166565b80156126685780601f1061263d57610100808354040283529160200191612668565b820191906000526020600020905b81548152906001019060200180831161264b57829003601f168201915b5050505050815250509050806000015173ffffffffffffffffffffffffffffffffffffffff16621d3567868686856020015186604001516040518663ffffffff1660e01b81526004016126bf9594939291906137e3565b600060405180830381600087803b1580156126d957600080fd5b505af11580156126ed573d6000803e3d6000fd5b50505050818054806127015761270161382f565b60008281526020812060027fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9093019283020180547fffffffff00000000000000000000000000000000000000000000000000000000168155906127686001830182612904565b505090555061254d565b600080600080845160221480612789575060428551115b6127ef576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601560248201527f496e76616c69642061646170746572506172616d7300000000000000000000006044820152606401610d93565b60028501519350602285015192508361ffff166001148061281457508361ffff166002145b61287a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f556e737570706f727465642074785479706500000000000000000000000000006044820152606401610d93565b600083116128e4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600b60248201527f47617320746f6f206c6f770000000000000000000000000000000000000000006044820152606401610d93565b8361ffff166002036128fd575050604283015160568401515b9193509193565b50805461291090613166565b6000825580601f10612920575050565b601f0160209004906000526020600020908101906102bf91905b8082111561294e576000815560010161293a565b5090565b803561ffff8116811461296457600080fd5b919050565b60006020828403121561297b57600080fd5b610a4782612952565b73ffffffffffffffffffffffffffffffffffffffff811681146102bf57600080fd5b6000602082840312156129b857600080fd5b8135610a4781612984565b60008083601f8401126129d557600080fd5b50813567ffffffffffffffff8111156129ed57600080fd5b602083019150836020828501011115612a0557600080fd5b9250929050565b600080600060408486031215612a2157600080fd5b612a2a84612952565b9250602084013567ffffffffffffffff811115612a4657600080fd5b612a52868287016129c3565b9497909650939450505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600082601f830112612a9f57600080fd5b813567ffffffffffffffff80821115612aba57612aba612a5f565b604051601f83017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f01168101908282118183101715612b0057612b00612a5f565b81604052838152866020858801011115612b1957600080fd5b836020870160208301376000602085830101528094505050505092915050565b600080600060608486031215612b4e57600080fd5b612b5784612952565b9250602084013567ffffffffffffffff811115612b7357600080fd5b612b7f86828701612a8e565b925050604084013590509250925092565b6000815180845260005b81811015612bb657602081850181015186830182015201612b9a565b5060006020828601015260207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f83011685010191505092915050565b73ffffffffffffffffffffffffffffffffffffffff8416815267ffffffffffffffff83166020820152606060408201526000612c336060830184612b90565b95945050505050565b60008060408385031215612c4f57600080fd5b50508035926020909101359150565b602081526000610a476020830184612b90565b80356fffffffffffffffffffffffffffffffff8116811461296457600080fd5b803567ffffffffffffffff8116811461296457600080fd5b600080600080600060a08688031215612cc157600080fd5b612cca86612c71565b9450612cd860208701612c71565b9350612ce660408701612c71565b9250612cf460608701612c91565b9150612d0260808701612c91565b90509295509295909350565b600080600080600060a08688031215612d2657600080fd5b612d2f86612952565b94506020860135612d3f81612984565b9350604086013567ffffffffffffffff80821115612d5c57600080fd5b612d6889838a01612a8e565b9450606088013591508115158214612d7f57600080fd5b90925060808701359080821115612d9557600080fd5b50612da288828901612a8e565b9150509295509295909350565b60008060408385031215612dc257600080fd5b612dcb83612952565b9150602083013567ffffffffffffffff811115612de757600080fd5b612df385828601612a8e565b9150509250929050565b60008060408385031215612e1057600080fd5b612e1983612952565b91506020830135612e2981612984565b809150509250929050565b600080600080600060608688031215612e4c57600080fd5b612e5586612952565b9450602086013567ffffffffffffffff80821115612e7257600080fd5b612e7e89838a016129c3565b90965094506040880135915080821115612e9757600080fd5b50612ea4888289016129c3565b969995985093965092949392505050565b600060208284031215612ec757600080fd5b5035919050565b60008060408385031215612ee157600080fd5b8235612e1981612984565b60008060008060008060008060c0898b031215612f0857600080fd5b612f1189612952565b9750602089013567ffffffffffffffff80821115612f2e57600080fd5b612f3a8c838d016129c3565b909950975060408b01359150612f4f82612984565b819650612f5e60608c01612c91565b955060808b0135945060a08b0135915080821115612f7b57600080fd5b50612f888b828c016129c3565b999c989b5096995094979396929594505050565b600080600080600080600060c0888a031215612fb757600080fd5b612fc088612952565b9650602088013567ffffffffffffffff80821115612fdd57600080fd5b612fe98b838c01612a8e565b975060408a0135915080821115612fff57600080fd5b61300b8b838c016129c3565b909750955060608a0135915061302082612984565b90935060808901359061303282612984565b90925060a0890135908082111561304857600080fd5b506130558a828b01612a8e565b91505092959891949750929550565b6000806000806080858703121561307a57600080fd5b61308385612952565b935061309160208601612952565b925060408501359150606085013567ffffffffffffffff8111156130b457600080fd5b6130c087828801612a8e565b91505092959194509250565b600080600080608085870312156130e257600080fd5b6130eb85612952565b93506130f960208601612952565b9250604085013561310981612984565b9396929550929360600135925050565b60006020828403121561312b57600080fd5b813567ffffffffffffffff81111561314257600080fd5b61314e84828501612a8e565b949350505050565b8183823760009101908152919050565b600181811c9082168061317a57607f821691505b6020821081036131b3577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b80820180821115610edc57610edc6131b9565b8183528181602085013750600060208284010152600060207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f840116840101905092915050565b61ffff84168152604060208201526000612c336040830184866131fb565b61ffff871681526080602082015260006132806080830187896131fb565b67ffffffffffffffff8616604084015282810360608401526132a38185876131fb565b9998505050505050505050565b61ffff861681526080602082015260006132ce6080830186886131fb565b905067ffffffffffffffff8416604083015273ffffffffffffffffffffffffffffffffffffffff831660608301529695505050505050565b600067ffffffffffffffff808316818103613323576133236131b9565b6001019392505050565b601f82111561337757600081815260208120601f850160051c810160208610156133545750805b601f850160051c820191505b8181101561337357828155600101613360565b5050505b505050565b815167ffffffffffffffff81111561339657613396612a5f565b6133aa816133a48454613166565b8461332d565b602080601f8311600181146133fd57600084156133c75750858301515b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600386901b1c1916600185901b178555613373565b6000858152602081207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08616915b8281101561344a5788860151825594840194600190910190840161342b565b508582101561348657878501517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600388901b60f8161c191681555b5050505050600190811b01905550565b81810381811115610edc57610edc6131b9565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b8181036134e3575050565b6134ed8254613166565b67ffffffffffffffff81111561350557613505612a5f565b613513816133a48454613166565b6000601f821160018114613565576000831561352f5750848201545b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600385901b1c1916600184901b178455613606565b6000858152602090207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0841690600086815260209020845b838110156135bd578286015482556001958601959091019060200161359d565b50858310156135f957818501547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600388901b60f8161c191681555b50505060018360011b0184555b5050505050565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361363e5761363e6131b9565b5060010190565b61ffff8916815260c06020820152600061366360c08301898b6131fb565b73ffffffffffffffffffffffffffffffffffffffff8816604084015267ffffffffffffffff8716606084015282810360808401526136a28186886131fb565b905082810360a08401526136b68185612b90565b9b9a5050505050505050505050565b61ffff8716815260c0602082015260006136e260c0830188612b90565b73ffffffffffffffffffffffffffffffffffffffff8716604084015267ffffffffffffffff8616606084015284608084015282810360a08401526132a38185612b90565b8082028115828204841417610edc57610edc6131b9565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b60008261377b5761377b61373d565b500490565b6fffffffffffffffffffffffffffffffff8181168382160280821691908281146137ac576137ac6131b9565b505092915050565b60006fffffffffffffffffffffffffffffffff808416806137d7576137d761373d565b92169190910492915050565b61ffff861681526080602082015260006138016080830186886131fb565b67ffffffffffffffff8516604084015282810360608401526138238185612b90565b98975050505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603160045260246000fdfea264697066735822122040b56336c32751d13680f02df73e17ee6bf2ebdf5348c09ceb71c0fc0300044164736f6c63430008130033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_chainId";
            readonly type: "uint16";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint16";
            readonly name: "srcChainId";
            readonly type: "uint16";
        }, {
            readonly indexed: false;
            readonly internalType: "bytes";
            readonly name: "srcAddress";
            readonly type: "bytes";
        }, {
            readonly indexed: false;
            readonly internalType: "uint64";
            readonly name: "nonce";
            readonly type: "uint64";
        }, {
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "dstAddress";
            readonly type: "address";
        }];
        readonly name: "PayloadCleared";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint16";
            readonly name: "srcChainId";
            readonly type: "uint16";
        }, {
            readonly indexed: false;
            readonly internalType: "bytes";
            readonly name: "srcAddress";
            readonly type: "bytes";
        }, {
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "dstAddress";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint64";
            readonly name: "nonce";
            readonly type: "uint64";
        }, {
            readonly indexed: false;
            readonly internalType: "bytes";
            readonly name: "payload";
            readonly type: "bytes";
        }, {
            readonly indexed: false;
            readonly internalType: "bytes";
            readonly name: "reason";
            readonly type: "bytes";
        }];
        readonly name: "PayloadStored";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint16";
            readonly name: "chainId";
            readonly type: "uint16";
        }, {
            readonly indexed: false;
            readonly internalType: "bytes";
            readonly name: "srcAddress";
            readonly type: "bytes";
        }];
        readonly name: "UaForceResumeReceive";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "uint256";
            readonly name: "quantity";
            readonly type: "uint256";
        }];
        readonly name: "ValueTransferFailed";
        readonly type: "event";
    }, {
        readonly inputs: readonly [];
        readonly name: "blockNextMsg";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "defaultAdapterParams";
        readonly outputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_dstChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "address";
            readonly name: "_userApplication";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "_payload";
            readonly type: "bytes";
        }, {
            readonly internalType: "bool";
            readonly name: "_payInZRO";
            readonly type: "bool";
        }, {
            readonly internalType: "bytes";
            readonly name: "_adapterParams";
            readonly type: "bytes";
        }];
        readonly name: "estimateFees";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "nativeFee";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "zroFee";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_srcChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "_path";
            readonly type: "bytes";
        }];
        readonly name: "forceResumeReceive";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getChainId";
        readonly outputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }, {
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "getConfig";
        readonly outputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_chainID";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "_path";
            readonly type: "bytes";
        }];
        readonly name: "getInboundNonce";
        readonly outputs: readonly [{
            readonly internalType: "uint64";
            readonly name: "";
            readonly type: "uint64";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_srcChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "_srcAddress";
            readonly type: "bytes";
        }];
        readonly name: "getLengthOfQueue";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_chainID";
            readonly type: "uint16";
        }, {
            readonly internalType: "address";
            readonly name: "_srcAddress";
            readonly type: "address";
        }];
        readonly name: "getOutboundNonce";
        readonly outputs: readonly [{
            readonly internalType: "uint64";
            readonly name: "";
            readonly type: "uint64";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "getReceiveLibraryAddress";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "getReceiveVersion";
        readonly outputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "getSendLibraryAddress";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "getSendVersion";
        readonly outputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_srcChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "_path";
            readonly type: "bytes";
        }];
        readonly name: "hasStoredPayload";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly name: "inboundNonce";
        readonly outputs: readonly [{
            readonly internalType: "uint64";
            readonly name: "";
            readonly type: "uint64";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "isReceivingPayload";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "isSendingPayload";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "lzEndpointLookup";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "mockChainId";
        readonly outputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "msgsToDeliver";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "dstAddress";
            readonly type: "address";
        }, {
            readonly internalType: "uint64";
            readonly name: "nonce";
            readonly type: "uint64";
        }, {
            readonly internalType: "bytes";
            readonly name: "payload";
            readonly type: "bytes";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "nextMsgBlocked";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "oracleFee";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }, {
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "outboundNonce";
        readonly outputs: readonly [{
            readonly internalType: "uint64";
            readonly name: "";
            readonly type: "uint64";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "protocolFeeConfig";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "zroFee";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "nativeBP";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_srcChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "_path";
            readonly type: "bytes";
        }, {
            readonly internalType: "address";
            readonly name: "_dstAddress";
            readonly type: "address";
        }, {
            readonly internalType: "uint64";
            readonly name: "_nonce";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint256";
            readonly name: "_gasLimit";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "_payload";
            readonly type: "bytes";
        }];
        readonly name: "receivePayload";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "relayerFeeConfig";
        readonly outputs: readonly [{
            readonly internalType: "uint128";
            readonly name: "dstPriceRatio";
            readonly type: "uint128";
        }, {
            readonly internalType: "uint128";
            readonly name: "dstGasPriceInWei";
            readonly type: "uint128";
        }, {
            readonly internalType: "uint128";
            readonly name: "dstNativeAmtCap";
            readonly type: "uint128";
        }, {
            readonly internalType: "uint64";
            readonly name: "baseGas";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint64";
            readonly name: "gasPerByte";
            readonly type: "uint64";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_srcChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "_path";
            readonly type: "bytes";
        }, {
            readonly internalType: "bytes";
            readonly name: "_payload";
            readonly type: "bytes";
        }];
        readonly name: "retryPayload";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_chainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "_path";
            readonly type: "bytes";
        }, {
            readonly internalType: "bytes";
            readonly name: "_payload";
            readonly type: "bytes";
        }, {
            readonly internalType: "address payable";
            readonly name: "_refundAddress";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_zroPaymentAddress";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "_adapterParams";
            readonly type: "bytes";
        }];
        readonly name: "send";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly name: "setConfig";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "_adapterParams";
            readonly type: "bytes";
        }];
        readonly name: "setDefaultAdapterParams";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "destAddr";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "lzEndpointAddr";
            readonly type: "address";
        }];
        readonly name: "setDestLzEndpoint";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_oracleFee";
            readonly type: "uint256";
        }];
        readonly name: "setOracleFee";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_zroFee";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "_nativeBP";
            readonly type: "uint256";
        }];
        readonly name: "setProtocolFee";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }];
        readonly name: "setReceiveVersion";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint128";
            readonly name: "_dstPriceRatio";
            readonly type: "uint128";
        }, {
            readonly internalType: "uint128";
            readonly name: "_dstGasPriceInWei";
            readonly type: "uint128";
        }, {
            readonly internalType: "uint128";
            readonly name: "_dstNativeAmtCap";
            readonly type: "uint128";
        }, {
            readonly internalType: "uint64";
            readonly name: "_baseGas";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint64";
            readonly name: "_gasPerByte";
            readonly type: "uint64";
        }];
        readonly name: "setRelayerPrice";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }];
        readonly name: "setSendVersion";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly name: "storedPayload";
        readonly outputs: readonly [{
            readonly internalType: "uint64";
            readonly name: "payloadLength";
            readonly type: "uint64";
        }, {
            readonly internalType: "address";
            readonly name: "dstAddress";
            readonly type: "address";
        }, {
            readonly internalType: "bytes32";
            readonly name: "payloadHash";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): LZEndpointMockInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): LZEndpointMock;
}

type index$2_LZEndpointMock__factory = LZEndpointMock__factory;
declare const index$2_LZEndpointMock__factory: typeof LZEndpointMock__factory;
declare namespace index$2 {
  export {
    index$2_LZEndpointMock__factory as LZEndpointMock__factory,
  };
}

declare namespace index$1 {
  export {
    index$3 as lzApp,
    index$2 as mocks,
  };
}

declare namespace index {
  export {
    index$1 as contracts,
    index$7 as layerzerolabs,
    index$4 as openzeppelin,
  };
}

export { ILayerZeroEndpoint, ILayerZeroEndpoint__factory, ILayerZeroReceiver, ILayerZeroReceiver__factory, ILayerZeroUserApplicationConfig, ILayerZeroUserApplicationConfig__factory, LZEndpointMock, LZEndpointMock__factory, LzApp, LzApp__factory, NonblockingLzApp, NonblockingLzApp__factory, Ownable, Ownable__factory, index$b as contracts, index as factories, index$h as layerzerolabs, index$e as openzeppelin };
