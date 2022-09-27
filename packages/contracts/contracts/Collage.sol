pragma solidity ^0.8.12;

// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ERC721G.sol";
import "hardhat/console.sol";

interface IRender {
     function tokenURI(uint256 tokenId, uint16[4] memory tokenIds) external view returns (string memory); 
    function previewCollage(uint16[4] memory tokenIds, uint256 pieceId, uint256 layerNr) external view returns(string memory);
}

interface IPieces {
        function burn(
        address account,
        uint256 id,
        uint256 value
    ) external;
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
    uint256 public allowListSupply = 500;
    uint256 public publicSupply = 500; 

    function mint() public payable {
        if(totalSupply() + 1 > maxSupply) revert MaxSupplyReached();
        //if(ERC721G._balanceData[msg.sender].mintedAmount + amount_ > maxPerWallet) revert maxMintsPerWallet();
        //check mint amount
        _mint(msg.sender, 1);
        //burn ERC5511
        //pieces.burn(msg.sender, )
    }

    function addLayer(uint256 tokenId, uint16 layerId, uint8 layer) public {
        pieces.burn(msg.sender, layerId, 1);
        _tokenData[tokenId].layers[layer] = layerId;
    }

    function mintAndSet(uint16 layerId, uint8 layer) public payable {
        if(totalSupply() + 1 > maxSupply) revert MaxSupplyReached();
        //if(ERC721G._balanceData[msg.sender].mintedAmount + amount_ > maxPerWallet) revert maxMintsPerWallet();
        //check mint amount
        //addLayer(ERC721G.tokenIndex, layerId, layer);
        _mintAndSet(msg.sender, 1, layerId, layer);
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

    function previewCollage(uint256 tokenId, uint256 pieceId, uint256 layerNr) public view returns (string memory) { 
        return render.previewCollage(_getTokenDataOf(tokenId).layers, pieceId, layerNr);
    }
}