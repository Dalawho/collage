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
import "./sharedStructs.sol";

interface IInflator {
    function puff(bytes memory source, uint256 destlen) external pure returns (uint8, bytes memory);
}

interface IPieces {
    function getLayerData(uint256 tokenId) external view returns(SharedStructs.LayerInfo memory, address);
}

contract Render is Initializable, OwnableUpgradeable, SharedStructs {
    using Strings for uint256;
    using Strings for uint8;
    using DynamicBuffer for bytes;

    IExquisiteGraphics public gfx;
    IInflator public inflateLib;
    IPieces public pieces;
    uint256 public constant MAX_LAYERS = 16; 

    Trait[] traits;

    error tokenDoesntExists();
    error onlyPiecesCanAddTokens();

    function initialize() initializer public {
        __Ownable_init();
        traits.push(Trait(address(0), 0,ImageType.png,0,0,""));
    }

    ////////////////////////  Set external contract addresses /////////////////////////////////

    function setGfx( address newGfx) public onlyOwner {
        gfx = IExquisiteGraphics(newGfx);
    }

    function setInflator( address newInflate) public onlyOwner {
        inflateLib = IInflator(newInflate);
    }

    function setPieces( address _newPieces) public onlyOwner {
        pieces = IPieces(_newPieces);
    }

    ////////////////////////  Upload and set data for traits, palletes and animals  /////////////////////////////////

    function addToken(bytes memory _data, uint16 destLen, uint8 imageType, uint8 xSize, uint8 ySize, string memory name) external {
        if(msg.sender != address(pieces)) revert onlyPiecesCanAddTokens();
        traits.push(Trait(SSTORE2.write(_data), destLen, ImageType(imageType), xSize, ySize, name));
    }

    ////////////////////////  TokenURI /////////////////////////////////

     function tokenURI(uint256 tokenId) external view returns (string memory) { 

        Trait memory _currentTrait = traits[tokenId];
        (LayerInfo memory _layerInfo, address _royalties ) = pieces.getLayerData(tokenId);

        string memory _outString = string.concat('data:application/json,', '{', '"name" : "' , _currentTrait.name, '", ',
            '"description" : "A piece that can be combined",');
        
        //console.log("attributes written");
        _outString = string.concat(_outString, '"attributes":[',
        '{"trait_type":"Creator","value":"', Strings.toHexString(uint256(uint160(_layerInfo.creator))), '"},',
        '{"trait_type":"Royalty Fee","value":"', Strings.toString(_layerInfo.royalties), '"},',
        '{"trait_type":"Name","value":"', _currentTrait.name, '"},',
        '{"trait_type":"Total Supply","value":"', Strings.toString(_layerInfo.maxSupply), '"}',
        ']'
        );
        
        _outString = string.concat(_outString,',"image": "data:image/svg+xml;base64,',
            Base64.encode(_getOneSVG(_currentTrait)),'"}');
        return _outString; 
    }

    function tokenURI(uint256 tokenId, LayerStruct[MAX_LAYERS] memory layerIds, address creator) external view returns (string memory) { 
        uint8 numberOfLayers = 0;
        Trait[] memory _traits = new Trait[](layerIds.length);
        LayerInfo[] memory _layerInfos = new LayerInfo[](layerIds.length);
        address[] memory _royaltyreciever = new address[](layerIds.length);
        for(uint256 i = 0; i < layerIds.length; i++) {
            _traits[i] = traits[layerIds[i].layerId];
            (_layerInfos[i], _royaltyreciever[i]) = pieces.getLayerData(layerIds[i].layerId);
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
             '{"trait_type":"Layer #', Strings.toString(i), '","value":"', _traits[i].name,'(by ', Strings.toHexString(uint256(uint160(_layerInfos[i].creator)), 20), ')"},',
             //'{"trait_type":"Layer #', Strings.toString(i), ' creator","value":"', string(abi.encodePacked(_layerInfos[i].creator)),'"},'
             '{"trait_type":"Layer #', Strings.toString(i), ' Royalty Fees","value":"', Strings.toString(_layerInfos[i].royalties) ,'"}'
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
        return string(_drawTraits(_traits, layerIds));
    }

    ////////////////////////  Full SVG functions /////////////////////////////////

    function _drawTraits(Trait[] memory _traits, LayerStruct[MAX_LAYERS] memory layerIds) internal view returns(bytes memory) {
            bytes memory buffer = DynamicBuffer.allocate(2**18);
            //buffer.appendSafe(bytes(string.concat('<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" version="1.1" viewBox="0 0 ', Strings.toString(height), ' ', Strings.toString(width),'" width="',Strings.toString(height*5),'" height="',Strings.toString(width*5),'"> ')));
            uint8 height;
            uint8 width;
            for(uint256 i = 0; i < _traits.length; i++) {
                if(_traits[i].data == address(0)) continue;
                _renderImg(_traits[i], layerIds[i], buffer);
                if(_traits[i].ySize*layerIds[i].scale+layerIds[i].yOffset > height) height = _traits[i].ySize*layerIds[i].scale+layerIds[i].yOffset;
                if(_traits[i].xSize*layerIds[i].scale+layerIds[i].xOffset > width) width = _traits[i].xSize*layerIds[i].scale+layerIds[i].xOffset;
            }
            buffer.appendSafe('<style>#pixel {image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: -webkit-crisp-edges; -ms-interpolation-mode: nearest-neighbor;}</style></svg>');
            return abi.encodePacked('<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" version="1.1" id="pixel" viewBox="0 0 ', Strings.toString(width), ' ', Strings.toString(height),'" width="',Strings.toString(uint256(width)*10),'" height="',Strings.toString(uint256(height)*10),'"> ', buffer);
    }

    function _renderBack(Trait memory _currentTrait, LayerStruct memory _currentLayer, bytes memory buffer) private view {
        (, bytes memory _toDecode) = inflateLib.puff(SSTORE2.read(_currentTrait.data), _currentTrait.destLen);
        bytes memory _traitData = abi.decode(_toDecode, (bytes));
        buffer.appendSafe(bytes('style="background-color:transparent;background-image:url(data:image/gif;base64,'));
        buffer.appendSafe(bytes(Base64.encode(_traitData)));
        buffer.appendSafe(bytes(');background-repeat:no-repeat;background-size:contain;background-position:center;image-rendering:-webkit-optimize-contrast;-ms-interpolation-mode:nearest-neighbor;image-rendering:-moz-crisp-edges;image-rendering:pixelated;">'));
    }

    function _renderImg(Trait memory _currentTrait, LayerStruct memory _currentLayer, bytes memory buffer) private view {
        (, bytes memory _toDecode) = inflateLib.puff(SSTORE2.read(_currentTrait.data), _currentTrait.destLen);
        bytes memory _traitData = abi.decode(_toDecode, (bytes));
        buffer.appendSafe(bytes(string.concat('<image x="', Strings.toString(_currentLayer.xOffset), '" y="', Strings.toString(_currentLayer.yOffset),'" width="', Strings.toString(_currentTrait.xSize*_currentLayer.scale), '" height="', Strings.toString(_currentTrait.ySize*_currentLayer.scale),
         '" href="data:image/', _currentTrait.imageType == ImageType.png ? 'png' : 'gif' , ';base64,'))); //iVBORw0KGgoAAAANSUhEUgAAAEgAAABIAQMAAABvIyEEAAAABlBMVEVHcEwAAACfKoRRAAAAAXRSTlMAQObYZgAAABtJREFUKM9jYBgFgxcoMLBAWR0MghhiowATAAAG1QDidu33BgAAAABJRU5ErkJggg==
        buffer.appendSafe(bytes(Base64.encode(_traitData)));
        buffer.appendSafe(bytes('"/>'));
    }

    function _renderTrait(Trait memory _currentTrait, LayerStruct memory _currentLayer, bytes memory buffer) internal view returns(uint8, uint8) {
        (, bytes memory _toDecode) = inflateLib.puff(SSTORE2.read(_currentTrait.data), _currentTrait.destLen);
        bytes memory _decoded = abi.decode(_toDecode, (bytes));
        bytes3[] memory out = new bytes3[](0);
        buffer.appendSafe(gfx.drawPixels(_decoded,IExquisiteGraphics.Palette(out, IExquisiteGraphics.PaletteTypes.none),_currentLayer.xOffset,_currentLayer.yOffset));
        return gfx.getDimensions(_decoded);
    }

    function _getOneSVG(Trait memory _currentTrait) internal view returns (bytes memory) {
        bytes memory buffer = DynamicBuffer.allocate(2**18);
        _renderImg(_currentTrait, LayerStruct(1,0,0,0), buffer);
        buffer.appendSafe('<style>#pixel {image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: -webkit-crisp-edges; -ms-interpolation-mode: nearest-neighbor;}</style></svg>');
        return abi.encodePacked('<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" id="pixel"  version="1.1" viewBox="0 0 ', Strings.toString(_currentTrait.xSize), ' ', Strings.toString(_currentTrait.ySize),'" width="',Strings.toString(uint256(_currentTrait.xSize)*10),'" height="',Strings.toString(uint256(_currentTrait.ySize)*10),'"> ', buffer);
    }

    function getSVGForBytes(bytes memory data, uint256 xSize, uint256 ySize, ImageType imageType) public pure returns(string memory) {
        bytes memory buffer = DynamicBuffer.allocate(2**18);
        buffer.appendSafe(bytes(string.concat('<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" id="pixel"  version="1.1" viewBox="0 0 ', Strings.toString(xSize), ' ', Strings.toString(ySize),'" width="',Strings.toString(uint256(xSize)*10),'" height="',Strings.toString(uint256(ySize)*10),'"> ')));
        buffer.appendSafe(bytes(string.concat('<image width="', Strings.toString(xSize), '" height="', Strings.toString(ySize),
        '" href="data:image/', imageType == ImageType.png ? 'png' : 'gif' , ';base64,'))); //iVBORw0KGgoAAAANSUhEUgAAAEgAAABIAQMAAABvIyEEAAAABlBMVEVHcEwAAACfKoRRAAAAAXRSTlMAQObYZgAAABtJREFUKM9jYBgFgxcoMLBAWR0MghhiowATAAAG1QDidu33BgAAAABJRU5ErkJggg==
        buffer.appendSafe(bytes(Base64.encode(data)));
        buffer.appendSafe(bytes('"/>'));
        buffer.appendSafe('<style>#pixel {image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: -webkit-crisp-edges; -ms-interpolation-mode: nearest-neighbor;}</style></svg>');
        return string(buffer);
    }

    // ////////////////////////  SVG helper functions /////////////////////////////////


}
