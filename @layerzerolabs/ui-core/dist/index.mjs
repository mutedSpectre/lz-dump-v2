import { ChainId, getChainStage, ChainStage, ChainListId, AVERAGE_BLOCK_TIME } from '@layerzerolabs/lz-sdk';
export { getChainStage } from '@layerzerolabs/lz-sdk';
import { utils, BigNumber } from 'ethers';
import assert2 from 'assert';
import _Decimal from 'decimal.js-light';
import _Big from 'big.js';
import toFormat from 'toformat';

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var ChainType = /* @__PURE__ */ ((ChainType2) => {
  ChainType2["EVM"] = "EVM";
  ChainType2["APTOS"] = "APTOS";
  ChainType2["SOLANA"] = "SOLANA";
  return ChainType2;
})(ChainType || {});
var APTOS = [ChainId.APTOS, ChainId.APTOS_TESTNET, ChainId.APTOS_TESTNET_SANDBOX];
var SOLANA = [ChainId.SOLANA, ChainId.SOLANA_TESTNET];
function isChainType(chainId, chainType) {
  if (chainType === "APTOS" /* APTOS */)
    return APTOS.includes(chainId);
  if (chainType === "SOLANA" /* SOLANA */)
    return SOLANA.includes(chainId);
  if (SOLANA.includes(chainId))
    return false;
  if (APTOS.includes(chainId))
    return false;
  return true;
}
function getChainType(chainId) {
  if (isChainType(chainId, "APTOS" /* APTOS */))
    return "APTOS" /* APTOS */;
  if (isChainType(chainId, "SOLANA" /* SOLANA */))
    return "SOLANA" /* SOLANA */;
  return "EVM" /* EVM */;
}
function isEvmChainId(chainId) {
  return isChainType(chainId, "EVM" /* EVM */);
}
function isAptosChainId(chainId) {
  return isChainType(chainId, "APTOS" /* APTOS */);
}
function isSolanaChainId(chainId) {
  return isChainType(chainId, "SOLANA" /* SOLANA */);
}
var BaseCurrency = class {
  /**
   * Constructs an instance of the base class `BaseCurrency`.
   * @param chainId the chain ID on which this currency resides
   * @param decimals decimals of the currency
   * @param symbol symbol of the currency
   * @param name of the currency
   */
  constructor(chainId, decimals, symbol, name) {
    assert2(Number.isSafeInteger(chainId), "CHAIN_ID");
    assert2(decimals >= 0 && decimals < 255 && Number.isInteger(decimals), "DECIMALS");
    this.chainId = chainId;
    this.decimals = decimals;
    this.symbol = symbol;
    this.name = name;
  }
};

// src/currency/coin.ts
var Coin = class extends BaseCurrency {
  constructor(chainId, decimals, symbol, name) {
    super(chainId, decimals, symbol, name);
  }
  /**
   * Returns true if the two Coins are equivalent, i.e. have the same chainId
   * @param other other currency to compare
   */
  equals(other) {
    if (!(other instanceof Coin))
      return false;
    return this.chainId === other.chainId;
  }
  static from(input) {
    return new Coin(input.chainId, input.decimals, input.symbol, input.name);
  }
};
function validateAndParseAddress(address, chainId) {
  if (isEvmChainId(chainId)) {
    return utils.getAddress(address);
  }
  return address;
}

// src/currency/token.ts
var Token = class extends BaseCurrency {
  constructor(chainId, address, decimals, symbol, name) {
    super(chainId, decimals, symbol, name);
    this.address = validateAndParseAddress(address, chainId);
  }
  static from(input) {
    return new Token(input.chainId, input.address, input.decimals, input.symbol, input.name);
  }
  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  equals(other) {
    if (!(other instanceof Token))
      return false;
    return this.chainId === other.chainId && this.address === other.address;
  }
};

// src/currency/utils/assertToken.ts
function isToken(value) {
  return value instanceof Token;
}
function assertToken(value, errorMessage) {
  if (!isToken(value)) {
    throw new Error(errorMessage != null ? errorMessage : `Not a token (${value.symbol})`);
  }
}
function isCoin(value) {
  return value instanceof Coin;
}
function isCurrency(value) {
  return value instanceof Token || value instanceof Coin;
}

