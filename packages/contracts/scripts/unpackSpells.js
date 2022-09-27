const fs = require("fs");

const spells = require("../spells.json");

//const s = JSON.parse(spells);
//const t = s.map((e) => {e[0]});
var names = [];
for(let i = 1; i < 3333; i++) {
    names.push(`${spells[i][0]}\n`);
}
const n = names.sort();
console.log(n.join());
