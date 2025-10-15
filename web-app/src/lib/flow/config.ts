import * as fcl from "@onflow/fcl"

const FLOW_NETWORK = process.env.NEXT_PUBLIC_FLOW_NETWORK || "testnet"

// Contract addresses
const CONTRACTS = {
  testnet: {
    PredictionMarket: "0x7ee75d81c7229a61", // Replace with your deployed address
    PredictionActions: "0x7ee75d81c7229a61",
    NFTBattle: "0x7ee75d81c7229a61",
    AchievementNFT: "0x7ee75d81c7229a61",
    FlowToken: "0x7e60df042a9c0868",
    FungibleToken: "0x9a0766d93b6608b7",
    NonFungibleToken: "0x631e88ae7f1d7c20",
  },
  mainnet: {
    PredictionMarket: "0x", // TBD
    PredictionActions: "0x",
    NFTBattle: "0x",
    AchievementNFT: "0x",
    FlowToken: "0x1654653399040a61",
    FungibleToken: "0xf233dcee88fe0abe",
    NonFungibleToken: "0x1d7e57aa55817448",
  },
  emulator: {
    PredictionMarket: "0xf8d6e0586b0a20c7",
    PredictionActions: "0xf8d6e0586b0a20c7",
    NFTBattle: "0xf8d6e0586b0a20c7",
    AchievementNFT: "0xf8d6e0586b0a20c7",
    FlowToken: "0x0ae53cb6e3f42a79",
    FungibleToken: "0xee82856bf20e2aa6",
    NonFungibleToken: "0xf8d6e0586b0a20c7",
  },
}

// Configure FCL
fcl.config({
  "app.detail.title": "FlowBattle",
  "app.detail.description": "Swipe. Predict. Battle. Win.",
  "app.detail.icon": "https://flowbattle.app/logo.png",
  "flow.network": FLOW_NETWORK,
  "accessNode.api":
    FLOW_NETWORK === "mainnet"
      ? "https://rest-mainnet.onflow.org"
      : FLOW_NETWORK === "testnet"
        ? "https://rest-testnet.onflow.org"
        : "http://localhost:8888",
  "discovery.wallet":
    FLOW_NETWORK === "mainnet"
      ? "https://fcl-discovery.onflow.org/authn"
      : "https://fcl-discovery.onflow.org/testnet/authn",
  "discovery.authn.endpoint":
    FLOW_NETWORK === "mainnet"
      ? "https://fcl-discovery.onflow.org/api/authn"
      : "https://fcl-discovery.onflow.org/api/testnet/authn",
})

// Export contract addresses
export const getContractAddress = (contractName: keyof (typeof CONTRACTS)["testnet"]) => {
  return CONTRACTS[FLOW_NETWORK as keyof typeof CONTRACTS][contractName]
}

export { fcl }
export type FlowNetwork = keyof typeof CONTRACTS