// src/network/chains.ts
var NETWORK_INFO = [
  {
    "name": "Solana",
    "symbol": "solana",
    "chainId": 168,
    "nativeChainId": 1,
    "nativeCurrency": {
      "name": "SOL",
      "symbol": "SOL",
      "decimals": 9
    },
    "blockExplorers": [],
    "rpcs": [
      {
        "url": "https://api.mainnet-beta.solana.com"
      }
    ]
  },
  {
    "name": "Solana",
    "symbol": "solana",
    "chainId": 10168,
    "nativeChainId": 2,
    "nativeCurrency": {
      "name": "SOL",
      "symbol": "SOL",
      "decimals": 9
    },
    "blockExplorers": [],
    "rpcs": [
      {
        "url": "https://api.devnet.solana.com"
      }
    ]
  },
  {
    "name": "Ethereum",
    "symbol": "Ethereum",
    "chainId": 101,
    "nativeChainId": 1,
    "nativeCurrency": {
      "name": "ETH",
      "symbol": "ETH",
      "decimals": 18
    },
    "blockExplorers": [
      {
        "name": "etherscan",
        "url": "https://etherscan.io"
      }
    ],
    "rpcs": [
      {
        "url": "https://eth-mainnet.gateway.pokt.network/v1/5f3453978e354ab992c4da79",
        "weight": 1e6
      },
      {
        "url": "https://eth-rpc.gateway.pokt.network",
        "weight": 1e6
      },
      {
        "url": "https://ethereum.publicnode.com",
        "weight": 1e6
      },
      {
        "url": "https://eth-mainnet.public.blastapi.io",
        "weight": 1e6
      },
      {
        "url": "https://cloudflare-eth.com",
        "weight": 1e3
      },
      {
        "url": "https://mainnet.infura.io/v3/${INFURA_API_KEY}",
        "weight": 1
      },
      {
        "url": "https://eth-mainnet.alchemyapi.io/v2/84tGz8xVIWFkagsaSzNjObh7aSPbxeXD",
        "weight": 100
      },
      {
        "url": "https://eth-mainnet.alchemyapi.io/v2/VsPzIezK0AtqsnrWAuV0Gew-MS7H_E5E",
        "weight": 100
      }
    ]
  },
  {
    "name": "Rinkeby Testnet",
    "symbol": "Rinkeby",
    "chainId": 10101,
    "nativeChainId": 4,
    "nativeCurrency": {
      "name": "ETH",
      "symbol": "ETH",
      "decimals": 18
    },
    "blockExplorers": [
      {
        "name": "etherscan-rinkeby",
        "url": "https://rinkeby.etherscan.io"
      }
    ],
    "rpcs": [
      {
        "url": "https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}"
      }
    ]
  },
  {
    "name": "Goerli",
    "symbol": "goerli",
    "chainId": 10121,
    "nativeChainId": 5,
    "nativeCurrency": {
      "name": "GoerliETH",
      "symbol": "GoerliETH",
      "decimals": 18
    },
    "blockExplorers": [
      {
        "name": "etherscan-goerli",
        "url": "https://goerli.etherscan.io"
      }
    ],
    "rpcs": [
      {
        "url": "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
      }
    ]
  },
  {
    "name": "BNB Chain",
    "symbol": "BNB",
    "chainId": 102,
    "nativeChainId": 56,
    "nativeCurrency": {
      "symbol": "BNB",
      "name": "BNB",
      "decimals": 18
    },
    "blockExplorers": [
      {
        "name": "bscscan",
        "url": "https://bscscan.com"
      }
    ],
    "rpcs": [
      {
        "url": "https://bscrpc.com"
      },
      {
        "url": "https://binance.nodereal.io"
      },
      {
        "url": "https://bsc-dataseed.binance.org"
      },
      {
        "url": "https://bsc-dataseed1.binance.org"
      },
      {
        "url": "https://bsc-dataseed2.binance.org"
      },
      {
        "url": "https://bsc-dataseed3.binance.org"
      },
      {
        "url": "https://bsc-dataseed4.binance.org"
      }
    ]
  },
  {
    "name": "Binance Test Chain",
    "symbol": "BNB",
    "chainId": 10102,
    "nativeChainId": 97,
    "nativeCurrency": {
      "symbol": "BNB",
      "name": "BNB",
      "decimals": 18
    },
    "blockExplorers": [
      {
        "name": "bscscan-testnet",
        "url": "https://testnet.bscscan.com"
      }
    ],
    "rpcs": [
      {
        "url": "https://data-seed-prebsc-1-s3.binance.org:8545"
      },
      {
        "url": "https://data-seed-prebsc-2-s2.binance.org:8545"
      },
      {
        "url": "https://data-seed-prebsc-1-s1.binance.org:8545"
      },
      {
        "url": "https://data-seed-prebsc-1-s2.binance.org:8545"
      },
      {
        "url": "https://data-seed-prebsc-2-s1.binance.org:8545"
      }
    ]
  },
  {
    "name": "Polygon",
    "symbol": "Matic",
    "chainId": 109,
    "nativeChainId": 137,
    "nativeCurrency": {
      "name": "MATIC",
      "symbol": "MATIC",
      "decimals": 18
    },
    "blockExplorers": [
      {
        "name": "polygonscan",
        "url": "https://polygonscan.com"
      }
    ],
    "rpcs": [
      {
        "url": "https://poly-rpc.gateway.pokt.network",
        "weight": 1e6
      },
      {
        "url": "https://matic-mainnet.chainstacklabs.com",
        "weight": 1e6
      },
      {
        "url": "https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}"
      },
      {
        "url": "https://polygon-rpc.com",
        "weight": 1e6
      },
      {
        "url": "https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}",
        "weight": 1
      },
      {
        "url": "https://polygon-mainnet.g.alchemy.com/v2/me6Q04fTd2kTT74BUYAp82d_3KL-ObCw",
        "weight": 100
      },
      {
        "url": "https://polygon-mainnet.g.alchemy.com/v2/q3f-QpPeM_g7rL3G21Cr9tFeuYAquyYl",
        "weight": 100
      }
    ]
  },
  {
    "name": "Mumbai",
    "symbol": "Matic",
    "chainId": 10109,
    "nativeChainId": 80001,
    "nativeCurrency": {
      "symbol": "MATIC",
      "name": "MATIC",
      "decimals": 18
    },
    "blockExplorers": [
      {
        "name": "polygonscan",
        "url": "https://mumbai.polygonscan.com"
      }
    ],
    "rpcs": [
      {
        "url": "https://matic-mumbai.chainstacklabs.com"
      },
      {
        "url": "https://rpc-mumbai.maticvigil.com/v1/${MATICVIGIL_API_KEY}"
      }
    ]
  },
  {
    "name": "Avalanche",
    "symbol": "Avalanche",
    "chainId": 106,
    "nativeChainId": 43114,
    "nativeCurrency": {
      "name": "Avalanche Token",
      "symbol": "AVAX",
      "decimals": 18
    },
    "blockExplorers": [
      {
        "name": "snowtrace",
        "url": "https://snowtrace.io"
      }
    ],
    "rpcs": [
      {
        "url": "https://api.avax.network/ext/bc/C/rpc",
        "weight": 1e6
      },
      {
        "url": "https://avalanche--mainnet--rpc.datahub.figment.io/apikey/b1a0d59ba8a5d08049bbfdc174dca1b1/ext/bc/C/rpc",
        "weight": 100
      }
    ]
  },
  {
    "name": "Fuji",
    "symbol": "Avalanche",
    "chainId": 10106,
    "nativeChainId": 43113,
    "nativeCurrency": {
      "name": "Avalanche Token",
      "symbol": "AVAX",
      "decimals": 18
    },
    "blockExplorers": [
      {
        "name": "snowtrace",
        "url": "https://testnet.snowtrace.io"
      }
    ],
    "rpcs": [
      {
        "url": "https://api.avax-test.network/ext/bc/C/rpc"
      },
      {
        "url": "https://rpc.ankr.com/avalanche_fuji"
      }
    ]
  },
  {
    "name": "Fantom",
    "symbol": "Fantom",
    "chainId": 112,
    "nativeChainId": 250,
    "nativeCurrency": {
      "name": "Fantom",
      "symbol": "FTM",
      "decimals": 18
    },
    "blockExplorers": [
      {
        "name": "ftmscan",
        "url": "https://ftmscan.com"
      }
    ],
    "rpcs": [
      {
        "url": "https://rpc.ftm.tools",
        "weight": 1e6
      },
      {
        "url": "https://rpc2.fantom.network",
        "weight": 100
      },
      {
        "url": "https://rpc3.fantom.network",
        "weight": 100
      }
    ]
  },
  {
    "name": "Fantom Testnet",
    "symbol": "Fantom",
    "chainId": 10112,
    "nativeChainId": 4002,
    "nativeCurrency": {
      "name": "Fantom",
      "symbol": "FTM",
      "decimals": 18
    },
    "blockExplorers": [
      {
        "name": "ftmscan",
        "url": "https://testnet.ftmscan.com"
      }
    ],
    "rpcs": [
      {
        "url": "https://rpc.testnet.fantom.network/"
      },
      {
        "url": "https://rpc.ankr.com/fantom_testnet"
      },
      {
        "url": "https://fantom-testnet.public.blastapi.io"
      }
    ]
  },
  {
    "name": "Arbitrum",
    "symbol": "Arbitrum",
    "chainId": 110,
    "nativeChainId": 42161,
    "nativeCurrency": {
      "name": "ETH",
      "symbol": "ETH",
      "decimals": 18
    },
    "blockExplorers": [
      {
        "name": "Arbiscan",
        "url": "https://arbiscan.io"
      },
      {
        "name": "Arbitrum Explorer",
        "url": "https://explorer.arbitrum.io"
      }
    ],
    "rpcs": [
      {
        "url": "https://arb1.arbitrum.io/rpc",
        "weight": 1e6
      },
      {
        "url": "https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}",
        "weight": 1
      },
      {
        "url": "https://arb-mainnet.g.alchemy.com/v2/N71NRfHZGk2jbnDkW-GiM6fTe6ysJOmp",
        "weight": 100
      },
      {
        "url": "https://arb-mainnet.g.alchemy.com/v2/KhVdIItVH0ttiQvBYYO5NPL-De-gLWoW",
        "weight": 100
      }
    ]
  },
  {
    "name": "Arbitrum Goerli",
    "symbol": "Arbitrum",
    "chainId": 10143,
    "nativeChainId": 421613,
    "nativeCurrency": {
      "name": "ETH",
      "symbol": "ETH",
      "decimals": 18
    },
    "blockExplorers": [
      {
        "name": "Arbitrum Goerli Rollup Explorer",
        "url": "https://goerli-rollup-explorer.arbitrum.io"
      }
    ],
    "rpcs": [
      {
        "url": "https://goerli-rollup.arbitrum.io/rpc"
      },
      {
        "url": "https://arb-goerli.g.alchemy.com/v2/bgFeK0bK5LSFZCyBQAnztWaCUgF_b4fE"
      }
    ]
  },
  {
    "name": "Arbitrum Rinkeby",
    "symbol": "Arbitrum",
    "chainId": 10110,
    "nativeChainId": 421611,
    "nativeCurrency": {
      "name": "ETH",
      "symbol": "ETH",
      "decimals": 18
    },
    "blockExplorers": [
      {
        "name": "arbiscan-testnet",
        "url": "https://testnet.arbiscan.io"
      },
      {
        "name": "arbitrum-rinkeby",
        "url": "https://rinkeby-explorer.arbitrum.io"
      }
    ],
    "rpcs": [
      {
        "url": "https://rinkeby.arbitrum.io/rpc"
      },
      {
        "url": "https://arb-rinkeby.g.alchemy.com/v2/${ALCHEMY_API_KEY}"
      }
    ]
  },
  {
    "name": "Optimism",
    "symbol": "Optimism",
    "chainId": 111,
    "nativeChainId": 10,
    "nativeCurrency": {
      "symbol": "ETH",
      "name": "ETH",
      "decimals": 18
    },
    "blockExplorers": [
      {
        "name": "etherscan",
        "url": "https://optimistic.etherscan.io"
      }
    ],
    "rpcs": [
      {
        "url": "https://mainnet.optimism.io",
        "timeout": 8e3,
        "weight": 1e6
      },
      {
        "url": "https://optimism-mainnet.infura.io/v3/${INFURA_API_KEY}"
      },
      {
        "url": "https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}"
      },
      {
        "url": "https://opt-mainnet.g.alchemy.com/v2/3glkhRJRgzHCB2NbDwiQa7G_FTdqn3-T",
        "weight": 100
      },
      {
        "url": "https://opt-mainnet.g.alchemy.com/v2/7urLa-8k2RR_UYc0exh-b0qg4xySL5KA",
        "weight": 100
      }
    ]
  },
  {
    "name": "Optimism Kovan",
    "symbol": "Optimism",
    "chainId": 10111,
    "nativeChainId": 69,
    "nativeCurrency": {
      "symbol": "ETH",
      "name": "ETH",
      "decimals": 18
    },
    "blockExplorers": [
      {
        "name": "etherscan",
        "url": "https://kovan-optimistic.etherscan.io"
      }
    ],
    "rpcs": [
      {
        "url": "https://kovan.optimism.io/"
      },
      {
        "url": "https://opt-kovan.g.alchemy.com/v2/${ALCHEMY_API_KEY}"
      }
    ]
  },
  {
    "name": "Optimism Goerli",
    "symbol": "Optimism",
    "chainId": 10132,
    "nativeChainId": 420,
    "nativeCurrency": {
      "symbol": "ETH",
      "name": "ETH",
      "decimals": 18
    },
    "blockExplorers": [
      {
        "url": "https://goerli-optimism.etherscan.io",
        "name": "Optimism Goerli block explorer"
      }
    ],
    "rpcs": [
      {
        "url": "https://goerli.optimism.io"
      }
    ]
  },
  {
    "name": "Swimmer",
    "symbol": "swimmer",
    "chainId": 114,
    "nativeChainId": 0,
    "nativeCurrency": {
      "symbol": "TUS",
      "name": "TUS",
      "decimals": 18
    },
    "blockExplorers": [],
    "rpcs": [
      {
        "url": "https://avax-cra-rpc.gateway.pokt.network/"
      }
    ]
  },
  {
    "name": "DFK",
    "symbol": "dfk",
    "chainId": 115,
    "nativeChainId": 53935,
    "nativeCurrency": {
      "symbol": "JEWEL",
      "name": "JEWEL",
      "decimals": 18
    },
    "blockExplorers": [
      {
        "name": "ethernal",
        "url": "https://explorer.dfkchain.com"
      }
    ],
    "rpcs": [
      {
        "url": "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
      }
    ]
  },
  {
    "name": "Harmony",
    "symbol": "harmony",
    "chainId": 116,
    "nativeChainId": 16666e5,
    "nativeCurrency": {
      "symbol": "ONE",
      "name": "ONE",
      "decimals": 18
    },
    "blockExplorers": [
      {
        "name": "Harmony Block Explorer",
        "url": "https://explorer.harmony.one"
      }
    ],
    "rpcs": [
      {
        "url": "https://harmony-mainnet.chainstacklabs.com"
      },
      {
        "url": "https://api.harmony.one"
      },
      {
        "url": "https://api.s0.t.hmny.io"
      },
      {
        "url": "https://a.api.s0.t.hmny.io"
      },
      {
        "url": "https://rpc.ankr.com/harmony"
      },
      {
        "url": "https://harmony-0-rpc.gateway.pokt.network"
      }
    ]
  },
  {
    "name": "Aptos",
    "symbol": "APTOS",
    "chainId": 108,
    "nativeChainId": 1,
    "nativeCurrency": {
      "symbol": "APT",
      "name": "AptosCoin",
      "decimals": 8,
      "address": "0x1::aptos_coin::AptosCoin"
    },
    "blockExplorers": [
      {
        "url": "https://explorer.aptoslabs.com",
        "name": "APTOS Testnet block explorer"
      }
    ],
    "rpcs": [
      {
        "url": "https://mainnet.infura.io/v3/${INFURA_API_KEY}"
      },
      {
        "url": "wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}"
      },
      {
        "url": "https://api.mycryptoapi.com/eth"
      },
      {
        "url": "https://cloudflare-eth.com"
      },
      {
        "url": "https://ethereum.publicnode.com"
      }
    ]
  },
  {
    "name": "Aptos Testnet",
    "symbol": "APTOS",
    "chainId": 10108,
    "nativeChainId": 2,
    "nativeCurrency": {
      "symbol": "APT",
      "name": "AptosCoin",
      "decimals": 8,
      "address": "0x1::aptos_coin::AptosCoin"
    },
    "blockExplorers": [
      {
        "url": "https://explorer.aptoslabs.com",
        "name": "APTOS Testnet block explorer"
      }
    ],
    "rpcs": [
      {
        "url": "https://node.expanse.tech"
      }
    ]
  },
  {
    "name": "MOONBEAM",
    "symbol": "moonbeam",
    "chainId": 126,
    "nativeChainId": 1284,
    "nativeCurrency": {
      "symbol": "GLMR",
      "name": "GLMR",
      "decimals": 18
    },
    "blockExplorers": [
      {
        "name": "moonscan",
        "url": "https://moonbeam.moonscan.io"
      }
    ],
    "rpcs": [
      {
        "url": "https://rpc.api.moonbeam.network"
      },
      {
        "url": "wss://wss.api.moonbeam.network"
      }
    ]
  },
  {
    "name": "Metis",
    "symbol": "Metis",
    "chainId": 151,
    "nativeChainId": 1088,
    "nativeCurrency": {
      "symbol": "METIS",
      "name": "METIS",
      "decimals": 18
    },
    "blockExplorers": [
      {
        "name": "blockscout",
        "url": "https://andromeda-explorer.metis.io"
      }
    ],
    "rpcs": [
      {
        "url": "https://andromeda.metis.io/?owner=1088"
      }
    ]
  },
  {
    "name": "Metis",
    "symbol": "Metis",
    "chainId": 10151,
    "nativeChainId": 599,
    "nativeCurrency": {
      "symbol": "METIS",
      "name": "METIS",
      "decimals": 18
    },
    "blockExplorers": [
      {
        "name": "blockscout",
        "url": "https://goerli.explorer.metisdevops.link"
      }
    ],
    "rpcs": [
      {
        "url": "https://goerli.gateway.metisdevops.link"
      }
    ]
  },
  {
    "name": "DFK Chain Test",
    "symbol": "DFK",
    "chainId": 10115,
    "nativeChainId": 335,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "JEWEL",
      "name": "Jewel"
    },
    "blockExplorers": [
      {
        "name": "ethernal",
        "url": "https://explorer-test.dfkchain.com"
      }
    ],
    "rpcs": [
      {
        "url": "https://subnets.avax.network/defi-kingdoms/dfk-chain-testnet/rpc"
      }
    ]
  },
  {
    "name": "Harmony Testnet Shard 0",
    "symbol": "Harmony",
    "chainId": 10133,
    "nativeChainId": 16667e5,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "ONE",
      "name": "ONE"
    },
    "blockExplorers": [
      {
        "name": "Harmony Testnet Block Explorer",
        "url": "https://explorer.pops.one"
      }
    ],
    "rpcs": [
      {
        "url": "https://api.s0.b.hmny.io"
      }
    ]
  },
  {
    "name": "Dexalot Subnet Testnet",
    "symbol": "DEXALOT",
    "chainId": 10118,
    "nativeChainId": 432201,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "ALOT",
      "name": "Dexalot"
    },
    "blockExplorers": [
      {
        "name": "Avalanche Subnet Testnet Explorer",
        "url": "https://subnets-test.avax.network/dexalot"
      }
    ],
    "rpcs": [
      {
        "url": "https://subnets.avax.network/dexalot/testnet/rpc"
      }
    ]
  },
  {
    "name": "Kovan",
    "symbol": "kov",
    "chainId": 10120,
    "nativeChainId": 42,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "ETH",
      "name": "Kovan Ether"
    },
    "blockExplorers": [
      {
        "name": "etherscan",
        "url": "https://kovan.etherscan.io"
      }
    ],
    "rpcs": [
      {
        "url": "https://kovan.poa.network"
      },
      {
        "url": "http://kovan.poa.network:8545"
      },
      {
        "url": "https://kovan.infura.io/v3/${INFURA_API_KEY}"
      },
      {
        "url": "wss://kovan.infura.io/ws/v3/${INFURA_API_KEY}"
      },
      {
        "url": "ws://kovan.poa.network:8546"
      }
    ]
  },
  {
    "name": "Optimism on Gnosis",
    "symbol": "OGC",
    "chainId": 10145,
    "nativeChainId": 300,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "xDAI",
      "name": "xDAI"
    },
    "blockExplorers": [
      {
        "name": "blockscout",
        "url": "https://blockscout.com/xdai/optimism"
      }
    ],
    "rpcs": [
      {
        "url": "https://optimism.gnosischain.com"
      },
      {
        "url": "wss://optimism.gnosischain.com/wss"
      }
    ]
  },
  {
    "name": "Celo Mainnet",
    "symbol": "CELO",
    "chainId": 125,
    "nativeChainId": 42220,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "CELO",
      "name": "CELO"
    },
    "blockExplorers": [
      {
        "name": "Celoscan",
        "url": "https://celoscan.io"
      },
      {
        "name": "blockscout",
        "url": "https://explorer.celo.org"
      }
    ],
    "rpcs": [
      {
        "url": "https://forno.celo.org"
      },
      {
        "url": "wss://forno.celo.org/ws"
      }
    ]
  },
  {
    "name": "Celo Alfajores Testnet",
    "symbol": "CELO",
    "chainId": 10125,
    "nativeChainId": 44787,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "CELO",
      "name": "CELO"
    },
    "blockExplorers": [
      {
        "name": "Celoscan",
        "url": "https://celoscan.io"
      }
    ],
    "rpcs": [
      {
        "url": "https://alfajores-forno.celo-testnet.org"
      },
      {
        "url": "wss://alfajores-forno.celo-testnet.org/ws"
      }
    ]
  },
  {
    "name": "Moonbase Alpha",
    "symbol": "MOON",
    "chainId": 10126,
    "nativeChainId": 1287,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "DEV",
      "name": "Dev"
    },
    "blockExplorers": [
      {
        "name": "moonscan",
        "url": "https://moonbase.moonscan.io"
      }
    ],
    "rpcs": [
      {
        "url": "https://rpc.api.moonbase.moonbeam.network"
      },
      {
        "url": "wss://wss.api.moonbase.moonbeam.network"
      }
    ]
  },
  {
    "name": "Boba Network",
    "symbol": "Boba",
    "chainId": 127,
    "nativeChainId": 288,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "ETH",
      "name": "Ether"
    },
    "blockExplorers": [
      {
        "name": "Bobascan",
        "url": "https://bobascan.com"
      },
      {
        "name": "Blockscout",
        "url": "https://blockexplorer.boba.network"
      }
    ],
    "rpcs": [
      {
        "url": "https://mainnet.boba.network/"
      }
    ]
  },
  {
    "name": "Boba Network Rinkeby Testnet",
    "symbol": "BobaRinkeby",
    "chainId": 10144,
    "nativeChainId": 28,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "ETH",
      "name": "Ether"
    },
    "blockExplorers": [
      {
        "name": "Blockscout",
        "url": "https://blockexplorer.rinkeby.boba.network"
      }
    ],
    "rpcs": [
      {
        "url": "https://rinkeby.boba.network/"
      }
    ]
  },
  {
    "name": "Portal Fantasy Chain Test",
    "symbol": "PF",
    "chainId": 10128,
    "nativeChainId": 808,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "PFT",
      "name": "Portal Fantasy Token"
    },
    "blockExplorers": [],
    "rpcs": [
      {
        "url": "https://subnets.avax.network/portal-fantasy/testnet/rpc"
      }
    ]
  },
  {
    "name": "Aurora Mainnet",
    "symbol": "NEAR",
    "chainId": 129,
    "nativeChainId": 1313161554,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "ETH",
      "name": "Ether"
    },
    "blockExplorers": [
      {
        "name": "aurorascan.dev",
        "url": "https://aurorascan.dev"
      }
    ],
    "rpcs": [
      {
        "url": "https://mainnet.aurora.dev"
      }
    ]
  },
  {
    "name": "Aurora Testnet",
    "symbol": "NEAR",
    "chainId": 10129,
    "nativeChainId": 1313161555,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "ETH",
      "name": "Ether"
    },
    "blockExplorers": [
      {
        "name": "aurorascan.dev",
        "url": "https://testnet.aurorascan.dev"
      }
    ],
    "rpcs": [
      {
        "url": "https://testnet.aurora.dev/"
      }
    ]
  },
  {
    "name": "Astar",
    "symbol": "ASTR",
    "chainId": 146,
    "nativeChainId": 592,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "ASTR",
      "name": "Astar"
    },
    "blockExplorers": [
      {
        "name": "subscan",
        "url": "https://astar.subscan.io"
      }
    ],
    "rpcs": [
      {
        "url": "https://rpc.astar.network:8545"
      }
    ]
  },
  {
    "name": "Core Blockchain Mainnet",
    "symbol": "Core",
    "chainId": 153,
    "nativeChainId": 1116,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "CORE",
      "name": "Core Blockchain Native Token"
    },
    "blockExplorers": [
      {
        "name": "Core Scan",
        "url": "https://scan.coredao.org"
      }
    ],
    "rpcs": [
      {
        "url": "https://rpc.coredao.org/"
      },
      {
        "url": "https://rpc-core.icecreamswap.com"
      }
    ]
  },
  {
    "name": "Core Blockchain Testnet",
    "symbol": "Core",
    "chainId": 10153,
    "nativeChainId": 1115,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "tCORE",
      "name": "Core Blockchain Testnet Native Token"
    },
    "blockExplorers": [
      {
        "name": "Core Scan Testnet",
        "url": "https://scan.test.btcs.network"
      }
    ],
    "rpcs": [
      {
        "url": "https://rpc.test.btcs.network/"
      }
    ]
  },
  {
    "name": "Dexalot Subnet",
    "symbol": "DEXALOT",
    "chainId": 118,
    "nativeChainId": 432204,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "ALOT",
      "name": "Dexalot"
    },
    "blockExplorers": [
      {
        "name": "Avalanche Subnet Explorer",
        "url": "https://subnets.avax.network/dexalot"
      }
    ],
    "rpcs": [
      {
        "url": "https://subnets.avax.network/dexalot/mainnet/rpc"
      }
    ]
  },
  {
    "name": "DOS Chain",
    "symbol": "DOS",
    "chainId": 149,
    "nativeChainId": 7979,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "DOS",
      "name": "DOS"
    },
    "blockExplorers": [
      {
        "name": "DOScan",
        "url": "https://doscan.io"
      }
    ],
    "rpcs": [
      {
        "url": "https://main.doschain.com"
      }
    ]
  },
  {
    "name": "DOS Tesnet",
    "symbol": "DOS",
    "chainId": 10162,
    "nativeChainId": 3939,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "DOS",
      "name": "DOS"
    },
    "blockExplorers": [
      {
        "name": "DOScan-Test",
        "url": "https://test.doscan.io"
      }
    ],
    "rpcs": [
      {
        "url": "https://test.doschain.com"
      }
    ]
  },
  {
    "name": "Fuse Mainnet",
    "symbol": "FUSE",
    "chainId": 138,
    "nativeChainId": 122,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "FUSE",
      "name": "Fuse"
    },
    "blockExplorers": [],
    "rpcs": [
      {
        "url": "https://rpc.fuse.io"
      }
    ]
  },
  {
    "name": "Gnosis",
    "symbol": "GNO",
    "chainId": 145,
    "nativeChainId": 100,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "xDAI",
      "name": "xDAI"
    },
    "blockExplorers": [
      {
        "name": "gnosisscan",
        "url": "https://gnosisscan.io"
      },
      {
        "name": "blockscout",
        "url": "https://blockscout.com/xdai/mainnet"
      }
    ],
    "rpcs": [
      {
        "url": "https://rpc.gnosischain.com"
      },
      {
        "url": "https://rpc.ankr.com/gnosis"
      },
      {
        "url": "https://gnosischain-rpc.gateway.pokt.network"
      },
      {
        "url": "https://gnosis-mainnet.public.blastapi.io"
      },
      {
        "url": "wss://rpc.gnosischain.com/wss"
      }
    ]
  },
  {
    "name": "Goerli",
    "symbol": "gor",
    "chainId": 154,
    "nativeChainId": 5,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "ETH",
      "name": "Goerli Ether"
    },
    "blockExplorers": [
      {
        "name": "etherscan-goerli",
        "url": "https://goerli.etherscan.io"
      }
    ],
    "rpcs": [
      {
        "url": "https://goerli.infura.io/v3/${INFURA_API_KEY}"
      },
      {
        "url": "wss://goerli.infura.io/v3/${INFURA_API_KEY}"
      },
      {
        "url": "https://rpc.goerli.mudit.blog/"
      }
    ]
  },
  {
    "name": "Klaytn Mainnet Cypress",
    "symbol": "KLAY",
    "chainId": 150,
    "nativeChainId": 8217,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "KLAY",
      "name": "KLAY"
    },
    "blockExplorers": [
      {
        "name": "Klaytnscope",
        "url": "https://scope.klaytn.com"
      }
    ],
    "rpcs": [
      {
        "url": "https://public-node-api.klaytnapi.com/v1/cypress"
      }
    ]
  },
  {
    "name": "Klaytn Testnet Baobab",
    "symbol": "KLAY",
    "chainId": 10150,
    "nativeChainId": 1001,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "KLAY",
      "name": "KLAY"
    },
    "blockExplorers": [],
    "rpcs": [
      {
        "url": "https://api.baobab.klaytn.net:8651"
      }
    ]
  },
  {
    "name": "Meter Mainnet",
    "symbol": "METER",
    "chainId": 156,
    "nativeChainId": 82,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "MTR",
      "name": "Meter"
    },
    "blockExplorers": [
      {
        "name": "Meter Mainnet Scan",
        "url": "https://scan.meter.io"
      }
    ],
    "rpcs": [
      {
        "url": "https://rpc.meter.io"
      }
    ]
  },
  {
    "name": "Meter Testnet",
    "symbol": "METER Testnet",
    "chainId": 10156,
    "nativeChainId": 83,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "MTR",
      "name": "Meter"
    },
    "blockExplorers": [
      {
        "name": "Meter Testnet Scan",
        "url": "https://scan-warringstakes.meter.io"
      }
    ],
    "rpcs": [
      {
        "url": "https://rpctest.meter.io"
      }
    ]
  },
  {
    "name": "Moonriver",
    "symbol": "MOON",
    "chainId": 167,
    "nativeChainId": 1285,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "MOVR",
      "name": "Moonriver"
    },
    "blockExplorers": [
      {
        "name": "moonscan",
        "url": "https://moonriver.moonscan.io"
      }
    ],
    "rpcs": [
      {
        "url": "https://rpc.api.moonriver.moonbeam.network"
      },
      {
        "url": "wss://wss.api.moonriver.moonbeam.network"
      }
    ]
  },
  {
    "name": "OKXChain Mainnet",
    "symbol": "okxchain",
    "chainId": 155,
    "nativeChainId": 66,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "OKT",
      "name": "OKXChain Global Utility Token"
    },
    "blockExplorers": [
      {
        "name": "OKLink",
        "url": "https://www.oklink.com/en/okc"
      }
    ],
    "rpcs": [
      {
        "url": "https://exchainrpc.okex.org"
      },
      {
        "url": "https://okc-mainnet.gateway.pokt.network/v1/lb/6275309bea1b320039c893ff"
      }
    ]
  },
  {
    "name": "Sepolia",
    "symbol": "sep",
    "chainId": 161,
    "nativeChainId": 11155111,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "ETH",
      "name": "Sepolia Ether"
    },
    "blockExplorers": [
      {
        "name": "etherscan-sepolia",
        "url": "https://sepolia.etherscan.io"
      },
      {
        "name": "otterscan-sepolia",
        "url": "https://sepolia.otterscan.io"
      }
    ],
    "rpcs": [
      {
        "url": "https://rpc.sepolia.org"
      },
      {
        "url": "https://rpc2.sepolia.org"
      },
      {
        "url": "https://rpc-sepolia.rockx.com"
      }
    ]
  },
  {
    "name": "zkSync Era Mainnet",
    "symbol": "zksync",
    "chainId": 165,
    "nativeChainId": 324,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "ETH",
      "name": "Ether"
    },
    "blockExplorers": [
      {
        "name": "zkSync Era Block Explorer",
        "url": "https://explorer.zksync.io"
      }
    ],
    "rpcs": [
      {
        "url": "https://mainnet.era.zksync.io"
      }
    ]
  },
  {
    "name": "zkSync Era Testnet",
    "symbol": "zksync-goerli",
    "chainId": 10165,
    "nativeChainId": 280,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "ETH",
      "name": "Ether"
    },
    "blockExplorers": [
      {
        "name": "zkSync Era Block Explorer",
        "url": "https://goerli.explorer.zksync.io"
      }
    ],
    "rpcs": [
      {
        "url": "https://testnet.era.zksync.dev"
      }
    ]
  },
  {
    "name": "Base Testnet",
    "symbol": "base",
    "chainId": 10160,
    "nativeChainId": 84531,
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18
    },
    "blockExplorers": [
      {
        "name": "basescan",
        "url": "https://goerli.basescan.org"
      },
      {
        "name": "basescout",
        "url": "https://base-goerli.blockscout.com"
      }
    ],
    "rpcs": [
      {
        "url": "https://goerli.base.org"
      }
    ]
  },
  {
    "name": "Shrapnel Subnet",
    "symbol": "Shrapnel",
    "chainId": 148,
    "nativeChainId": 2044,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "SHRAPG",
      "name": "Shrapnel Gas Token"
    },
    "blockExplorers": [],
    "rpcs": [
      {
        "url": "https://subnets.avax.network/shrapnel/mainnet/rpc"
      }
    ]
  },
  {
    "name": "Tenet",
    "symbol": "tenet",
    "chainId": 173,
    "nativeChainId": 1559,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "TENET",
      "name": "TENET"
    },
    "blockExplorers": [
      {
        "name": "TenetScan Mainnet",
        "url": "https://tenetscan.io"
      }
    ],
    "rpcs": [
      {
        "url": "https://rpc.tenet.org"
      }
    ]
  },
  {
    "name": "Tenet Testnet",
    "symbol": "tenet-testnet",
    "chainId": 10173,
    "nativeChainId": 155,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "TENET",
      "name": "TENET"
    },
    "blockExplorers": [
      {
        "name": "TenetScan Testnet",
        "url": "https://testnet.tenetscan.io"
      }
    ],
    "rpcs": [
      {
        "url": "https://rpc.testnet.tenet.org"
      }
    ]
  },
  {
    "name": "Polygon zkEVM",
    "symbol": "zkevm",
    "chainId": 158,
    "nativeChainId": 1101,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "ETH",
      "name": "Ether"
    },
    "blockExplorers": [
      {
        "name": "blockscout",
        "url": "https://zkevm.polygonscan.com"
      }
    ],
    "rpcs": [
      {
        "url": "https://zkevm-rpc.com"
      }
    ]
  },
  {
    "name": "Polygon zkEVM Testnet",
    "symbol": "testnet-zkEVM-mango",
    "chainId": 10158,
    "nativeChainId": 1442,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "ETH",
      "name": "Ether"
    },
    "blockExplorers": [
      {
        "name": "Polygon zkEVM explorer",
        "url": "https://explorer.public.zkevm-test.net"
      }
    ],
    "rpcs": [
      {
        "url": "https://rpc.public.zkevm-test.net"
      }
    ]
  },
  {
    "name": "Canto",
    "symbol": "canto",
    "chainId": 159,
    "nativeChainId": 7700,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "CANTO",
      "name": "Canto"
    },
    "blockExplorers": [
      {
        "name": "Canto EVM Explorer (Blockscout)",
        "url": "https://evm.explorer.canto.io"
      },
      {
        "name": "Canto Cosmos Explorer",
        "url": "https://cosmos-explorers.neobase.one"
      },
      {
        "name": "Canto EVM Explorer (Blockscout)",
        "url": "https://tuber.build"
      }
    ],
    "rpcs": [
      {
        "url": "https://canto.slingshot.finance"
      },
      {
        "url": "https://canto.neobase.one"
      },
      {
        "url": "https://mainnode.plexnode.org:8545"
      }
    ]
  },
  {
    "name": "Canto Testnet",
    "symbol": "tcanto",
    "chainId": 10159,
    "nativeChainId": 740,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "CANTO",
      "name": "Canto"
    },
    "blockExplorers": [
      {
        "name": "Canto Tesnet Explorer (Neobase)",
        "url": "https://testnet-explorer.canto.neobase.one"
      }
    ],
    "rpcs": [
      {
        "url": "https://eth.plexnode.wtf/"
      }
    ]
  },
  {
    "name": "Arbitrum Nova",
    "symbol": "arb-nova",
    "chainId": 175,
    "nativeChainId": 42170,
    "nativeCurrency": {
      "decimals": 18,
      "symbol": "ETH",
      "name": "Ether"
    },
    "blockExplorers": [
      {
        "name": "Arbitrum Nova Chain Explorer",
        "url": "https://nova-explorer.arbitrum.io"
      }
    ],
    "rpcs": [
      {
        "url": "https://nova.arbitrum.io/rpc"
      }
    ]
  }
];

