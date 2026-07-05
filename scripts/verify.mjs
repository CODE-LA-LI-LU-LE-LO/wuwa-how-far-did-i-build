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
  return JSON.parse(source);
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
    body: { append() {}, classList },
  };
}

async function smokeLoadApp({ configSource, characterSource, goalDefaultsSource, appSource }) {
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
    CSS: { escape: (value) => String(value) },
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
    fetch: async (url) => {
      if (String(url).endsWith("data/characters.json")) {
        return { ok: true, status: 200, json: async () => JSON.parse(characterSource) };
      }
      if (String(url).endsWith("data/goal-defaults.json")) {
        return { ok: true, status: 200, json: async () => JSON.parse(goalDefaultsSource) };
      }
      return { ok: false, status: 404, json: async () => ({}) };
    },
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
  vm.runInContext(appSource, sandbox, { filename: "app.js" });
  sandbox.__getState = vm.runInContext("() => state", sandbox);
  await new Promise((resolve) => setTimeout(resolve, 0));
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
  "styles.css",
  "sw.js",
  "data/characters.json",
  "data/goal-defaults.json",
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
const stylesSource = await readText("styles.css");
const goalDefaultsSource = await readText("data/goal-defaults.json");
try {
  JSON.parse(goalDefaultsSource);
} catch (error) {
  fail(`data/goal-defaults.json must be valid JSON: ${error.message}`);
}
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

for (const removedStickySource of [
  "sticky-toggle",
  "focus-strip-sentinel",
  "focus-sticky-toggle",
  "hasScrolledPastElement",
  "syncStickySectionCollapse",
  "updateFocusStripStickiness",
  "is-toolbar-collapsed",
  "has-category-filter",
]) {
  if (html.includes(removedStickySource)) fail(`index.html should not include removed sticky UI source: ${removedStickySource}`);
  if (appSource.includes(removedStickySource)) fail(`app.js should not include removed sticky UI source: ${removedStickySource}`);
  if (stylesSource.includes(removedStickySource)) fail(`styles.css should not include removed sticky UI source: ${removedStickySource}`);
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
  "getInitialDetailPickerOptionIndex",
  'aria-haspopup="listbox"',
  "수치입력",
  "<span>속성</span>",
]) {
  if (!appSource.includes(requiredSource)) fail(`app.js missing ${requiredSource}`);
}

const manifest = JSON.parse(await readText("manifest.webmanifest"));
if (manifest.display !== "standalone") fail("manifest display must be standalone");
if (!Array.isArray(manifest.icons) || manifest.icons.length === 0) fail("manifest must include icons");

if (!appSource.includes('const statVariantOptions = ["-", "A", "B", "C", "D", "E", "F"];')) {
  fail("app.js must provide stat branch options from - through A-F");
}
if (!/const valueStatOptions = \[[\s\S]*"healingBonus"[\s\S]*\]\.map/.test(appSource)) {
  fail("app.js value stat options must include healingBonus for numeric input attributes");
}
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
  "async function loadGoalDefaultsData()",
  `fetch("data/goal-defaults.json"`,
  "function getGoalDefaultsExportData()",
  "function offerCharactersJsonDownload()",
  "function downloadCharactersJson()",
  "downloadCharactersJson();",
  "if (!isAdmin()) return;",
]) {
  if (!appSource.includes(requiredAdminSource)) {
    fail(`app.js missing admin verification guard: ${requiredAdminSource}`);
  }
}

const characterSeed = loadCharacterSeed(await readText("data/characters.json"));
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
for (const networkFirstPath of ["/index.html", "/app.js", "/styles.css"]) {
  if (!sw.includes(networkFirstPath)) fail(`service worker should network-first ${networkFirstPath}`);
}
if (!sw.includes("/app-config.js")) fail("service worker should network-first app-config.js");
if (!sw.includes("/data/characters.json")) fail("service worker should network-first data/characters.json");
if (!sw.includes("/data/goal-defaults.json")) fail("service worker should network-first data/goal-defaults.json");
const appShell = sw.match(/const APP_SHELL = \[([\s\S]*?)\];/)?.[1] ?? "";
if (appShell.includes("app-config.js")) fail("app-config.js should not be precached");
if (appShell.includes("data/characters.json")) fail("data/characters.json should not be precached");
if (appShell.includes("data/goal-defaults.json")) fail("data/goal-defaults.json should not be precached");

const rules = await readText("firestore.rules");
if (!rules.includes("match /profiles/{userId}")) fail("firestore rules must protect profiles/{userId}");
if (!rules.includes("request.auth.uid == userId")) fail("firestore rules must require owner uid");
if (!rules.includes("allow read, write: if false")) fail("firestore rules must deny fallback access");
for (const requiredRuleSource of [
  "match /admins/{userId}",
  "allow get: if signedIn() && request.auth.uid == userId;",
  "allow list: if false;",
  "allow create, update, delete: if false;",
]) {
  if (!rules.includes(requiredRuleSource)) {
    fail(`firestore rules missing admin protection: ${requiredRuleSource}`);
  }
}

