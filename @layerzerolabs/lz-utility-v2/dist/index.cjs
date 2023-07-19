'use strict';

var ethers = require('ethers');
var web3_js = require('@solana/web3.js');
var utils = require('ethers/lib/utils');
var invariant = require('tiny-invariant');
var lzEvmSdkV2 = require('@layerzerolabs/lz-evm-sdk-v2');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var invariant__default = /*#__PURE__*/_interopDefault(invariant);

// src/utils/utils.ts
async function sleep(timeout) {
  await new Promise((resolve) => setTimeout(resolve, timeout));
}
var parseError = (errorData, intf) => {
  const buildInError = parseBuildInError(errorData);
  if (buildInError !== void 0) {
    return buildInError;
  }
  if (intf) {
    try {
      return intf.parseError(errorData);
    } catch (e) {
      console.error(e);
    }
  }
};
function parseBuildInError(errorData) {
  if (errorData.startsWith("0x08c379a0")) {
    const content = `0x${errorData.substring(10)}`;
    const reason = ethers.ethers.utils.defaultAbiCoder.decode(["string"], content);
    return reason[0];
  }
  if (errorData.startsWith("0x4e487b71")) {
    const content = `0x${errorData.substring(10)}`;
    const code = ethers.ethers.utils.defaultAbiCoder.decode(["uint"], content);
    return code[0];
  }
  if (errorData === "0x") {
    return "";
  }
}
function hexZeroPadTo32(addr) {
  return ethers.ethers.utils.hexZeroPad(addr, 32);
}
function bytes32ToEthAddress(bytes32) {
  if (bytes32 instanceof Uint8Array) {
    bytes32 = ethers.ethers.utils.hexlify(bytes32);
  }
  return ethers.ethers.utils.getAddress(bytes32.slice(-40));
}
function trim0x(str) {
  return str.replace(/^0x/, "");
}
function addressToBytes32(address) {
  if (isSolanaAddress(address)) {
    return new web3_js.PublicKey(address).toBytes();
  } else if (address.startsWith("0x") && address.length <= 66) {
    return utils.arrayify(hexZeroPadTo32(address));
  }
  throw new Error("Invalid address");
}
var solanaAddressRegex = /^([1-9A-HJ-NP-Za-km-z]{32,44})$/;
function isSolanaAddress(address) {
  return solanaAddressRegex.test(address);
}

