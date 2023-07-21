'use strict';

var invariant = require('tiny-invariant');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var invariant__default = /*#__PURE__*/_interopDefault(invariant);

// src/enums/chain.ts
var Chain = /* @__PURE__ */ ((Chain2) => {
  Chain2["ETHEREUM"] = "ethereum";
  Chain2["BSC"] = "bsc";
  Chain2["AVALANCHE"] = "avalanche";
  Chain2["POLYGON"] = "polygon";
  Chain2["ZKPOLYGON"] = "zkpolygon";
  Chain2["ARBITRUM"] = "arbitrum";
  Chain2["OPTIMISM"] = "optimism";
  Chain2["FANTOM"] = "fantom";
  Chain2["SWIMMER"] = "swimmer";
  Chain2["DFK"] = "dfk";
  Chain2["HARMONY"] = "harmony";
  Chain2["ARCANA"] = "arcana";
  Chain2["DEXALOT"] = "dexalot";
  Chain2["CASTLECRUSH"] = "castlecrush";
  Chain2["GNOSIS"] = "gnosis";
  Chain2["CELO"] = "celo";
  Chain2["MOONBEAM"] = "moonbeam";
  Chain2["BOBA"] = "boba";
  Chain2["PORTAL"] = "portal";
  Chain2["AURORA"] = "aurora";
  Chain2["INTAIN"] = "intain";
  Chain2["FUSE"] = "fuse";
  Chain2["ASTAR"] = "astar";
  Chain2["ZKSYNC"] = "zksync";
  Chain2["SHRAPNEL"] = "shrapnel";
  Chain2["DOS"] = "dos";
  Chain2["APTOS"] = "aptos";
  Chain2["KLAYTN"] = "klaytn";
  Chain2["METIS"] = "metis";
  Chain2["COREDAO"] = "coredao";
  Chain2["OKX"] = "okx";
  Chain2["METER"] = "meter";
  Chain2["GOERLI"] = "goerli";
  Chain2["SOLANA"] = "solana";
  Chain2["BASE"] = "base";
  Chain2["ZKCONSENSYS"] = "zkconsensys";
  Chain2["SEPOLIA"] = "sepolia";
  Chain2["MOONRIVER"] = "moonriver";
  Chain2["AAVEGOTCHI"] = "aavegotchi";
  Chain2["SCROLL"] = "scroll";
  Chain2["CATHAY"] = "cathay";
  Chain2["KAVA"] = "kava";
  Chain2["TENET"] = "tenet";
  Chain2["CANTO"] = "canto";
  Chain2["ORDERLY"] = "orderly";
  Chain2["NOVA"] = "nova";
  Chain2["BLOCKGEN"] = "blockgen";
  Chain2["MERITCIRCLE"] = "meritcircle";
  Chain2["MANTLE"] = "mantle";
  Chain2["HUBBLE"] = "hubble";
  return Chain2;
})(Chain || {});

// src/enums/chain-type.ts
var ChainType = /* @__PURE__ */ ((ChainType2) => {
  ChainType2["UNKNOWN"] = "unknown";
  ChainType2["EVM"] = "evm";
  ChainType2["APTOS"] = "aptos";
  ChainType2["SOLANA"] = "solana";
  return ChainType2;
})(ChainType || {});