try {
  await smokeLoadApp({
    configSource: await readText("app-config.js"),
    characterSource: await readText("data/characters.json"),
    goalDefaultsSource,
    appSource,
  });
} catch (error) {
  fail(`app smoke load failed: ${error.message}`);
}

try {
  const missingConfigSandbox = await smokeLoadApp({
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
    characterSource: await readText("data/characters.json"),
    goalDefaultsSource,
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

try {
  const syncSandbox = await smokeLoadApp({
    configSource: await readText("app-config.js"),
    characterSource: await readText("data/characters.json"),
    goalDefaultsSource,
    appSource,
  });
  const [seedCharacter] = JSON.parse(await readText("data/characters.json"));
  const normalizedState = syncSandbox.normalizeState({
    user: { role: "user" },
    updatedAt: "2026-01-01T00:00:00.000Z",
    goalDefaultsVersion: 2,
    characters: [
      {
        id: "saved-id",
        name: seedCharacter.name,
        en: seedCharacter.en,
        element: "저장된 속성",
        weapon: "저장된 무기",
        rarity: "1",
        image: "saved.webp",
        isPublic: seedCharacter.isPublic === false,
        owned: true,
      },
    ],
  });
  const [normalizedCharacter] = normalizedState.characters;
  if (
    normalizedCharacter?.element !== seedCharacter.element ||
    normalizedCharacter?.weapon !== seedCharacter.weapon ||
    normalizedCharacter?.rarity !== String(seedCharacter.rarity) ||
    normalizedCharacter?.image !== seedCharacter.image ||
    normalizedCharacter?.isPublic !== (seedCharacter.isPublic !== false) ||
    normalizedCharacter?.owned !== true
  ) {
    fail("seed character data must override saved character metadata while preserving user state");
  }
} catch (error) {
  fail(`app seed priority verification failed: ${error.message}`);
}

try {
  const initialSearchSandbox = await smokeLoadApp({
    configSource: await readText("app-config.js"),
    characterSource: await readText("data/characters.json"),
    goalDefaultsSource,
    appSource,
  });
  if (initialSearchSandbox.extractHangulInitialConsonants("떠오르는 구름") !== "ㄸㅇㄹㄴ ㄱㄹ") {
    fail("echo set initial search must extract Korean initials from Hangul names");
  }
  if (initialSearchSandbox.isHangulConsonantQuery("ㄱㄹ") !== true) {
    fail("echo set initial search must recognize consonant-only queries");
  }
  if (initialSearchSandbox.isHangulConsonantQuery("구름") !== false) {
    fail("echo set initial search must not treat full Hangul syllables as consonant-only queries");
  }
  if (initialSearchSandbox.normalizeEchoSetInitialSearchValue("떠오르는 구름").includes("ㄱㄹ") !== true) {
    fail("echo set initial search must allow consonant includes matching");
  }
} catch (error) {
  fail(`app echo set initial search verification failed: ${error.message}`);
}

try {
  const currentStatSyncSandbox = await smokeLoadApp({
    configSource: await readText("app-config.js"),
    characterSource: await readText("data/characters.json"),
    goalDefaultsSource,
    appSource,
  });
  const character = currentStatSyncSandbox.createCharacter({
    name: "테스트",
    element: "미정",
    weapon: "미정",
  });
  character.goals.admin.stats = [
    { key: "atk", label: "공격력", target: 2000, cost: "COST 1", variant: "A" },
    { key: "atk", label: "공격력", target: 2000, cost: "COST 1", variant: "B" },
    { key: "hp", label: "HP", target: 20000, cost: "COST 1", variant: "-" },
  ];
  currentStatSyncSandbox.__getState().characters = [character];
  currentStatSyncSandbox.updateCurrentStat(character.id, "A:atk", 200);
  if (
    character.currentStats.values["A:atk"] !== 200 ||
    character.currentStats.values["B:atk"] !== 200
  ) {
    fail("current stat inputs with the same attribute must sync across branch variants");
  }
  currentStatSyncSandbox.updateCurrentStat(character.id, "B:atk", 350);
  if (
    character.currentStats.values["A:atk"] !== 350 ||
    character.currentStats.values["B:atk"] !== 350
  ) {
    fail("later current stat edits must overwrite matching attribute branch values");
  }
  if (character.currentStats.values.hp === 350) {
    fail("current stat sync must not overwrite different attributes");
  }
} catch (error) {
  fail(`app current stat sync verification failed: ${error.message}`);
}

if (failures.length > 0) {
  throw new Error(`Static verification failed:\n- ${failures.join("\n- ")}`);
}

console.log("Static verification passed.");
