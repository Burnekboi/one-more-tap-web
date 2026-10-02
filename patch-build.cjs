const fs = require('fs');
const path = require('path');
const buildDir = process.argv[2] || 'build/one-more-tap';
const appid = '7688522145869236231';

const gj = path.join(buildDir, 'game.js');
if (fs.existsSync(gj)) {
  let s = fs.readFileSync(gj, 'utf8');
  if (!s.includes('tt.loadSubpackage({ name')) {
    s = s.replace(/^loadCC\(\);\r?\n/m, "tt.loadSubpackage({ name: 'cocos-js', success: doStart, fail: doStart });\nfunction doStart(){loadCC();}\n".replace(/\n/g, '\r\n'));
    fs.writeFileSync(gj, s);
    console.log('patched', gj, '(added tt.loadSubpackage)');
  } else {
    console.log('game.js already patched');
  }
}

const stub = path.join(buildDir, 'cocos-js', 'game.js');
if (fs.existsSync(stub)) {
  console.log('cocos-js/game.js already exists');
} else {
  fs.writeFileSync(stub, '// no-op stub for the cocos-js subpackage entry');
  console.log('created', stub);
}

const pc = path.join(buildDir, 'project.config.json');
if (fs.existsSync(pc)) {
  const obj = JSON.parse(fs.readFileSync(pc, 'utf8'));
  obj.appid = appid;
  fs.writeFileSync(pc, JSON.stringify(obj));
  console.log('appid set to', appid);
}