import Test
import BlockchainHelpers
import "PredictionMarket"
import "FlowToken"
import "FungibleToken"

access(all) let admin = Test.getAccount(0x0000000000000007)
access(all) let alice = Test.createAccount()
access(all) let bob = Test.createAccount()

access(all) fun setup() {
    let err = Test.deployContract(
        name: "PredictionMarket",
        path: "../contracts/PredictionMarket.cdc",
        arguments: []
    )
    Test.expect(err, Test.beNil())
}

access(all) fun testCreateMarket() {
    let futureTime = getCurrentBlock().timestamp + 3600.0
    
    let txResult = executeTransaction(
        "../transactions/create_market.cdc",
        ["Will this test pass?", futureTime, 1.0, 5.0],
        admin
    )
    
    Test.expect(txResult, Test.beSucceeded())
    
    // Verify market was created
    let marketInfo = executeScript(
        "../scripts/get_market_info.cdc",
        [0 as UInt64]
    )
    
    Test.expect(marketInfo, Test.not(Test.beNil()))
}

access(all) fun testPlacePrediction() {
    // Setup: Create market first
    let futureTime = getCurrentBlock().timestamp + 3600.0
    executeTransaction(
        "../transactions/create_market.cdc",
        ["Will Alice win?", futureTime, 1.0, 5.0],
        admin
    )
    
    // Mint FLOW tokens to Alice
    mintFlow(alice, 100.0)
    
    // Alice places prediction
    let txResult = executeTransaction(
        "../transactions/place_prediction.cdc",
        [0 as UInt64, "yes", 10.0],
        alice
    )
    
    Test.expect(txResult, Test.beSucceeded())
}

access(all) fun testPlacePredictionViaAction() {
    let futureTime = getCurrentBlock().timestamp + 3600.0
    executeTransaction(
        "../transactions/create_market.cdc",
        ["Will Flow Actions work?", futureTime, 1.0, 5.0],
        admin
    )
    
    mintFlow(bob, 100.0)
    
    let txResult = executeTransaction(
        "../transactions/place_prediction_via_action.cdc",
        [0 as UInt64, "yes", 5.0],
        bob
    )
    
    Test.expect(txResult, Test.beSucceeded())
}

access(all) fun testResolveAndClaimWinnings() {
    // Create market
    let futureTime = getCurrentBlock().timestamp + 1.0
    executeTransaction(
        "../transactions/create_market.cdc",
        ["Test market", futureTime, 1.0, 5.0],
        admin
    )
    
    // Place predictions
    mintFlow(alice, 100.0)
    mintFlow(bob, 100.0)
    
    executeTransaction(
        "../transactions/place_prediction.cdc",
        [0 as UInt64, "yes", 10.0],
        alice
    )
    
    executeTransaction(
        "../transactions/place_prediction.cdc",
        [0 as UInt64, "no", 5.0],
        bob
    )
    
    // Wait for market to close
    Test.moveTime(by: 2.0)
    
    // Resolve market (admin only)
    let resolveResult = executeTransaction(
        "../transactions/resolve_market.cdc",
        [0 as UInt64, "yes"],
        admin
    )
    
    Test.expect(resolveResult, Test.beSucceeded())
    
    // Alice claims winnings
    let claimResult = executeTransaction(
        "../transactions/claim_winnings.cdc",
        [0 as UInt64],
        alice
    )
    
    Test.expect(claimResult, Test.beSucceeded())
}

// Helper functions
access(all) fun mintFlow(_ account: Test.TestAccount, _ amount: UFix64) {
    // Note: In actual tests, use Test framework's built-in token minting
    // This is a placeholder for the test structure
}

access(all) fun executeTransaction(_ path: String, _ args: [AnyStruct], _ signer: Test.TestAccount): Test.TransactionResult {
    let code = Test.readFile(path)
    let tx = Test.Transaction(
        code: code,
        authorizers: [signer.address],
        signers: [signer],
        arguments: args
    )
    return Test.executeTransaction(tx)
}

access(all) fun executeScript(_ path: String, _ args: [AnyStruct]): AnyStruct? {
    let code = Test.readFile(path)
    return Test.executeScript(code, args)
}