// src/network/toULNv2.ts
var EXCEPTIONS = /* @__PURE__ */ new Set([20008]);
function toULNv2(chainId) {
  if (EXCEPTIONS.has(chainId))
    return chainId;
  if (chainId < 100)
    return chainId + 100;
  if (chainId < 1e4)
    return chainId;
  if (chainId < 10100)
    return chainId + 100;
  if (chainId < 2e4)
    return chainId;
  if (chainId < 20100)
    return chainId + 100;
  return chainId;
}

// src/network/networks.ts
function addSandboxNetworks(networks) {
  const result = networks.slice();
  for (const network of networks) {
    const networkSymbol = ChainId[network.chainId];
    const chainId = ChainId[networkSymbol + "_SANDBOX"];
    if (chainId) {
      const sandbox = __spreadProps(__spreadValues({}, network), {
        chainId
      });
      result.push(sandbox);
    }
  }
  return result;
}
var NETWORKS = addSandboxNetworks(NETWORK_INFO).map(
  (_a) => {
    var _b = _a, { nativeCurrency } = _b, network = __objRest(_b, ["nativeCurrency"]);
    return __spreadProps(__spreadValues({}, network), {
      nativeCurrency: nativeCurrency.address ? new Token(
        network.chainId,
        nativeCurrency.address,
        nativeCurrency.decimals,
        nativeCurrency.symbol,
        nativeCurrency.name
      ) : new Coin(
        network.chainId,
        nativeCurrency.decimals,
        nativeCurrency.symbol,
        nativeCurrency.name
      )
    });
  }
);
var isEvmAddress = utils.isAddress;
function getNetwork(chainId) {
  const network = tryGetNetwork(chainId);
  if (!network)
    throw Error(`No NETWORK for ${chainId}`);
  return network;
}
function tryGetNetwork(chainId) {
  if (chainId === void 0)
    return void 0;
  chainId = toULNv2(chainId);
  return NETWORKS.find((i) => i.chainId === chainId);
}
function getNativeCurrency(chainId) {
  return getNetwork(chainId).nativeCurrency;
}
function isNativeCurrency(currency) {
  const native = getNativeCurrency(currency.chainId);
  return native.equals(currency);
}
function isChainOnStage(chainId, chainStage) {
  return getChainStage(chainId) === chainStage;
}
function getBlockExplorerUrl(chainId) {
  var _a, _b;
  return (_b = (_a = tryGetBlockExplorer(chainId)) == null ? void 0 : _a.url) != null ? _b : "";
}
function getBlockLink(chainId, blockOrHash) {
  return getBlockExplorerUrl(chainId) + `/block/${blockOrHash}`;
}
function getAddressLink(chainId, address) {
  return getBlockExplorerUrl(chainId) + `/address/${address}`;
}
function getTransactionLink(chainId, hash) {
  const explorer = getBlockExplorerUrl(chainId);
  if (isChainType(chainId, "APTOS" /* APTOS */)) {
    const queryString = chainId === ChainId.APTOS_TESTNET || chainId === ChainId.APTOS_TESTNET_SANDBOX ? "?network=Testnet" : "";
    return explorer + "/txn/" + hash + queryString;
  }
  return explorer + "/tx/" + hash;
}
function getScanLink(chainId, hash) {
  const chainStage = getChainStage(chainId);
  if (chainStage === ChainStage.MAINNET) {
    return `https://layerzeroscan.com/tx/${hash}`;
  }
  if (chainStage === ChainStage.TESTNET) {
    return `https://testnet.layerzeroscan.com/tx/${hash}`;
  }
  return `https://sandbox.layerzeroscan.com/tx/${hash}`;
}
function getBlockExplorer(chainId) {
  const explorer = tryGetBlockExplorer(chainId);
  if (!explorer)
    throw new Error(`No BLOCK_EXPLORERS for ChainId ${chainId}`);
  return explorer;
}
function tryGetBlockExplorer(chainId) {
  const network = tryGetNetwork(chainId);
  return network == null ? void 0 : network.blockExplorers.at(0);
}

