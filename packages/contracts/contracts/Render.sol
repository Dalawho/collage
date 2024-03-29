// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;


import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {StringsUpgradeable as Strings} from "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "./SSTORE2.sol";
import {Base64Upgradeable as Base64} from "@openzeppelin/contracts-upgradeable/utils/Base64Upgradeable.sol";
import '@divergencetech/ethier/contracts/utils/DynamicBuffer.sol';
import './interfaces/IExquisiteGraphics.sol';
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "hardhat/console.sol";

interface IInflator {
    function puff(bytes memory source, uint256 destlen) external pure returns (uint8, bytes memory);
}

interface IPieces {
    function getLayerData(uint256 tokenId) external view returns(Render.LayerInfo memory, address);
}

contract Render is Initializable, OwnableUpgradeable {
    using Strings for uint256;
    using Strings for uint8;
    using DynamicBuffer for bytes;

    IExquisiteGraphics public gfx;
    IInflator public inflateLib;
    address public pieces;
    uint256 public constant MAX_LAYERS = 8; 

    struct Trait {
        address data;
        uint16 destLen;
        string name;
    }
    
    struct LayerStruct {
        uint8 scale;
        uint8 xOffset;
        uint8 yOffset;
        uint16 layerId;
    }

    struct LayerInfo {
        address creator;
        uint8 maxSupply;
        uint8 supplyMinted;
        uint8 royalties;
        uint8 maxPerWallet;
        uint64 price;
    }

    Trait[] traits;

    error tokenDoesntExists();
    error onlyPiecesCanAddTokens();

    function initialize() initializer public {
        __Ownable_init();
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
        _outString = string.concat(_outString,',"image": "data:image/svg+xml;base64,',
            Base64.encode(_getOneSVG(_currentTrait)),'"}');
        return _outString; 
    }

    function tokenURI(uint256 tokenId, LayerStruct[MAX_LAYERS] memory layerIds) external view returns (string memory) { 
        uint8 numberOfLayers = 0;
        Trait[] memory _traits = new Trait[](layerIds.length);
        LayerInfo[] memory _layerInfos = new LayerInfo[](layerIds.length);
        for(uint256 i = 0; i < layerIds.length; i++) {
            _traits[i] = traits[layerIds[i].layerId];
            if(layerIds[i].layerId != 0) numberOfLayers++; 
        }

        string memory _outString = string.concat('data:application/json,', '{', '"name" : "Collage #' , Strings.toString(tokenId), '", ',
            '"description" : "A piece that can be combined"');
        
        _outString = string.concat(_outString, ',"attributes":[');
        for(uint8 i = 0; i < _traits.length; i++) {
            if(_traits[i].data == address(0)) continue;
            if(i > 0) _outString = string.concat(_outString,',');
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
                Base64.encode(_drawTraits(_traits, layerIds)), '"');
        }
        _outString = string.concat(_outString,'}');
        return _outString; 
    }

    function previewCollage(LayerStruct[MAX_LAYERS] memory layerIds) external view returns(string memory) {
        uint8 numberOfLayers = 0;
        Trait[] memory _traits = new Trait[](layerIds.length);
        for(uint256 i = 0; i < layerIds.length; i++) {
            _traits[i] = traits[layerIds[i].layerId];
            if(layerIds[i].layerId != 0) numberOfLayers++; 
        }
 
        bytes memory buffer = DynamicBuffer.allocate(2**18);
        uint8 height;
        uint8 width;
        uint8 tempHeight;
        uint8 tempWidth;
        for(uint256 i = 0; i < _traits.length; i++) {
            if(_traits[i].data == address(0)) continue;
            (tempHeight, tempWidth) = _renderTrait(_traits[i], layerIds[i], buffer);
            if(tempHeight+layerIds[i].yOffset > height) height = tempHeight+layerIds[i].yOffset;
            if(tempWidth+layerIds[i].xOffset > width) width = tempWidth+layerIds[i].xOffset;
           }
        buffer.appendSafe('</svg>');

        return string.concat('<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" version="1.1" viewBox="0 0 ', Strings.toString(width), ' ', Strings.toString(height),'" width="',Strings.toString(uint256(width)*10),'" height="',Strings.toString(uint256(height)*10),'"> ', string(buffer));
    }

    ////////////////////////  Full SVG functions /////////////////////////////////

    function _drawTraits(Trait[] memory _traits, LayerStruct[MAX_LAYERS] memory layerIds) internal view returns(bytes memory) {
            bytes memory buffer = DynamicBuffer.allocate(2**18);
            //buffer.appendSafe(bytes(string.concat('<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" version="1.1" viewBox="0 0 ', Strings.toString(height), ' ', Strings.toString(width),'" width="',Strings.toString(height*5),'" height="',Strings.toString(width*5),'"> ')));
            uint8 height;
            uint8 width;
            uint8 tempHeight;
            uint8 tempWidth;
            for(uint256 i = 0; i < _traits.length; i++) {
                if(_traits[i].data == address(0)) continue;
                (tempHeight, tempWidth) = _renderTrait(_traits[i], layerIds[i], buffer);
                if(tempHeight+layerIds[i].yOffset > height) height = tempHeight+layerIds[i].yOffset;
                if(tempWidth+layerIds[i].xOffset > width) width = tempWidth+layerIds[i].xOffset;
            }
            buffer.appendSafe('</svg>');
            return abi.encodePacked('<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" version="1.1" viewBox="0 0 ', Strings.toString(width), ' ', Strings.toString(height),'" width="',Strings.toString(uint256(width)*10),'" height="',Strings.toString(uint256(height)*10),'"> ', buffer);
    }

    function _getOneSVG(Trait memory _currentTrait) internal view returns (bytes memory) {
        bytes memory buffer = DynamicBuffer.allocate(2**18);
        (uint8 height, uint8 width) = _renderTrait(_currentTrait, LayerStruct(0,0,0,0), buffer);
        buffer.appendSafe('</svg>');
        return abi.encodePacked('<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" version="1.1" viewBox="0 0 ', Strings.toString(width), ' ', Strings.toString(height),'" width="',Strings.toString(uint256(width)*10),'" height="',Strings.toString(uint256(height)*10),'"> ', buffer);
    }

    function getSVGForBytes(bytes memory data) public view returns(string memory) {
        bytes memory buffer = DynamicBuffer.allocate(2**18);
        (uint8 height, uint8 width) = gfx.getDimensions(data);
        console.log("made it past dimensions");
        console.log(height);
        console.log(width);
        buffer.appendSafe(bytes(string.concat('<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" version="1.1" viewBox="0 0 ', Strings.toString(width), ' ', Strings.toString(height),'" width="',Strings.toString(uint256(width)*10),'" height="',Strings.toString(uint256(height)*10),'"> ')));
        bytes3[] memory out = new bytes3[](0);
        console.log("made it past dimensions");
        buffer.appendSafe(gfx.drawPixels(data,IExquisiteGraphics.Palette(out, IExquisiteGraphics.PaletteTypes.none),0,0));   
        buffer.appendSafe('</svg>');
        return string(buffer);
    }

    // ////////////////////////  SVG helper functions /////////////////////////////////

    function _renderTrait(Trait memory _currentTrait, LayerStruct memory _currentLayer, bytes memory buffer) internal view returns(uint8, uint8) {
        (, bytes memory _toDecode) = inflateLib.puff(SSTORE2.read(_currentTrait.data), _currentTrait.destLen);
        bytes memory _decoded = abi.decode(_toDecode, (bytes));
        bytes3[] memory out = new bytes3[](0);
        buffer.appendSafe(gfx.drawPixels(_decoded,IExquisiteGraphics.Palette(out, IExquisiteGraphics.PaletteTypes.none),_currentLayer.xOffset,_currentLayer.yOffset));
        return gfx.getDimensions(_decoded);
    }
}
