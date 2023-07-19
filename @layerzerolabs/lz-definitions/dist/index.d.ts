declare enum Chain {
    ETHEREUM = "ethereum",
    BSC = "bsc",
    AVALANCHE = "avalanche",
    POLYGON = "polygon",
    ZKPOLYGON = "zkpolygon",
    ARBITRUM = "arbitrum",
    OPTIMISM = "optimism",
    FANTOM = "fantom",
    SWIMMER = "swimmer",
    DFK = "dfk",
    HARMONY = "harmony",
    ARCANA = "arcana",
    DEXALOT = "dexalot",
    CASTLECRUSH = "castlecrush",
    GNOSIS = "gnosis",
    CELO = "celo",
    MOONBEAM = "moonbeam",
    BOBA = "boba",
    PORTAL = "portal",
    AURORA = "aurora",
    INTAIN = "intain",
    FUSE = "fuse",
    ASTAR = "astar",
    ZKSYNC = "zksync",
    SHRAPNEL = "shrapnel",
    DOS = "dos",
    APTOS = "aptos",
    KLAYTN = "klaytn",
    METIS = "metis",
    COREDAO = "coredao",
    OKX = "okx",
    METER = "meter",
    GOERLI = "goerli",
    SOLANA = "solana",
    BASE = "base",
    ZKCONSENSYS = "zkconsensys",
    SEPOLIA = "sepolia",
    MOONRIVER = "moonriver",
    AAVEGOTCHI = "aavegotchi",
    SCROLL = "scroll",
    CATHAY = "cathay",
    KAVA = "kava",
    TENET = "tenet",
    CANTO = "canto",
    ORDERLY = "orderly",
    NOVA = "nova",
    BLOCKGEN = "blockgen",
    MERITCIRCLE = "meritcircle",
    MANTLE = "mantle",
    HUBBLE = "hubble"
}

declare enum ChainType {
    UNKNOWN = "unknown",
    EVM = "evm",
    APTOS = "aptos",
    SOLANA = "solana"
}

