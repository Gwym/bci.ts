var fs = require("fs");
var path = require("path");
var outfile = './webapp/commons.ts';
var warning = '// WARNING : GENERATED FILE, DO NOT MODIFY (modifiy server/commons.ts ' + "\n"
    + '// and run node build/common_tr.js' + "\n\n";
var com = fs.readFileSync('./server/commons.ts', 'utf8');
com = warning + com.replace(/export /g, '');
fs.writeFileSync(outfile, com, 'utf8');
console.log('wrote ' + path.resolve(outfile));
//# sourceMappingURL=common_tr.js.map