// src/enums/endpoint-id.ts
var MainnetEndpointId = /* @__PURE__ */ ((MainnetEndpointId2) => {
  MainnetEndpointId2[MainnetEndpointId2["ETHEREUM_MAINNET"] = 101] = "ETHEREUM_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["BSC_MAINNET"] = 102] = "BSC_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["AVALANCHE_MAINNET"] = 106] = "AVALANCHE_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["POLYGON_MAINNET"] = 109] = "POLYGON_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["ARBITRUM_MAINNET"] = 110] = "ARBITRUM_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["OPTIMISM_MAINNET"] = 111] = "OPTIMISM_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["FANTOM_MAINNET"] = 112] = "FANTOM_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["SWIMMER_MAINNET"] = 114] = "SWIMMER_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["DFK_MAINNET"] = 115] = "DFK_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["HARMONY_MAINNET"] = 116] = "HARMONY_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["DEXALOT_MAINNET"] = 118] = "DEXALOT_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["CELO_MAINNET"] = 125] = "CELO_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["MOONBEAM_MAINNET"] = 126] = "MOONBEAM_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["INTAIN_MAINNET"] = 152] = "INTAIN_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["FUSE_MAINNET"] = 138] = "FUSE_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["GNOSIS_MAINNET"] = 145] = "GNOSIS_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["APTOS_MAINNET"] = 108] = "APTOS_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["KLAYTN_MAINNET"] = 150] = "KLAYTN_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["METIS_MAINNET"] = 151] = "METIS_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["COREDAO_MAINNET"] = 153] = "COREDAO_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["GOERLI_MAINNET"] = 154] = "GOERLI_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["OKX_MAINNET"] = 155] = "OKX_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["CANTO_MAINNET"] = 159] = "CANTO_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["ZKSYNC_MAINNET"] = 165] = "ZKSYNC_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["SHRAPNEL_MAINNET"] = 148] = "SHRAPNEL_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["DOS_MAINNET"] = 149] = "DOS_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["ZKPOLYGON_MAINNET"] = 158] = "ZKPOLYGON_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["SEPOLIA_MAINNET"] = 161] = "SEPOLIA_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["MOONRIVER_MAINNET"] = 167] = "MOONRIVER_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["SOLANA_MAINNET"] = 168] = "SOLANA_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["TENET_MAINNET"] = 173] = "TENET_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["NOVA_MAINNET"] = 175] = "NOVA_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["METER_MAINNET"] = 176] = "METER_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["KAVA_MAINNET"] = 177] = "KAVA_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["MANTLE_MAINNET"] = 181] = "MANTLE_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["HUBBLE_MAINNET"] = 182] = "HUBBLE_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["ZKCONSENSYS_MAINNET"] = 183] = "ZKCONSENSYS_MAINNET";
  MainnetEndpointId2[MainnetEndpointId2["BASE_MAINNET"] = 184] = "BASE_MAINNET";
  return MainnetEndpointId2;
})(MainnetEndpointId || {});
var TestnetEndpointId = /* @__PURE__ */ ((TestnetEndpointId2) => {
  TestnetEndpointId2[TestnetEndpointId2["BSC_TESTNET"] = 10102] = "BSC_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["AVALANCHE_TESTNET"] = 10106] = "AVALANCHE_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["POLYGON_TESTNET"] = 10109] = "POLYGON_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["FANTOM_TESTNET"] = 10112] = "FANTOM_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["SWIMMER_TESTNET"] = 10130] = "SWIMMER_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["DFK_TESTNET"] = 10115] = "DFK_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["HARMONY_TESTNET"] = 10133] = "HARMONY_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["DEXALOT_TESTNET"] = 10118] = "DEXALOT_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["CELO_TESTNET"] = 10125] = "CELO_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["MOONBEAM_TESTNET"] = 10126] = "MOONBEAM_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["INTAIN_TESTNET"] = 10152] = "INTAIN_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["ETHEREUM_TESTNET"] = 10121] = "ETHEREUM_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["ARBITRUM_TESTNET"] = 10143] = "ARBITRUM_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["OPTIMISM_TESTNET"] = 10132] = "OPTIMISM_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["FUSE_TESTNET"] = 10138] = "FUSE_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["GNOSIS_TESTNET"] = 10145] = "GNOSIS_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["ZKSYNC_TESTNET"] = 10165] = "ZKSYNC_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["SHRAPNEL_TESTNET"] = 10164] = "SHRAPNEL_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["DOS_TESTNET"] = 10162] = "DOS_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["APTOS_TESTNET"] = 10108] = "APTOS_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["KLAYTN_TESTNET"] = 10150] = "KLAYTN_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["METIS_TESTNET"] = 10151] = "METIS_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["COREDAO_TESTNET"] = 10153] = "COREDAO_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["OKX_TESTNET"] = 10155] = "OKX_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["METER_TESTNET"] = 10156] = "METER_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["ZKCONSENSYS_TESTNET"] = 10157] = "ZKCONSENSYS_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["ZKPOLYGON_TESTNET"] = 10158] = "ZKPOLYGON_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["CANTO_TESTNET"] = 10159] = "CANTO_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["BASE_TESTNET"] = 10160] = "BASE_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["SEPOLIA_TESTNET"] = 10161] = "SEPOLIA_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["SOLANA_TESTNET"] = 10168] = "SOLANA_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["SCROLL_TESTNET"] = 10170] = "SCROLL_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["CATHAY_TESTNET"] = 10171] = "CATHAY_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["KAVA_TESTNET"] = 10172] = "KAVA_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["TENET_TESTNET"] = 10173] = "TENET_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["ORDERLY_TESTNET"] = 10174] = "ORDERLY_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["BLOCKGEN_TESTNET"] = 10177] = "BLOCKGEN_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["MERITCIRCLE_TESTNET"] = 10178] = "MERITCIRCLE_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["MANTLE_TESTNET"] = 10181] = "MANTLE_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["HUBBLE_TESTNET"] = 10182] = "HUBBLE_TESTNET";
  TestnetEndpointId2[TestnetEndpointId2["AAVEGOTCHI_TESTNET"] = 10191] = "AAVEGOTCHI_TESTNET";
  return TestnetEndpointId2;
})(TestnetEndpointId || {});
var SandboxEndpointId = /* @__PURE__ */ ((SandboxEndpointId2) => {
  SandboxEndpointId2[SandboxEndpointId2["BSC_SANDBOX"] = 20102] = "BSC_SANDBOX";
  SandboxEndpointId2[SandboxEndpointId2["AVALANCHE_SANDBOX"] = 20106] = "AVALANCHE_SANDBOX";
  SandboxEndpointId2[SandboxEndpointId2["POLYGON_SANDBOX"] = 20109] = "POLYGON_SANDBOX";
  SandboxEndpointId2[SandboxEndpointId2["ETHEREUM_SANDBOX"] = 20121] = "ETHEREUM_SANDBOX";
  SandboxEndpointId2[SandboxEndpointId2["APTOS_SANDBOX"] = 20008] = "APTOS_SANDBOX";
  return SandboxEndpointId2;
})(SandboxEndpointId || {});
var MainnetV2EndpointId = /* @__PURE__ */ ((MainnetV2EndpointId2) => {
  MainnetV2EndpointId2[MainnetV2EndpointId2["ETHEREUM_V2_MAINNET"] = 30101] = "ETHEREUM_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["BSC_V2_MAINNET"] = 30102] = "BSC_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["AVALANCHE_V2_MAINNET"] = 30106] = "AVALANCHE_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["POLYGON_V2_MAINNET"] = 30109] = "POLYGON_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["ARBITRUM_V2_MAINNET"] = 30110] = "ARBITRUM_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["OPTIMISM_V2_MAINNET"] = 30111] = "OPTIMISM_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["FANTOM_V2_MAINNET"] = 30112] = "FANTOM_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["SWIMMER_V2_MAINNET"] = 30114] = "SWIMMER_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["DFK_V2_MAINNET"] = 30115] = "DFK_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["HARMONY_V2_MAINNET"] = 30116] = "HARMONY_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["DEXALOT_V2_MAINNET"] = 30118] = "DEXALOT_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["CELO_V2_MAINNET"] = 30125] = "CELO_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["MOONBEAM_V2_MAINNET"] = 30126] = "MOONBEAM_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["INTAIN_V2_MAINNET"] = 30152] = "INTAIN_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["FUSE_V2_MAINNET"] = 30138] = "FUSE_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["GNOSIS_V2_MAINNET"] = 30145] = "GNOSIS_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["APTOS_V2_MAINNET"] = 30108] = "APTOS_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["KLAYTN_V2_MAINNET"] = 30150] = "KLAYTN_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["METIS_V2_MAINNET"] = 30151] = "METIS_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["COREDAO_V2_MAINNET"] = 30153] = "COREDAO_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["GOERLI_V2_MAINNET"] = 30154] = "GOERLI_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["OKX_V2_MAINNET"] = 30155] = "OKX_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["CANTO_V2_MAINNET"] = 30159] = "CANTO_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["ZKSYNC_V2_MAINNET"] = 30165] = "ZKSYNC_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["SHRAPNEL_V2_MAINNET"] = 30148] = "SHRAPNEL_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["DOS_V2_MAINNET"] = 30149] = "DOS_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["ZKPOLYGON_V2_MAINNET"] = 30158] = "ZKPOLYGON_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["SEPOLIA_V2_MAINNET"] = 30161] = "SEPOLIA_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["MOONRIVER_V2_MAINNET"] = 30167] = "MOONRIVER_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["SOLANA_V2_MAINNET"] = 30168] = "SOLANA_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["TENET_V2_MAINNET"] = 30173] = "TENET_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["NOVA_V2_MAINNET"] = 30175] = "NOVA_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["METER_V2_MAINNET"] = 30176] = "METER_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["KAVA_V2_MAINNET"] = 30177] = "KAVA_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["MANTLE_V2_MAINNET"] = 30181] = "MANTLE_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["HUBBLE_V2_MAINNET"] = 30182] = "HUBBLE_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["ZKCONSENSYS_V2_MAINNET"] = 30183] = "ZKCONSENSYS_V2_MAINNET";
  MainnetV2EndpointId2[MainnetV2EndpointId2["BASE_V2_MAINNET"] = 30184] = "BASE_V2_MAINNET";
  return MainnetV2EndpointId2;
})(MainnetV2EndpointId || {});
var TestnetV2EndpointId = /* @__PURE__ */ ((TestnetV2EndpointId2) => {
  TestnetV2EndpointId2[TestnetV2EndpointId2["AVALANCHE_V2_TESTNET"] = 40106] = "AVALANCHE_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["POLYGON_V2_TESTNET"] = 40109] = "POLYGON_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["ETHEREUM_V2_TESTNET"] = 40121] = "ETHEREUM_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["OPTIMISM_V2_TESTNET"] = 40132] = "OPTIMISM_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["ARBITRUM_V2_TESTNET"] = 40143] = "ARBITRUM_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["SOLANA_V2_TESTNET"] = 40168] = "SOLANA_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["BSC_V2_TESTNET"] = 40102] = "BSC_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["FANTOM_V2_TESTNET"] = 40112] = "FANTOM_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["DFK_V2_TESTNET"] = 40115] = "DFK_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["HARMONY_V2_TESTNET"] = 40133] = "HARMONY_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["DEXALOT_V2_TESTNET"] = 40118] = "DEXALOT_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["CELO_V2_TESTNET"] = 40125] = "CELO_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["MOONBEAM_V2_TESTNET"] = 40126] = "MOONBEAM_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["FUSE_V2_TESTNET"] = 40138] = "FUSE_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["GNOSIS_V2_TESTNET"] = 40145] = "GNOSIS_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["ZKSYNC_V2_TESTNET"] = 40165] = "ZKSYNC_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["SHRAPNEL_V2_TESTNET"] = 40164] = "SHRAPNEL_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["DOS_V2_TESTNET"] = 40162] = "DOS_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["KLAYTN_V2_TESTNET"] = 40150] = "KLAYTN_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["METIS_V2_TESTNET"] = 40151] = "METIS_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["COREDAO_V2_TESTNET"] = 40153] = "COREDAO_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["OKX_V2_TESTNET"] = 40155] = "OKX_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["METER_V2_TESTNET"] = 40156] = "METER_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["ZKCONSENSYS_V2_TESTNET"] = 40157] = "ZKCONSENSYS_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["ZKPOLYGON_V2_TESTNET"] = 40158] = "ZKPOLYGON_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["CANTO_V2_TESTNET"] = 40159] = "CANTO_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["BASE_V2_TESTNET"] = 40160] = "BASE_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["SEPOLIA_V2_TESTNET"] = 40161] = "SEPOLIA_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["AAVEGOTCHI_V2_TESTNET"] = 40179] = "AAVEGOTCHI_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["SCROLL_V2_TESTNET"] = 40170] = "SCROLL_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["CATHAY_V2_TESTNET"] = 40171] = "CATHAY_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["KAVA_V2_TESTNET"] = 40172] = "KAVA_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["TENET_V2_TESTNET"] = 40173] = "TENET_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["ORDERLY_V2_TESTNET"] = 40174] = "ORDERLY_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["BLOCKGEN_V2_TESTNET"] = 40177] = "BLOCKGEN_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["MERITCIRCLE_V2_TESTNET"] = 40178] = "MERITCIRCLE_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["MANTLE_V2_TESTNET"] = 40181] = "MANTLE_V2_TESTNET";
  TestnetV2EndpointId2[TestnetV2EndpointId2["HUBBLE_V2_TESTNET"] = 40182] = "HUBBLE_V2_TESTNET";
  return TestnetV2EndpointId2;
})(TestnetV2EndpointId || {});
var SandboxV2EndpointId = /* @__PURE__ */ ((SandboxV2EndpointId2) => {
  SandboxV2EndpointId2[SandboxV2EndpointId2["ETHEREUM_V2_SANDBOX"] = 50121] = "ETHEREUM_V2_SANDBOX";
  SandboxV2EndpointId2[SandboxV2EndpointId2["POLYGON_V2_SANDBOX"] = 50109] = "POLYGON_V2_SANDBOX";
  SandboxV2EndpointId2[SandboxV2EndpointId2["SOLANA_V2_SANDBOX"] = 50168] = "SOLANA_V2_SANDBOX";
  SandboxV2EndpointId2[SandboxV2EndpointId2["BSC_V2_SANDBOX"] = 50102] = "BSC_V2_SANDBOX";
  SandboxV2EndpointId2[SandboxV2EndpointId2["AVALANCHE_V2_SANDBOX"] = 50106] = "AVALANCHE_V2_SANDBOX";
  return SandboxV2EndpointId2;
})(SandboxV2EndpointId || {});
var EndpointId = {
  ...MainnetEndpointId,
  ...TestnetEndpointId,
  ...SandboxEndpointId,
  ...MainnetV2EndpointId,
  ...TestnetV2EndpointId,
  ...SandboxV2EndpointId
};

