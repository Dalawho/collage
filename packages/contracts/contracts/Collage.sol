pragma solidity ^0.8.12;

// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ERC721G.sol";
import "hardhat/console.sol";

interface IRender {
     function tokenURI(uint256 tokenId, ERC721G.LayerStruct[4] memory layerIds) external view returns (string memory); 
    function previewCollage(ERC721G.LayerStruct[4] memory layerIds, uint8 layerNr, ERC721G.LayerStruct memory newLayer) external view returns(string memory);
}

interface IPieces {
    function burn( address account, uint256 id, uint256 value) external;
}

contract Collage is ERC721G, Ownable {

    error MaxSupplyReached();
    error mintNotStarted();
    error maxMintsPerWallet();
    error notAValidSender();
    error maxFreeClaimed();
    error notTokenOwner();
    error onlyMinter();

    IRender public render;
    IPieces public pieces;

    // Set the base ERC721G Constructor
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() ERC721G("Collage", "CLG", 1, 30) {

    }

    // Define the NFT Constant Params
    uint256 public constant maxSupply = 1000;

    function mint() public payable {
        if(totalSupply() + 1 > maxSupply) revert MaxSupplyReached();
        _mint(msg.sender, 1);
    }

    function addLayer(uint256 tokenId, uint8 layer, uint8 layerId, uint8 xOffset, uint8 yOffset) public {
        if(msg.sender != _tokenData[tokenId].owner) revert notTokenOwner();
        pieces.burn(msg.sender, layerId, 1);
        _tokenData[tokenId].layers[layer] = LayerStruct(layerId, xOffset, yOffset);
    }

    function mintAndSet(uint8 layer, uint8 layerId, uint8 xOffset, uint8 yOffset) public payable {
        if(totalSupply() + 1 > maxSupply) revert MaxSupplyReached();
        //if(ERC721G._balanceData[msg.sender].mintedAmount + amount_ > maxPerWallet) revert maxMintsPerWallet();
        //check mint amount
        //addLayer(ERC721G.tokenIndex, layerId, layer);
        _mintAndSet(msg.sender, 1, layer, layerId, xOffset, yOffset);
        pieces.burn(msg.sender, layerId, 1);
    }

        ////////////////////////  Set external contract addresses /////////////////////////////////

    function setRender( address _newRender) public onlyOwner {
        render = IRender(_newRender);
    }

    function setPieces( address _newPieces) public onlyOwner {
        pieces = IPieces(_newPieces);
    }

    ////////////////////////  TokenURI /////////////////////////////////

    function tokenURI(uint256 tokenId) override public view returns (string memory) { 
        return render.tokenURI(tokenId, _getTokenDataOf(tokenId).layers);
    }

    function previewCollage(uint256 tokenId, uint8 layerNr, uint8 pieceId, uint8 xOffset, uint8 yOffset) public view returns (string memory) { 
        return render.previewCollage(_getTokenDataOf(tokenId).layers, layerNr, LayerStruct(pieceId, xOffset, yOffset));
    }
}