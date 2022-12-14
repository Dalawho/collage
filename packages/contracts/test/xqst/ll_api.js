"use strict";
// Functions for Hardcore Builders working with binary pixel format directly
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixelBuffer = void 0;
const api_1 = require("./api");
class PixelBuffer {
    constructor(header, palette) {
        // TODO; Use Buffer instead of string
        this.headerBuffer = Buffer.from('0', 'hex');
        this.paletteBuffer = Buffer.from('0', 'hex');
        this.dataBuffer = Buffer.from('0', 'hex');
        if (header && palette) {
            // TODO: validate options
            this.header = header;
            this.palette = palette;
            validateOptions(header);
            this.pixelInfo = getPixelInfo(this.header.numColors);
            this._setHeader();
            this._setPalette();
            this._initData();
        }
        else {
            this.header = {
                locx: 0,
                locy: 0,
                version: 24,
                width: 0,
                height: 0,
                numColors: 0,
                scaleFactor: 0,
                alpha: true,
                backgroundIncluded: false,
                backgroundIndex: 0
            };
            this.palette = [];
            this.pixelInfo = { ppb: 0, bpp: 0, mask: 0 };
        }
    }
    // TODO change to static
    from(data) {
        // TODO: validate data (the passed in string)
        // read header
        const header = readHeader(data);
        if (header == null)
            return;
        this.header = header;
        this.palette = readPalette(data, header);
        validateOptions(header);
        this.pixelInfo = getPixelInfo(this.header.numColors);
        this._setHeader();
        this._setPalette();
        this._initData();
        // set data
        const colorChannels = header.alpha ? 4 : 3;
        this.dataBuffer = Buffer.from(data
            .replace('0x', '')
            .substring(20 + header.numColors * colorChannels * 2), 'hex'); // 
    }
    _initData() {
        this.dataBuffer = Buffer.from('00'.repeat(Math.ceil((this.header.width * this.header.height) / this.pixelInfo.ppb)), 'hex');
    }
    _setHeader() {
        this.headerBuffer = generateHeader(this.header);
    }
    _setPalette() {
        this.paletteBuffer = generatePalette(this.palette);
    }
    setPixel(x, y, color) {
        if (x >= this.header.width)
            return;
        if (y >= this.header.height)
            return;
        const bpp = this.pixelInfo.bpp;
        const ppb = this.pixelInfo.ppb;
        const mask = this.pixelInfo.mask;
        const pixelNum = x + this.header.width * y;
        const index = Math.floor(pixelNum / this.pixelInfo.ppb);
        let d = this.dataBuffer[index];
        // TODO: validate that the number is within range
        // clear-bit
        d = d & ~(mask << (bpp * (ppb - 1 - (pixelNum % ppb))));
        // set-bit
        d = d | (color << (bpp * (ppb - 1 - (pixelNum % ppb))));
        this.dataBuffer[index] = d;
    }
    getPixel(x, y) {
        const bpp = this.pixelInfo.bpp;
        const ppb = this.pixelInfo.ppb;
        const mask = this.pixelInfo.mask;
        const pixelNum = x + this.header.width * y;
        const index = Math.floor(pixelNum / this.pixelInfo.ppb);
        const d = this.dataBuffer[index];
        return (d >> (bpp * (ppb - 1 - (pixelNum % ppb)))) & mask;
    }
    getPixelColor(x, y) {
        const colorIndex = this.getPixel(x, y);
        return this.palette[colorIndex];
    }
    getPixelBuffer() {
        const header = this.headerBuffer.toString('hex');
        const palette = this.paletteBuffer.toString('hex');
        const data = this.dataBuffer.toString('hex');
        return `0x${header}${palette}${data}`;
    }
    getHeader() {
        return `0x${this.headerBuffer.toString('hex')}`;
    }
    setHeader() {
        this.header.backgroundIndex = 0;
        //this.header.backgroundIncluded = false;
        this.headerBuffer = generateHeader(this.header);
    }

    setLoc(loc) {
        this.header.locx = loc[0];
        this.header.locy = loc[1];
        this.headerBuffer = generateHeader(this.header);
    }

