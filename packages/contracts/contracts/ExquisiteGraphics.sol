// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {IExquisiteGraphics} from './interfaces/IExquisiteGraphics.sol';
import {ExquisiteUtils as utils} from './utils/ExquisiteUtils.sol';
import {ExquisiteDecoder as decoder} from './utils/ExquisiteDecoder.sol';
import '@divergencetech/ethier/contracts/utils/DynamicBuffer.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

contract ExquisiteGraphics is IExquisiteGraphics {
  using DynamicBuffer for bytes;

  enum DrawType {
    SVG,
    PIXELS
  }

  struct PX {
    uint256 colorIndex;
    uint256 width;
    uint256 pixelNum;
  }

  function drawPixels(bytes memory data, Palette memory palette, uint8 xOffset, uint8 yOffset)
    public view
    returns (bytes memory)  // pure
  {
    return _draw(data, palette, xOffset, yOffset);
  }

    /// Initializes the Draw Context from the given data
  /// @param ctx The Draw Context to initialize
  /// @param data Binary data in the .xqst format.
  function _initDrawContext(
    DrawContext memory ctx,
    bytes memory data,
    HeaderType headerType,
    Palette memory palette
  ) internal pure {
    ctx.header = decoder._decodeHeader(data, headerType);

    ctx.palette = decoder._decodePalette(data, ctx.header, palette);
    ctx.pixels = decoder._decodePixels(data, ctx.header);
            
  }

    /// Draws the SVG or <rect> elements from the given data
  /// @param data Binary data in the .xqst format.
  function _draw(
    bytes memory data, 
    Palette memory palette,
    uint8 xOffset,
    uint8 yOffset
  ) internal view returns (bytes memory) {
    DrawContext memory ctx;
    bytes memory buffer = DynamicBuffer.allocate(2**18);

    console.log("made it to draw");
    _initDrawContext(ctx, data, HeaderType.ITEM, palette);

    _writeSVGPixelsWithOffset(ctx, buffer, xOffset, yOffset);
    return (buffer);
  }

  function _writeSVGPixelsWithOffset(DrawContext memory ctx, bytes memory buffer, uint256 xOffset, uint256 yOffset)
    internal
    view
  {
    // uint256 colorIndex;
    // uint256 width;
    // uint256 pixelNum;
    console.log("made it to the render");
    PX memory px;
    uint256[] memory numberStrings = utils._getNumberStrings(ctx.header);
    string[] memory _palette = new string[](ctx.palette.length); //define this using a function in here
    _palette = _getNormalPalette(ctx.palette);

    if (ctx.header.hasBackground) {
      buffer.appendSafe(
        abi.encodePacked(
          '"<rect fill="#',
          _palette[ctx.header.backgroundColorIndex],
          '" height="',
          Strings.toString(numberStrings[ctx.header.height]),
          '" width="',
          Strings.toString(numberStrings[ctx.header.width]),
          '"/>'
        )
      );
    }
    // Write every pixel into the buffer
    while (px.pixelNum < ctx.header.totalPixels) {
      px.colorIndex = ctx.pixels[px.pixelNum];

      // Check if we need to write a new rect to the buffer at all
      if (utils._canSkipPixel(ctx, px.colorIndex)) {
        px.pixelNum++;
        continue;
      }

      // Check whether the pixel is transparent and skip 
      if (uint8(bytes1(ctx.palette[px.colorIndex] << 24)) == 0x00) {
         px.pixelNum++;
         continue;
       }

      // Calculate the width of a continuous rect with the same color, ONLY DO THIS WITH Devine != 2
      px.width = 1;
      while ((px.pixelNum + px.width) % ctx.header.width != 0) {
        if (px.colorIndex == ctx.pixels[px.pixelNum + px.width]) {
          px.width++;
        } else break;
      } 
      buffer.appendSafe(
        abi.encodePacked(
          '<rect fill="#',
          _palette[px.colorIndex],
          '" x="',
          Strings.toString(numberStrings[px.pixelNum % ctx.header.width]+(xOffset+ctx.header.locx)),
          '" y="',
          Strings.toString(numberStrings[px.pixelNum / ctx.header.width]+(yOffset+ctx.header.locy)),
          '" height="1" width="',
          Strings.toString(numberStrings[px.width]),
          '"/>'
        )
      );

      unchecked {
        px.pixelNum += px.width;
      }
    }
  }

  function _getNormalPalette(bytes4[] memory _bytesPalette) internal pure returns(string[] memory _palette) {
    _palette = new string[](_bytesPalette.length);
    for(uint256 i = 0; i < _bytesPalette.length; i++) {
      _palette[i] = utils._uint32ToColor(uint32(_bytesPalette[i]));
    }
    return _palette;
  }

  function getDimensions(bytes memory data)
    external
    pure
    returns (uint8, uint8) {
      DrawContext memory ctx;
      ctx.header = decoder._decodeHeader(data, HeaderType.ITEM);
      return (uint8(ctx.header.height), uint8(ctx.header.width));
    }

}