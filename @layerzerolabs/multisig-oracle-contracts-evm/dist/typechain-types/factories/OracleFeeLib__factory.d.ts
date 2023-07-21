import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { OracleFeeLib, OracleFeeLibInterface } from "../OracleFeeLib";
type OracleFeeLibConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class OracleFeeLib__factory extends ContractFactory {
    constructor(...args: OracleFeeLibConstructorParams);
    deploy(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<OracleFeeLib>;
    getDeployTransaction(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): OracleFeeLib;
    connect(signer: Signer): OracleFeeLib__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b5061057e806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063dc60028014610030575b600080fd5b61004361003e366004610316565b610055565b60405190815260200160405180910390f35b60008061006d604167ffffffffffffffff88166103f7565b90508061007b602082610443565b156100a35761008b602083610443565b6100959083610457565b6100a090602061046a565b90505b6000816100b260e0604461046a565b6100bc919061046a565b6100c790604061046a565b6040517f7bc3c9ab00000000000000000000000000000000000000000000000000000000815261ffff8c1660048201526024810182905267ffffffffffffffff8b16604482015290915060009073ffffffffffffffffffffffffffffffffffffffff8d1690637bc3c9ab906064016040805180830381865afa158015610151573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610175919061047d565b509050866fffffffffffffffffffffffffffffffff16600003610196578796505b60006127106101b76fffffffffffffffffffffffffffffffff8a16846103f7565b6101c191906104ad565b905060008d73ffffffffffffffffffffffffffffffffffffffff166392807f586040518163ffffffff1660e01b8152600401602060405180830381865afa158015610210573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061023491906104c1565b90506fffffffffffffffffffffffffffffffff8116158061026557506fffffffffffffffffffffffffffffffff8816155b15610277575094506102cd9350505050565b60008161028c8a670de0b6b3a76400006104e5565b6102969190610519565b6102b2906fffffffffffffffffffffffffffffffff168561046a565b90508281116102c157826102c3565b805b9750505050505050505b979650505050505050565b803567ffffffffffffffff811681146102f057600080fd5b919050565b6fffffffffffffffffffffffffffffffff8116811461031357600080fd5b50565b600080600080600080600060e0888a03121561033157600080fd5b873573ffffffffffffffffffffffffffffffffffffffff8116811461035557600080fd5b9650602088013561ffff8116811461036c57600080fd5b955061037a604089016102d8565b9450610388606089016102d8565b93506080880135610398816102f5565b925060a08801356103a8816102f5565b915060c08801356103b8816102f5565b8091505092959891949750929550565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b808202811582820484141761040e5761040e6103c8565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b60008261045257610452610414565b500690565b8181038181111561040e5761040e6103c8565b8082018082111561040e5761040e6103c8565b6000806040838503121561049057600080fd5b8251915060208301516104a2816102f5565b809150509250929050565b6000826104bc576104bc610414565b500490565b6000602082840312156104d357600080fd5b81516104de816102f5565b9392505050565b6fffffffffffffffffffffffffffffffff818116838216028082169190828114610511576105116103c8565b505092915050565b60006fffffffffffffffffffffffffffffffff8084168061053c5761053c610414565b9216919091049291505056fea26469706673582212204e379e113fc46f7cad4868a35cb6bcea161ccd2702c78005abe4fa00e52d94f964736f6c63430008110033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "contract ILayerZeroPriceFeed";
            readonly name: "_priceFeed";
            readonly type: "address";
        }, {
            readonly internalType: "uint16";
            readonly name: "_dstChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint64";
            readonly name: "_baseGas";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint64";
            readonly name: "_quorum";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint128";
            readonly name: "_defaultMultiplier";
            readonly type: "uint128";
        }, {
            readonly internalType: "uint128";
            readonly name: "_multiplier";
            readonly type: "uint128";
        }, {
            readonly internalType: "uint128";
            readonly name: "_floorMarginUSD";
            readonly type: "uint128";
        }];
        readonly name: "getFee";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): OracleFeeLibInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): OracleFeeLib;
}
export {};
//# sourceMappingURL=OracleFeeLib__factory.d.ts.map