// src/network/evm.ts
function toEvmChainId(chainId) {
  const key = ChainId[chainId];
  const evmChainId = ChainListId[key];
  if (!evmChainId)
    throw Error(`No ChainListId for ${key}, ${chainId}`);
  return evmChainId;
}
function isSupportedEvmChainId(evmChainId) {
  return evmChainId in ChainListId;
}
function fromEvmChainId(evmChainId, sandbox = false) {
  evmChainId = Number(evmChainId);
  const matches = [];
  for (const key in ChainListId) {
    const nativeChainId = ChainListId[key];
    if (nativeChainId !== evmChainId)
      continue;
    const chainId2 = ChainId[key];
    if (!isFinite(chainId2))
      continue;
    if (!isEvmChainId(chainId2))
      continue;
    matches.push(chainId2);
  }
  if (sandbox) {
    const chainId2 = matches.find((i) => isChainOnStage(i, ChainStage.TESTNET_SANDBOX));
    if (chainId2)
      return chainId2;
  }
  const chainId = matches[0];
  if (chainId)
    return chainId;
  throw new Error(`No ChainId for ${evmChainId}`);
}
function tryFromEvmChainId(evmChainId, sandbox = false) {
  try {
    return fromEvmChainId(evmChainId, sandbox);
  } catch (e) {
    return void 0;
  }
}
var AptosChainId = /* @__PURE__ */ ((AptosChainId2) => {
  AptosChainId2[AptosChainId2["TESTNET"] = 2] = "TESTNET";
  AptosChainId2[AptosChainId2["MAINNET"] = 1] = "MAINNET";
  return AptosChainId2;
})(AptosChainId || {});
var SolanaChainId = /* @__PURE__ */ ((SolanaChainId2) => {
  SolanaChainId2[SolanaChainId2["MAINNET"] = 1] = "MAINNET";
  SolanaChainId2[SolanaChainId2["TESTNET"] = 2] = "TESTNET";
  return SolanaChainId2;
})(SolanaChainId || {});
function fromAptosChainId(aptosChainId) {
  aptosChainId = Number(aptosChainId);
  if (aptosChainId === 1 /* MAINNET */)
    return ChainId.APTOS;
  if (aptosChainId === 2 /* TESTNET */) {
    return ChainId.APTOS_TESTNET;
  }
  return void 0;
}