// src/enums/environment.ts
var Environment = /* @__PURE__ */ ((Environment2) => {
  Environment2["LOCAL"] = "local";
  Environment2["DEVNET"] = "devnet";
  Environment2["TESTNET"] = "testnet";
  Environment2["MAINNET"] = "mainnet";
  return Environment2;
})(Environment || {});

// src/enums/stage.ts
var Stage = /* @__PURE__ */ ((Stage2) => {
  Stage2["MAINNET"] = "mainnet";
  Stage2["TESTNET"] = "testnet";
  Stage2["SANDBOX"] = "sandbox";
  return Stage2;
})(Stage || {});

// src/enums/endpoint-version.ts
var EndpointVersion = /* @__PURE__ */ ((EndpointVersion2) => {
  EndpointVersion2["V1"] = "v1";
  EndpointVersion2["V2"] = "v2";
  return EndpointVersion2;
})(EndpointVersion || {});

// src/enums/message-lib.ts
var MessageLibVersionV2 = /* @__PURE__ */ ((MessageLibVersionV22) => {
  MessageLibVersionV22["SIMPLE"] = "0.0.2";
  MessageLibVersionV22["ULTRA_LIGHT_NODE_302"] = "3.0.2";
  return MessageLibVersionV22;
})(MessageLibVersionV2 || {});
var MessageLibVersionV1 = /* @__PURE__ */ ((MessageLibVersionV12) => {
  MessageLibVersionV12["ULTRA_LIGHT_NODE_301"] = "3.0.1";
  MessageLibVersionV12["ULTRA_LIGHT_NODE_201"] = "2.0.1";
  return MessageLibVersionV12;
})(MessageLibVersionV1 || {});