declare enum MainnetEndpointId {
    ETHEREUM_MAINNET = 101,
    BSC_MAINNET = 102,
    AVALANCHE_MAINNET = 106,
    POLYGON_MAINNET = 109,
    ARBITRUM_MAINNET = 110,
    OPTIMISM_MAINNET = 111,
    FANTOM_MAINNET = 112,
    SWIMMER_MAINNET = 114,
    DFK_MAINNET = 115,
    HARMONY_MAINNET = 116,
    DEXALOT_MAINNET = 118,
    CELO_MAINNET = 125,
    MOONBEAM_MAINNET = 126,
    INTAIN_MAINNET = 152,
    FUSE_MAINNET = 138,
    GNOSIS_MAINNET = 145,
    APTOS_MAINNET = 108,
    KLAYTN_MAINNET = 150,
    METIS_MAINNET = 151,
    COREDAO_MAINNET = 153,
    GOERLI_MAINNET = 154,
    OKX_MAINNET = 155,
    CANTO_MAINNET = 159,
    ZKSYNC_MAINNET = 165,
    SHRAPNEL_MAINNET = 148,
    DOS_MAINNET = 149,
    ZKPOLYGON_MAINNET = 158,
    SEPOLIA_MAINNET = 161,
    MOONRIVER_MAINNET = 167,
    SOLANA_MAINNET = 168,
    TENET_MAINNET = 173,
    NOVA_MAINNET = 175,
    METER_MAINNET = 176,
    KAVA_MAINNET = 177,
    MANTLE_MAINNET = 181,
    HUBBLE_MAINNET = 182,
    ZKCONSENSYS_MAINNET = 183,
    BASE_MAINNET = 184
}
declare enum TestnetEndpointId {
    BSC_TESTNET = 10102,
    AVALANCHE_TESTNET = 10106,
    POLYGON_TESTNET = 10109,
    FANTOM_TESTNET = 10112,
    SWIMMER_TESTNET = 10130,
    DFK_TESTNET = 10115,
    HARMONY_TESTNET = 10133,
    DEXALOT_TESTNET = 10118,
    CELO_TESTNET = 10125,
    MOONBEAM_TESTNET = 10126,
    INTAIN_TESTNET = 10152,
    ETHEREUM_TESTNET = 10121,
    ARBITRUM_TESTNET = 10143,
    OPTIMISM_TESTNET = 10132,
    FUSE_TESTNET = 10138,
    GNOSIS_TESTNET = 10145,
    ZKSYNC_TESTNET = 10165,
    SHRAPNEL_TESTNET = 10164,
    DOS_TESTNET = 10162,
    APTOS_TESTNET = 10108,
    KLAYTN_TESTNET = 10150,
    METIS_TESTNET = 10151,
    COREDAO_TESTNET = 10153,
    OKX_TESTNET = 10155,
    METER_TESTNET = 10156,
    ZKCONSENSYS_TESTNET = 10157,
    ZKPOLYGON_TESTNET = 10158,
    CANTO_TESTNET = 10159,
    BASE_TESTNET = 10160,
    SEPOLIA_TESTNET = 10161,
    SOLANA_TESTNET = 10168,
    SCROLL_TESTNET = 10170,
    CATHAY_TESTNET = 10171,
    KAVA_TESTNET = 10172,
    TENET_TESTNET = 10173,
    ORDERLY_TESTNET = 10174,
    BLOCKGEN_TESTNET = 10177,
    MERITCIRCLE_TESTNET = 10178,
    MANTLE_TESTNET = 10181,
    HUBBLE_TESTNET = 10182,
    AAVEGOTCHI_TESTNET = 10190
}
declare enum SandboxEndpointId {
    BSC_SANDBOX = 20102,
    AVALANCHE_SANDBOX = 20106,
    POLYGON_SANDBOX = 20109,
    ETHEREUM_SANDBOX = 20121,
    APTOS_SANDBOX = 20008
}
declare enum MainnetV2EndpointId {
    ETHEREUM_V2_MAINNET = 30101,
    BSC_V2_MAINNET = 30102,
    AVALANCHE_V2_MAINNET = 30106,
    POLYGON_V2_MAINNET = 30109,
    ARBITRUM_V2_MAINNET = 30110,
    OPTIMISM_V2_MAINNET = 30111,
    FANTOM_V2_MAINNET = 30112,
    SWIMMER_V2_MAINNET = 30114,
    DFK_V2_MAINNET = 30115,
    HARMONY_V2_MAINNET = 30116,
    DEXALOT_V2_MAINNET = 30118,
    CELO_V2_MAINNET = 30125,
    MOONBEAM_V2_MAINNET = 30126,
    INTAIN_V2_MAINNET = 30152,
    FUSE_V2_MAINNET = 30138,
    GNOSIS_V2_MAINNET = 30145,
    APTOS_V2_MAINNET = 30108,
    KLAYTN_V2_MAINNET = 30150,
    METIS_V2_MAINNET = 30151,
    COREDAO_V2_MAINNET = 30153,
    GOERLI_V2_MAINNET = 30154,
    OKX_V2_MAINNET = 30155,
    CANTO_V2_MAINNET = 30159,
    ZKSYNC_V2_MAINNET = 30165,
    SHRAPNEL_V2_MAINNET = 30148,
    DOS_V2_MAINNET = 30149,
    ZKPOLYGON_V2_MAINNET = 30158,
    SEPOLIA_V2_MAINNET = 30161,
    MOONRIVER_V2_MAINNET = 30167,
    SOLANA_V2_MAINNET = 30168,
    TENET_V2_MAINNET = 30173,
    NOVA_V2_MAINNET = 30175,
    METER_V2_MAINNET = 30176,
    KAVA_V2_MAINNET = 30177,
    MANTLE_V2_MAINNET = 30181,
    HUBBLE_V2_MAINNET = 30182,
    ZKCONSENSYS_V2_MAINNET = 30183,
    BASE_V2_MAINNET = 30184
}
declare enum TestnetV2EndpointId {
    AVALANCHE_V2_TESTNET = 40106,
    POLYGON_V2_TESTNET = 40109,
    ETHEREUM_V2_TESTNET = 40121,
    OPTIMISM_V2_TESTNET = 40132,
    ARBITRUM_V2_TESTNET = 40143,
    SOLANA_V2_TESTNET = 40168,
    BSC_V2_TESTNET = 40102,
    FANTOM_V2_TESTNET = 40112,
    DFK_V2_TESTNET = 40115,
    HARMONY_V2_TESTNET = 40133,
    DEXALOT_V2_TESTNET = 40118,
    CELO_V2_TESTNET = 40125,
    MOONBEAM_V2_TESTNET = 40126,
    FUSE_V2_TESTNET = 40138,
    GNOSIS_V2_TESTNET = 40145,
    ZKSYNC_V2_TESTNET = 40165,
    SHRAPNEL_V2_TESTNET = 40164,
    DOS_V2_TESTNET = 40162,
    KLAYTN_V2_TESTNET = 40150,
    METIS_V2_TESTNET = 40151,
    COREDAO_V2_TESTNET = 40153,
    OKX_V2_TESTNET = 40155,
    METER_V2_TESTNET = 40156,
    ZKCONSENSYS_V2_TESTNET = 40157,
    ZKPOLYGON_V2_TESTNET = 40158,
    CANTO_V2_TESTNET = 40159,
    BASE_V2_TESTNET = 40160,
    SEPOLIA_V2_TESTNET = 40161,
    AAVEGOTCHI_V2_TESTNET = 40179,
    SCROLL_V2_TESTNET = 40170,
    CATHAY_V2_TESTNET = 40171,
    KAVA_V2_TESTNET = 40172,
    TENET_V2_TESTNET = 40173,
    ORDERLY_V2_TESTNET = 40174,
    BLOCKGEN_V2_TESTNET = 40177,
    MERITCIRCLE_V2_TESTNET = 40178,
    MANTLE_V2_TESTNET = 40181,
    HUBBLE_V2_TESTNET = 40182
}
declare enum SandboxV2EndpointId {
    ETHEREUM_V2_SANDBOX = 50121,
    POLYGON_V2_SANDBOX = 50109,
    SOLANA_V2_SANDBOX = 50168,
    BSC_V2_SANDBOX = 50102,
    AVALANCHE_V2_SANDBOX = 50106
}
declare const EndpointId: {
    [x: number]: string;
    ETHEREUM_V2_SANDBOX: SandboxV2EndpointId.ETHEREUM_V2_SANDBOX;
    POLYGON_V2_SANDBOX: SandboxV2EndpointId.POLYGON_V2_SANDBOX;
    SOLANA_V2_SANDBOX: SandboxV2EndpointId.SOLANA_V2_SANDBOX;
    BSC_V2_SANDBOX: SandboxV2EndpointId.BSC_V2_SANDBOX;
    AVALANCHE_V2_SANDBOX: SandboxV2EndpointId.AVALANCHE_V2_SANDBOX;
    AVALANCHE_V2_TESTNET: TestnetV2EndpointId.AVALANCHE_V2_TESTNET;
    POLYGON_V2_TESTNET: TestnetV2EndpointId.POLYGON_V2_TESTNET;
    ETHEREUM_V2_TESTNET: TestnetV2EndpointId.ETHEREUM_V2_TESTNET;
    OPTIMISM_V2_TESTNET: TestnetV2EndpointId.OPTIMISM_V2_TESTNET;
    ARBITRUM_V2_TESTNET: TestnetV2EndpointId.ARBITRUM_V2_TESTNET;
    SOLANA_V2_TESTNET: TestnetV2EndpointId.SOLANA_V2_TESTNET;
    BSC_V2_TESTNET: TestnetV2EndpointId.BSC_V2_TESTNET;
    FANTOM_V2_TESTNET: TestnetV2EndpointId.FANTOM_V2_TESTNET;
    DFK_V2_TESTNET: TestnetV2EndpointId.DFK_V2_TESTNET;
    HARMONY_V2_TESTNET: TestnetV2EndpointId.HARMONY_V2_TESTNET;
    DEXALOT_V2_TESTNET: TestnetV2EndpointId.DEXALOT_V2_TESTNET;
    CELO_V2_TESTNET: TestnetV2EndpointId.CELO_V2_TESTNET;
    MOONBEAM_V2_TESTNET: TestnetV2EndpointId.MOONBEAM_V2_TESTNET;
    FUSE_V2_TESTNET: TestnetV2EndpointId.FUSE_V2_TESTNET;
    GNOSIS_V2_TESTNET: TestnetV2EndpointId.GNOSIS_V2_TESTNET;
    ZKSYNC_V2_TESTNET: TestnetV2EndpointId.ZKSYNC_V2_TESTNET;
    SHRAPNEL_V2_TESTNET: TestnetV2EndpointId.SHRAPNEL_V2_TESTNET;
    DOS_V2_TESTNET: TestnetV2EndpointId.DOS_V2_TESTNET;
    KLAYTN_V2_TESTNET: TestnetV2EndpointId.KLAYTN_V2_TESTNET;
    METIS_V2_TESTNET: TestnetV2EndpointId.METIS_V2_TESTNET;
    COREDAO_V2_TESTNET: TestnetV2EndpointId.COREDAO_V2_TESTNET;
    OKX_V2_TESTNET: TestnetV2EndpointId.OKX_V2_TESTNET;
    METER_V2_TESTNET: TestnetV2EndpointId.METER_V2_TESTNET;
    ZKCONSENSYS_V2_TESTNET: TestnetV2EndpointId.ZKCONSENSYS_V2_TESTNET;
    ZKPOLYGON_V2_TESTNET: TestnetV2EndpointId.ZKPOLYGON_V2_TESTNET;
    CANTO_V2_TESTNET: TestnetV2EndpointId.CANTO_V2_TESTNET;
    BASE_V2_TESTNET: TestnetV2EndpointId.BASE_V2_TESTNET;
    SEPOLIA_V2_TESTNET: TestnetV2EndpointId.SEPOLIA_V2_TESTNET;
    AAVEGOTCHI_V2_TESTNET: TestnetV2EndpointId.AAVEGOTCHI_V2_TESTNET;
    SCROLL_V2_TESTNET: TestnetV2EndpointId.SCROLL_V2_TESTNET;
    CATHAY_V2_TESTNET: TestnetV2EndpointId.CATHAY_V2_TESTNET;
    KAVA_V2_TESTNET: TestnetV2EndpointId.KAVA_V2_TESTNET;
    TENET_V2_TESTNET: TestnetV2EndpointId.TENET_V2_TESTNET;
    ORDERLY_V2_TESTNET: TestnetV2EndpointId.ORDERLY_V2_TESTNET;
    BLOCKGEN_V2_TESTNET: TestnetV2EndpointId.BLOCKGEN_V2_TESTNET;
    MERITCIRCLE_V2_TESTNET: TestnetV2EndpointId.MERITCIRCLE_V2_TESTNET;
    MANTLE_V2_TESTNET: TestnetV2EndpointId.MANTLE_V2_TESTNET;
    HUBBLE_V2_TESTNET: TestnetV2EndpointId.HUBBLE_V2_TESTNET;
    ETHEREUM_V2_MAINNET: MainnetV2EndpointId.ETHEREUM_V2_MAINNET;
    BSC_V2_MAINNET: MainnetV2EndpointId.BSC_V2_MAINNET;
    AVALANCHE_V2_MAINNET: MainnetV2EndpointId.AVALANCHE_V2_MAINNET;
    POLYGON_V2_MAINNET: MainnetV2EndpointId.POLYGON_V2_MAINNET;
    ARBITRUM_V2_MAINNET: MainnetV2EndpointId.ARBITRUM_V2_MAINNET;
    OPTIMISM_V2_MAINNET: MainnetV2EndpointId.OPTIMISM_V2_MAINNET;
    FANTOM_V2_MAINNET: MainnetV2EndpointId.FANTOM_V2_MAINNET;
    SWIMMER_V2_MAINNET: MainnetV2EndpointId.SWIMMER_V2_MAINNET;
    DFK_V2_MAINNET: MainnetV2EndpointId.DFK_V2_MAINNET;
    HARMONY_V2_MAINNET: MainnetV2EndpointId.HARMONY_V2_MAINNET;
    DEXALOT_V2_MAINNET: MainnetV2EndpointId.DEXALOT_V2_MAINNET;
    CELO_V2_MAINNET: MainnetV2EndpointId.CELO_V2_MAINNET;
    MOONBEAM_V2_MAINNET: MainnetV2EndpointId.MOONBEAM_V2_MAINNET;
    INTAIN_V2_MAINNET: MainnetV2EndpointId.INTAIN_V2_MAINNET;
    FUSE_V2_MAINNET: MainnetV2EndpointId.FUSE_V2_MAINNET;
    GNOSIS_V2_MAINNET: MainnetV2EndpointId.GNOSIS_V2_MAINNET;
    APTOS_V2_MAINNET: MainnetV2EndpointId.APTOS_V2_MAINNET;
    KLAYTN_V2_MAINNET: MainnetV2EndpointId.KLAYTN_V2_MAINNET;
    METIS_V2_MAINNET: MainnetV2EndpointId.METIS_V2_MAINNET;
    COREDAO_V2_MAINNET: MainnetV2EndpointId.COREDAO_V2_MAINNET;
    GOERLI_V2_MAINNET: MainnetV2EndpointId.GOERLI_V2_MAINNET;
    OKX_V2_MAINNET: MainnetV2EndpointId.OKX_V2_MAINNET;
    CANTO_V2_MAINNET: MainnetV2EndpointId.CANTO_V2_MAINNET;
    ZKSYNC_V2_MAINNET: MainnetV2EndpointId.ZKSYNC_V2_MAINNET;
    SHRAPNEL_V2_MAINNET: MainnetV2EndpointId.SHRAPNEL_V2_MAINNET;
    DOS_V2_MAINNET: MainnetV2EndpointId.DOS_V2_MAINNET;
    ZKPOLYGON_V2_MAINNET: MainnetV2EndpointId.ZKPOLYGON_V2_MAINNET;
    SEPOLIA_V2_MAINNET: MainnetV2EndpointId.SEPOLIA_V2_MAINNET;
    MOONRIVER_V2_MAINNET: MainnetV2EndpointId.MOONRIVER_V2_MAINNET;
    SOLANA_V2_MAINNET: MainnetV2EndpointId.SOLANA_V2_MAINNET;
    TENET_V2_MAINNET: MainnetV2EndpointId.TENET_V2_MAINNET;
    NOVA_V2_MAINNET: MainnetV2EndpointId.NOVA_V2_MAINNET;
    METER_V2_MAINNET: MainnetV2EndpointId.METER_V2_MAINNET;
    KAVA_V2_MAINNET: MainnetV2EndpointId.KAVA_V2_MAINNET;
    MANTLE_V2_MAINNET: MainnetV2EndpointId.MANTLE_V2_MAINNET;
    HUBBLE_V2_MAINNET: MainnetV2EndpointId.HUBBLE_V2_MAINNET;
    ZKCONSENSYS_V2_MAINNET: MainnetV2EndpointId.ZKCONSENSYS_V2_MAINNET;
    BASE_V2_MAINNET: MainnetV2EndpointId.BASE_V2_MAINNET;
    BSC_SANDBOX: SandboxEndpointId.BSC_SANDBOX;
    AVALANCHE_SANDBOX: SandboxEndpointId.AVALANCHE_SANDBOX;
    POLYGON_SANDBOX: SandboxEndpointId.POLYGON_SANDBOX;
    ETHEREUM_SANDBOX: SandboxEndpointId.ETHEREUM_SANDBOX;
    APTOS_SANDBOX: SandboxEndpointId.APTOS_SANDBOX;
    BSC_TESTNET: TestnetEndpointId.BSC_TESTNET;
    AVALANCHE_TESTNET: TestnetEndpointId.AVALANCHE_TESTNET;
    POLYGON_TESTNET: TestnetEndpointId.POLYGON_TESTNET;
    FANTOM_TESTNET: TestnetEndpointId.FANTOM_TESTNET;
    SWIMMER_TESTNET: TestnetEndpointId.SWIMMER_TESTNET;
    DFK_TESTNET: TestnetEndpointId.DFK_TESTNET;
    HARMONY_TESTNET: TestnetEndpointId.HARMONY_TESTNET;
    DEXALOT_TESTNET: TestnetEndpointId.DEXALOT_TESTNET;
    CELO_TESTNET: TestnetEndpointId.CELO_TESTNET;
    MOONBEAM_TESTNET: TestnetEndpointId.MOONBEAM_TESTNET;
    INTAIN_TESTNET: TestnetEndpointId.INTAIN_TESTNET;
    ETHEREUM_TESTNET: TestnetEndpointId.ETHEREUM_TESTNET;
    ARBITRUM_TESTNET: TestnetEndpointId.ARBITRUM_TESTNET;
    OPTIMISM_TESTNET: TestnetEndpointId.OPTIMISM_TESTNET;
    FUSE_TESTNET: TestnetEndpointId.FUSE_TESTNET;
    GNOSIS_TESTNET: TestnetEndpointId.GNOSIS_TESTNET;
    ZKSYNC_TESTNET: TestnetEndpointId.ZKSYNC_TESTNET;
    SHRAPNEL_TESTNET: TestnetEndpointId.SHRAPNEL_TESTNET;
    DOS_TESTNET: TestnetEndpointId.DOS_TESTNET;
    APTOS_TESTNET: TestnetEndpointId.APTOS_TESTNET;
    KLAYTN_TESTNET: TestnetEndpointId.KLAYTN_TESTNET;
    METIS_TESTNET: TestnetEndpointId.METIS_TESTNET;
    COREDAO_TESTNET: TestnetEndpointId.COREDAO_TESTNET;
    OKX_TESTNET: TestnetEndpointId.OKX_TESTNET;
    METER_TESTNET: TestnetEndpointId.METER_TESTNET;
    ZKCONSENSYS_TESTNET: TestnetEndpointId.ZKCONSENSYS_TESTNET;
    ZKPOLYGON_TESTNET: TestnetEndpointId.ZKPOLYGON_TESTNET;
    CANTO_TESTNET: TestnetEndpointId.CANTO_TESTNET;
    BASE_TESTNET: TestnetEndpointId.BASE_TESTNET;
    SEPOLIA_TESTNET: TestnetEndpointId.SEPOLIA_TESTNET;
    SOLANA_TESTNET: TestnetEndpointId.SOLANA_TESTNET;
    SCROLL_TESTNET: TestnetEndpointId.SCROLL_TESTNET;
    CATHAY_TESTNET: TestnetEndpointId.CATHAY_TESTNET;
    KAVA_TESTNET: TestnetEndpointId.KAVA_TESTNET;
    TENET_TESTNET: TestnetEndpointId.TENET_TESTNET;
    ORDERLY_TESTNET: TestnetEndpointId.ORDERLY_TESTNET;
    BLOCKGEN_TESTNET: TestnetEndpointId.BLOCKGEN_TESTNET;
    MERITCIRCLE_TESTNET: TestnetEndpointId.MERITCIRCLE_TESTNET;
    MANTLE_TESTNET: TestnetEndpointId.MANTLE_TESTNET;
    HUBBLE_TESTNET: TestnetEndpointId.HUBBLE_TESTNET;
    AAVEGOTCHI_TESTNET: TestnetEndpointId.AAVEGOTCHI_TESTNET;
    ETHEREUM_MAINNET: MainnetEndpointId.ETHEREUM_MAINNET;
    BSC_MAINNET: MainnetEndpointId.BSC_MAINNET;
    AVALANCHE_MAINNET: MainnetEndpointId.AVALANCHE_MAINNET;
    POLYGON_MAINNET: MainnetEndpointId.POLYGON_MAINNET;
    ARBITRUM_MAINNET: MainnetEndpointId.ARBITRUM_MAINNET;
    OPTIMISM_MAINNET: MainnetEndpointId.OPTIMISM_MAINNET;
    FANTOM_MAINNET: MainnetEndpointId.FANTOM_MAINNET;
    SWIMMER_MAINNET: MainnetEndpointId.SWIMMER_MAINNET;
    DFK_MAINNET: MainnetEndpointId.DFK_MAINNET;
    HARMONY_MAINNET: MainnetEndpointId.HARMONY_MAINNET;
    DEXALOT_MAINNET: MainnetEndpointId.DEXALOT_MAINNET;
    CELO_MAINNET: MainnetEndpointId.CELO_MAINNET;
    MOONBEAM_MAINNET: MainnetEndpointId.MOONBEAM_MAINNET;
    INTAIN_MAINNET: MainnetEndpointId.INTAIN_MAINNET;
    FUSE_MAINNET: MainnetEndpointId.FUSE_MAINNET;
    GNOSIS_MAINNET: MainnetEndpointId.GNOSIS_MAINNET;
    APTOS_MAINNET: MainnetEndpointId.APTOS_MAINNET;
    KLAYTN_MAINNET: MainnetEndpointId.KLAYTN_MAINNET;
    METIS_MAINNET: MainnetEndpointId.METIS_MAINNET;
    COREDAO_MAINNET: MainnetEndpointId.COREDAO_MAINNET;
    GOERLI_MAINNET: MainnetEndpointId.GOERLI_MAINNET;
    OKX_MAINNET: MainnetEndpointId.OKX_MAINNET;
    CANTO_MAINNET: MainnetEndpointId.CANTO_MAINNET;
    ZKSYNC_MAINNET: MainnetEndpointId.ZKSYNC_MAINNET;
    SHRAPNEL_MAINNET: MainnetEndpointId.SHRAPNEL_MAINNET;
    DOS_MAINNET: MainnetEndpointId.DOS_MAINNET;
    ZKPOLYGON_MAINNET: MainnetEndpointId.ZKPOLYGON_MAINNET;
    SEPOLIA_MAINNET: MainnetEndpointId.SEPOLIA_MAINNET;
    MOONRIVER_MAINNET: MainnetEndpointId.MOONRIVER_MAINNET;
    SOLANA_MAINNET: MainnetEndpointId.SOLANA_MAINNET;
    TENET_MAINNET: MainnetEndpointId.TENET_MAINNET;
    NOVA_MAINNET: MainnetEndpointId.NOVA_MAINNET;
    METER_MAINNET: MainnetEndpointId.METER_MAINNET;
    KAVA_MAINNET: MainnetEndpointId.KAVA_MAINNET;
    MANTLE_MAINNET: MainnetEndpointId.MANTLE_MAINNET;
    HUBBLE_MAINNET: MainnetEndpointId.HUBBLE_MAINNET;
    ZKCONSENSYS_MAINNET: MainnetEndpointId.ZKCONSENSYS_MAINNET;
    BASE_MAINNET: MainnetEndpointId.BASE_MAINNET;
};
type EndpointId = MainnetEndpointId | TestnetEndpointId | SandboxEndpointId | MainnetV2EndpointId | TestnetV2EndpointId | SandboxV2EndpointId;

