export interface Artwork {
    name: string,
    price: string,
    amount: number,
    mint:number,
    compressed: Uint8Array,
    inputLength: number
}