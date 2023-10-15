// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {IExquisiteGraphics as xqstgfx} from '../interfaces/IExquisiteGraphics.sol';

library ExquisiteUtils {
  /// Gets an array of numbers in string format
  /// @dev index 0 is the string '0' and index 255 is the string '255'
  /// @param header used to figure out how many numbers we need to store
  /// @return numberStrings the array of numbers
  function _getNumberStrings(xqstgfx.Header memory header)
    internal
    pure
    returns (uint256[] memory numberStrings)
  {
    uint256 max;

    max = (header.width > header.height ? header.width : header.height) + 1;
    max = header.numColors > max ? header.numColors : max;

    numberStrings = new uint256[](max);
    for (uint256 i = 0; i < max; i++) {
      numberStrings[i] = i;
    }
  }

  /// Determines if we can skip rendering a pixel
  /// @dev Can skip rendering a pixel under 3 Conditions
  /// @dev 1. The pixel's color is the same as the background color
  /// @dev 2. We are rendering in 0-color mode, and the pixel is a 0
  /// @dev 3. The pixel's color doesn't exist in the palette
  /// @param ctx the draw context
  /// @param colorIndex the index of the color for this pixel
  function _canSkipPixel(xqstgfx.DrawContext memory ctx, uint256 colorIndex)
    internal
    pure
    returns (bool)
  {
    return ((ctx.header.hasBackground &&
      colorIndex == ctx.header.backgroundColorIndex) ||
      (ctx.header.numColors == 0 && colorIndex == 0) ||
      (ctx.header.numColors > 0 && colorIndex >= ctx.header.numColors));
  }

  /// Returns the bytes representation of a number
  /// @param value the number to convert to bytes
  /// @return bytes representation of the number
  function toBytes(uint256 value) internal pure returns (bytes memory) {
    // Inspired by OraclizeAPI's implementation - MIT license
    // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

    if (value == 0) {
      return '0';
    }
    uint256 temp = value;
    uint256 digits;
    while (temp != 0) {
      digits++;
      temp /= 10;
    }
    bytes memory buffer = new bytes(digits);
    while (value != 0) {
      digits -= 1;
      buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
      value /= 10;
    }
    return buffer;
  }

  /// Gets the ascii hex character for a uint8 (byte)
  /// @param char the uint8 to get the ascii hex character for
  /// @return bytes1 ascii hex character for the given uint8
  function _getHexChar(uint8 char) internal pure returns (bytes1) {
    return
      (char > 9)
        ? bytes1(char + 87) // ascii a-f
        : bytes1(char + 48); // ascii 0-9
  }

  /// Converts 4 bytes (uint32) to a RGBA hex string
  /// @param u the uint32 to convert to a color
  /// @return bytes8 the color in RBGA hex format
  function _uint32ToColor(uint32 u) internal pure returns (string memory) {
    bytes memory b = new bytes(8);
    for (uint256 j = 0; j < 8; j++) {
      b[7 - j] = _getHexChar(uint8(uint32(u) & 0x0f));
      u = u >> 4;
    }
    return string(b);
  }

  /// Converts 3 bytes (uint24) to a RGB hex string
  /// @param u the uint24 to convert to a color
  /// @return string the color in RBG hex format
  function _uint24ToColor(uint24 u) internal pure returns (string memory) {
    bytes memory b = new bytes(6);
    for (uint256 j = 0; j < 6; j++) {
      b[5 - j] = _getHexChar(uint8(uint24(u) & 0x0f));
      u = u >> 4;
    }
    return string(b);
  }

function _invertColor(uint32 col) internal pure returns (string memory) {
    bytes4 temp;
    temp = temp >> 8 | bytes1(uint8(col));
    col = col >> 8; 
    for (uint256 i = 1; i < 4; i++) {
      temp = temp >> 8 | bytes1(255 - uint8(col)); 
      col = col >> 8; 
    }
    return _uint32ToColor(uint32(temp));
  }

   function _getGray(bytes4 test) internal pure returns(uint8 gray) {
        //e.g. pass in #37946e
        uint8[3] memory numbs = _getNumbers(test);
        gray = uint8((2989 * uint256(numbs[0]) + 5870 * uint256(numbs[1]) + 1140 * uint256(numbs[2])) / 10000);
    }
    
    function _getTransparent(bytes4 test) internal pure returns(uint8 gray) {
        gray = uint8(bytes1(test << (3*8)));
      }

    function _getNumbers(bytes4 test) internal pure returns(uint8[3] memory numbs) {
        for(uint256 i = 0; i < 3; i++) {
            numbs[i] = uint8(bytes1(test << (i*8)));
        }
    }

    function _grayToColor(bytes4 color, uint256 gray) internal pure returns(uint8[3] memory numbs) {
      uint8[3] memory parentColor = _getNumbers(color);
        // for(uint i = 0; i < parentColor.length; i++) {
        //   if(gray < 127) {numbs[i] = uint8((0 + uint256(parentColor[i]) * (gray*2)) / 255);}
        //   else {  numbs[i] = uint8(parentColor[i] + (255-parentColor[i]) * ((gray-127)*2) / 255);}
        // }
      for(uint i = 0; i < parentColor.length; i++) {
        if(gray <= 127) {numbs[i] = uint8((0 + uint256(parentColor[i]) * (gray*2)) / 255);}
        else {  numbs[i] = uint8(parentColor[i] + (255-parentColor[i]) * ((gray-127)*2) / 255);}
     }
    }

    //basically the algo workes well for colors at medium size, but the scaling is very different dependent on color
    //if I define breakpoint as parentcolor? 

    function _graysToPalette(bytes3[] memory colors, uint8[] memory grays, uint8[] memory transparent) internal pure returns(bytes4[] memory coloredGrays) {
        coloredGrays = new bytes4[](grays.length);
        for(uint i = 0; i < grays.length; i++) {
            coloredGrays[i] = _joinColors( _grayToColor( colors[i%colors.length], grays[i] ), transparent[i] );
        }
    }

    function _rgbToHexString(uint8[3] memory numbs) internal pure returns (string memory) {
        bytes memory b = new bytes(6);
        for (uint256 i = 0; i < 3; i++) {
            b[i*2 + 1] = _getHexChar(uint8(uint24(numbs[i]) & 0x0f));
            numbs[i] = numbs[i] >> 4;
            b[i*2] = _getHexChar(uint8(uint24(numbs[i]) & 0x0f));
            }
        return string(b);
    }

    function _joinColors(uint8[3] memory numbs, uint8 transparent ) internal pure returns(bytes4) {
        uint32 out;
        out = uint32(numbs[0]) << 24;
        out = out | uint32(numbs[1]) << 16;
        out = out | uint32(numbs[2]) << 8;
        out = out | uint32(transparent);
        return bytes4(out);
    }

    function _graysToGray(uint8[] memory grays) internal pure returns(string[] memory coloredGrays) {
        coloredGrays = new string[](grays.length);
        for(uint i = 0; i < grays.length; i++) {
            coloredGrays[i] = _rgbToHexString([grays[i],grays[i], grays[i]] );
        }
    }

}