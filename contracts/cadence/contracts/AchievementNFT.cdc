import NonFungibleToken from "NonFungibleToken"
import MetadataViews from "MetadataViews"
import ViewResolver from "ViewResolver"

/// AchievementNFT - Soulbound (non-transferable) achievement NFTs
access(all) contract AchievementNFT: NonFungibleToken {
    
    access(all) event ContractInitialized()
    access(all) event Withdraw(id: UInt64, from: Address?)
    access(all) event Deposit(id: UInt64, to: Address?)
    access(all) event AchievementMinted(id: UInt64, recipient: Address, achievementType: String)
    
    access(all) let CollectionStoragePath: StoragePath
    access(all) let CollectionPublicPath: PublicPath
    access(all) let MinterStoragePath: StoragePath
    
    access(all) var totalSupply: UInt64
    
    access(all) struct AchievementMetadata {
        access(all) let achievementType: String
        access(all) let name: String
        access(all) let description: String
        access(all) let tier: String
        access(all) let unlockedAt: UFix64
        
        init(achievementType: String, name: String, description: String, tier: String) {
            self.achievementType = achievementType
            self.name = name
            self.description = description
            self.tier = tier
            self.unlockedAt = getCurrentBlock().timestamp
        }
    }
    
    access(all) resource NFT: NonFungibleToken.NFT {
        access(all) let id: UInt64
        access(all) let metadata: AchievementMetadata
        
        init(id: UInt64, metadata: AchievementMetadata) {
            self.id = id
            self.metadata = metadata
        }
        
        access(all) view fun getViews(): [Type] {
            return [Type<MetadataViews.Display>()]
        }
        
        access(all) fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: self.metadata.name,
                        description: self.metadata.description,
                        thumbnail: MetadataViews.HTTPFile(url: "https://flowbattle.app/achievements/".concat(self.metadata.achievementType).concat(".png"))
                    )
            }
            return nil
        }
        
        access(all) fun createEmptyCollection(): @{NonFungibleToken.Collection} {
            return <-AchievementNFT.createEmptyCollection(nftType: Type<@AchievementNFT.NFT>())
        }
    }
    
    access(all) resource interface AchievementCollectionPublic {
        access(all) view fun getIDs(): [UInt64]
        access(all) view fun borrowNFT(_ id: UInt64): &{NonFungibleToken.NFT}?
        access(all) fun borrowAchievement(id: UInt64): &AchievementNFT.NFT?
    }
    
    access(all) resource Collection: AchievementCollectionPublic, NonFungibleToken.Collection {
        access(all) var ownedNFTs: @{UInt64: {NonFungibleToken.NFT}}
        
        init() {
            self.ownedNFTs <- {}
        }
        
        access(NonFungibleToken.Withdraw) fun withdraw(withdrawID: UInt64): @{NonFungibleToken.NFT} {
            panic("Achievements are soulbound and cannot be transferred")
        }
        
        access(all) fun deposit(token: @{NonFungibleToken.NFT}) {
            let token <- token as! @AchievementNFT.NFT
            let id = token.id
            self.ownedNFTs[id] <-! token
            emit Deposit(id: id, to: self.owner?.address)
        }
        
        access(all) view fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }
        
        access(all) view fun borrowNFT(_ id: UInt64): &{NonFungibleToken.NFT}? {
            return &self.ownedNFTs[id]
        }
        
        access(all) fun borrowAchievement(id: UInt64): &AchievementNFT.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = &self.ownedNFTs[id] as &{NonFungibleToken.NFT}?
                return ref as! &AchievementNFT.NFT
            }
            return nil
        }
        
        access(all) view fun getSupportedNFTTypes(): {Type: Bool} {
            return {Type<@AchievementNFT.NFT>(): true}
        }
        
        access(all) view fun isSupportedNFTType(type: Type): Bool {
            return type == Type<@AchievementNFT.NFT>()
        }
        
        access(all) fun createEmptyCollection(): @{NonFungibleToken.Collection} {
            return <-AchievementNFT.createEmptyCollection(nftType: Type<@AchievementNFT.NFT>())
        }
    }
    
    access(all) fun createEmptyCollection(nftType: Type): @{NonFungibleToken.Collection} {
        return <-create Collection()
    }
    
    access(all) resource Minter {
        access(all) fun mintAchievement(recipient: &{NonFungibleToken.Receiver}, achievementType: String, name: String, description: String, tier: String) {
            let metadata = AchievementMetadata(achievementType: achievementType, name: name, description: description, tier: tier)
            let nft <- create NFT(id: AchievementNFT.totalSupply, metadata: metadata)
            let id = nft.id
            
            recipient.deposit(token: <-nft)
            
            AchievementNFT.totalSupply = AchievementNFT.totalSupply + 1
            emit AchievementMinted(id: id, recipient: recipient.owner!.address, achievementType: achievementType)
        }
    }
    
    init() {
        self.totalSupply = 0
        self.CollectionStoragePath = /storage/AchievementNFTCollection
        self.CollectionPublicPath = /public/AchievementNFTCollection
        self.MinterStoragePath = /storage/AchievementNFTMinter
        
        let minter <- create Minter()
        self.account.storage.save(<-minter, to: self.MinterStoragePath)
        
        emit ContractInitialized()
    }
}