// src/icon.ts
var IconTheme = /* @__PURE__ */ ((IconTheme2) => {
  IconTheme2["LZ_DARK"] = "lz-dark";
  IconTheme2["LZ_LIGHT"] = "lz-light";
  IconTheme2["STG_LIGHT"] = "stargate-light";
  return IconTheme2;
})(IconTheme || {});
var defaultTheme = "lz-dark" /* LZ_DARK */;
var baseUrl = "https://icons-ckg.pages.dev";
function getCurrencyIcon(symbol, theme = getCurrencyIcon.defaultTheme) {
  return [baseUrl, theme, "tokens", symbol.toLowerCase() + ".svg"].join("/");
}
function getNetworkIcon(chainIdOrSymbol, theme = getNetworkIcon.defaultTheme) {
  const symbol = typeof chainIdOrSymbol === "string" ? chainIdOrSymbol : getNetwork(chainIdOrSymbol).symbol;
  return [baseUrl, theme, "networks", symbol.toLowerCase() + ".svg"].join("/");
}
function getWalletIcon(walletType, theme = getWalletIcon.defaultTheme) {
  return [baseUrl, theme, "wallets", walletType.toLowerCase() + ".svg"].join("/");
}
getCurrencyIcon.defaultTheme = defaultTheme;
getNetworkIcon.defaultTheme = defaultTheme;
getWalletIcon.defaultTheme = defaultTheme;
function setIconTheme(theme) {
  getCurrencyIcon.defaultTheme = theme;
  getNetworkIcon.defaultTheme = theme;
  getWalletIcon.defaultTheme = theme;
}

