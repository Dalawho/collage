// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IExquisiteGraphics {
  struct Header {
    /* HEADER START */
    uint8 version; // 8 bits
    uint16 width; // 8 bits
    uint16 height; // 8 bits
    uint8 locx; // 8 bits
    uint8 locy; // 8 bits
    uint16 numColors; // 16 bits
    uint8 backgroundColorIndex; // 8 bits
    uint16 scale; // 10 bits
    uint8 reserved; // 4 bits
    bool alpha; // 1 bit
    bool hasBackground; // 1 bit
    /* HEADER END */

    /* CALCULATED DATA START */
    uint24 totalPixels; // total pixels in the image
    uint8 bitsPerPixel; // bits per pixel
    uint8 pixelsPerByte; // pixels per byte
    uint16 paletteStart; // number of the byte where the palette starts
    uint16 dataStart; // number of the byte where the data starts
    /* CALCULATED DATA END */
  }

  struct DrawContext {
    bytes data; // the binary data in .xqst format
    Header header; // the header of the data
    bytes4[] palette; // hex color for each color in the image
    uint8[] pixels; // color index (in the palette) for a pixel
  }

  enum HeaderType {
    ITEM,
    ANIMAL
  }

  struct Palette {
        bytes3[] colors;
        PaletteTypes paletteType;
  }

    enum PaletteTypes {
        none,
        gray,
        monochrome,
        multicolorHue,
        multicolorFix,
        inverted
    }

  error ExceededMaxPixels();
  error ExceededMaxRows();
  error ExceededMaxColumns();
  error ExceededMaxColors();
  error BackgroundColorIndexOutOfRange();
  error PixelColorIndexOutOfRange();
  error MissingHeader();
  error NotEnoughData();
  error NoColors();

    function drawPixels(bytes memory data, Palette memory palette, uint8 xOffset, uint8 yOffset, uint8 devine)
    external
    view
    returns (bytes memory);

}