// src/enums/chain-key.ts
var ChainKey = /* @__PURE__ */ ((ChainKey3) => {
  ChainKey3["ETHEREUM"] = "ethereum";
  ChainKey3["GOERLI"] = "goerli";
  ChainKey3["SEPOLIA"] = "sepolia";
  ChainKey3["BSC"] = "bsc";
  ChainKey3["BSC_TESTNET"] = "bsc-testnet";
  ChainKey3["AVALANCHE"] = "avalanche";
  ChainKey3["FUJI"] = "fuji";
  ChainKey3["POLYGON"] = "polygon";
  ChainKey3["MUMBAI"] = "mumbai";
  ChainKey3["ARBITRUM"] = "arbitrum";
  ChainKey3["ARBITURM_GOERLI"] = "arbitrum-goerli";
  ChainKey3["OPTIMISM"] = "optimism";
  ChainKey3["OPTIMISM_GOERLI"] = "optimism-goerli";
  ChainKey3["FANTOM"] = "fantom";
  ChainKey3["FANTOM_TESTNET"] = "fantom-testnet";
  ChainKey3["SWIMMER"] = "swimmer";
  ChainKey3["SWIMMER_TESTNET"] = "swimmer-testnet";
  ChainKey3["DFK"] = "dfk";
  ChainKey3["DFK_TESTNET"] = "dfk-testnet";
  ChainKey3["HARMONY"] = "harmony";
  ChainKey3["HARMONY_TESTNET"] = "harmony-testnet";
  ChainKey3["DEXALOT"] = "dexalot";
  ChainKey3["DEVALOT_TESTNET"] = "dexalot-testnet";
  ChainKey3["CELO"] = "celo";
  ChainKey3["ALFAJORES"] = "alfajores";
  ChainKey3["MOONBEAM"] = "moonbeam";
  ChainKey3["MOONBASE"] = "moonbase";
  ChainKey3["MOONRIVER"] = "moonriver";
  ChainKey3["INTAIN"] = "intain";
  ChainKey3["INTAIN_TESTNET"] = "intain-testnet";
  ChainKey3["FUSE"] = "fuse";
  ChainKey3["FUSESPARK"] = "fusespark";
  ChainKey3["GNOSIS"] = "gnosis";
  ChainKey3["CHIADO"] = "chiado";
  ChainKey3["APTOS"] = "aptos";
  ChainKey3["APTOS_TESTNET"] = "aptos-testnet";
  ChainKey3["KLAYTN"] = "klaytn";
  ChainKey3["KLAYTN_BAOBAB"] = "klaytn-baobab";
  ChainKey3["METIS"] = "metis";
  ChainKey3["METIS_GOERLI"] = "metis-goerli";
  ChainKey3["COREDAO"] = "coredao";
  ChainKey3["COREDAO_TESTNET"] = "coredao-testnet";
  ChainKey3["METER"] = "meter";
  ChainKey3["METER_TESTNET"] = "meter-testnet";
  ChainKey3["OKX"] = "okx";
  ChainKey3["OKX_TESTNET"] = "okx-testnet";
  ChainKey3["ZKSYNC"] = "zksync";
  ChainKey3["ZKSYNC_TESTNET"] = "zksync-testnet";
  ChainKey3["SHRAPNEL"] = "shrapnel";
  ChainKey3["SHRAPNEL_TESTNET"] = "shrapnel-testnet";
  ChainKey3["DOS"] = "dos";
  ChainKey3["DOS_TESTNET"] = "dos-testnet";
  ChainKey3["ZKEVM"] = "zkevm";
  ChainKey3["ZKEVM_TESTNET"] = "zkevm-testnet";
  ChainKey3["NOVA"] = "nova";
  ChainKey3["TENET"] = "tenet";
  ChainKey3["TENET_TESTNET"] = "tenet-testnet";
  ChainKey3["CANTO"] = "canto";
  ChainKey3["CANTO_TESTNET"] = "canto-testnet";
  ChainKey3["KAVA"] = "kava";
  ChainKey3["KAVA_TESTNET"] = "kava-testnet";
  ChainKey3["SOLANA"] = "solana";
  ChainKey3["SOLANA_TESTNET"] = "solana-testnet";
  ChainKey3["LINEA_GOERLI"] = "linea-goerli";
  ChainKey3["BASE_GOERLI"] = "base-goerli";
  ChainKey3["AAVEGOTCHI_TESTNET"] = "aavegotchi-testnet";
  ChainKey3["SCROLL_TESTNET"] = "scroll-testnet";
  ChainKey3["CATHAY_TESTNET"] = "cathay-testnet";
  ChainKey3["ORDERLY_TESTNET"] = "orderly-testnet";
  ChainKey3["BLOCKGEN_TESTNET"] = "blockgen-testnet";
  ChainKey3["MERITCIRCLE_TESTNET"] = "meritcircle-testnet";
  ChainKey3["MANTLE"] = "mantle";
  ChainKey3["MANTLE_TESTNET"] = "mantle-testnet";
  ChainKey3["HUBBLE"] = "hubble";
  ChainKey3["HUBBLE_TESTNET"] = "hubble-testnet";
  ChainKey3["ZKCONSENSYS"] = "zkconsensys";
  ChainKey3["BASE"] = "base";
  return ChainKey3;
})(ChainKey || {});