declare enum Environment {
    LOCAL = "local",
    DEVNET = "devnet",
    TESTNET = "testnet",
    MAINNET = "mainnet"
}

declare enum Stage {
    MAINNET = "mainnet",
    TESTNET = "testnet",
    SANDBOX = "sandbox"
}

declare enum EndpointVersion {
    V1 = "v1",
    V2 = "v2"
}

declare enum MessageLibVersionV2 {
    SIMPLE = "0.0.2",
    ULTRA_LIGHT_NODE_302 = "3.0.2"
}
declare enum MessageLibVersionV1 {
    ULTRA_LIGHT_NODE_301 = "3.0.1",
    ULTRA_LIGHT_NODE_201 = "2.0.1"
}
type MessageLibVersion = MessageLibVersionV2 | MessageLibVersionV1;

declare enum ChainKey {
    ETHEREUM = "ethereum",
    GOERLI = "goerli",
    SEPOLIA = "sepolia",
    BSC = "bsc",
    BSC_TESTNET = "bsc-testnet",
    AVALANCHE = "avalanche",
    FUJI = "fuji",
    POLYGON = "polygon",
    MUMBAI = "mumbai",
    ARBITRUM = "arbitrum",
    ARBITURM_GOERLI = "arbitrum-goerli",
    OPTIMISM = "optimism",
    OPTIMISM_GOERLI = "optimism-goerli",
    FANTOM = "fantom",
    FANTOM_TESTNET = "fantom-testnet",
    SWIMMER = "swimmer",
    SWIMMER_TESTNET = "swimmer-testnet",
    DFK = "dfk",
    DFK_TESTNET = "dfk-testnet",
    HARMONY = "harmony",
    HARMONY_TESTNET = "harmony-testnet",
    DEXALOT = "dexalot",
    DEVALOT_TESTNET = "dexalot-testnet",
    CELO = "celo",
    ALFAJORES = "alfajores",
    MOONBEAM = "moonbeam",
    MOONBASE = "moonbase",
    MOONRIVER = "moonriver",
    INTAIN = "intain",
    INTAIN_TESTNET = "intain-testnet",
    FUSE = "fuse",
    FUSESPARK = "fusespark",
    GNOSIS = "gnosis",
    CHIADO = "chiado",
    APTOS = "aptos",
    APTOS_TESTNET = "aptos-testnet",
    KLAYTN = "klaytn",
    KLAYTN_BAOBAB = "klaytn-baobab",
    METIS = "metis",
    METIS_GOERLI = "metis-goerli",
    COREDAO = "coredao",
    COREDAO_TESTNET = "coredao-testnet",
    METER = "meter",
    METER_TESTNET = "meter-testnet",
    OKX = "okx",
    OKX_TESTNET = "okx-testnet",
    ZKSYNC = "zksync",
    ZKSYNC_TESTNET = "zksync-testnet",
    SHRAPNEL = "shrapnel",
    SHRAPNEL_TESTNET = "shrapnel-testnet",
    DOS = "dos",
    DOS_TESTNET = "dos-testnet",
    ZKEVM = "zkevm",
    ZKEVM_TESTNET = "zkevm-testnet",
    NOVA = "nova",
    TENET = "tenet",
    TENET_TESTNET = "tenet-testnet",
    CANTO = "canto",
    CANTO_TESTNET = "canto-testnet",
    KAVA = "kava",
    KAVA_TESTNET = "kava-testnet",
    SOLANA = "solana",
    SOLANA_TESTNET = "solana-testnet",
    LINEA_GOERLI = "linea-goerli",
    BASE_GOERLI = "base-goerli",
    AAVEGOTCHI_TESTNET = "aavegotchi-testnet",
    SCROLL_TESTNET = "scroll-testnet",
    CATHAY_TESTNET = "cathay-testnet",
    ORDERLY_TESTNET = "orderly-testnet",
    BLOCKGEN_TESTNET = "blockgen-testnet",
    MERITCIRCLE_TESTNET = "meritcircle-testnet",
    MANTLE = "mantle",
    MANTLE_TESTNET = "mantle-testnet",
    HUBBLE = "hubble",
    HUBBLE_TESTNET = "hubble-testnet",
    ZKCONSENSYS = "zkconsensys",
    BASE = "base"
}