// src/utils/precrime.ts
function parsePrecrimeConfig(precrimeConfig) {
  const data = trim0x(precrimeConfig);
  const version = parseInt(data.slice(0, 4), 16);
  const maxBatchSize = parseInt(data.slice(4, 20), 16);
  const remoteChainsLength = parseInt(data.slice(20, 84), 16);
  const remoteChainsBytes = data.slice(84, 84 + remoteChainsLength * 64);
  const remoteAddressesBytes = data.slice(
    84 + remoteChainsLength * 64,
    84 + remoteChainsLength * 64 + remoteChainsLength * 64
  );
  const remoteChainsBytesArray = [];
  const remoteAddressesBytesArray = [];
  let start = 0;
  let end = 64;
  for (let i = 0; i < remoteChainsLength; i++) {
    remoteChainsBytesArray.push(parseInt(remoteChainsBytes.slice(start, end), 16));
    remoteAddressesBytesArray.push(`0x${remoteAddressesBytes.slice(start, end)}`);
    start += 64;
    end += 64;
  }
  return { version, maxBatchSize, remoteEids: remoteChainsBytesArray, remoteAddresses: remoteAddressesBytesArray };
}
var TYPE_1 = 1;
var TYPE_2 = 2;
var TYPE_3 = 3;
var MaxUint128 = ethers.ethers.BigNumber.from("0xffffffffffffffffffffffffffffffff");
function optionsType1(_extraGas) {
  const extraGas = ethers.ethers.BigNumber.from(_extraGas);
  invariant__default.default(extraGas.lte(MaxUint128), "extraGas should be less than MaxUint128");
  return ethers.ethers.utils.solidityPack(["uint16", "uint256"], [TYPE_1, extraGas]);
}
function optionsType2(_extraGas, _dstNativeAmt, _dstNativeAddress) {
  const extraGas = ethers.ethers.BigNumber.from(_extraGas);
  invariant__default.default(extraGas.lte(MaxUint128), "extraGas should be less than MaxUint128");
  const dstNativeAmt = ethers.ethers.BigNumber.from(_dstNativeAmt);
  invariant__default.default(dstNativeAmt.lte(MaxUint128), "dstNativeAmt should be less than MaxUint128");
  return ethers.ethers.utils.solidityPack(
    ["uint16", "uint256", "uint256", "bytes"],
    [TYPE_2, ethers.ethers.BigNumber.from(extraGas), ethers.ethers.BigNumber.from(dstNativeAmt), _dstNativeAddress]
  );
}
var WorkerId = /* @__PURE__ */ ((WorkerId2) => {
  WorkerId2[WorkerId2["Executor"] = 1] = "Executor";
  WorkerId2[WorkerId2["Verifier"] = 2] = "Verifier";
  WorkerId2[WorkerId2["Treasury"] = 255] = "Treasury";
  return WorkerId2;
})(WorkerId || {});
var ExecutorOptionType = /* @__PURE__ */ ((ExecutorOptionType2) => {
  ExecutorOptionType2[ExecutorOptionType2["lzReceive"] = 1] = "lzReceive";
  ExecutorOptionType2[ExecutorOptionType2["airdrop"] = 2] = "airdrop";
  ExecutorOptionType2[ExecutorOptionType2["compose"] = 3] = "compose";
  ExecutorOptionType2[ExecutorOptionType2["ordered"] = 4] = "ordered";
  return ExecutorOptionType2;
})(ExecutorOptionType || {});
var VerifierOptionType = /* @__PURE__ */ ((VerifierOptionType2) => {
  VerifierOptionType2[VerifierOptionType2["precrime"] = 1] = "precrime";
  return VerifierOptionType2;
})(VerifierOptionType || {});
var Options = class {
  constructor() {
    this.workerOptions = [];
  }
  static newOptions() {
    return new Options();
  }
  static fromOptions(optionsHex) {
    const options = new Options();
    const optionsBytes = ethers.ethers.utils.arrayify(optionsHex);
    const optionsType = ethers.ethers.BigNumber.from(optionsBytes.slice(0, 2)).toNumber();
    if (optionsType === TYPE_3) {
      let cursor = 2;
      while (cursor < optionsBytes.byteLength) {
        const workerId = ethers.ethers.BigNumber.from(optionsBytes.slice(cursor, cursor + 1)).toNumber();
        cursor += 1;
        const size = ethers.ethers.BigNumber.from(optionsBytes.slice(cursor, cursor + 2)).toNumber();
        cursor += 2;
        if (workerId === 1 /* Executor */) {
          const optionType = ethers.ethers.BigNumber.from(optionsBytes.slice(cursor, cursor + 1)).toNumber();
          cursor += 1;
          const params = optionsBytes.slice(cursor, cursor + size - 1);
          cursor += size - 1;
          options.addOption(workerId, { type: optionType, params: ethers.ethers.utils.hexlify(params) });
        } else if (workerId === 2 /* Verifier */) {
          const verifierIdx = ethers.ethers.BigNumber.from(optionsBytes.slice(cursor, cursor + 1)).toNumber();
          cursor += 1;
          const optionType = ethers.ethers.BigNumber.from(optionsBytes.slice(cursor, cursor + 1)).toNumber();
          cursor += 1;
          const params = optionsBytes.slice(cursor, cursor + size - 2);
          cursor += size - 2;
          options.addOption(workerId, {
            type: optionType,
            index: verifierIdx,
            params: ethers.ethers.utils.hexlify(params)
          });
        }
      }
    } else if (optionsType === TYPE_2) {
      const extraGas = ethers.ethers.BigNumber.from(optionsBytes.slice(2, 34)).toNumber();
      const dstNativeAmt = ethers.ethers.BigNumber.from(optionsBytes.slice(34, 66)).toNumber();
      const dstNativeAddress = ethers.ethers.utils.hexlify(optionsBytes.slice(66, optionsBytes.byteLength));
      options.addExecutorLzReceiveOption(extraGas).addExecutorAirdropOption(dstNativeAmt, dstNativeAddress);
    } else if (optionsType === TYPE_1) {
      const extraGas = ethers.ethers.BigNumber.from(optionsBytes.slice(2, 34)).toNumber();
      options.addExecutorLzReceiveOption(extraGas);
    }
    return options;
  }
  addExecutorLzReceiveOption(gas, value = 0) {
    const gasBN = ethers.ethers.BigNumber.from(gas);
    invariant__default.default(gasBN.lte(MaxUint128), "gas shouldn't be greater than MaxUint128");
    const valueBN = ethers.ethers.BigNumber.from(value);
    invariant__default.default(valueBN.lte(MaxUint128), "value shouldn't be greater than MaxUint128");
    this.addOption(1 /* Executor */, {
      type: 1 /* lzReceive */,
      params: valueBN.eq(0) ? ethers.ethers.utils.solidityPack(["uint128"], [gasBN]) : ethers.ethers.utils.solidityPack(["uint128", "uint128"], [gasBN, valueBN])
    });
    return this;
  }
  addExecutorAirdropOption(amount, receiver) {
    const amountBN = ethers.ethers.BigNumber.from(amount);
    invariant__default.default(amountBN.lte(MaxUint128), "amount shouldn't be greater than MaxUint128");
    this.addOption(1 /* Executor */, {
      type: 2 /* airdrop */,
      params: ethers.ethers.utils.solidityPack(["uint128", "bytes32"], [amountBN, hexZeroPadTo32(receiver)])
    });
    return this;
  }
  addExecutorComposeOption(gas, value = 0) {
    const gasBN = ethers.ethers.BigNumber.from(gas);
    invariant__default.default(gasBN.lte(MaxUint128), "gas shouldn't be greater than MaxUint128");
    const valueBN = ethers.ethers.BigNumber.from(value);
    invariant__default.default(valueBN.lte(MaxUint128), "value shouldn't be greater than MaxUint128");
    this.addOption(1 /* Executor */, {
      type: 3 /* compose */,
      params: ethers.ethers.utils.solidityPack(["uint128", "uint128"], [gasBN, valueBN])
    });
    return this;
  }
  addExecutorOrderedExecutionOption() {
    this.addOption(1 /* Executor */, {
      type: 4 /* ordered */,
      params: "0x"
    });
    return this;
  }
  addVerifierPrecrimeOption(verifierIdx) {
    this.addOption(2 /* Verifier */, {
      type: 1 /* precrime */,
      index: verifierIdx,
      params: "0x"
    });
    return this;
  }
  toHex() {
    let hex = ethers.ethers.utils.solidityPack(["uint16"], [TYPE_3]);
    this.workerOptions.forEach((w) => {
      for (const option of w.options) {
        if (w.workerId === 1 /* Executor */) {
          hex += trim0x(
            ethers.ethers.utils.solidityPack(
              ["uint8", "uint16", "uint8", "bytes"],
              [w.workerId, trim0x(option.params).length / 2 + 1, option.type, option.params]
            )
          );
        } else if (w.workerId === 2 /* Verifier */) {
          const verifierOption = option;
          hex += trim0x(
            ethers.ethers.utils.solidityPack(
              ["uint8", "uint16", "uint8", "uint8", "bytes"],
              [
                w.workerId,
                trim0x(option.params).length / 2 + 2,
                verifierOption.index,
                verifierOption.type,
                verifierOption.params
              ]
            )
          );
        }
      }
    });
    return hex;
  }
  toBytes() {
    return ethers.ethers.utils.arrayify(this.toHex());
  }
  addOption(workerId, option) {
    const worker = this.workerOptions.find((w) => w.workerId === workerId);
    if (worker) {
      worker.options.push(option);
    } else {
      this.workerOptions.push({ workerId, options: [option] });
    }
  }
  decodeExecutorLzReceiveOption() {
    const option = this.findOption(1 /* Executor */, 1 /* lzReceive */);
    if (!option) {
      return;
    }
    const buffer = Buffer.from(trim0x(option.params), "hex");
    const gas = ethers.ethers.BigNumber.from(buffer.slice(0, 16));
    if (buffer.length === 16) {
      return { gas, value: ethers.ethers.BigNumber.from(0) };
    }
    const value = ethers.ethers.BigNumber.from(buffer.slice(16, 32));
    return { gas, value };
  }
  decodeExecutorAirdropOption() {
    const option = this.findOption(1 /* Executor */, 2 /* airdrop */);
    if (!option) {
      return;
    }
    const buffer = Buffer.from(trim0x(option.params), "hex");
    const amount = ethers.ethers.BigNumber.from(buffer.slice(0, 16));
    const receiver = ethers.ethers.utils.hexlify(buffer.slice(16, 48));
    return { amount, receiver };
  }
  decodeExecutorComposeOption() {
    const option = this.findOption(1 /* Executor */, 3 /* compose */);
    if (!option) {
      return;
    }
    const buffer = Buffer.from(trim0x(option.params), "hex");
    const gas = ethers.ethers.BigNumber.from(buffer.slice(0, 16));
    const value = ethers.ethers.BigNumber.from(buffer.slice(16, 32));
    return { gas, value };
  }
  decodeExecutorOrderedExecutionOption() {
    const option = this.findOption(1 /* Executor */, 4 /* ordered */);
    return option !== void 0;
  }
  findOption(workerId, optionType) {
    const worker = this.workerOptions.find((w) => w.workerId === workerId);
    if (worker) {
      return worker.options.find((o) => o.type === optionType);
    }
  }
  findVerifierOption(verifierIdx, optionType) {
    const worker = this.workerOptions.find((w) => w.workerId === 2 /* Verifier */);
    if (worker) {
      const opt = worker.options.find((o) => o.type === optionType && o.index === verifierIdx);
      if (opt) {
        return opt;
      }
    }
  }
};
var PACKET_VERSION_OFFSET = 0;
var NONCE_OFFSET = 1;
var SRC_CHAIN_OFFSET = 9;
var SRC_ADDRESS_OFFSET = 13;
var DST_CHAIN_OFFSET = 45;
var DST_ADDRESS_OFFSET = 49;
var GUID_OFFSET = 81;
var MESSAGE_OFFSET = 113;
var PacketV1Codec = class {
  static from(payloadEncoded) {
    return new PacketV1Codec(payloadEncoded);
  }
  static fromBytes(payload) {
    return new PacketV1Codec("0x" + Buffer.from(payload).toString("hex"));
  }
  constructor(payloadEncoded) {
    this.buffer = Buffer.from(trim0x(payloadEncoded), "hex");
  }
  /**
   * encode packet to hex string
   */
  static encode(packet) {
    const message = trim0x(packet.message);
    const buffer = Buffer.alloc(MESSAGE_OFFSET + message.length / 2);
    buffer.writeUInt8(packet.version, PACKET_VERSION_OFFSET);
    buffer.writeBigUInt64BE(BigInt(packet.nonce), NONCE_OFFSET);
    buffer.writeUInt32BE(packet.srcEid, SRC_CHAIN_OFFSET);
    buffer.write(trim0x(packet.sender), SRC_ADDRESS_OFFSET, 32, "hex");
    buffer.writeUInt32BE(packet.dstEid, DST_CHAIN_OFFSET);
    buffer.write(trim0x(packet.receiver), DST_ADDRESS_OFFSET, 32, "hex");
    buffer.write(trim0x(packet.guid), GUID_OFFSET, 32, "hex");
    buffer.write(message, MESSAGE_OFFSET, message.length / 2, "hex");
    return "0x" + buffer.toString("hex");
  }
  version() {
    return this.buffer.readUInt8(PACKET_VERSION_OFFSET);
  }
  nonce() {
    return this.buffer.readBigUint64BE(NONCE_OFFSET).toString();
  }
  srcEid() {
    return this.buffer.readUint32BE(SRC_CHAIN_OFFSET);
  }
  sender() {
    return "0x" + this.buffer.slice(SRC_ADDRESS_OFFSET, DST_CHAIN_OFFSET).toString("hex");
  }
  senderAddressB20() {
    return bytes32ToEthAddress(this.sender());
  }
  dstEid() {
    return this.buffer.readUint32BE(DST_CHAIN_OFFSET);
  }
  receiver() {
    return "0x" + this.buffer.slice(DST_ADDRESS_OFFSET, GUID_OFFSET).toString("hex");
  }
  receiverAddressB20() {
    return bytes32ToEthAddress(this.receiver());
  }
  guid() {
    return "0x" + this.buffer.slice(GUID_OFFSET, MESSAGE_OFFSET).toString("hex");
  }
  message() {
    return "0x" + this.buffer.slice(MESSAGE_OFFSET).toString("hex");
  }
  payloadHash() {
    return keccak256(this.payload());
  }
  payload() {
    return "0x" + this.buffer.slice(GUID_OFFSET).toString("hex");
  }
  header() {
    return "0x" + this.buffer.slice(0, GUID_OFFSET).toString("hex");
  }
  headerHash() {
    return keccak256(this.header());
  }
  /**
   * deserialize packet from hex string
   * @deprecated use toPacket instead
   */
  decode() {
    return this.toPacket();
  }
  toPacket() {
    return {
      version: this.version(),
      nonce: this.nonce(),
      srcEid: this.srcEid(),
      sender: this.sender(),
      dstEid: this.dstEid(),
      receiver: this.receiver(),
      guid: this.guid(),
      message: this.message(),
      // derived
      payload: this.payload()
    };
  }
};
function calculateGuid(packetHead) {
  return keccak256(
    ethers.ethers.utils.solidityPack(
      ["uint64", "uint32", "bytes32", "uint32", "bytes32"],
      [
        ethers.ethers.BigNumber.from(packetHead.nonce),
        packetHead.srcEid,
        addressToBytes32(packetHead.sender),
        packetHead.dstEid,
        addressToBytes32(packetHead.receiver)
      ]
    )
  );
}
function keccak256(message) {
  return ethers.ethers.utils.keccak256(message);
}