// src/constants/chainKey.ts
var CHAIN_KEY = {
  [EndpointId.ETHEREUM_MAINNET]: "ethereum" /* ETHEREUM */,
  [EndpointId.BSC_MAINNET]: "bsc" /* BSC */,
  [EndpointId.AVALANCHE_MAINNET]: "avalanche" /* AVALANCHE */,
  [EndpointId.POLYGON_MAINNET]: "polygon" /* POLYGON */,
  [EndpointId.ARBITRUM_MAINNET]: "arbitrum" /* ARBITRUM */,
  [EndpointId.OPTIMISM_MAINNET]: "optimism" /* OPTIMISM */,
  [EndpointId.FANTOM_MAINNET]: "fantom" /* FANTOM */,
  [EndpointId.SWIMMER_MAINNET]: "swimmer" /* SWIMMER */,
  [EndpointId.DFK_MAINNET]: "dfk" /* DFK */,
  [EndpointId.HARMONY_MAINNET]: "harmony" /* HARMONY */,
  [EndpointId.DEXALOT_MAINNET]: "dexalot" /* DEXALOT */,
  [EndpointId.CELO_MAINNET]: "celo" /* CELO */,
  [EndpointId.MOONBEAM_MAINNET]: "moonbeam" /* MOONBEAM */,
  [EndpointId.INTAIN_MAINNET]: "intain" /* INTAIN */,
  [EndpointId.FUSE_MAINNET]: "fuse" /* FUSE */,
  [EndpointId.GNOSIS_MAINNET]: "gnosis" /* GNOSIS */,
  [EndpointId.APTOS_MAINNET]: "aptos" /* APTOS */,
  [EndpointId.KLAYTN_MAINNET]: "klaytn" /* KLAYTN */,
  [EndpointId.METIS_MAINNET]: "metis" /* METIS */,
  [EndpointId.COREDAO_MAINNET]: "coredao" /* COREDAO */,
  [EndpointId.METER_MAINNET]: "meter" /* METER */,
  [EndpointId.OKX_MAINNET]: "okx" /* OKX */,
  [EndpointId.GOERLI_MAINNET]: "goerli" /* GOERLI */,
  [EndpointId.ZKSYNC_MAINNET]: "zksync" /* ZKSYNC */,
  [EndpointId.SHRAPNEL_MAINNET]: "shrapnel" /* SHRAPNEL */,
  [EndpointId.DOS_MAINNET]: "dos" /* DOS */,
  [EndpointId.ZKPOLYGON_MAINNET]: "zkevm" /* ZKEVM */,
  [EndpointId.SEPOLIA_MAINNET]: "sepolia" /* SEPOLIA */,
  [EndpointId.MOONRIVER_MAINNET]: "moonriver" /* MOONRIVER */,
  [EndpointId.NOVA_MAINNET]: "nova" /* NOVA */,
  [EndpointId.TENET_MAINNET]: "tenet" /* TENET */,
  [EndpointId.CANTO_MAINNET]: "canto" /* CANTO */,
  [EndpointId.KAVA_MAINNET]: "kava" /* KAVA */,
  [EndpointId.MANTLE_MAINNET]: "mantle" /* MANTLE */,
  [EndpointId.HUBBLE_MAINNET]: "hubble" /* HUBBLE */,
  [EndpointId.ZKCONSENSYS_MAINNET]: "zkconsensys" /* ZKCONSENSYS */,
  [EndpointId.BASE_MAINNET]: "base" /* BASE */,
  [EndpointId.SOLANA_MAINNET]: "solana" /* SOLANA */,
  // v2 mainnet
  [EndpointId.ETHEREUM_V2_MAINNET]: "ethereum" /* ETHEREUM */,
  [EndpointId.BSC_V2_MAINNET]: "bsc" /* BSC */,
  [EndpointId.AVALANCHE_V2_MAINNET]: "avalanche" /* AVALANCHE */,
  [EndpointId.POLYGON_V2_MAINNET]: "polygon" /* POLYGON */,
  [EndpointId.ARBITRUM_V2_MAINNET]: "arbitrum" /* ARBITRUM */,
  [EndpointId.OPTIMISM_V2_MAINNET]: "optimism" /* OPTIMISM */,
  [EndpointId.FANTOM_V2_MAINNET]: "fantom" /* FANTOM */,
  [EndpointId.SWIMMER_V2_MAINNET]: "swimmer" /* SWIMMER */,
  [EndpointId.DFK_V2_MAINNET]: "dfk" /* DFK */,
  [EndpointId.HARMONY_V2_MAINNET]: "harmony" /* HARMONY */,
  [EndpointId.DEXALOT_V2_MAINNET]: "dexalot" /* DEXALOT */,
  [EndpointId.CELO_V2_MAINNET]: "celo" /* CELO */,
  [EndpointId.MOONBEAM_V2_MAINNET]: "moonbeam" /* MOONBEAM */,
  [EndpointId.INTAIN_V2_MAINNET]: "intain" /* INTAIN */,
  [EndpointId.FUSE_V2_MAINNET]: "fuse" /* FUSE */,
  [EndpointId.GNOSIS_V2_MAINNET]: "gnosis" /* GNOSIS */,
  [EndpointId.APTOS_V2_MAINNET]: "aptos" /* APTOS */,
  [EndpointId.KLAYTN_V2_MAINNET]: "klaytn" /* KLAYTN */,
  [EndpointId.METIS_V2_MAINNET]: "metis" /* METIS */,
  [EndpointId.COREDAO_V2_MAINNET]: "coredao" /* COREDAO */,
  [EndpointId.GOERLI_V2_MAINNET]: "goerli" /* GOERLI */,
  [EndpointId.OKX_V2_MAINNET]: "okx" /* OKX */,
  [EndpointId.CANTO_V2_MAINNET]: "canto" /* CANTO */,
  [EndpointId.ZKSYNC_V2_MAINNET]: "zksync" /* ZKSYNC */,
  [EndpointId.SHRAPNEL_V2_MAINNET]: "shrapnel" /* SHRAPNEL */,
  [EndpointId.DOS_V2_MAINNET]: "dos" /* DOS */,
  [EndpointId.ZKPOLYGON_V2_MAINNET]: "zkevm" /* ZKEVM */,
  [EndpointId.SEPOLIA_V2_MAINNET]: "sepolia" /* SEPOLIA */,
  [EndpointId.MOONRIVER_V2_MAINNET]: "moonriver" /* MOONRIVER */,
  [EndpointId.SOLANA_V2_MAINNET]: "solana" /* SOLANA */,
  [EndpointId.TENET_V2_MAINNET]: "tenet" /* TENET */,
  [EndpointId.NOVA_V2_MAINNET]: "nova" /* NOVA */,
  [EndpointId.METER_V2_MAINNET]: "meter" /* METER */,
  [EndpointId.KAVA_V2_MAINNET]: "kava" /* KAVA */,
  [EndpointId.MANTLE_V2_MAINNET]: "mantle" /* MANTLE */,
  [EndpointId.HUBBLE_V2_MAINNET]: "hubble" /* HUBBLE */,
  [EndpointId.ZKCONSENSYS_V2_MAINNET]: "zkconsensys" /* ZKCONSENSYS */,
  [EndpointId.BASE_V2_MAINNET]: "base" /* BASE */,
  // testnet
  [EndpointId.ETHEREUM_TESTNET]: "goerli" /* GOERLI */,
  [EndpointId.BSC_TESTNET]: "bsc-testnet" /* BSC_TESTNET */,
  [EndpointId.POLYGON_TESTNET]: "mumbai" /* MUMBAI */,
  [EndpointId.FANTOM_TESTNET]: "fantom-testnet" /* FANTOM_TESTNET */,
  [EndpointId.HARMONY_TESTNET]: "harmony-testnet" /* HARMONY_TESTNET */,
  [EndpointId.AVALANCHE_TESTNET]: "fuji" /* FUJI */,
  [EndpointId.ARBITRUM_TESTNET]: "arbitrum-goerli" /* ARBITURM_GOERLI */,
  [EndpointId.OPTIMISM_TESTNET]: "optimism-goerli" /* OPTIMISM_GOERLI */,
  [EndpointId.DFK_TESTNET]: "dfk-testnet" /* DFK_TESTNET */,
  [EndpointId.SWIMMER_TESTNET]: "swimmer-testnet" /* SWIMMER_TESTNET */,
  [EndpointId.DEXALOT_TESTNET]: "dexalot-testnet" /* DEVALOT_TESTNET */,
  [EndpointId.GNOSIS_TESTNET]: "chiado" /* CHIADO */,
  [EndpointId.CELO_TESTNET]: "alfajores" /* ALFAJORES */,
  [EndpointId.APTOS_TESTNET]: "aptos-testnet" /* APTOS_TESTNET */,
  [EndpointId.MOONBEAM_TESTNET]: "moonbase" /* MOONBASE */,
  [EndpointId.FUSE_TESTNET]: "fusespark" /* FUSESPARK */,
  [EndpointId.ZKSYNC_TESTNET]: "zksync-testnet" /* ZKSYNC_TESTNET */,
  [EndpointId.SHRAPNEL_TESTNET]: "shrapnel-testnet" /* SHRAPNEL_TESTNET */,
  [EndpointId.DOS_TESTNET]: "dos-testnet" /* DOS_TESTNET */,
  [EndpointId.KLAYTN_TESTNET]: "klaytn-baobab" /* KLAYTN_BAOBAB */,
  [EndpointId.METIS_TESTNET]: "metis-goerli" /* METIS_GOERLI */,
  [EndpointId.INTAIN_TESTNET]: "intain-testnet" /* INTAIN_TESTNET */,
  [EndpointId.COREDAO_TESTNET]: "coredao-testnet" /* COREDAO_TESTNET */,
  [EndpointId.ZKPOLYGON_TESTNET]: "zkevm-testnet" /* ZKEVM_TESTNET */,
  [EndpointId.OKX_TESTNET]: "okx-testnet" /* OKX_TESTNET */,
  [EndpointId.SOLANA_TESTNET]: "solana-testnet" /* SOLANA_TESTNET */,
  [EndpointId.METER_TESTNET]: "meter-testnet" /* METER_TESTNET */,
  [EndpointId.ZKCONSENSYS_TESTNET]: "linea-goerli" /* LINEA_GOERLI */,
  [EndpointId.SEPOLIA_TESTNET]: "sepolia" /* SEPOLIA */,
  [EndpointId.BASE_TESTNET]: "base-goerli" /* BASE_GOERLI */,
  [EndpointId.AAVEGOTCHI_TESTNET]: "aavegotchi-testnet" /* AAVEGOTCHI_TESTNET */,
  [EndpointId.SCROLL_TESTNET]: "scroll-testnet" /* SCROLL_TESTNET */,
  [EndpointId.CATHAY_TESTNET]: "cathay-testnet" /* CATHAY_TESTNET */,
  [EndpointId.KAVA_TESTNET]: "kava-testnet" /* KAVA_TESTNET */,
  [EndpointId.TENET_TESTNET]: "tenet-testnet" /* TENET_TESTNET */,
  [EndpointId.CANTO_TESTNET]: "canto-testnet" /* CANTO_TESTNET */,
  [EndpointId.ORDERLY_TESTNET]: "orderly-testnet" /* ORDERLY_TESTNET */,
  [EndpointId.BLOCKGEN_TESTNET]: "blockgen-testnet" /* BLOCKGEN_TESTNET */,
  [EndpointId.MERITCIRCLE_TESTNET]: "meritcircle-testnet" /* MERITCIRCLE_TESTNET */,
  [EndpointId.MANTLE_TESTNET]: "mantle-testnet" /* MANTLE_TESTNET */,
  [EndpointId.HUBBLE_TESTNET]: "hubble-testnet" /* HUBBLE_TESTNET */,
  // v2 testnet
  [EndpointId.ETHEREUM_V2_TESTNET]: "goerli" /* GOERLI */,
  [EndpointId.POLYGON_V2_TESTNET]: "mumbai" /* MUMBAI */,
  [EndpointId.SOLANA_V2_TESTNET]: "solana-testnet" /* SOLANA_TESTNET */,
  [EndpointId.ARBITRUM_V2_TESTNET]: "arbitrum-goerli" /* ARBITURM_GOERLI */,
  [EndpointId.OPTIMISM_V2_TESTNET]: "optimism-goerli" /* OPTIMISM_GOERLI */,
  [EndpointId.AVALANCHE_V2_TESTNET]: "fuji" /* FUJI */,
  [EndpointId.BSC_V2_TESTNET]: "bsc-testnet" /* BSC_TESTNET */,
  [EndpointId.FANTOM_V2_TESTNET]: "fantom-testnet" /* FANTOM_TESTNET */,
  [EndpointId.DFK_V2_TESTNET]: "dfk-testnet" /* DFK_TESTNET */,
  [EndpointId.HARMONY_V2_TESTNET]: "harmony-testnet" /* HARMONY_TESTNET */,
  [EndpointId.DEXALOT_V2_TESTNET]: "dexalot-testnet" /* DEVALOT_TESTNET */,
  [EndpointId.CELO_V2_TESTNET]: "alfajores" /* ALFAJORES */,
  [EndpointId.MOONBEAM_V2_TESTNET]: "moonbase" /* MOONBASE */,
  [EndpointId.FUSE_V2_TESTNET]: "fusespark" /* FUSESPARK */,
  [EndpointId.GNOSIS_V2_TESTNET]: "chiado" /* CHIADO */,
  [EndpointId.ZKSYNC_V2_TESTNET]: "zksync-testnet" /* ZKSYNC_TESTNET */,
  [EndpointId.SHRAPNEL_V2_TESTNET]: "shrapnel-testnet" /* SHRAPNEL_TESTNET */,
  [EndpointId.DOS_V2_TESTNET]: "dos-testnet" /* DOS_TESTNET */,
  [EndpointId.KLAYTN_V2_TESTNET]: "klaytn-baobab" /* KLAYTN_BAOBAB */,
  [EndpointId.METIS_V2_TESTNET]: "metis-goerli" /* METIS_GOERLI */,
  [EndpointId.COREDAO_V2_TESTNET]: "coredao-testnet" /* COREDAO_TESTNET */,
  [EndpointId.OKX_V2_TESTNET]: "okx-testnet" /* OKX_TESTNET */,
  [EndpointId.METER_V2_TESTNET]: "meter-testnet" /* METER_TESTNET */,
  [EndpointId.ZKCONSENSYS_V2_TESTNET]: "linea-goerli" /* LINEA_GOERLI */,
  [EndpointId.ZKPOLYGON_V2_TESTNET]: "zkevm-testnet" /* ZKEVM_TESTNET */,
  [EndpointId.CANTO_V2_TESTNET]: "canto-testnet" /* CANTO_TESTNET */,
  [EndpointId.BASE_V2_TESTNET]: "base-goerli" /* BASE_GOERLI */,
  [EndpointId.SEPOLIA_V2_TESTNET]: "sepolia" /* SEPOLIA */,
  [EndpointId.AAVEGOTCHI_V2_TESTNET]: "aavegotchi-testnet" /* AAVEGOTCHI_TESTNET */,
  [EndpointId.SCROLL_V2_TESTNET]: "scroll-testnet" /* SCROLL_TESTNET */,
  [EndpointId.CATHAY_V2_TESTNET]: "cathay-testnet" /* CATHAY_TESTNET */,
  [EndpointId.KAVA_V2_TESTNET]: "kava-testnet" /* KAVA_TESTNET */,
  [EndpointId.TENET_V2_TESTNET]: "tenet-testnet" /* TENET_TESTNET */,
  [EndpointId.ORDERLY_V2_TESTNET]: "orderly-testnet" /* ORDERLY_TESTNET */,
  [EndpointId.BLOCKGEN_V2_TESTNET]: "blockgen-testnet" /* BLOCKGEN_TESTNET */,
  [EndpointId.MERITCIRCLE_V2_TESTNET]: "meritcircle-testnet" /* MERITCIRCLE_TESTNET */,
  [EndpointId.MANTLE_V2_TESTNET]: "mantle-testnet" /* MANTLE_TESTNET */,
  [EndpointId.HUBBLE_V2_TESTNET]: "hubble-testnet" /* HUBBLE_TESTNET */,
  // sandbox
  [EndpointId.ETHEREUM_SANDBOX]: "goerli" /* GOERLI */,
  [EndpointId.BSC_SANDBOX]: "bsc-testnet" /* BSC_TESTNET */,
  [EndpointId.POLYGON_SANDBOX]: "mumbai" /* MUMBAI */,
  [EndpointId.AVALANCHE_SANDBOX]: "fuji" /* FUJI */,
  [EndpointId.APTOS_SANDBOX]: "aptos" /* APTOS */,
  // v2 sandbox
  [EndpointId.ETHEREUM_V2_SANDBOX]: "goerli" /* GOERLI */,
  [EndpointId.POLYGON_V2_SANDBOX]: "mumbai" /* MUMBAI */,
  [EndpointId.SOLANA_V2_SANDBOX]: "solana-testnet" /* SOLANA_TESTNET */,
  [EndpointId.BSC_V2_SANDBOX]: "bsc-testnet" /* BSC_TESTNET */,
  [EndpointId.AVALANCHE_V2_SANDBOX]: "fuji" /* FUJI */
};

