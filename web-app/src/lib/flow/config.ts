import * as fcl from "@onflow/fcl"

const FLOW_NETWORK = process.env.NEXT_PUBLIC_FLOW_NETWORK || "testnet"
//const FLOW_NETWORK = (process.env.NEXT_PUBLIC_FLOW_NETWORK || "emulator") as FlowNetwork


// Contract addresses
const CONTRACTS = {
  testnet: {
    PredictionMarket: "0x7782fffb2efed309",
    PredictionActions: "0x7782fffb2efed309",
    NFTBattle: "0x7782fffb2efed309",
    AchievementNFT: "0x7782fffb2efed309",
    ExampleConnectors: "0x7782fffb2efed309",
    FlowToken: "0x7e60df042a9c0868",
    FungibleToken: "0x9a0766d93b6608b7",
    NonFungibleToken: "0x631e88ae7f1d7c20",
  },
  mainnet: {
    PredictionMarket: "0x",
    PredictionActions: "0x",
    NFTBattle: "0x",
    AchievementNFT: "0x",
    ExampleConnectors: "0x",
    FlowToken: "0x1654653399040a61",
    FungibleToken: "0xf233dcee88fe0abe",
    NonFungibleToken: "0x1d7e57aa55817448",
  },
  emulator: {
    PredictionMarket: "0xf8d6e0586b0a20c7",
    PredictionActions: "0xf8d6e0586b0a20c7",
    NFTBattle: "0xf8d6e0586b0a20c7",
    AchievementNFT: "0xf8d6e0586b0a20c7",
    ExampleConnectors: "0xf8d6e0586b0a20c7",
    FlowToken: "0x0ae53cb6e3f42a79",
    FungibleToken: "0xee82856bf20e2aa6",
    NonFungibleToken: "0xf8d6e0586b0a20c7",
  },
} as const

export type FlowNetwork = keyof typeof CONTRACTS

// Configure FCL
if (typeof window !== 'undefined') {
  const accessNodeApi = 
    FLOW_NETWORK === "mainnet"
      ? "https://rest-mainnet.onflow.org"
      : FLOW_NETWORK === "testnet"
        ? "https://rest-testnet.onflow.org"
        : "http://localhost:8888"

  const discoveryWallet = FLOW_NETWORK === "mainnet" 
    ? "https://fcl-discovery.onflow.org/authn"
    : "https://fcl-discovery.onflow.org/testnet/authn"
  
  const discoveryAuthnEndpoint = FLOW_NETWORK === "mainnet"
    ? "https://fcl-discovery.onflow.org/api/authn"
    : "https://fcl-discovery.onflow.org/api/testnet/authn"

  fcl.config()
    .put("app.detail.title", "Moments - Sports Prediction Markets")
    .put("app.detail.description", "Swipe. Predict. Battle. Win.")
    .put("app.detail.icon", "https://i.imgur.com/ux3lYB9.png")
    .put("flow.network", FLOW_NETWORK)
    .put("accessNode.api", accessNodeApi)
    .put("fcl.limit", 9999)
    .put("discovery.wallet", discoveryWallet)
    .put("discovery.authn.endpoint", discoveryAuthnEndpoint)
    .put("discovery.authn.include", [])
    .put("challenge.handshake", discoveryWallet)
    .put('walletconnect.projectId', 'BDMpT0l7Iq0IXVYYAMQZtbBBF_Ey4Tu6es2i8fkhCRYRc9c0jpawZFLOH1wkdTN_S31hHNY4I7F9nEHlE_0SCC8')
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🌊 Flow Network:', FLOW_NETWORK)
    console.log('🔧 Access Node:', accessNodeApi)
  }
}

// Export contract addresses
export const getContractAddress = (contractName: keyof (typeof CONTRACTS)["testnet"]) => {
  return CONTRACTS[FLOW_NETWORK as keyof typeof CONTRACTS][contractName]
}

export const FLOW_NETWORK_NAME = FLOW_NETWORK

export { fcl }