// src/model/packet.ts
var PacketSerializer = class {
  static serialize(packet) {
    return PacketV1Codec.encode(packet);
  }
  static deserialize(bytesLike) {
    let codec;
    if (bytesLike instanceof Uint8Array) {
      codec = PacketV1Codec.fromBytes(bytesLike);
    } else {
      codec = PacketV1Codec.from(bytesLike);
    }
    return codec.toPacket();
  }
};
function packetToMessageOrigin(packet) {
  return {
    srcEid: packet.srcEid,
    sender: packet.sender,
    nonce: packet.nonce
  };
}
async function populateSetEndpointConfig(oapp, configPayload) {
  return { to: oapp.address, data: oapp.interface.encodeFunctionData("setEndpointConfig", [configPayload]) };
}
async function populateSnapshotConfig(oapp, messageLib, eids) {
  const endpointIFace = lzEvmSdkV2.EndpointV2__factory.createInterface();
  const configPayload = endpointIFace.encodeFunctionData("snapshotConfig", [messageLib, eids]);
  return populateSetEndpointConfig(oapp, configPayload);
}
async function populateSetConfig(oapp, lib, eid, params) {
  const endpointIFace = lzEvmSdkV2.EndpointV2__factory.createInterface();
  const configPayload = endpointIFace.encodeFunctionData("setConfig", [lib, eid, params]);
  return populateSetEndpointConfig(oapp, configPayload);
}
async function populateSetSendMessageLib(oapp, eid, newLib) {
  const endpointIFace = lzEvmSdkV2.EndpointV2__factory.createInterface();
  const configPayload = endpointIFace.encodeFunctionData("setSendLibrary", [eid, newLib]);
  return populateSetEndpointConfig(oapp, configPayload);
}
async function populateResetConfig(oapp, lib, eids) {
  const endpointIFace = lzEvmSdkV2.EndpointV2__factory.createInterface();
  const configPayload = endpointIFace.encodeFunctionData("resetConfig", [lib, eids]);
  return populateSetEndpointConfig(oapp, configPayload);
}
async function populateSetReceiveLibrary(oapp, eid, newLib, gracePeriod) {
  const endpointIFace = lzEvmSdkV2.EndpointV2__factory.createInterface();
  const configPayload = endpointIFace.encodeFunctionData("setReceiveLibrary", [eid, newLib, gracePeriod]);
  return populateSetEndpointConfig(oapp, configPayload);
}
async function populateSetReceiveLibraryTimeout(oapp, eid, lib, expiry) {
  const endpointIFace = lzEvmSdkV2.EndpointV2__factory.createInterface();
  const configPayload = endpointIFace.encodeFunctionData("setReceiveLibraryTimeout", [eid, lib, expiry]);
  return populateSetEndpointConfig(oapp, configPayload);
}
async function populateClear(oapp, origin, guid, message) {
  const endpointIFace = lzEvmSdkV2.EndpointV2__factory.createInterface();
  const configPayload = endpointIFace.encodeFunctionData("clear", [origin, guid, message]);
  return populateSetEndpointConfig(oapp, configPayload);
}
async function populateSkip(oapp, srcEid, sender, nonce) {
  const endpointIFace = lzEvmSdkV2.EndpointV2__factory.createInterface();
  const configPayload = endpointIFace.encodeFunctionData("skip", [srcEid, sender, nonce]);
  return populateSetEndpointConfig(oapp, configPayload);
}

