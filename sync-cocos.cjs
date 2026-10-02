const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function generateUuid(seed) {
  const hash = crypto.createHash('md5').update(seed).digest('hex');
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    '4' + hash.slice(13, 16),
    'a' + hash.slice(17, 20),
    hash.slice(20, 32)
  ].join('-');
}

const BASE64_KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function compressUuid(uuid) {
  if (!uuid || uuid.length === 23) return uuid;
  let cleanUuid = uuid.replace(/-/g, '');
  let first5 = cleanUuid.slice(0, 5);
  let rest = cleanUuid.slice(5);
  let compressed = first5;
  for (let i = 0; i < rest.length; i += 3) {
    let hexTriple = rest.slice(i, i + 3);
    let num = parseInt(hexTriple, 16);
    let c1 = BASE64_KEYS[(num >> 6) & 63];
    let c2 = BASE64_KEYS[num & 63];
    compressed += c1 + c2;
  }
  return compressed;
}

function walk(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      list.push({ isDir: true, path: p });
      walk(p, list);
    } else if (!p.endsWith('.meta')) {
      list.push({ isDir: false, path: p });
    }
  });
  return list;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// 1. Generate/normalize all .meta files in assets and assets.meta
const items = [{ isDir: true, path: 'assets' }, ...walk('assets')];
items.forEach(item => {
  const metaPath = item.path === 'assets' ? 'assets.meta' : item.path + '.meta';
  if (!fs.existsSync(metaPath)) {
    const uuid = generateUuid(item.path);
    let importer = 'asset';
    if (item.isDir) importer = 'directory';
    else if (item.path.endsWith('.ts')) importer = 'typescript';
    else if (item.path.endsWith('.prefab')) importer = 'prefab';
    else if (item.path.endsWith('.scene')) importer = 'scene';

    const metaContent = {
      ver: '1.0.1',
      importer: importer,
      imported: true,
      uuid: uuid,
      files: [],
      subMetas: {},
      userData: {}
    };
    fs.writeFileSync(metaPath, JSON.stringify(metaContent, null, 2));
    console.log('Created meta:', metaPath, 'uuid:', uuid);
  } else {
    try {
      const existing = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      const hasValidUuid = existing.uuid && UUID_REGEX.test(existing.uuid);
      if (existing.packageVersion || existing.id || !existing.ver || !hasValidUuid) {
        const fixed = {
          ver: '1.0.1',
          importer: existing.importer || (item.isDir ? 'directory' : 'asset'),
          imported: true,
          uuid: hasValidUuid ? existing.uuid : generateUuid(item.path),
          files: existing.files || [],
          subMetas: existing.subMetas || {},
          userData: existing.userData || {}
        };
        fs.writeFileSync(metaPath, JSON.stringify(fixed, null, 2));
        console.log('Updated meta format:', metaPath, 'uuid:', fixed.uuid);
      }
    } catch (e) {}
  }
});

// 2. Map class names to compressed UUIDs
const classMetaMap = {
  'GameRoot': 'assets/scripts/GameRoot.ts.meta',
  'GameManager': 'assets/scripts/GameManager.ts.meta',
  'ButtonController': 'assets/scripts/ui/ButtonController.ts.meta',
  'Dashboard': 'assets/scripts/ui/Dashboard.ts.meta',
  'PopupManager': 'assets/scripts/ui/PopupManager.ts.meta',
  'SettingsPanel': 'assets/scripts/ui/SettingsPanel.ts.meta',
  'AchievementsPanel': 'assets/scripts/ui/AchievementsPanel.ts.meta',
  'UIManager': 'assets/scripts/ui/UIManager.ts.meta',
  'TimerBar': 'assets/scripts/entities/TimerBar.ts.meta',
  'Target': 'assets/scripts/entities/Target.ts.meta',
  'ParticleEmitter': 'assets/scripts/entities/Particle.ts.meta',
};

const classToCompressedUuid = {};
Object.entries(classMetaMap).forEach(([cls, metaPath]) => {
  if (fs.existsSync(metaPath)) {
    const data = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    classToCompressedUuid[cls] = compressUuid(data.uuid);
    console.log(`Class ${cls} => ${data.uuid} => ${classToCompressedUuid[cls]}`);
  }
});

// 3. Update Main.scene with compressed UUIDs for __type__
if (fs.existsSync('assets/Main.scene')) {
  let sceneStr = fs.readFileSync('assets/Main.scene', 'utf8');
  let replacedCount = 0;
  Object.entries(classToCompressedUuid).forEach(([cls, compUuid]) => {
    const pattern = new RegExp(`"__type__":\\s*"${cls}"`, 'g');
    sceneStr = sceneStr.replace(pattern, () => {
      replacedCount++;
      return `"__type__": "${compUuid}"`;
    });
  });
  fs.writeFileSync('assets/Main.scene', sceneStr);
  console.log(`Updated assets/Main.scene with ${replacedCount} compressed UUID types!`);
}

// 4. Update prefabs as well
['UIButton.prefab', 'UIPanel.prefab', 'UIPopup.prefab', 'StatCard.prefab'].forEach(p => {
  const pPath = path.join('assets/prefabs', p);
  if (fs.existsSync(pPath)) {
    let pStr = fs.readFileSync(pPath, 'utf8');
    Object.entries(classToCompressedUuid).forEach(([cls, compUuid]) => {
      const pattern = new RegExp(`"__type__":\\s*"${cls}"`, 'g');
      pStr = pStr.replace(pattern, `"__type__": "${compUuid}"`);
    });
    fs.writeFileSync(pPath, pStr);
    console.log('Updated prefab:', pPath);
  }
});

// 5. Synchronize start-scene in settings/project.json
const { runSync: runMetaSync } = require('./sync-metas.cjs');
runMetaSync();
