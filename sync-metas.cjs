/**
 * Cocos Creator 3.8.8 Meta & Start-Scene Synchronization Script
 * 
 * 1. Recursively scans the assets directory
 * 2. Generates consistent, deterministic UUIDs for all .meta files
 * 3. Enforces Cocos Creator 3.8.8 'ver' ('1.0.1') and 'uuid' schema
 * 4. Detects Main.scene and synchronizes start-scene in settings/project.json
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Resolve project root (directory where package.json or settings/ lives)
function findProjectRoot(startDir) {
  let current = startDir;
  while (current && current !== path.parse(current).root) {
    if (fs.existsSync(path.join(current, 'settings')) || fs.existsSync(path.join(current, 'assets'))) {
      return current;
    }
    current = path.dirname(current);
  }
  return startDir;
}

const ROOT_DIR = findProjectRoot(process.cwd());
const ASSETS_DIR = path.join(ROOT_DIR, 'assets');
const SETTINGS_PROJECT_JSON = path.join(ROOT_DIR, 'settings', 'project.json');
const SETTINGS_V2_PROJECT_JSON = path.join(ROOT_DIR, 'settings', 'v2', 'packages', 'project.json');
const BUILDER_JSON = path.join(ROOT_DIR, 'profiles', 'v2', 'packages', 'builder.json');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Deterministically generates a compliant RFC 4122 v4 UUID from an asset relative path.
 * Consistent across runs: same path => identical UUID.
 */
function generateConsistentUuid(relPath) {
  const normalizedPath = relPath.replace(/\\/g, '/');
  const hash = crypto.createHash('md5').update(normalizedPath).digest('hex');
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    '4' + hash.slice(13, 16),
    'a' + hash.slice(17, 20),
    hash.slice(20, 32)
  ].join('-').toLowerCase();
}

/**
 * Determines the appropriate Cocos Creator 3.8.x importer for an asset.
 */
function getImporter(filePath, isDir) {
  if (isDir) return 'directory';
  const ext = path.extname(filePath).toLowerCase();
  if (filePath.endsWith('.d.ts') || ext === '.ts') return 'typescript';
  if (ext === '.js') return 'javascript';
  if (ext === '.scene') return 'scene';
  if (ext === '.prefab') return 'prefab';
  if (ext === '.json') return 'json';
  if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) return 'image';
  if (['.mp3', '.wav', '.ogg', '.m4a'].includes(ext)) return 'audio-clip';
  return 'asset';
}

/**
 * Recursively scans directory collecting directories and non-meta files.
 */
function scanDirectory(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      list.push({ isDir: true, fullPath });
      scanDirectory(fullPath, list);
    } else if (!entry.endsWith('.meta')) {
      list.push({ isDir: false, fullPath });
    }
  }
  return list;
}

