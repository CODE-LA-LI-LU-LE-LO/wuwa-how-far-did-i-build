import { readFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

function fail(message) {
  failures.push(message);
}

async function readText(path) {
  return readFile(resolve(root, path), "utf8");
}

async function mustExist(path) {
  try {
    const info = await stat(resolve(root, path));
    if (!info.isFile()) fail(`${path} is not a file`);
  } catch {
    fail(`${path} is missing`);
  }
}

function localReferences(html) {
  const refs = [];
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const ref = match[1];
    if (/^(https?:|data:|#)/.test(ref)) continue;
    refs.push(ref);
  }
  return refs;
}

function loadCharacterSeed(source) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "data/characters.js" });
  return sandbox.window.WW_CHARACTER_SEED;
}

function createDomStub() {
  const classList = {
    add() {},
    remove() {},
    toggle() {},
  };

  const element = {
    value: "",
    dataset: {},
    files: [],
    style: { setProperty() {} },
    classList,
    addEventListener() {},
    append() {},
    click() {},
    cloneNode() { return element; },
    close() {},
    focus() {},
    querySelector() { return element; },
    querySelectorAll() { return []; },
    remove() {},
    scrollIntoView() {},
    select() {},
    setAttribute() {},
    showModal() {},
    get content() { return element; },
    set innerHTML(value) { this._innerHTML = value; },
    get innerHTML() { return this._innerHTML ?? ""; },
    set textContent(value) { this._textContent = value; },
    get textContent() { return this._textContent ?? ""; },
  };

  return {
    querySelector() { return element; },
    querySelectorAll() { return []; },
    createElement() { return element; },
    execCommand() { return true; },
    body: { append() {} },
  };
}

function smokeLoadApp({ configSource, characterSource, goalDefaultsSource, appSource }) {
  const storage = new Map();
  const sandbox = {
    Blob: class {},
    URL,
    URLSearchParams,
    TextDecoder,
    TextEncoder,
    atob: (value) => Buffer.from(value, "base64").toString("binary"),
    btoa: (value) => Buffer.from(value, "binary").toString("base64"),
    crypto: { randomUUID: () => "verify-id" },
    document: createDomStub(),
    history: { replaceState() {} },
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      removeItem: (key) => storage.delete(key),
      setItem: (key, value) => storage.set(key, value),
    },
    location: {
      hash: "",
      href: "https://example.test/tracker/",
      protocol: "https:",
    },
    navigator: {},
    window: null,
    addEventListener(event, callback) {
      if (event === "load") callback();
    },
    clearTimeout,
    console,
    setTimeout,
  };
  sandbox.window = sandbox;

  vm.createContext(sandbox);
  vm.runInContext(configSource, sandbox, { filename: "app-config.js" });
  vm.runInContext(characterSource, sandbox, { filename: "data/characters.js" });
  vm.runInContext(goalDefaultsSource, sandbox, { filename: "data/goal-defaults.js" });
  vm.runInContext(appSource, sandbox, { filename: "app.js" });
  return sandbox;
}

const requiredRootFiles = [
  ".nojekyll",
  "app-config.js",
  "app-config.example.js",
  "app.js",
  "firebase.json",
  "firestore.rules",
  "index.html",
  "manifest.webmanifest",
  "data/goal-defaults.json",
  "data/goal-defaults.js",
  "styles.css",
  "sw.js",
];

const requiredIconFiles = [
  "assets/icons/elements/aero.webp",
  "assets/icons/elements/electro.webp",
  "assets/icons/elements/fusion.webp",
  "assets/icons/elements/glacio.webp",
  "assets/icons/elements/havoc.webp",
  "assets/icons/elements/spectro.webp",
  "assets/icons/weapons/broadblade.webp",
  "assets/icons/weapons/gauntlets.webp",
  "assets/icons/weapons/pistols.webp",
  "assets/icons/weapons/rectifier.webp",
  "assets/icons/weapons/sword.webp",
  "assets/icons/stats/atk.webp",
  "assets/icons/stats/crit.webp",
  "assets/icons/stats/critdmg.webp",
  "assets/icons/stats/def.webp",
  "assets/icons/stats/energy.webp",
  "assets/icons/stats/heal.webp",
  "assets/icons/stats/hp.webp",
  "assets/icons/ui/lock-closed.svg",
];

for (const file of requiredRootFiles) {
  await mustExist(file);
}

for (const file of requiredIconFiles) {
  await mustExist(file);
}

for (let index = 1; index <= 31; index += 1) {
  await mustExist(`assets/icons/echoes/set_${index}.webp`);
}

const html = await readText("index.html");
const appSource = await readText("app.js");
for (const ref of localReferences(html)) {
  await mustExist(ref);
}