// src/constants/environment.ts
var ENVIRONMENT = {
  [EndpointId.ETHEREUM_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.BSC_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.AVALANCHE_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.POLYGON_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.ARBITRUM_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.OPTIMISM_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.FANTOM_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.SWIMMER_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.DFK_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.HARMONY_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.DEXALOT_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.CELO_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.MOONBEAM_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.INTAIN_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.FUSE_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.GNOSIS_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.APTOS_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.KLAYTN_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.METIS_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.COREDAO_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.METER_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.OKX_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.GOERLI_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.ZKSYNC_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.SHRAPNEL_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.DOS_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.ZKPOLYGON_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.SEPOLIA_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.MOONRIVER_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.NOVA_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.TENET_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.CANTO_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.KAVA_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.MANTLE_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.HUBBLE_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.ZKCONSENSYS_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.BASE_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.SOLANA_MAINNET]: "mainnet" /* MAINNET */,
  // v2 mainnet
  [EndpointId.ETHEREUM_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.BSC_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.AVALANCHE_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.POLYGON_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.ARBITRUM_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.OPTIMISM_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.FANTOM_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.SWIMMER_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.DFK_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.HARMONY_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.DEXALOT_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.CELO_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.MOONBEAM_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.INTAIN_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.FUSE_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.GNOSIS_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.APTOS_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.KLAYTN_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.METIS_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.COREDAO_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.GOERLI_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.OKX_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.CANTO_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.ZKSYNC_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.SHRAPNEL_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.DOS_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.ZKPOLYGON_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.SEPOLIA_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.MOONRIVER_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.SOLANA_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.TENET_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.NOVA_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.METER_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.KAVA_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.MANTLE_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.HUBBLE_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.ZKCONSENSYS_V2_MAINNET]: "mainnet" /* MAINNET */,
  [EndpointId.BASE_V2_MAINNET]: "mainnet" /* MAINNET */,
  // testnet
  [EndpointId.ETHEREUM_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.BSC_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.POLYGON_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.FANTOM_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.HARMONY_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.AVALANCHE_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.ARBITRUM_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.OPTIMISM_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.DFK_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.SWIMMER_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.DEXALOT_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.GNOSIS_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.CELO_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.APTOS_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.MOONBEAM_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.FUSE_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.ZKSYNC_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.SHRAPNEL_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.DOS_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.KLAYTN_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.METIS_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.INTAIN_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.COREDAO_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.ZKPOLYGON_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.OKX_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.SOLANA_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.METER_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.ZKCONSENSYS_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.SEPOLIA_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.BASE_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.AAVEGOTCHI_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.SCROLL_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.CATHAY_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.KAVA_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.TENET_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.CANTO_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.ORDERLY_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.BLOCKGEN_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.MERITCIRCLE_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.MANTLE_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.HUBBLE_TESTNET]: "testnet" /* TESTNET */,
  // v2 testnet
  [EndpointId.ETHEREUM_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.POLYGON_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.SOLANA_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.ARBITRUM_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.OPTIMISM_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.AVALANCHE_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.BSC_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.FANTOM_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.DFK_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.HARMONY_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.DEXALOT_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.CELO_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.MOONBEAM_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.FUSE_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.GNOSIS_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.ZKSYNC_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.SHRAPNEL_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.DOS_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.KLAYTN_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.METIS_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.COREDAO_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.OKX_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.METER_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.ZKCONSENSYS_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.ZKPOLYGON_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.CANTO_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.BASE_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.SEPOLIA_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.AAVEGOTCHI_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.SCROLL_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.CATHAY_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.KAVA_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.TENET_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.ORDERLY_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.BLOCKGEN_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.MERITCIRCLE_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.MANTLE_V2_TESTNET]: "testnet" /* TESTNET */,
  [EndpointId.HUBBLE_V2_TESTNET]: "testnet" /* TESTNET */,
  // sandbox
  [EndpointId.ETHEREUM_SANDBOX]: "testnet" /* TESTNET */,
  [EndpointId.BSC_SANDBOX]: "testnet" /* TESTNET */,
  [EndpointId.POLYGON_SANDBOX]: "testnet" /* TESTNET */,
  [EndpointId.AVALANCHE_SANDBOX]: "testnet" /* TESTNET */,
  [EndpointId.APTOS_SANDBOX]: "devnet" /* DEVNET */,
  // v2 sandbox
  [EndpointId.ETHEREUM_V2_SANDBOX]: "testnet" /* TESTNET */,
  [EndpointId.POLYGON_V2_SANDBOX]: "devnet" /* DEVNET */,
  [EndpointId.SOLANA_V2_SANDBOX]: "devnet" /* DEVNET */,
  [EndpointId.BSC_V2_SANDBOX]: "devnet" /* DEVNET */,
  [EndpointId.AVALANCHE_V2_SANDBOX]: "devnet" /* DEVNET */
};

