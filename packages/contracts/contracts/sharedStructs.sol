// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface SharedStructs {
    struct Trait {
        address data;
        uint16 destLen;
        ImageType imageType;
        uint8 xSize;
        uint8 ySize;
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

    enum ImageType {
        png,
        gif
    }
    
}