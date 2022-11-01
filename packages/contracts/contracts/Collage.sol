pragma solidity ^0.8.12;

// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./ERC721G.sol";
//import "hardhat/console.sol";

interface IRender {
     function tokenURI(uint256 tokenId, ERC721G.LayerStruct[4] memory layerIds) external view returns (string memory); 
    function previewCollage(ERC721G.LayerStruct[4] memory layerIds) external view returns(string memory);
}

interface IPieces {
    function burn( address account, uint256 id, uint256 value) external;
}

contract Collage is ERC721G, OwnableUpgradeable {

    event MetadataUpdate(uint256 _tokenId);

    error MaxSupplyReached();
    error mintNotStarted();
    error maxMintsPerWallet();
    error notAValidSender();
    error maxFreeClaimed();
    error notTokenOwner();
    error onlyMinter();

    IRender public render;
    IPieces public pieces;

    function initialize() initializer public {
        __ERC721G_init("Collage", "CLG", 1, 30);
        __Ownable_init();
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
        emit MetadataUpdate(tokenId);
    }

    function mintAndSet(uint8[4] calldata layerIds, uint8[4] calldata xOffsets, uint8[4] calldata yOffsets) public payable {
        if(totalSupply() + 1 > maxSupply) revert MaxSupplyReached();
        //if(ERC721G._balanceData[msg.sender].mintedAmount + amount_ > maxPerWallet) revert maxMintsPerWallet();
        //check mint amount
        for(uint8 i; i < 4; i++) {
            if(layerIds[i] > 0) pieces.burn(msg.sender, layerIds[i], 1);
        }
        _mintAndSet(msg.sender, 1, layerIds, xOffsets, yOffsets);
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

    function previewTokenCollage(uint256 tokenId, uint8 layerNr, uint8 pieceId, uint8 xOffset, uint8 yOffset) public view returns (string memory) { 
        LayerStruct[4] memory _tokenLayers = _getTokenDataOf(tokenId).layers;
        _tokenLayers[layerNr] = LayerStruct(pieceId, xOffset, yOffset);
        return render.previewCollage(_tokenLayers);
    }

    function previewCollage(uint8[4] memory pieceIds, uint8[4] memory xOffsets, uint8[4] memory yOffsets) public view returns (string memory) { 
        return render.previewCollage([LayerStruct(pieceIds[0], xOffsets[0], yOffsets[0]), LayerStruct(pieceIds[1], xOffsets[1], yOffsets[1]), LayerStruct(pieceIds[2], xOffsets[2], yOffsets[2]), LayerStruct(pieceIds[3], xOffsets[3], yOffsets[3])]);
    }
}