// src/constants/ulnv1.ts
var ULN_V1_CHAINS = [
  EndpointId.ETHEREUM_MAINNET,
  EndpointId.ETHEREUM_TESTNET,
  EndpointId.ETHEREUM_SANDBOX,
  EndpointId.BSC_MAINNET,
  EndpointId.BSC_TESTNET,
  EndpointId.BSC_SANDBOX,
  EndpointId.AVALANCHE_MAINNET,
  EndpointId.AVALANCHE_TESTNET,
  EndpointId.AVALANCHE_SANDBOX,
  EndpointId.POLYGON_MAINNET,
  EndpointId.POLYGON_TESTNET,
  EndpointId.POLYGON_SANDBOX,
  EndpointId.ARBITRUM_MAINNET,
  EndpointId.OPTIMISM_MAINNET,
  EndpointId.FANTOM_MAINNET,
  EndpointId.FANTOM_TESTNET,
  EndpointId.SWIMMER_MAINNET,
  EndpointId.SWIMMER_TESTNET,
  EndpointId.DFK_MAINNET,
  EndpointId.DFK_TESTNET,
  EndpointId.HARMONY_MAINNET,
  EndpointId.HARMONY_TESTNET,
  EndpointId.MOONBEAM_MAINNET,
  EndpointId.MOONBEAM_TESTNET,
  EndpointId.DEXALOT_TESTNET,
  EndpointId.CELO_TESTNET,
  EndpointId.INTAIN_TESTNET
];

