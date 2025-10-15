import DeFiActions from "DeFiActions"
import FungibleToken from "FungibleToken"
import FlowToken from "FlowToken"
import PredictionMarket from "PredictionMarket"

/// PredictionActions - Flow Actions integration for composable prediction placement
/// Implements DeFiActions.Sink to enable predictions as part of larger DeFi workflows
access(all) contract PredictionActions {
    
    access(all) event PredictionActionCreated(marketId: UInt64, outcome: String, userAddress: Address)
    access(all) event PredictionExecuted(marketId: UInt64, userAddress: Address, amount: UFix64)
    
    /// PredictionSink - A DeFiActions.Sink that places predictions on markets
    /// This allows predictions to be composed with other DeFi actions
    access(all) struct PredictionSink: DeFiActions.Sink {
        access(contract) var uniqueID: DeFiActions.UniqueIdentifier?
        access(all) let marketId: UInt64
        access(all) let outcome: String
        access(all) let userAddress: Address
        
        init(marketId: UInt64, outcome: String, userAddress: Address, uniqueID: DeFiActions.UniqueIdentifier?) {
            self.marketId = marketId
            self.outcome = outcome
            self.userAddress = userAddress
            self.uniqueID = uniqueID
        }
        
        /// Returns the type of vault this sink accepts (FlowToken)
        access(all) view fun getSinkType(): Type {
            return Type<@FlowToken.Vault>()
        }
        
        /// Returns minimum capacity based on market's min stake
        access(all) fun minimumCapacity(): UFix64 {
            let marketInfo = PredictionMarket.getMarketInfo(marketId: self.marketId)
            return marketInfo?.minStake ?? 1.0
        }
        
        /// Deposits funds and places prediction
        access(all) fun depositCapacity(from: auth(FungibleToken.Withdraw) &{FungibleToken.Vault}) {
            pre {
                from.getType() == self.getSinkType(): "Invalid vault type - must be FlowToken"
            }
            
            let amount = from.balance
            if amount == 0.0 { return }
            
            let payment <- from.withdraw(amount: amount) as! @FlowToken.Vault
            
            // Place prediction on the market
            PredictionMarket.placePrediction(
                marketId: self.marketId,
                user: self.userAddress,
                outcome: self.outcome,
                payment: <-payment
            )
            
            emit PredictionExecuted(marketId: self.marketId, userAddress: self.userAddress, amount: amount)
        }
        
        /// Returns component metadata for DeFiActions graph inspection
        access(all) fun getComponentInfo(): DeFiActions.ComponentInfo {
            return DeFiActions.ComponentInfo(
                type: self.getType(),
                id: self.id(),
                innerComponents: []
            )
        }
        
        /// Implementation for UniqueIdentifier passthrough
        access(contract) view fun copyID(): DeFiActions.UniqueIdentifier? {
            return self.uniqueID
        }
        
        /// Allows framework to set/propagate UniqueIdentifier for tracing
        access(contract) fun setID(_ id: DeFiActions.UniqueIdentifier?) {
            self.uniqueID = id
        }
    }
    
    /// Create a new PredictionSink action
    /// This can be used standalone or composed with other DeFi actions
    access(all) fun createPredictionAction(marketId: UInt64, outcome: String, userAddress: Address): PredictionSink {
        let sink = PredictionSink(
            marketId: marketId,
            outcome: outcome,
            userAddress: userAddress,
            uniqueID: nil
        )
        
        emit PredictionActionCreated(marketId: marketId, outcome: outcome, userAddress: userAddress)
        return sink
    }
    
    /// Helper function to get market info
    access(all) fun getMarketInfo(marketId: UInt64): PredictionMarket.MarketInfo? {
        return PredictionMarket.getMarketInfo(marketId: marketId)
    }
}
