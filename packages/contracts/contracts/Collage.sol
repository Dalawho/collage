pragma solidity ^0.8.12;

// SPDX-License-Identifier: MIT
// Two storage slots for each 

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./ERC721G.sol";
//import "hardhat/console.sol";

interface IRender {
     function tokenURI(uint256 tokenId, ERC721G.LayerStruct[16] memory layerIds, address creator) external view returns (string memory); 
    function previewCollage(ERC721G.LayerStruct[16] memory layerIds) external view returns(string memory);
}

interface IPieces {
    function burn( address account, uint256 id, uint256 value) external;
    function getPriceAndBurn(uint16[16] calldata layerIds) external returns (uint256 totalPrice);
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
    error payRightAmount();

    IRender public render;
    IPieces public pieces;
    uint256 public COLLAGE_PRICE;


    function initialize() initializer public {
        __ERC721G_init("Collage", "CLG", 1, 30);
        __Ownable_init();
        COLLAGE_PRICE = 0.03 ether;
    }

    // Define the NFT Constant Params
    uint256 public constant maxSupply = 1000;

    function mint() public payable {
        if(totalSupply() + 1 > maxSupply) revert MaxSupplyReached();
        if(msg.value != COLLAGE_PRICE) revert payRightAmount();
        _mint(msg.sender, 1);
    }

    function addLayer(uint256 tokenId, uint8 layer, uint8 scale, uint8 xOffset, uint8 yOffset, uint16 layerId) public {
        if(msg.sender != _tokenData[tokenId].owner) revert notTokenOwner();
        pieces.burn(msg.sender, layerId, 1);
        tokenInfo[tokenId].layers[layer] = LayerStruct(scale, xOffset, yOffset, layerId);
        emit MetadataUpdate(tokenId);
    }

    function mintAndSet(uint16[MAX_LAYERS] calldata layerIds, uint8[MAX_LAYERS] calldata scales, uint8[MAX_LAYERS] calldata xOffsets, uint8[MAX_LAYERS] calldata yOffsets) public payable {
        if(totalSupply() + 1 > maxSupply) revert MaxSupplyReached();
        //if(ERC721G._balanceData[msg.sender].mintedAmount + amount_ > maxPerWallet) revert maxMintsPerWallet();
        //check mint amount
        if(msg.value != COLLAGE_PRICE) revert payRightAmount();
        for(uint8 i; i < MAX_LAYERS; i++) {
            if(layerIds[i] > 0) pieces.burn(msg.sender, layerIds[i], 1);
        }
        _mintAndSet(msg.sender, 1, layerIds, scales, xOffsets, yOffsets);
    }

    function mintAndBuy(uint16[MAX_LAYERS] calldata layerIds, uint8[MAX_LAYERS] calldata scales, uint8[MAX_LAYERS] calldata xOffsets, uint8[MAX_LAYERS] calldata yOffsets) public payable {
        if(totalSupply() + 1 > maxSupply) revert MaxSupplyReached();
        //if(ERC721G._balanceData[msg.sender].mintedAmount + amount_ > maxPerWallet) revert maxMintsPerWallet();
        //check mint amount

        //get total price for pieces and increase mint counter without minting them to an addr
        uint256 totalPrice = pieces.getPriceAndBurn(layerIds);
        if(msg.value != (totalPrice + COLLAGE_PRICE)) revert payRightAmount();
        
        _mintAndSet(msg.sender, 1, layerIds, scales, xOffsets, yOffsets);
    }

        ////////////////////////  Set external contract addresses /////////////////////////////////

    function setRender( address _newRender) public onlyOwner {
        render = IRender(_newRender);
    }

    function setPieces( address _newPieces) public onlyOwner {
        pieces = IPieces(_newPieces);
    }

    function setCollagePrice(uint256 _newCollagePrice) external onlyOwner {
        COLLAGE_PRICE = _newCollagePrice;
    }

    ////////////////////////  TokenURI /////////////////////////////////

    function tokenURI(uint256 tokenId) override public view returns (string memory) { 
        return render.tokenURI(tokenId, tokenInfo[tokenId].layers, tokenInfo[tokenId].creator);
    }

    function previewTokenCollage(uint256 tokenId, uint8 layerNr, uint8 scale, uint8 xOffset, uint8 yOffset, uint8 pieceId) public view returns (string memory) { 
        LayerStruct[MAX_LAYERS] memory _tokenLayers = tokenInfo[tokenId].layers;
        _tokenLayers[layerNr] = LayerStruct(scale, xOffset, yOffset, pieceId);
        return render.previewCollage(_tokenLayers);
    }

    function previewCollage(uint16[MAX_LAYERS] memory pieceIds, uint8[MAX_LAYERS] memory scale, uint8[MAX_LAYERS] memory xOffsets, uint8[MAX_LAYERS] memory yOffsets) public view returns (string memory) { 
        LayerStruct[MAX_LAYERS] memory _layers;// = new LayerStruct[](MAX_LAYERS);
        for(uint8 i; i < MAX_LAYERS; i++) {
            if(pieceIds[i] > 0) _layers[i] = LayerStruct(scale[i], xOffsets[i], yOffsets[i], pieceIds[i]);
        }
        return render.previewCollage(_layers);
    }
}