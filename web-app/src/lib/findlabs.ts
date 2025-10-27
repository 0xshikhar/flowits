const FINDLABS_API = "https://prod-main-net-dashboard-api.azurewebsites.net"

export interface NFTCollection {
  id: string
  name: string
  count: number
  logo?: string
}

export interface NFTMetadata {
  id: string
  name: string
  description?: string
  image?: string
  collection: string
  traits?: Record<string, any>
}

export async function getNFTsByAddress(address: string): Promise<NFTCollection[]> {
  try {
    const response = await fetch(`${FINDLABS_API}/api/nfts/collections?address=${address}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data.collections || []
  } catch (error) {
    console.error("Error fetching NFTs from Find Labs:", error)
    return []
  }
}

export async function getNFTMetadata(collection: string, tokenId: string): Promise<NFTMetadata | null> {
  try {
    const response = await fetch(`${FINDLABS_API}/api/nfts/${collection}/${tokenId}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching NFT metadata from Find Labs:", error)
    return null
  }
}

export async function getAllNFTsForAddress(address: string): Promise<NFTMetadata[]> {
  try {
    const collections = await getNFTsByAddress(address)
    const allNFTs: NFTMetadata[] = []

    for (const collection of collections) {
      // Fetch up to 10 NFTs per collection for performance
      const nftPromises = Array.from({ length: Math.min(collection.count, 10) }, (_, i) => 
        getNFTMetadata(collection.id, `${i}`)
      )
      
      const nfts = await Promise.all(nftPromises)
      allNFTs.push(...nfts.filter((nft): nft is NFTMetadata => nft !== null))
    }

    return allNFTs
  } catch (error) {
    console.error("Error fetching all NFTs:", error)
    return []
  }
}