    noBackground() {
        this.header.backgroundIncluded = false;
        this.headerBuffer = generateHeader(this.header);
    }
    getPalette() {
        return `0x${this.paletteBuffer.toString('hex')}`;
    }
    getData() {
        return `0x${this.dataBuffer.toString('hex')}`;
    }
    // TODO, this might make sense to move out of the class?
    toPixels() {
        const pixels = [];
        for (let y = 0; y < this.header.height; y++) {
            for (let x = 0; x < this.header.width; x++) {
                const color = this.getPixelColor(x, y);
                pixels.push({ x, y, color });
            }
        }
        return pixels;
    }
    toPixel2DArr() {
        const pixels = [];
        for (let y = 0; y < this.header.height; y++) {
            const row = [];
            for (let x = 0; x < this.header.width; x++) {
                row.push(this.getPixelColor(x, y));
            }
            pixels.push(row);
        }
        return pixels;
    }
    toPixelMap() {
        const pixelMap = new Map();
        for (let y = 0; y < this.header.height; y++) {
            for (let x = 0; x < this.header.width; x++) {
                const color = this.getPixelColor(x, y);
                pixelMap.set({ x, y }, color);
            }
        }
        return pixelMap;
    }
}
exports.PixelBuffer = PixelBuffer;
// ensure header will be accepted by ExquisiteValidator contract
const validateOptions = (header) => {
    if (header.width < 1 || header.width > 256) {
        return false;
    }
    if (header.height < 1 || header.height > 256) {
        return false;
    }
    if (header.height * header.width > 4096) {
        return false;
    }
    if (header.numColors < 1 || header.numColors > 256) {
        return false;
    }
    // if (header.numColors != header.palette.length) {
    //   // numColors must match the length of the palette
    //   return false;
    // }
    if (header.backgroundIncluded && header.backgroundIndex < header.numColors) {
        // background index must be less than numColors
        return false;
    }
    return true;
};
function generatePalette(palette) {
    let s = '';
    palette.map((color) => {
        const c = color.replace('#', '');
        if ((0, api_1.isRGBA)(color)) {
            // TODO handle RGBA
            // s += `#${color.r.toString(16).padStart(2, '0')}${color.g
            //   .toString(16)
            //   .padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`;
        }
        else if ((0, api_1.isString)(c)) {
            if (c.length == 3 || c.length == 4) {
                for (let char of c) {
                    s += `${char}${char}`;
                }
            }
            else {
                s += c;
            }
        }
    });
    return Buffer.from(s, 'hex');
}
const readPalette = (data, header) => {
    // TODO: validate data
    const d = data.replace('0x', '').substring(20, 16 + header.numColors * 16);
    const buffer = Buffer.from(d, 'hex');
    const palette = [];
    for (let i = 0; i < header.numColors; i++) {
        if (header.alpha) {
            palette.push(buffer
                .readUInt32BE(i * 4)
                .toString(16)
                .padStart(8, '0'));
        }
        else {
            const r = buffer
                .readUInt8(i * 3)
                .toString(16)
                .padStart(2, '0');
            const g = buffer
                .readUInt8(i * 3 + 1)
                .toString(16)
                .padStart(2, '0');
            const b = buffer
                .readUInt8(i * 3 + 2)
                .toString(16)
                .padStart(2, '0');
            palette.push(`#${r}${g}${b}`);
        }
    }
    return palette;
};
const readHeader = (data) => {
    const rawData = data.replace('0x', '');
    if (rawData.length < 16) {
        return null;
    }
    const headerData = Buffer.from(rawData.substring(0, 20), 'hex');

    let locx = headerData.readUInt8();
    let locy = headerData.readUInt8(1); 
    const version = headerData.readUInt8(2);
    let width = headerData.readUInt8(3);
    let height = headerData.readUInt8(4);
    const numColors = headerData.readUInt16BE(5);
    const backgroundIndex = headerData.readUInt8(7);
    const scaleFactor = headerData.readUInt16BE(8) >> 6;
    const alpha = ((headerData.readUInt8(9) >> 1) & 0x01) == 1;
    const backgroundIncluded = (headerData.readUInt8(9) & 0x01) == 1;
    if (width == 0)
        width = 256;
    if (height == 0)
        height = 256;
    const header = {
        locx,
        locy,
        version,
        width,
        height,
        numColors,
        scaleFactor,
        alpha,
        backgroundIncluded,
        backgroundIndex
    };
    return header;
};
const generateHeader = (header) => {
    let headerData = '';
    let last2Bytes = 0;
    if (header) {
        // TODO, use get bit and set bit to do this.
        if (header.alpha && header.alpha == true) {
            last2Bytes |= 1 << 1;
        }
        if (header.backgroundIncluded && header.backgroundIncluded == true) {
            last2Bytes |= 1;
        }
        if (header.scaleFactor) {
            last2Bytes |= header.scaleFactor << 6;
        }
    }
    headerData += `${header.locx.toString(16).padStart(2, '0')}`;
    headerData += `${header.locy.toString(16).padStart(2, '0')}`;
    headerData += `${header.version.toString(16).padStart(2, '0')}`;
    headerData +=
        header.width == 256
            ? '00'
            : `${header.width.toString(16).padStart(2, '0')}`;
    headerData +=
        header.height == 256
            ? '00'
            : `${header.height.toString(16).padStart(2, '0')}`;
    headerData += `${header.numColors.toString(16).padStart(4, '0')}`;
    if (header && header.backgroundIndex) {
        headerData += `${header.backgroundIndex.toString(16).padStart(2, '0')}`;
    }
    else {
        headerData += '00';
    }
    headerData += last2Bytes.toString(16).padStart(4, '0');
    //console.log('header', headerData);
    return Buffer.from(headerData, 'hex');
};
const getPixelInfo = (numColors) => {
    if (numColors > 16)
        return { ppb: 1, bpp: 8, mask: 0xff };
    if (numColors > 4)
        return { ppb: 2, bpp: 4, mask: 0x0f };
    if (numColors > 2)
        return { ppb: 4, bpp: 2, mask: 0x03 };
    return { ppb: 8, bpp: 1, mask: 0x01 };
};
// Convert a hex string to a byte array
function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}
// Convert a byte array to a hex string
function bytesToHex(bytes) {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
        hex.push((current >>> 4).toString(16));
        hex.push((current & 0xf).toString(16));
    }
    return hex.join('');
}
