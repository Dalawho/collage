const fs = require("fs");

const blit = require("../blitOwners.json");
const tinyD = require("../tinyD.json");
const spells = require("../spellsOwners.json");

function getUnique(obj) {
    var names = [];
    for(key in obj) {
        names.push(obj[key]);
    }
    let unique = [...new Set(names)];
    console.log(`names length: ${names.length}`);
    console.log(`unique length: ${unique.length}`);
    return unique;
}

var out = [];

out.push(...getUnique(blit));
out.push(...getUnique(tinyD));
out.push(...getUnique(spells));
let outUnique = [...new Set(out)];

console.log(`out length: ${out.length}`);
console.log(`outUnique length: ${outUnique.length}`);

fs.writeFileSync(`allUnique.json`, JSON.stringify(outUnique), (err) => {
    if (err) throw err;
});