exports.ExecutorOptionType = ExecutorOptionType;
exports.Options = Options;
exports.PacketSerializer = PacketSerializer;
exports.PacketV1Codec = PacketV1Codec;
exports.VerifierOptionType = VerifierOptionType;
exports.WorkerId = WorkerId;
exports.addressToBytes32 = addressToBytes32;
exports.bytes32ToEthAddress = bytes32ToEthAddress;
exports.calculateGuid = calculateGuid;
exports.hexZeroPadTo32 = hexZeroPadTo32;
exports.isSolanaAddress = isSolanaAddress;
exports.keccak256 = keccak256;
exports.optionsType1 = optionsType1;
exports.optionsType2 = optionsType2;
exports.packetToMessageOrigin = packetToMessageOrigin;
exports.parseError = parseError;
exports.parsePrecrimeConfig = parsePrecrimeConfig;
exports.populateClear = populateClear;
exports.populateResetConfig = populateResetConfig;
exports.populateSetConfig = populateSetConfig;
exports.populateSetEndpointConfig = populateSetEndpointConfig;
exports.populateSetReceiveLibrary = populateSetReceiveLibrary;
exports.populateSetReceiveLibraryTimeout = populateSetReceiveLibraryTimeout;
exports.populateSetSendMessageLib = populateSetSendMessageLib;
exports.populateSkip = populateSkip;
exports.populateSnapshotConfig = populateSnapshotConfig;
exports.sleep = sleep;
exports.trim0x = trim0x;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.cjs.map