// src/fraction/constants.ts
var Rounding = /* @__PURE__ */ ((Rounding2) => {
  Rounding2[Rounding2["ROUND_DOWN"] = 0] = "ROUND_DOWN";
  Rounding2[Rounding2["ROUND_HALF_UP"] = 1] = "ROUND_HALF_UP";
  Rounding2[Rounding2["ROUND_UP"] = 2] = "ROUND_UP";
  return Rounding2;
})(Rounding || {});
var MaxUint256 = BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);
var Decimal = toFormat(_Decimal);
var Big = toFormat(_Big);
var toSignificantRounding = {
  [0 /* ROUND_DOWN */]: Decimal.ROUND_DOWN,
  [1 /* ROUND_HALF_UP */]: Decimal.ROUND_HALF_UP,
  [2 /* ROUND_UP */]: Decimal.ROUND_UP
};
var toFixedRounding = {
  [0 /* ROUND_DOWN */]: 0,
  [1 /* ROUND_HALF_UP */]: 1,
  [2 /* ROUND_UP */]: 3
};
var Fraction = class {
  constructor(numerator, denominator = BigInt(1)) {
    this.numerator = BigInt(numerator);
    this.denominator = BigInt(denominator);
  }
  static tryParseFraction(fractionish) {
    if (typeof fractionish === "number" || typeof fractionish === "string" || typeof fractionish === "bigint")
      return new Fraction(fractionish);
    if ("numerator" in fractionish && "denominator" in fractionish)
      return fractionish;
    throw new Error("Could not parse fraction");
  }
  // performs floor division
  get quotient() {
    return this.numerator / this.denominator;
  }
  // remainder after floor division
  get remainder() {
    return new Fraction(this.numerator % this.denominator, this.denominator);
  }
  invert() {
    return new Fraction(this.denominator, this.numerator);
  }
  add(other) {
    const otherParsed = Fraction.tryParseFraction(other);
    if (this.denominator === otherParsed.denominator) {
      return new Fraction(this.numerator + otherParsed.numerator, this.denominator);
    }
    return new Fraction(
      this.numerator * otherParsed.denominator + otherParsed.numerator * this.denominator,
      this.denominator * otherParsed.denominator
    );
  }
  subtract(other) {
    const otherParsed = Fraction.tryParseFraction(other);
    if (this.denominator === otherParsed.denominator) {
      return new Fraction(this.numerator - otherParsed.numerator, this.denominator);
    }
    return new Fraction(
      this.numerator * otherParsed.denominator - otherParsed.numerator * this.denominator,
      this.denominator * otherParsed.denominator
    );
  }
  lessThan(other) {
    const otherParsed = Fraction.tryParseFraction(other);
    return this.numerator * otherParsed.denominator < otherParsed.numerator * this.denominator;
  }
  equalTo(other) {
    const otherParsed = Fraction.tryParseFraction(other);
    return this.numerator * otherParsed.denominator === otherParsed.numerator * this.denominator;
  }
  greaterThan(other) {
    const otherParsed = Fraction.tryParseFraction(other);
    return this.numerator * otherParsed.denominator > otherParsed.numerator * this.denominator;
  }
  multiply(other) {
    const otherParsed = Fraction.tryParseFraction(other);
    return new Fraction(
      this.numerator * otherParsed.numerator,
      this.denominator * otherParsed.denominator
    );
  }
  divide(other) {
    const otherParsed = Fraction.tryParseFraction(other);
    return new Fraction(
      this.numerator * otherParsed.denominator,
      this.denominator * otherParsed.numerator
    );
  }
  toSignificant(significantDigits, format = { groupSeparator: "" }, rounding = 1 /* ROUND_HALF_UP */) {
    assert2(Number.isInteger(significantDigits), `${significantDigits} is not an integer.`);
    assert2(significantDigits > 0, `${significantDigits} is not positive.`);
    Decimal.set({ precision: significantDigits + 1, rounding: toSignificantRounding[rounding] });
    const quotient = new Decimal(this.numerator.toString()).div(this.denominator.toString()).toSignificantDigits(significantDigits);
    return quotient.toFormat(quotient.decimalPlaces(), format);
  }
  toFixed(decimalPlaces, format = { groupSeparator: "" }, rounding = 1 /* ROUND_HALF_UP */) {
    assert2(Number.isInteger(decimalPlaces), `${decimalPlaces} is not an integer.`);
    assert2(decimalPlaces >= 0, `${decimalPlaces} is negative.`);
    Big.DP = decimalPlaces;
    Big.RM = toFixedRounding[rounding];
    return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(decimalPlaces, format);
  }
  /**
   * Helper method for converting any super class back to a fraction
   */
  get asFraction() {
    return new Fraction(this.numerator, this.denominator);
  }
};
var Big2 = toFormat(_Big);
var CurrencyAmount = class extends Fraction {
  constructor(currency, numerator, denominator) {
    super(numerator, denominator);
    assert2(this.quotient <= MaxUint256, "AMOUNT");
    this.currency = currency;
    this.decimalScale = BigInt(10) ** BigInt(currency.decimals);
  }
  /**
   * Returns a new currency amount instance from the unitless amount of token, i.e. the raw amount
   * @param currency the currency in the amount
   * @param rawAmount the raw token or ether amount
   */
  static fromRawAmount(currency, rawAmount) {
    return new CurrencyAmount(currency, rawAmount);
  }
  /**
   * Construct a currency amount with a denominator that is not equal to 1
   * @param currency the currency
   * @param numerator the numerator of the fractional token amount
   * @param denominator the denominator of the fractional token amount
   */
  static fromFractionalAmount(currency, numerator, denominator) {
    return new CurrencyAmount(currency, numerator, denominator);
  }
  add(other) {
    assert2(this.currency.equals(other.currency), "CURRENCY");
    const added = super.add(other);
    return CurrencyAmount.fromFractionalAmount(this.currency, added.numerator, added.denominator);
  }
  subtract(other) {
    assert2(this.currency.equals(other.currency), "CURRENCY");
    const subtracted = super.subtract(other);
    return CurrencyAmount.fromFractionalAmount(
      this.currency,
      subtracted.numerator,
      subtracted.denominator
    );
  }
  multiply(other) {
    const multiplied = super.multiply(other);
    return CurrencyAmount.fromFractionalAmount(
      this.currency,
      multiplied.numerator,
      multiplied.denominator
    );
  }
  divide(other) {
    const divided = super.divide(other);
    return CurrencyAmount.fromFractionalAmount(
      this.currency,
      divided.numerator,
      divided.denominator
    );
  }
  toSignificant(significantDigits = 6, format, rounding = 0 /* ROUND_DOWN */) {
    return super.divide(this.decimalScale).toSignificant(significantDigits, format, rounding);
  }
  toFixed(decimalPlaces = this.currency.decimals, format, rounding = 0 /* ROUND_DOWN */) {
    assert2(decimalPlaces <= this.currency.decimals, "DECIMALS");
    return super.divide(this.decimalScale).toFixed(decimalPlaces, format, rounding);
  }
  toExact(format = { groupSeparator: "" }) {
    Big2.DP = this.currency.decimals;
    return new Big2(this.quotient.toString()).div(this.decimalScale.toString()).toFormat(format);
  }
};

