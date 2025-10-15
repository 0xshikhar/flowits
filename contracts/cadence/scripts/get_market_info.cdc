import PredictionMarket from "PredictionMarket"

access(all) fun main(marketId: UInt64): PredictionMarket.MarketInfo? {
    return PredictionMarket.getMarketInfo(marketId: marketId)
}
