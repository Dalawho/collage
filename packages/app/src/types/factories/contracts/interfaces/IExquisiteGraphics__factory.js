"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
exports.__esModule = true;
exports.IExquisiteGraphics__factory = void 0;
var ethers_1 = require("ethers");
var _abi = [
    {
        inputs: [],
        name: "BackgroundColorIndexOutOfRange",
        type: "error"
    },
    {
        inputs: [],
        name: "ExceededMaxColors",
        type: "error"
    },
    {
        inputs: [],
        name: "ExceededMaxColumns",
        type: "error"
    },
    {
        inputs: [],
        name: "ExceededMaxPixels",
        type: "error"
    },
    {
        inputs: [],
        name: "ExceededMaxRows",
        type: "error"
    },
    {
        inputs: [],
        name: "MissingHeader",
        type: "error"
    },
    {
        inputs: [],
        name: "NoColors",
        type: "error"
    },
    {
        inputs: [],
        name: "NotEnoughData",
        type: "error"
    },
    {
        inputs: [],
        name: "PixelColorIndexOutOfRange",
        type: "error"
    },
    {
        inputs: [
            {
                internalType: "bytes",
                name: "data",
                type: "bytes"
            },
            {
                components: [
                    {
                        internalType: "bytes3[]",
                        name: "colors",
                        type: "bytes3[]"
                    },
                    {
                        internalType: "enum IExquisiteGraphics.PaletteTypes",
                        name: "paletteType",
                        type: "uint8"
                    },
                ],
                internalType: "struct IExquisiteGraphics.Palette",
                name: "palette",
                type: "tuple"
            },
        ],
        name: "drawPixelsAnimal",
        outputs: [
            {
                internalType: "uint8[2][3]",
                name: "",
                type: "uint8[2][3]"
            },
            {
                internalType: "bytes",
                name: "",
                type: "bytes"
            },
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "bytes",
                name: "data",
                type: "bytes"
            },
            {
                internalType: "uint8",
                name: "xOffset",
                type: "uint8"
            },
            {
                internalType: "uint8",
                name: "yOffset",
                type: "uint8"
            },
        ],
        name: "drawPixelsItems",
        outputs: [
            {
                internalType: "bytes",
                name: "",
                type: "bytes"
            },
        ],
        stateMutability: "view",
        type: "function"
    },
];
var IExquisiteGraphics__factory = /** @class */ (function () {
    function IExquisiteGraphics__factory() {
    }
    IExquisiteGraphics__factory.createInterface = function () {
        return new ethers_1.utils.Interface(_abi);
    };
    IExquisiteGraphics__factory.connect = function (address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    };
    IExquisiteGraphics__factory.abi = _abi;
    return IExquisiteGraphics__factory;
}());
exports.IExquisiteGraphics__factory = IExquisiteGraphics__factory;