// src/constants/stargate.ts
var BRIDGE_ADDRESS = {
  [EndpointId.ETHEREUM_MAINNET]: "0x296F55F8Fb28E498B858d0BcDA06D955B2Cb3f97",
  [EndpointId.BSC_MAINNET]: "0x6694340fc020c5E6B96567843da2df01b2CE1eb6",
  [EndpointId.BSC_TESTNET]: "0xa1E105511416aEc3200CcE7069548cF332c6DCA2",
  [EndpointId.AVALANCHE_MAINNET]: "0x9d1B1669c73b033DFe47ae5a0164Ab96df25B944",
  [EndpointId.AVALANCHE_TESTNET]: "0x29fBC4E4092Db862218c62a888a00F9521619230",
  [EndpointId.POLYGON_MAINNET]: "0x9d1B1669c73b033DFe47ae5a0164Ab96df25B944",
  [EndpointId.POLYGON_TESTNET]: "0x629B57D89b1739eE1C0c0fD9eab426306e11cF42",
  [EndpointId.ARBITRUM_MAINNET]: "0x352d8275AAE3e0c2404d9f68f6cEE084B5bEB3DD",
  [EndpointId.OPTIMISM_MAINNET]: "0x701a95707A0290AC8B90b3719e8EE5b210360883",
  [EndpointId.FANTOM_MAINNET]: "0x45A01E4e04F14f7A4a6702c74187c5F6222033cd",
  [EndpointId.FANTOM_TESTNET]: "0xb97948ad8805174e0CB27cAf0115e5eA5e02F3A7",
  [EndpointId.METIS_MAINNET]: "0x45f1A95A4D3f3836523F5c83673c797f4d4d263B"
};
var STG_ADDRESS = {
  [EndpointId.ETHEREUM_MAINNET]: "0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6",
  [EndpointId.BSC_MAINNET]: "0xB0D502E938ed5f4df2E681fE6E419ff29631d62b",
  [EndpointId.BSC_TESTNET]: "0xcd2DBD80c15b1A3df37658e5656a87160969bE11",
  [EndpointId.AVALANCHE_MAINNET]: "0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590",
  [EndpointId.AVALANCHE_TESTNET]: "0xA6B23d4be9364398FB265c60588cdc4FB78314a0",
  [EndpointId.POLYGON_MAINNET]: "0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590",
  [EndpointId.POLYGON_TESTNET]: "0x9049D580A526871A1bD8d4348fFBA220F7Dd0563",
  [EndpointId.ARBITRUM_MAINNET]: "0x6694340fc020c5E6B96567843da2df01b2CE1eb6",
  [EndpointId.OPTIMISM_MAINNET]: "0x296F55F8Fb28E498B858d0BcDA06D955B2Cb3f97",
  [EndpointId.FANTOM_MAINNET]: "0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590",
  [EndpointId.FANTOM_TESTNET]: "0x8678A0cF61896CdAF4e3cD60c57D23d22B519B80"
};
function networkToEndpointId(network, version) {
  const name = network.replace("-local", "");
  const [chain, stage] = name.split("-");
  const key = version === "v1" /* V1 */ ? `${chain.toUpperCase()}_${stage.toUpperCase()}` : `${chain.toUpperCase()}_V2_${stage.toUpperCase()}`;
  invariant__default.default(key in EndpointId, `Invalid network name: ${network}, key: ${key}`);
  return EndpointId[key];
}
function networkToEnv(network, version) {
  if (network.includes("local") || network === "hardhat") {
    return "local" /* LOCAL */;
  }
  const endpointId = networkToEndpointId(network, version);
  return ENVIRONMENT[endpointId];
}
function networkToStage(network) {
  const name = network.replace("-local", "");
  const stage = name.split("-")[1];
  return Stage[stage.toUpperCase()];
}
function endpointIdToNetwork(endpointId, env) {
  const key = EndpointId[endpointId];
  invariant__default.default(key, `Invalid endpointId: ${endpointId}`);
  const network = key.toLowerCase().replace(/_/g, "-").replace("-v2", "");
  if (env === "local" /* LOCAL */) {
    return `${network}-local`;
  }
  return network;
}
function endpointIdToVersion(endpointId) {
  const key = EndpointId[endpointId];
  invariant__default.default(key, `Invalid endpointId: ${endpointId}`);
  return key.includes("V2") ? "v2" /* V2 */ : "v1" /* V1 */;
}
function endpointIdToChainKey(endpointId) {
  const chainKey = CHAIN_KEY[endpointId];
  invariant__default.default(chainKey, `No ChainKey for EndpointId: ${endpointId}`);
  return chainKey;
}
function chainAndStageToEndpointId(chain, stage, version) {
  const key = version === "v2" /* V2 */ ? `${chain.toUpperCase()}_V2_${stage.toUpperCase()}` : `${chain.toUpperCase()}_${stage.toUpperCase()}`;
  invariant__default.default(key in EndpointId, `Invalid key: ${key}`);
  return EndpointId[key];
}
function chainAndStageToNetwork(chain, stage, env) {
  if (env === "local" /* LOCAL */) {
    return `${chain}-${stage}-local`;
  }
  return `${chain}-${stage}`;
}
function networkToChain(network) {
  return network.split("-")[0];
}
function networkToChainType(network) {
  const chain = networkToChain(network);
  return getChainType(chain);
}
function getChainType(chain) {
  switch (chain) {
    case "aptos" /* APTOS */:
      return "aptos" /* APTOS */;
    case "solana" /* SOLANA */:
      return "solana" /* SOLANA */;
    default:
      if (Object.values(Chain).includes(chain)) {
        return "evm" /* EVM */;
      } else {
        return "unknown" /* UNKNOWN */;
      }
  }
}
function endpointIdToChain(endpointId) {
  const key = EndpointId[endpointId];
  invariant__default.default(key, `Invalid endpointId: ${endpointId}`);
  return key.split("_")[0].toLowerCase();
}
function endpointIdToStage(endpointId) {
  let key = EndpointId[endpointId];
  invariant__default.default(key, `Invalid endpointId: ${endpointId}`);
  key = key.replace("_V2", "");
  return key.split("_")[1].toLowerCase();
}
function endpointIdToChainType(endpointId) {
  const chain = endpointIdToChain(endpointId);
  return getChainType(chain);
}
function getNetworksForStage(stage) {
  const networks = [];
  for (const key in EndpointId) {
    if (Number(key) >= 0) {
      const network = endpointIdToNetwork(Number(key));
      const s = network.split("-")[1];
      if (stage === s) {
        networks.push(network);
      }
    }
  }
  return networks;
}
var ULN_V1_BIAS = 100;
var getEndpointVersionForUlnVersion = (ulnVersion) => {
  const [majorVerion, minorVersion, endpointVersion] = ulnVersion.split(".");
  if (!endpointVersion) {
    return "v1" /* V1 */;
  }
  const version = {
    "1": "v1" /* V1 */,
    "2": "v2" /* V2 */
  }[endpointVersion];
  if (!version) {
    throw new Error(`Invalid ulnVersion: ${ulnVersion}`);
  }
  return version;
};
function getChainIdForNetwork(chain, stage, ulnVersion) {
  const endpointId = chainAndStageToEndpointId(
    chain,
    stage,
    getEndpointVersionForUlnVersion(ulnVersion)
  );
  return (ulnVersion == "1" ? endpointId - ULN_V1_BIAS : endpointId).toString();
}
function getNetworkForChainId(targetchainId) {
  if (ULN_V1_CHAINS.includes(targetchainId + ULN_V1_BIAS)) {
    const endpointId = targetchainId + ULN_V1_BIAS;
    const chain2 = endpointIdToChain(endpointId);
    const stage2 = networkToStage(endpointIdToNetwork(endpointId));
    return {
      chainName: chain2,
      env: stage2,
      ulnVersion: "1"
    };
  }
  const chain = endpointIdToChain(targetchainId);
  const stage = networkToStage(endpointIdToNetwork(targetchainId));
  return {
    chainName: chain,
    env: stage,
    ulnVersion: "2"
  };
}

exports.BRIDGE_ADDRESS = BRIDGE_ADDRESS;
exports.CHAIN_KEY = CHAIN_KEY;
exports.Chain = Chain;
exports.ChainKey = ChainKey;
exports.ChainType = ChainType;
exports.ENVIRONMENT = ENVIRONMENT;
exports.EndpointId = EndpointId;
exports.EndpointVersion = EndpointVersion;
exports.Environment = Environment;
exports.MainnetEndpointId = MainnetEndpointId;
exports.MainnetV2EndpointId = MainnetV2EndpointId;
exports.MessageLibVersionV1 = MessageLibVersionV1;
exports.MessageLibVersionV2 = MessageLibVersionV2;
exports.STG_ADDRESS = STG_ADDRESS;
exports.SandboxEndpointId = SandboxEndpointId;
exports.SandboxV2EndpointId = SandboxV2EndpointId;
exports.Stage = Stage;
exports.TestnetEndpointId = TestnetEndpointId;
exports.TestnetV2EndpointId = TestnetV2EndpointId;
exports.ULN_V1_CHAINS = ULN_V1_CHAINS;
exports.chainAndStageToEndpointId = chainAndStageToEndpointId;
exports.chainAndStageToNetwork = chainAndStageToNetwork;
exports.endpointIdToChain = endpointIdToChain;
exports.endpointIdToChainKey = endpointIdToChainKey;
exports.endpointIdToChainType = endpointIdToChainType;
exports.endpointIdToNetwork = endpointIdToNetwork;
exports.endpointIdToStage = endpointIdToStage;
exports.endpointIdToVersion = endpointIdToVersion;
exports.getChainIdForNetwork = getChainIdForNetwork;
exports.getChainType = getChainType;
exports.getEndpointVersionForUlnVersion = getEndpointVersionForUlnVersion;
exports.getNetworkForChainId = getNetworkForChainId;
exports.getNetworksForStage = getNetworksForStage;
exports.networkToChain = networkToChain;
exports.networkToChainType = networkToChainType;
exports.networkToEndpointId = networkToEndpointId;
exports.networkToEnv = networkToEnv;
exports.networkToStage = networkToStage;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.cjs.map