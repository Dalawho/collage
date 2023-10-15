import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  Pieces,
  ArtworkAdded,
  TransferBatch,
  TransferSingle,
  ArtworkAddedLayerStruct
} from "../generated/Pieces/Pieces"
import { Piece, Owner, OwnerPiece} from "../generated/schema"

export function handleTransferSingle(event: TransferSingle): void {
  //check if the address is already added to owners
  //let nullAddress = new Address(0);
  //implement proper handeling of the floating and minted parameters
  let piece = Piece.load(event.params.id.toString());

  if(event.params.to.toHex() != "0x0000000000000000000000000000000000000000") {
    let ownerCheck = Owner.load(event.params.to);
    if (ownerCheck == null) {
      ownerCheck = new Owner(event.params.to);
      ownerCheck.save();
    }

    let reciever = OwnerPiece.load(event.params.to.toHex() + '-' + (event.params.id.toString()));
    if (reciever == null) {
      reciever = new OwnerPiece(event.params.to.toHex() + '-' + (event.params.id.toString()));
      reciever.owner = event.params.to;
      reciever.amount = BigInt.fromI32(0);
      reciever.piece = event.params.id.toString();
    }
    reciever.amount = reciever.amount.plus(event.params.value);
    reciever.save();
  }
  else {
    if (piece != null) {
      //this does not look right, this hsould only be if we burn it. 
      piece.floating = piece.floating.minus(event.params.value);
      piece.save();
    }
  }
  if(event.params.from.toHex() == "0x0000000000000000000000000000000000000000") {
    if (piece != null) {
      piece.minted = piece.minted.plus(event.params.value);
      piece.floating = piece.floating.plus(event.params.value);
      piece.remaining = piece.remaining.minus(event.params.value);
      piece.save();
    }
  }
  else {
    let sender = OwnerPiece.load(event.params.from.toHex() + '-' + (event.params.id.toString()));
    if (sender != null) {
      sender.amount = sender.amount.minus(event.params.value);
      sender.save();
    }
  }
}

export function handleTransferBatch(event: TransferBatch): void {
    //check if the address is already added to owners
  // the pieces update is only updated in the single transfer atm, not the batch transfer 

    let ownerCheck = Owner.load(event.params.to);
    if (ownerCheck == null) {
      ownerCheck = new Owner(event.params.to);
      ownerCheck.save();
    }

  for(let i = 0; i < event.params.ids.length; i++) {
    let reciever = OwnerPiece.load(event.params.to.toString() + '-' + (event.params.ids[i].toString()));
    if (reciever == null) {
      reciever = new OwnerPiece(event.params.to.toString() + '-' + (event.params.ids[i].toString()));
      reciever.owner = event.params.to;
    }
    let sender = OwnerPiece.load(event.params.from.toString() + '-' + (event.params.ids[i].toString()));
    
    if (sender != null) {
      sender.amount = sender.amount.minus(event.params.values[i]);
      sender.save();
    }
    reciever.amount = reciever.amount.plus(event.params.values[i]);
    reciever.save();
  }
}

export function handleArtworkAdded(event: ArtworkAdded): void {
  const contract = Pieces.bind(event.address);

  let artwork = new Piece(event.params.id.toString());
  artwork.creator = event.params.layer.creator;
  artwork.price = event.params.layer.price;
  artwork.name = event.params.name.toString();
  artwork.maxSupply = BigInt.fromI32(event.params.layer.maxSupply);
  artwork.category = event.params.category.toString();
  artwork.collection = event.params.collection.toString();
  artwork.minted = BigInt.fromI32(event.params.layer.supplyMinted);
  artwork.maxPerWallet = BigInt.fromI32(event.params.layer.maxPerWallet);
  artwork.floating = BigInt.fromI32(event.params.layer.supplyMinted);
  artwork.remaining = BigInt.fromI32(event.params.layer.maxSupply - event.params.layer.supplyMinted);
  let tokenURI = contract.try_tokenURI(event.params.id);
  if ( !tokenURI.reverted ) {
    artwork.tokenURI = tokenURI.value;
  } else {
    artwork.tokenURI = "URIcall fail";
  }

  artwork.save();
}