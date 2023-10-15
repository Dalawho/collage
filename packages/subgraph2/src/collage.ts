import {
  MetadataUpdate,
  Transfer,
  Collage
} from "../generated/Collage/Collage"
import {
  CollageToken
} from "../generated/schema"

export function handleMetadataUpdate(event: MetadataUpdate): void {
  const contract = Collage.bind(event.address);

  let token = CollageToken.load(event.params._tokenId.toString());
  if (token == null) {
    token = new CollageToken(event.params._tokenId.toString());
  }
  let tokenURI = contract.try_tokenURI(event.params._tokenId);
  if ( !tokenURI.reverted ) {
    token.tokenURI = tokenURI.value;
  } else {
    token.tokenURI = "URIcall fail";
  }
  token.save();
}

export function handleTransfer(event: Transfer): void {
  const contract = Collage.bind(event.address);

  let token = CollageToken.load(event.params.tokenId.toString());
  if (token == null) {
    token = new CollageToken(event.params.tokenId.toString());
  }
  token.owner = event.params.to;
  let tokenURI = contract.try_tokenURI(event.params.tokenId);
  if ( !tokenURI.reverted ) {
    token.tokenURI = tokenURI.value;
  } else {
    token.tokenURI = "URIcall fail";
  }
  token.save();
}