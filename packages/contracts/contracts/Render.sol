// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import '@openzeppelin/contracts/access/Ownable.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
import "./SSTORE2.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import '@divergencetech/ethier/contracts/utils/DynamicBuffer.sol';
import './interfaces/IExquisiteGraphics.sol';
import "hardhat/console.sol";

interface IInflator {
    function puff(bytes memory source, uint256 destlen) external pure returns (uint8, bytes memory);
}

contract Render is Ownable {
    using Strings for uint256;
    using Strings for uint8;
    using DynamicBuffer for bytes;

    IExquisiteGraphics public gfx;
    IInflator public inflateLib;
    address public pieces;

    struct Trait {
        address data;
        uint16 destLen;
        string name;
    }

    Trait[] traits;

    error tokenDoesntExists();
    error onlyPiecesCanAddTokens();

    constructor() { 
        traits.push(Trait(address(0), 0, ""));
      }

    ////////////////////////  Set external contract addresses /////////////////////////////////

    function setGfx( address newGfx) public onlyOwner {
        gfx = IExquisiteGraphics(newGfx);
    }

    function setInflator( address newInflate) public onlyOwner {
        inflateLib = IInflator(newInflate);
    }

    function setPieces( address _newPieces) public onlyOwner {
        pieces = _newPieces;
    }

    ////////////////////////  Upload and set data for traits, palletes and animals  /////////////////////////////////

    function addToken(bytes memory _data, uint16 destLen, string memory name) external {
        if(msg.sender != pieces) revert onlyPiecesCanAddTokens();
        traits.push(Trait(SSTORE2.write(_data), destLen, name));
    }

    ////////////////////////  TokenURI /////////////////////////////////

     function tokenURI(uint256 tokenId) external view returns (string memory) { 

        Trait memory _currentTrait = traits[tokenId];

        string memory _outString = string.concat('data:application/json,', '{', '"name" : "' , _currentTrait.name, '", ',
            '"description" : "A piece that can be combined"');
        
        //console.log("attributes written");
        bytes memory buffer = DynamicBuffer.allocate(2**18);
        _getOneSVG(_currentTrait, buffer);
        buffer.appendSafe('</svg>');
        _outString = string.concat(_outString,',"image": "data:image/svg+xml;base64,',
            Base64.encode(buffer),'"}');
        return _outString; 
    }

    function tokenURI(uint256 tokenId, uint16[4] memory tokenIds) external view returns (string memory) { 
        uint8 numberOfLayers = 0;
        Trait[] memory _traits = new Trait[](tokenIds.length);
        for(uint256 i = 0; i < tokenIds.length; i++) {
            _traits[i] = traits[tokenIds[i]];
            if(tokenIds[i] != 0) numberOfLayers++; 
        }

        string memory _outString = string.concat('data:application/json,', '{', '"name" : "Collage #' , Strings.toString(tokenId), '", ',
            '"description" : "A piece that can be combined"');
        
        _outString = string.concat(_outString, ',"attributes":[');
        for(uint8 i = 0; i < _traits.length; i++) {
            if(_traits[i].data == address(0)) continue;
            if(i > 1) _outString = string.concat(_outString,',');
              _outString = string.concat(
              _outString,
             '{"trait_type":"Layer #',
              Strings.toString(i),
              '","value":"',
              _traits[i].name,
              '"}'
          );
        }
        _outString = string.concat(_outString, ']');

        if(numberOfLayers != 0) {
            _outString = string.concat(_outString,',"image": "data:image/svg+xml;base64,',
                Base64.encode(_drawTraits(_traits)));
        }
        _outString = string.concat(_outString,'"}');
        return _outString; 
    }

    function previewCollage(uint16[4] memory tokenIds, uint256 pieceId, uint256 layerNr) external view returns(string memory) {
        uint8 numberOfLayers = 0;
        Trait[] memory _traits = new Trait[](tokenIds.length);
        for(uint256 i = 0; i < tokenIds.length; i++) {
            _traits[i] = traits[tokenIds[i]];
            if(tokenIds[i] != 0) numberOfLayers++; 
        }
        _traits[layerNr] = traits[pieceId];
        bytes memory buffer = DynamicBuffer.allocate(2**18);
        buffer.appendSafe(bytes('<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" version="1.1" viewBox="0 0 21 21" width="315" height="315"> '));

        for(uint256 i = 0; i < _traits.length; i++) {
            if(_traits[i].data == address(0)) continue;
            _renderTrait(_traits[i], buffer);
        }
        buffer.appendSafe('</svg>');
        return string(buffer);
    }

    ////////////////////////  Full SVG functions /////////////////////////////////

    function _drawTraits(Trait[] memory _traits) internal view returns(bytes memory) {
            bytes memory buffer = DynamicBuffer.allocate(2**18);
            buffer.appendSafe(bytes('<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" version="1.1" viewBox="0 0 21 21" width="315" height="315"> '));

            for(uint256 i = 0; i < _traits.length; i++) {
                if(_traits[i].data == address(0)) continue;
                _renderTrait(_traits[i], buffer);
            }
            buffer.appendSafe('</svg>');
            return buffer;
    }

    function _getOneSVG(Trait memory _currentTrait, bytes memory buffer) internal view {
        buffer.appendSafe(bytes('<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" version="1.1" viewBox="0 0 21 21" width="315" height="315"> '));
        _renderTrait(_currentTrait, buffer);
    }

    function getSVGForBytes(bytes memory data) public view returns(string memory) {
        bytes memory buffer = DynamicBuffer.allocate(2**18);
        buffer.appendSafe(bytes('<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" version="1.1" viewBox="0 0 21 21" width="315" height="315"> '));
         bytes3[] memory out = new bytes3[](0);
        buffer.appendSafe(gfx.drawPixels(data,IExquisiteGraphics.Palette(out, IExquisiteGraphics.PaletteTypes.none),0,0,0));   
        buffer.appendSafe('</svg>');
        return string(buffer);
    }

    // ////////////////////////  SVG helper functions /////////////////////////////////

    function _renderTrait(Trait memory _currentTrait, bytes memory buffer) internal view {
        (, bytes memory _toDecode) = inflateLib.puff(SSTORE2.read(_currentTrait.data), _currentTrait.destLen);
        bytes memory _decoded = abi.decode(_toDecode, (bytes));
        bytes3[] memory out = new bytes3[](0);
        buffer.appendSafe(gfx.drawPixels(_decoded,IExquisiteGraphics.Palette(out, IExquisiteGraphics.PaletteTypes.none),0,0,0));   
    }
}