// src/fraction/percent.ts
var ONE_HUNDRED = new Fraction(BigInt(100));
function toPercent(fraction) {
  return new Percent(fraction.numerator, fraction.denominator);
}
var Percent = class extends Fraction {
  constructor() {
    super(...arguments);
    /**
     * This boolean prevents a fraction from being interpreted as a Percent
     */
    this.isPercent = true;
  }
  add(other) {
    return toPercent(super.add(other));
  }
  subtract(other) {
    return toPercent(super.subtract(other));
  }
  multiply(other) {
    return toPercent(super.multiply(other));
  }
  divide(other) {
    return toPercent(super.divide(other));
  }
  toSignificant(significantDigits = 5, format, rounding) {
    return super.multiply(ONE_HUNDRED).toSignificant(significantDigits, format, rounding);
  }
  toFixed(decimalPlaces = 2, format, rounding) {
    return super.multiply(ONE_HUNDRED).toFixed(decimalPlaces, format, rounding);
  }
};

// ../../node_modules/tiny-invariant/dist/esm/tiny-invariant.js
var isProduction = process.env.NODE_ENV === "production";
var prefix = "Invariant failed";
function invariant(condition, message) {
  if (condition) {
    return;
  }
  if (isProduction) {
    throw new Error(prefix);
  }
  var provided = typeof message === "function" ? message() : message;
  var value = provided ? "".concat(prefix, ": ").concat(provided) : prefix;
  throw new Error(value);
}

// src/fraction/price.ts
var Price = class extends Fraction {
  // used to adjust the raw fraction w/r/t the decimals of the {base,quote}Token
  /**
   * Construct a price, either with the base and quote currency amount, or the
   * @param args
   */
  constructor(...args) {
    let baseCurrency, quoteCurrency, denominator, numerator;
    if (args.length === 4) {
      [baseCurrency, quoteCurrency, denominator, numerator] = args;
    } else {
      const result = args[0].quoteAmount.divide(args[0].baseAmount);
      [baseCurrency, quoteCurrency, denominator, numerator] = [
        args[0].baseAmount.currency,
        args[0].quoteAmount.currency,
        result.denominator,
        result.numerator
      ];
    }
    super(numerator, denominator);
    this.baseCurrency = baseCurrency;
    this.quoteCurrency = quoteCurrency;
    this.scalar = new Fraction(
      BigInt(10) ** BigInt(baseCurrency.decimals),
      BigInt(10) ** BigInt(quoteCurrency.decimals)
    );
  }
  /**
   * Flip the price, switching the base and quote currency
   */
  invert() {
    return new Price(this.quoteCurrency, this.baseCurrency, this.numerator, this.denominator);
  }
  /**
   * Multiply the price by another price, returning a new price. The other price must have the same base currency as this price's quote currency
   * @param other the other price
   */
  multiply(other) {
    invariant(this.quoteCurrency.equals(other.baseCurrency), "TOKEN");
    const fraction = super.multiply(other);
    return new Price(
      this.baseCurrency,
      other.quoteCurrency,
      fraction.denominator,
      fraction.numerator
    );
  }
  /**
   * Return the amount of quote currency corresponding to a given amount of the base currency
   * @param currencyAmount the amount of base currency to quote against the price
   */
  quote(currencyAmount) {
    invariant(currencyAmount.currency.equals(this.baseCurrency), "TOKEN");
    const result = super.multiply(currencyAmount);
    return CurrencyAmount.fromFractionalAmount(
      this.quoteCurrency,
      result.numerator,
      result.denominator
    );
  }
  /**
   * Get the value scaled by decimals for formatting
   * @private
   */
  get adjustedForDecimals() {
    return super.multiply(this.scalar);
  }
  toSignificant(significantDigits = 6, format, rounding) {
    return this.adjustedForDecimals.toSignificant(significantDigits, format, rounding);
  }
  toFixed(decimalPlaces = 4, format, rounding) {
    return this.adjustedForDecimals.toFixed(decimalPlaces, format, rounding);
  }
};

// src/fraction/utils/bpToFraction.ts
function bpToFraction(bp, decimals = 4) {
  return new Fraction(bp.toNumber(), 10 ** decimals);
}

// src/fraction/utils/castCurrencyAmountUnsafe.ts
function castCurrencyAmountUnsafe(input, dstCurrency) {
  const srcCurrency = input.currency;
  if (srcCurrency.decimals === dstCurrency.decimals) {
    return CurrencyAmount.fromRawAmount(dstCurrency, input.quotient);
  }
  return CurrencyAmount.fromRawAmount(dstCurrency, input.quotient).multiply(10 ** dstCurrency.decimals).divide(10 ** srcCurrency.decimals);
}

// src/fraction/utils/formatAmount.ts
function formatAmount(amount) {
  if (amount instanceof CurrencyAmount) {
    return formatCurrencyAmount(amount);
  }
}
formatAmount.nice = (amount) => {
  if (amount instanceof CurrencyAmount) {
    return formatCurrencyAmount.nice(amount);
  }
};
function formatCurrencyAmount(value) {
  return value.toExact();
}
formatCurrencyAmount.short = (value, dp = 1) => {
  if (!value)
    return "-";
  const formatted = formatCurrencyAmount(value);
  try {
    const number = parseFloat(formatted);
    if (number > 1e6) {
      const m = number / 1e6;
      return m.toLocaleString("en-US", {
        maximumFractionDigits: dp,
        minimumFractionDigits: 1
      }) + "M";
    }
    return number.toLocaleString("en-US", {
      maximumFractionDigits: dp,
      minimumFractionDigits: 1
    });
  } catch (e) {
    const [whole, rest = "0"] = formatted.split(".");
    return whole + "." + rest.substr(0, dp);
  }
};
var niceFormat = { groupSeparator: "," };
formatCurrencyAmount.nice = (value, dp = 2) => {
  if (!value)
    return "-";
  if (!value.toFixed)
    return "-";
  return value.toFixed(dp, niceFormat);
};
function formatFiatAmount(amount) {
  return amount.value.toLocaleString("en-US", {
    currency: amount.currency,
    style: "currency"
  });
}
formatFiatAmount.nice = (amount) => {
  if (!amount)
    return "-";
  return formatFiatAmount(amount);
};
formatFiatAmount.short = (value, currency = "USD") => {
  if (value >= 1e6) {
    const m = value / 1e6;
    return m.toLocaleString("en-US", {
      currency,
      style: "currency",
      maximumFractionDigits: 1
    }) + "M";
  }
  return value.toLocaleString("en-US", {
    currency,
    style: "currency"
  });
};
function parseCurrencyAmount(currency, value) {
  const typedValueParsed = utils.parseUnits(value, currency.decimals);
  return CurrencyAmount.fromRawAmount(currency, typedValueParsed.toHexString());
}
function tryParseCurrencyAmount(currency, value) {
  if (currency === void 0 || value === void 0)
    return void 0;
  try {
    return parseCurrencyAmount(currency, value);
  } catch (e) {
  }
  return void 0;
}
function parseFraction(value, decimals) {
  const parsed = utils.parseUnits(value, decimals);
  const denominator = 10 ** decimals;
  return new Fraction(parsed.toHexString(), denominator);
}
function tryParseFraction(value, decimals = 4) {
  if (value === void 0)
    return void 0;
  try {
    return parseFraction(value, decimals);
  } catch (e) {
  }
  return void 0;
}
function parsePercent(value, decimals) {
  const parsed = utils.parseUnits(value, decimals).toBigInt();
  const denominator = 100 * 10 ** decimals;
  return new Percent(parsed, denominator);
}
function tryParsePercent(value, decimals = 4) {
  if (value === void 0)
    return void 0;
  try {
    return parsePercent(value, decimals);
  } catch (e) {
  }
  return void 0;
}

