"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
exports.__esModule = true;
exports.ICCZPayment__factory = void 0;
var ethers_1 = require("ethers");
var _abi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "account",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "shares_",
                type: "uint256"
            },
        ],
        name: "addPayee",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
];
var ICCZPayment__factory = /** @class */ (function () {
    function ICCZPayment__factory() {
    }
    ICCZPayment__factory.createInterface = function () {
        return new ethers_1.utils.Interface(_abi);
    };
    ICCZPayment__factory.connect = function (address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    };
    ICCZPayment__factory.abi = _abi;
    return ICCZPayment__factory;
}());
exports.ICCZPayment__factory = ICCZPayment__factory;