const htmlIds = new Set([...html.matchAll(/id="([^"]+)"/g)].map((match) => match[1]));
for (const match of appSource.matchAll(/querySelector(?:All)?\(\s*["']#([A-Za-z0-9_-]+)["']\s*\)/g)) {
  const id = match[1];
  if (!htmlIds.has(id)) fail(`app.js references missing DOM id #${id}`);
}

for (const attribute of [
  "data-view",
  "data-close-dialog",
  'data-sort="weapon"',
  'data-sort="rarity"',
  'id="newRarity"',
  "data-field",
  'data-field="manualComplete"',
  'data-field="priority"',
  'data-field="nextAction"',
  'data-field="notes"',
]) {
  if (!html.includes(attribute)) fail(`index.html missing ${attribute}`);
}

for (const requiredSource of [
  "MAX_IMAGE_BYTES",
  "resolveImageInput",
  "2MB 이하 이미지만 업로드할 수 있습니다",
  "data-add-stat",
  "data-remove-stat",
  "목표</button>",
  "수동 입력</button>",
  "편집</button>",
  "weaponOrder",
  "getWeaponSortScore",
  "getRarity",
  "card-backdrop-image",
  "card-select-surface",
  "normalizeEchoSetName",
  "Lingering Tunes",
  "끊임없는 잔향",
]) {
  if (!appSource.includes(requiredSource)) fail(`app.js missing ${requiredSource}`);
}

const manifest = JSON.parse(await readText("manifest.webmanifest"));
if (manifest.display !== "standalone") fail("manifest display must be standalone");
if (!Array.isArray(manifest.icons) || manifest.icons.length === 0) fail("manifest must include icons");
for (const icon of manifest.icons ?? []) {
  await mustExist(icon.src);
}

const config = await readText("app-config.js");
const configExample = await readText("app-config.example.js");
for (const field of ["apiKey", "authDomain", "projectId", "appId"]) {
  if (!config.includes(field)) fail(`app-config.js missing ${field}`);
  if (!configExample.includes(field)) fail(`app-config.example.js missing ${field}`);
}
for (const [path, source] of [
  ["app-config.js", config],
  ["app-config.example.js", configExample],
]) {
  if (/\b(adminEmails|adminUids)\b/.test(source)) {
    fail(`${path} must not include frontend admin identifier lists`);
  }
  if (/\b(serviceAccount|privateKey|PRIVATE KEY|Admin SDK)\b/.test(source)) {
    fail(`${path} must not include private Firebase credentials`);
  }
}
if (/\b(adminEmails|adminUids)\b/.test(appSource)) {
  fail("app.js must not parse admin email/uid lists from frontend config");
}
for (const requiredAdminSource of [
  "function isAdmin()",
  "cloud?.auth.currentUser",
  "state.user?.role === userRoles.admin",
  "cloud.doc(cloud.db, \"admins\", user.uid)",
  "adminSnapshot.data()?.enabled === true",
  "async function saveCloudAdminCharacters()",
  "async function saveCloudAdminGoalDefaults()",
  "if (!isAdmin()) return;",
]) {
  if (!appSource.includes(requiredAdminSource)) {
    fail(`app.js missing admin verification guard: ${requiredAdminSource}`);
  }
}

const characterSeed = loadCharacterSeed(await readText("data/characters.js"));
if (!Array.isArray(characterSeed) || characterSeed.length < 60) {
  fail("character seed should include at least 60 entries");
}
for (const [index, character] of (characterSeed ?? []).entries()) {
  for (const field of ["name", "element", "weapon", "rarity", "image"]) {
    if (!character[field]) fail(`character seed ${index} missing ${field}`);
  }
  if (!["4", "5"].includes(String(character.rarity))) {
    fail(`character seed ${index} has invalid rarity`);
  }
  if (!/^assets\/characters\/[a-z0-9-]+\.(webp|png)$/.test(character.image)) {
    fail(`character seed ${index} has invalid local image path`);
  }
  await mustExist(character.image);
}

const sw = await readText("sw.js");
if (!sw.includes("NETWORK_FIRST_PATHS")) fail("service worker missing network-first list");
if (!sw.includes("/app-config.js")) fail("service worker should network-first app-config.js");
if (!sw.includes("/data/characters.js")) fail("service worker should network-first data/characters.js");
const appShell = sw.match(/const APP_SHELL = \[([\s\S]*?)\];/)?.[1] ?? "";
if (appShell.includes("app-config.js")) fail("app-config.js should not be precached");
if (appShell.includes("data/characters.js")) fail("data/characters.js should not be precached");

const rules = await readText("firestore.rules");
if (!rules.includes("match /profiles/{userId}")) fail("firestore rules must protect profiles/{userId}");
if (!rules.includes("request.auth.uid == userId")) fail("firestore rules must require owner uid");
if (!rules.includes("allow read, write: if false")) fail("firestore rules must deny fallback access");
for (const requiredRuleSource of [
  "match /admins/{userId}",
  "allow get: if signedIn() && request.auth.uid == userId;",
  "allow list: if false;",
  "allow create, update, delete: if false;",
  "match /admin/{docId}",
  "allow write: if isAdmin();",
]) {
  if (!rules.includes(requiredRuleSource)) {
    fail(`firestore rules missing admin protection: ${requiredRuleSource}`);
  }
}

try {
  smokeLoadApp({
    configSource: await readText("app-config.js"),
    characterSource: await readText("data/characters.js"),
    goalDefaultsSource: await readText("data/goal-defaults.js"),
    appSource,
  });
} catch (error) {
  fail(`app smoke load failed: ${error.message}`);
}

try {
  const missingConfigSandbox = smokeLoadApp({
    configSource: `
      window.WW_TRACKER_CONFIG = {
        firebase: {
          apiKey: "",
          authDomain: "",
          projectId: "",
          appId: "",
        },
      };
    `,
    characterSource: await readText("data/characters.js"),
    goalDefaultsSource: await readText("data/goal-defaults.js"),
    appSource,
  });
  if (missingConfigSandbox.isAdmin() !== false) {
    fail("isAdmin() must default to false without a signed-in Firebase user");
  }
  if (missingConfigSandbox.hasFirebaseConfig() !== false) {
    fail("missing Firebase config should keep hasFirebaseConfig() false");
  }
} catch (error) {
  fail(`app missing-config smoke load failed: ${error.message}`);
}

if (failures.length > 0) {
  throw new Error(`Static verification failed:\n- ${failures.join("\n- ")}`);
}

console.log("Static verification passed.");