declare const CHAIN_KEY: {
    [endpointId in EndpointId]: ChainKey;
};

declare const ENVIRONMENT: {
    [endpointId in EndpointId]: Environment;
};

declare const ULN_V1_CHAINS: (MainnetEndpointId | TestnetEndpointId | SandboxEndpointId)[];

declare const BRIDGE_ADDRESS: {
    [chainId: number]: string;
};
declare const STG_ADDRESS: {
    [chainId: number]: string;
};

declare function networkToEndpointId(network: string, version: EndpointVersion): number;
declare function networkToEnv(network: string, version: EndpointVersion): Environment;
declare function networkToStage(network: string): Stage;
declare function endpointIdToNetwork(endpointId: number, env?: Environment): string;
declare function endpointIdToVersion(endpointId: number): EndpointVersion;
declare function chainAndStageToEndpointId(chain: Chain, stage: Stage, version: EndpointVersion): EndpointId;
declare function chainAndStageToNetwork(chain: Chain, stage: Stage, env?: Environment): string;
declare function networkToChain(network: string): Chain;
declare function networkToChainType(network: string): ChainType;
/**
 * Returns the chain family for a given chain
 * @param chain
 */
declare function getChainType(chain: Chain): ChainType;
declare function endpointIdToChain(endpointId: number): Chain;
declare function endpointIdToStage(endpointId: number): Stage;
declare function endpointIdToChainType(endpointId: number): ChainType;
declare function getNetworksForStage(stage: Stage): string[];
declare const getEndpointVersionForUlnVersion: (ulnVersion: string) => EndpointVersion;
declare function getChainIdForNetwork(chain: string, stage: string, ulnVersion: string): string;
declare function getNetworkForChainId(targetchainId: number): {
    chainName: Chain;
    env: Stage;
    ulnVersion: string;
};

type Network = `${Chain}-${Stage}${'-local' | ''}`;

export { BRIDGE_ADDRESS, CHAIN_KEY, Chain, ChainKey, ChainType, ENVIRONMENT, EndpointId, EndpointVersion, Environment, MainnetEndpointId, MainnetV2EndpointId, MessageLibVersion, MessageLibVersionV1, MessageLibVersionV2, Network, STG_ADDRESS, SandboxEndpointId, SandboxV2EndpointId, Stage, TestnetEndpointId, TestnetV2EndpointId, ULN_V1_CHAINS, chainAndStageToEndpointId, chainAndStageToNetwork, endpointIdToChain, endpointIdToChainType, endpointIdToNetwork, endpointIdToStage, endpointIdToVersion, getChainIdForNetwork, getChainType, getEndpointVersionForUlnVersion, getNetworkForChainId, getNetworksForStage, networkToChain, networkToChainType, networkToEndpointId, networkToEnv, networkToStage };
