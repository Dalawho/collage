export interface Artwork {
    name: string,
    price: string,
    amount: number,
    mint:number,
    compressed: Uint8Array,
    inputLength: number,
    xSize: number,
    ySize: number,
    royaltyReciever: string,
    mintTo: string,
    collection: string,
    category: string,
    royalties: number,
    maxPerWallet: number,
    imageType: number
}