function runSync() {
  console.log('--- Cocos Creator 3.8.8 Meta & Start-Scene Sync ---');
  console.log(`Root directory: ${ROOT_DIR}`);

  if (!fs.existsSync(ASSETS_DIR)) {
    console.error(`Error: Assets directory not found at ${ASSETS_DIR}`);
    process.exit(1);
  }

  // 1. Gather all assets and directories to verify
  const allItems = [
    { isDir: true, fullPath: ASSETS_DIR },
    ...scanDirectory(ASSETS_DIR)
  ];

  let createdCount = 0;
  let updatedCount = 0;
  let verifiedCount = 0;
  let mainSceneUuid = null;

  for (const item of allItems) {
    const relPath = path.relative(ROOT_DIR, item.fullPath).replace(/\\/g, '/');
    const metaPath = item.fullPath === ASSETS_DIR
      ? path.join(ROOT_DIR, 'assets.meta')
      : item.fullPath + '.meta';

    const importer = getImporter(item.fullPath, item.isDir);
    let metaContent = null;
    let needsWrite = false;

    if (!fs.existsSync(metaPath)) {
      const uuid = generateConsistentUuid(relPath);
      metaContent = {
        ver: '1.0.1',
        importer: importer,
        imported: true,
        uuid: uuid,
        files: [],
        subMetas: {},
        userData: {}
      };
      needsWrite = true;
      createdCount++;
      console.log(`+ Created .meta: ${path.relative(ROOT_DIR, metaPath)} [${uuid}]`);
    } else {
      try {
        const raw = fs.readFileSync(metaPath, 'utf8');
        const parsed = JSON.parse(raw);
        metaContent = parsed;

        // Check and enforce Cocos 3.8.8 schema compliance
        const currentUuid = metaContent.uuid || metaContent.id;
        const hasValidUuid = typeof currentUuid === 'string' && UUID_REGEX.test(currentUuid);
        const compliantUuid = hasValidUuid ? currentUuid.toLowerCase() : generateConsistentUuid(relPath);

        const isCompliant =
          metaContent.ver === '1.0.1' &&
          metaContent.uuid === compliantUuid &&
          metaContent.imported === true &&
          metaContent.importer === (metaContent.importer || importer) &&
          !metaContent.packageVersion &&
          !metaContent.id;

        if (!isCompliant) {
          metaContent = {
            ver: '1.0.1',
            importer: metaContent.importer || importer,
            imported: true,
            uuid: compliantUuid,
            files: metaContent.files || [],
            subMetas: metaContent.subMetas || {},
            userData: metaContent.userData || {}
          };
          needsWrite = true;
          updatedCount++;
          console.log(`~ Updated .meta format: ${path.relative(ROOT_DIR, metaPath)} [${compliantUuid}]`);
        } else {
          verifiedCount++;
        }
      } catch (err) {
        console.warn(`! Corrupted .meta found, regenerating: ${metaPath} (${err.message})`);
        const uuid = generateConsistentUuid(relPath);
        metaContent = {
          ver: '1.0.1',
          importer: importer,
          imported: true,
          uuid: uuid,
          files: [],
          subMetas: {},
          userData: {}
        };
        needsWrite = true;
        updatedCount++;
      }
    }

    if (needsWrite && metaContent) {
      fs.writeFileSync(metaPath, JSON.stringify(metaContent, null, 2) + '\n');
    }

    // Detect Main.scene UUID
    if (!item.isDir && (item.fullPath.endsWith('Main.scene') || item.fullPath.endsWith('.scene'))) {
      if (item.fullPath.endsWith('Main.scene') || !mainSceneUuid) {
        mainSceneUuid = metaContent.uuid;
      }
    }
  }

  console.log(`Scan summary: ${allItems.length} total entries checked.`);
  console.log(`- Validated: ${verifiedCount}`);
  console.log(`- Created:   ${createdCount}`);
  console.log(`- Repaired:  ${updatedCount}`);
  console.log(`- Main.scene UUID: ${mainSceneUuid || 'NOT FOUND'}`);

  // 2. Synchronize start-scene in settings/project.json
  if (mainSceneUuid) {
    if (fs.existsSync(SETTINGS_PROJECT_JSON)) {
      try {
        const projData = JSON.parse(fs.readFileSync(SETTINGS_PROJECT_JSON, 'utf8'));
        if (projData['start-scene'] !== mainSceneUuid) {
          const prevUuid = projData['start-scene'];
          projData['start-scene'] = mainSceneUuid;
          fs.writeFileSync(SETTINGS_PROJECT_JSON, JSON.stringify(projData, null, 2) + '\n');
          console.log(`✔ Updated settings/project.json "start-scene":`);
          console.log(`  From: ${prevUuid}`);
          console.log(`  To:   ${mainSceneUuid}`);
        } else {
          console.log(`✔ settings/project.json "start-scene" already matches Main.scene (${mainSceneUuid})`);
        }
      } catch (e) {
        console.error(`Error updating ${SETTINGS_PROJECT_JSON}:`, e.message);
      }
    } else {
      // Create settings/project.json if missing
      fs.mkdirSync(path.dirname(SETTINGS_PROJECT_JSON), { recursive: true });
      const defaultProjectSettings = {
        'design-resolution-width': 720,
        'design-resolution-height': 1280,
        'fit-width': true,
        'fit-height': true,
        'start-scene': mainSceneUuid
      };
      fs.writeFileSync(SETTINGS_PROJECT_JSON, JSON.stringify(defaultProjectSettings, null, 2) + '\n');
      console.log(`✔ Created ${SETTINGS_PROJECT_JSON} with start-scene: ${mainSceneUuid}`);
    }

    // Synchronize settings/v2/packages/project.json if present
    if (fs.existsSync(SETTINGS_V2_PROJECT_JSON)) {
      try {
        const v2ProjData = JSON.parse(fs.readFileSync(SETTINGS_V2_PROJECT_JSON, 'utf8'));
        if (v2ProjData.general && v2ProjData.general.startScene !== mainSceneUuid) {
          v2ProjData.general.startScene = mainSceneUuid;
          fs.writeFileSync(SETTINGS_V2_PROJECT_JSON, JSON.stringify(v2ProjData, null, 2) + '\n');
          console.log(`✔ Synchronized settings/v2/packages/project.json startScene: ${mainSceneUuid}`);
        }
      } catch (e) {
        console.error(`Error updating ${SETTINGS_V2_PROJECT_JSON}:`, e.message);
      }
    }

    // Synchronize profiles/v2/packages/builder.json if present
    if (fs.existsSync(BUILDER_JSON)) {
      try {
        const builderData = JSON.parse(fs.readFileSync(BUILDER_JSON, 'utf8'));
        let builderModified = false;
        if (builderData.common) {
          if (builderData.common.startScene !== mainSceneUuid) {
            builderData.common.startScene = mainSceneUuid;
            builderModified = true;
          }
          if (Array.isArray(builderData.common.scenes)) {
            for (const sc of builderData.common.scenes) {
              if (sc.url && sc.url.includes('Main.scene') && sc.uuid !== mainSceneUuid) {
                sc.uuid = mainSceneUuid;
                builderModified = true;
              }
            }
          }
        }
        if (builderModified) {
          fs.writeFileSync(BUILDER_JSON, JSON.stringify(builderData, null, 2) + '\n');
          console.log(`✔ Synchronized profiles/v2/packages/builder.json scene configurations`);
        }
      } catch (e) {
        console.error(`Error updating ${BUILDER_JSON}:`, e.message);
      }
    }
  } else {
    console.warn('! Warning: No .scene file found to set as start-scene.');
  }

  console.log('--- Sync Completed Successfully ---');
}

if (require.main === module) {
  runSync();
}

module.exports = {
  runSync,
  generateConsistentUuid,
  getImporter,
  UUID_REGEX
};