// src/fraction/utils/sumUnsafe.ts
function sumUnsafe(amounts, asCurrency) {
  if (!amounts || amounts.length === 0 || amounts.some((i) => !i)) {
    return void 0;
  }
  asCurrency = asCurrency != null ? asCurrency : amounts[0].currency;
  let sum = 0;
  for (let amount of amounts) {
    const float = parseFloat(amount.toExact());
    sum += float;
  }
  if (!Number.isFinite(sum))
    return void 0;
  return tryParseCurrencyAmount(asCurrency, sum.toFixed(asCurrency.decimals));
}
function sumFiat(amounts) {
  if (!amounts || amounts.length === 0)
    return void 0;
  let sum = 0;
  const currency = amounts[0].currency;
  for (let amount of amounts) {
    if (!amount)
      return void 0;
    if (currency !== amount.currency)
      return void 0;
    sum += amount.value;
  }
  if (!Number.isFinite(sum))
    return void 0;
  return {
    currency,
    value: sum
  };
}
function toBigNumber(amount) {
  return BigNumber.from(amount.quotient.toString());
}
function toBigInt(amount) {
  return BigInt(amount.quotient.toString());
}
function toCurrencyAmount(token, value) {
  if (BigNumber.isBigNumber(value))
    value = value.toHexString();
  return CurrencyAmount.fromRawAmount(token, value);
}

// src/fraction/utils/removeDust.ts
function removeDust(amount, sharedDecimals) {
  const localDecimals = amount.currency.decimals;
  const diff = localDecimals - sharedDecimals;
  if (diff > 0) {
    return CurrencyAmount.fromRawAmount(
      amount.currency,
      amount.divide(10 ** diff).quotient
    ).multiply(10 ** diff);
  }
  return amount;
}

// src/utils/waitFor.ts
var noop = () => {
};
function waitFor(condition, { timeout = 1e3, interval = 100 }) {
  let cancel = noop;
  const promise = new Promise((resolve, reject) => {
    try {
      if (condition()) {
        resolve();
        return;
      }
    } catch (e) {
    }
    const id = setInterval(() => {
      if (condition()) {
        cancel();
        resolve();
      }
    }, interval);
    cancel = () => clearInterval(id);
    setTimeout(() => {
      cancel();
      reject();
    }, timeout);
  });
  promise.cancel = cancel;
  return promise;
}
var DEFAULT_BLOCK_TIME_SECONDS = 15;
var DEFAULT_BLOCK_CONFIRMATIONS = 1;
var BLOCK_CONFIRMATIONS = {
  [ChainId.ETHEREUM]: 15,
  [ChainId.AVALANCHE]: 12,
  [ChainId.BSC]: 20,
  [ChainId.POLYGON]: 512,
  [ChainId.ARBITRUM]: 20,
  [ChainId.OPTIMISM]: 20,
  [ChainId.FANTOM]: 5
};
function getBlockTime(chainId) {
  var _a;
  return (_a = AVERAGE_BLOCK_TIME[chainId]) != null ? _a : DEFAULT_BLOCK_TIME_SECONDS;
}
function getRequiredBlockConfirmations(chainId) {
  var _a;
  return (_a = BLOCK_CONFIRMATIONS[chainId]) != null ? _a : DEFAULT_BLOCK_CONFIRMATIONS;
}
function getEstimatedTransactionTime(chainId) {
  const confirmations = getRequiredBlockConfirmations(chainId);
  const blockTime = getBlockTime(chainId);
  const extraDelay = 10;
  return (confirmations + 1) * blockTime + extraDelay;
}
function getExpectedConfirmationDateSameChain(chainId, nowTimestamp = timeStamp()) {
  const delay = getEstimatedTransactionTime(chainId);
  return nowTimestamp + delay;
}
function getDefaultMessageDuration(srcChainId, dstChainId) {
  const fromDelay = getBlockTime(srcChainId) * (1 + getRequiredBlockConfirmations(srcChainId));
  const toDelay = 2 * getBlockTime(dstChainId);
  const lambdaDelay = 15;
  const extraDelay = 10;
  return fromDelay + toDelay + lambdaDelay + extraDelay;
}
function getExpectedConfirmationDateBetweenChains(srcChainId, dstChainId, nowTimestamp = timeStamp()) {
  if (srcChainId === ChainId.APTOS || srcChainId === ChainId.APTOS_TESTNET) {
    return nowTimestamp + 3 * 24 * 3600;
  }
  const duration = getDefaultMessageDuration(srcChainId, dstChainId);
  return nowTimestamp + duration;
}
function timeStamp() {
  return Math.floor(Date.now() / 1e3);
}
function getExpectedDate(srcChainId, dstChainId, nowTimestamp = timeStamp()) {
  if (!dstChainId)
    return getExpectedConfirmationDateSameChain(srcChainId, nowTimestamp);
  return getExpectedConfirmationDateBetweenChains(srcChainId, dstChainId, nowTimestamp);
}

// src/utils/parseNumber.ts
function formatUserInput(value) {
  value = value.replace(/,/g, ".");
  return value;
}
var tryParseNumber = (value) => {
  const nextUserInput = formatUserInput(value);
  if (nextUserInput === "" || inputRegex.test(escapeRegExp(nextUserInput))) {
    return nextUserInput;
  }
  return void 0;
};
var parseNumber = (value) => {
  const number = tryParseNumber(value);
  if (!number)
    throw new Error(`Value "${value}" is invalid number`);
  return number;
};
var inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`);
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// src/utils/convertToPaddedUint8Array.ts
function convertToPaddedUint8Array(str, length) {
  const value = str.replace(/^0x/i, "").match(/.{1,2}/g).map((byte) => parseInt(byte, 16));
  const result = Uint8Array.from([...new Array(length - value.length).fill(0), ...value]);
  return result;
}

// src/utils/interpolateString.ts
function interpolateString(str, variables) {
  const regex = /\${([a-zA-Z0-9_]+)}/g;
  return str.replace(regex, (_, variable) => {
    const value = variables[variable];
    if (value === void 0) {
      throw new Error(`Undefined environment variable: ${variable}`);
    }
    return String(value);
  });
}

// src/providers/ResourceProvider__currency_evm.ts
var ResourceProvider__currency_evm = class {
  supports(resource) {
    if (!isCurrency(resource))
      return false;
    return isEvmChainId(resource.chainId);
  }
  register(resource) {
    throw new Error("Method not supported.");
  }
  async isRegistered(resource, address) {
    return true;
  }
  getType(resource) {
    return `${resource.chainId}:${resource.symbol}:${isToken(resource) ? resource.address : "0x"}`;
  }
};
var AdapterParams = class {
  constructor(version, extraGas = 2e5, dstNativeAmount, dstNativeAddress) {
    this.version = version;
    this.extraGas = extraGas;
    this.dstNativeAmount = dstNativeAmount;
    this.dstNativeAddress = dstNativeAddress;
  }
  static forV1(extraGas) {
    return new AdapterParams(1, extraGas);
  }
  static forV2(input) {
    assert2(input.dstNativeAmount);
    assert2(input.dstNativeAddress);
    return new AdapterParams(2, input.extraGas, input.dstNativeAmount, input.dstNativeAddress);
  }
  create(input) {
    var _a;
    if ((_a = input.dstNativeAmount) == null ? void 0 : _a.greaterThan(1)) {
      return AdapterParams.forV1(input.extraGas);
    } else {
      assert2(input.dstNativeAddress);
      assert2(input.dstNativeAmount);
      return AdapterParams.forV2(input);
    }
  }
};

export { AdapterParams, AptosChainId, BLOCK_CONFIRMATIONS, BaseCurrency, ChainType, Coin, CurrencyAmount, DEFAULT_BLOCK_CONFIRMATIONS, DEFAULT_BLOCK_TIME_SECONDS, Fraction, IconTheme, MaxUint256, NETWORKS, Percent, Price, ResourceProvider__currency_evm, Rounding, SolanaChainId, Token, assertToken, bpToFraction, castCurrencyAmountUnsafe, convertToPaddedUint8Array, escapeRegExp, formatAmount, formatCurrencyAmount, formatFiatAmount, fromAptosChainId, fromEvmChainId, getAddressLink, getBlockExplorer, getBlockLink, getBlockTime, getChainType, getCurrencyIcon, getDefaultMessageDuration, getEstimatedTransactionTime, getExpectedDate, getNativeCurrency, getNetwork, getNetworkIcon, getRequiredBlockConfirmations, getScanLink, getTransactionLink, getWalletIcon, interpolateString, isAptosChainId, isChainOnStage, isChainType, isCoin, isCurrency, isEvmAddress, isEvmChainId, isNativeCurrency, isSolanaChainId, isSupportedEvmChainId, isToken, parseCurrencyAmount, parseFraction, parseNumber, parsePercent, removeDust, setIconTheme, sumFiat, sumUnsafe, timeStamp, toBigInt, toBigNumber, toCurrencyAmount, toEvmChainId, toULNv2, tryFromEvmChainId, tryGetBlockExplorer, tryGetNetwork, tryParseCurrencyAmount, tryParseFraction, tryParseNumber, tryParsePercent, validateAndParseAddress, waitFor };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.mjs.map