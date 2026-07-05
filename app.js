const STORAGE_KEY = "ww-farming-tracker-v2";
const FIREBASE_VERSION = "10.12.5";
const SHARE_URL_WARN_LENGTH = 6000;
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const GOAL_DEFAULT_VERSION = "2026-07-value-stat-variants-reset";
const DEFAULT_CHARACTER_SORT_LOCALE = "ko";
const CONFIG = window.WW_TRACKER_CONFIG ?? {};
const HANGUL_BASE_CODE = 0xac00;
const HANGUL_LAST_CODE = 0xd7a3;
const HANGUL_SYLLABLE_COUNT = 588;
const HANGUL_INITIAL_CONSONANTS = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];
const HANGUL_COMPAT_CONSONANT_PATTERN = /^[ㄱ-ㅎ\s]+$/;

const elementColors = {
  회절: "#ffd75a",
  응결: "#88d7ff",
  용융: "#ff8c66",
  전도: "#b58cff",
  기류: "#5ce4d0",
  인멸: "#ff78aa",
  미정: "#9fb1c4",
};

const elementIcons = {
  기류: "assets/icons/elements/aero.webp",
  용융: "assets/icons/elements/fusion.webp",
  응결: "assets/icons/elements/glacio.webp",
  전도: "assets/icons/elements/electro.webp",
  인멸: "assets/icons/elements/havoc.webp",
  회절: "assets/icons/elements/spectro.webp",
};

const weaponIcons = {
  대검: "assets/icons/weapons/broadblade.webp",
  직검: "assets/icons/weapons/sword.webp",
  권총: "assets/icons/weapons/pistols.webp",
  증폭기: "assets/icons/weapons/rectifier.webp",
  권갑: "assets/icons/weapons/gauntlets.webp",
};

const weaponOrder = ["직검", "대검", "권총", "권갑", "증폭기", "미정"];

const statOptions = [
  {
    key: "critRate",
    label: "크리확률",
    icon: "assets/icons/stats/crit.webp",
    defaultTarget: 70,
  },
  {
    key: "critDamage",
    label: "크리피해",
    icon: "assets/icons/stats/critdmg.webp",
    defaultTarget: 280,
  },
  {
    key: "energy",
    label: "공명효율",
    icon: "assets/icons/stats/energy.webp",
    defaultTarget: 130,
  },
  {
    key: "attack",
    label: "공격력%",
    icon: "assets/icons/stats/atk.webp",
    defaultTarget: 2100,
  },
  {
    key: "hp",
    label: "체력%",
    icon: "assets/icons/stats/hp.webp",
    defaultTarget: 0,
  },
  {
    key: "healingBonus",
    label: "치료효과+",
    icon: "assets/icons/stats/heal.webp",
    defaultTarget: 0,
  },
  {
    key: "defense",
    label: "방어력",
    icon: "assets/icons/stats/def.webp",
    defaultTarget: 0,
  },
  {
    key: "aeroDamage",
    label: "기류피증",
    icon: elementIcons.기류,
    defaultTarget: 0,
  },
  {
    key: "fusionDamage",
    label: "용융피증",
    icon: elementIcons.용융,
    defaultTarget: 0,
  },
  {
    key: "glacioDamage",
    label: "응결피증",
    icon: elementIcons.응결,
    defaultTarget: 0,
  },
  {
    key: "electroDamage",
    label: "전도피증",
    icon: elementIcons.전도,
    defaultTarget: 0,
  },
  {
    key: "havocDamage",
    label: "인멸피증",
    icon: elementIcons.인멸,
    defaultTarget: 0,
  },
  {
    key: "spectroDamage",
    label: "회절피증",
    icon: elementIcons.회절,
    defaultTarget: 0,
  },
];

const valueStatLabels = {
  attack: "공격력",
  hp: "체력",
};
const valueStatOptions = [
  "critRate",
  "critDamage",
  "energy",
  "attack",
  "defense",
  "hp",
  "healingBonus",
].map((key) => {
  const option = statOptions.find((item) => item.key === key);
  return {
    ...option,
    label: valueStatLabels[key] ?? option.label,
  };
});
const statCostOptions = ["COST 4", "COST 3", "COST 1"];
const statVariantOptions = ["-", "A", "B", "C", "D", "E", "F"];
const echoSetPieceOptions = ["5 Set", "3 Set", "2 Set", "1 Set"];
const echoSetJoinOptions = ["+", "OR"];

const echoSets = [
  {
    en: "Freezing Frost",
    name: "야밤의 서리",
    icon: "assets/icons/echoes/set_1.webp",
  },
  {
    en: "Molten Rift",
    name: "솟구치는 용암",
    icon: "assets/icons/echoes/set_2.webp",
  },
  {
    en: "Void Thunder",
    name: "울려퍼지는 뇌음",
    icon: "assets/icons/echoes/set_3.webp",
  },
  {
    en: "Sierra Gale",
    name: "스쳐가는 바람",
    icon: "assets/icons/echoes/set_4.webp",
  },
  {
    en: "Celestial Light",
    name: "빛나는 별",
    icon: "assets/icons/echoes/set_5.webp",
  },
  {
    en: "Havoc Eclipse",
    name: "빛을 삼키는 해",
    icon: "assets/icons/echoes/set_6.webp",
  },
  {
    en: "Rejuvenating Glow",
    name: "찬란한 광휘",
    icon: "assets/icons/echoes/set_7.webp",
  },
  {
    en: "Moonlit Clouds",
    name: "떠오르는 구름",
    icon: "assets/icons/echoes/set_8.webp",
  },
  {
    en: "Lingering Tunes",
    name: "끊임없는 잔향",
    icon: "assets/icons/echoes/set_9.webp",
  },
  {
    en: "Frosty Resolve",
    name: "냉철한 결단",
    icon: "assets/icons/echoes/set_10.webp",
  },
  {
    en: "Eternal Radiance",
    name: "영원의 광채",
    icon: "assets/icons/echoes/set_11.webp",
  },
  {
    en: "Midnight Veil",
    name: "어둠의 장막",
    icon: "assets/icons/echoes/set_12.webp",
  },
  {
    en: "Empyrean Anthem",
    name: "하늘의 합주곡",
    icon: "assets/icons/echoes/set_13.webp",
  },
  {
    en: "Tidebreaking Courage",
    name: "파도에 맞선 용기",
    icon: "assets/icons/echoes/set_14.webp",
  },
  {
    en: "Gusts of Welkin",
    name: "끝없는 하늘",
    icon: "assets/icons/echoes/set_15.webp",
  },
  {
    en: "Windward Pilgrimage",
    name: "영광이 깃든 바람",
    icon: "assets/icons/echoes/set_17.webp",
  },
  {
    en: "Flaming Clawprint",
    name: "울부짖는 늑대의 불꽃",
    icon: "assets/icons/echoes/set_16.webp",
  },
  {
    en: "Dream of the Lost",
    name: "뒤틀린 피안의 꿈",
    icon: "assets/icons/echoes/set_18.webp",
  },
  {
    en: "Crown of Valor",
    name: "영광의 칼날로 만들어진 왕관",
    icon: "assets/icons/echoes/set_19.webp",
  },
  {
    en: "Law of Harmony",
    name: "만물의 숨결에 비롯된 울림",
    icon: "assets/icons/echoes/set_20.webp",
  },
  {
    en: "Flamewing's Shadow",
    name: "불타는 깃털을 펼친 사냥꾼의 그림자",
    icon: "assets/icons/echoes/set_21.webp",
  },
  {
    en: "Thread of Severed Fate",
    name: "운명을 붕괴시키는 현",
    icon: "assets/icons/echoes/set_22.webp",
  },
  {
    en: "Pact of Neonlight Leap",
    name: "역광 속 눈부신 서약",
    icon: "assets/icons/echoes/set_24.webp",
  },
  {
    en: "Halo of Starry Radiance",
    name: "빛을 쫓는 별의 고리",
    icon: "assets/icons/echoes/set_23.webp",
  },
  {
    en: "Rite of Gilded Revelation",
    name: "흐르는 금빛 속 진리의 답",
    icon: "assets/icons/echoes/set_25.webp",
  },
  {
    en: "Trailblazing Star",
    name: "긴 여정을 떠나는 별",
    icon: "assets/icons/echoes/set_26.webp",
  },
  {
    en: "Chromatic Foam",
    name: "오색찬란한 거품",
    icon: "assets/icons/echoes/set_27.webp",
  },
  {
    en: "Sound of True Name",
    name: "함의의 소리를 따라",
    icon: "assets/icons/echoes/set_28.webp",
  },
  {
    en: "Wishes of Quiet Snowfall",
    name: "소리 없이 내려앉은 기도의 눈",
    icon: "assets/icons/echoes/set_30.webp",
  },
  {
    en: "Reel of Spliced Memories",
    name: "마음을 엮은 꿈의 그림자",
    icon: "assets/icons/echoes/set_29.webp",
  },
  {
    en: "Shadow of Shattered Dreams",
    name: "꿈을 깨뜨리는 망령의 악몽",
    icon: "assets/icons/echoes/set_31.webp",
  },
];

let characterSeed = [];

const defaultFarm = {
  level: 0,
  weapon: 0,
  skill: 0,
  echo: 0,
  material: 0,
  priority: "mid",
  nextAction: "",
  notes: "",
};

const defaultGoal = {
  echoSet: "",
  echoSets: [{ join: "+", name: "", pieces: "5 Set" }],
  mainEchoes: [{ join: "OR", name: "" }],
  echoBuild: "43311",
  echoBuildAlt: "",
  mainEcho: "",
  note: "",
  echoStats: [
    {
      key: "critRate",
      label: "크리확률",
      cost: "COST 4",
      variant: "A",
      branchChecked: false,
    },
    {
      key: "critDamage",
      label: "크리피해",
      cost: "COST 3",
      variant: "A",
      branchChecked: false,
    },
    {
      key: "energy",
      label: "공명효율",
      cost: "COST 3",
      variant: "A",
      branchChecked: false,
    },
    {
      key: "attack",
      label: "공격력%",
      cost: "COST 1",
      variant: "A",
      branchChecked: false,
    },
  ],
  stats: [
    {
      key: "critRate",
      label: "크리확률",
      target: 70,
      cost: "COST 4",
      variant: "-",
    },
    {
      key: "critDamage",
      label: "크리피해",
      target: 260,
      cost: "COST 3",
      variant: "-",
    },
    {
      key: "energy",
      label: "공명효율",
      target: 120,
      cost: "COST 3",
      variant: "-",
    },
    {
      key: "attack",
      label: "공격력",
      target: 2200,
      cost: "COST 1",
      variant: "-",
    },
  ],
};

const defaultCurrentStats = {
  echoSet: "",
  mainEcho: "",
  note: "",
  values: {
    critRate: 0,
    critDamage: 0,
    energy: 0,
    attack: 0,
    hp: 0,
    healingBonus: 0,
    defense: 0,
    aeroDamage: 0,
    fusionDamage: 0,
    glacioDamage: 0,
    electroDamage: 0,
    havocDamage: 0,
    spectroDamage: 0,
  },
};

let adminGoalDefaults = {};

const rosterList = document.querySelector("#rosterList");
const detailPanel = document.querySelector("#detailPanel");
const detailTemplate = document.querySelector("#detailTemplate");
const searchInput = document.querySelector("#searchInput");
const ownedCount = document.querySelector("#ownedCount");
const activePlans = document.querySelector("#activePlans");
const avgProgress = document.querySelector("#avgProgress");
const sessionName = document.querySelector("#sessionName");
const sessionHint = document.querySelector("#sessionHint");
const googleButton = document.querySelector("#googleButton");
const dialog = document.querySelector("#characterDialog");
const characterForm = document.querySelector("#characterForm");
const importInput = document.querySelector("#importInput");
const exportCharactersButton = document.querySelector("#exportCharactersButton");
const exportGoalDefaultsButton = document.querySelector("#exportGoalDefaultsButton");
const shareNotice = document.querySelector("#shareNotice");
const saveSnapshotButton = document.querySelector("#saveSnapshotButton");
const closeShareButton = document.querySelector("#closeShareButton");
const focusStrip = document.querySelector("#focusStrip");
const categoryRail = document.querySelector("#categoryRail");
const listEyebrow = document.querySelector("#listEyebrow");
const listTitle = document.querySelector("#listTitle");
const editCharacterId = document.querySelector("#editCharacterId");
const deleteCharacterButton = document.querySelector("#deleteCharacterButton");
const appTabs = document.querySelectorAll("[data-tab]");
const sortButtons = document.querySelectorAll("[data-sort]");
const farmingFilterInputs = document.querySelectorAll("[data-farm-filter]");
const visibilityFilterButtons = document.querySelectorAll("[data-visibility-filter]");
const compactDetailQuery =
  typeof window.matchMedia === "function"
    ? window.matchMedia("(max-width: 1440px)")
    : null;

let cloud = null;
let cloudSaveTimer = null;

const userRoles = {
  user: "user",
  admin: "admin",
};

function createDefaultUser() {
  return {
    role: userRoles.user,
  };
}

function createGoogleUser(user) {
  return {
    ...createDefaultUser(),
    provider: "google",
    uid: user.uid,
    name: user.displayName,
    email: user.email,
  };
}

function normalizeUser(user) {
  if (!user || typeof user !== "object") return createDefaultUser();
  const role = user.role === userRoles.admin ? userRoles.admin : userRoles.user;

  return {
    ...user,
    role,
  };
}

function isAdmin() {
  return Boolean(
    cloud?.auth.currentUser && state.user?.role === userRoles.admin,
  );
}

async function refreshAdminRole(user) {
  if (!user || !cloud) {
    state.user = createDefaultUser();
    return false;
  }

  let adminEnabled = false;
  try {
    const adminRef = cloud.doc(cloud.db, "admins", user.uid);
    const adminSnapshot = await cloud.getDoc(adminRef);
    adminEnabled =
      adminSnapshot.exists() && adminSnapshot.data()?.enabled === true;
  } catch {
    adminEnabled = false;
  }

  state.user = {
    ...createGoogleUser(user),
    role: adminEnabled ? userRoles.admin : userRoles.user,
  };
  return adminEnabled;
}

let sharedSnapshot = null;
let isSnapshotMode = false;
let state = {
  user: createDefaultUser(),
  goalDefaultsVersion: GOAL_DEFAULT_VERSION,
  characters: [],
};
let isDetailPanelCollapsed = Boolean(compactDetailQuery?.matches);
let selectedId = null;
let currentView = "all";
let searchTerm = "";
let activeTab = "ownership";
let sortMode = "name";
let activeCategory = "all";
let visibilityFilter = "all";
let farmingFilters = new Set(["owned"]);
let adminGoalEditingId = null;
let customGoalEditingId = null;

appTabs.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveTab(button.dataset.tab);
    render();
  });
});

function setActiveTab(tab, { resetCategory = false } = {}) {
  activeTab = tab;
  if (resetCategory) activeCategory = "all";
  customGoalEditingId = null;
  appTabs.forEach((item) =>
    item.classList.toggle("active", item.dataset.tab === tab),
  );
}

sortButtons.forEach((button) => {
  button.addEventListener("click", () => {
    sortMode = button.dataset.sort;
    activeCategory = "all";
    sortButtons.forEach((item) =>
      item.classList.toggle("active", item === button),
    );
    render();
  });
});

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    currentView = button.dataset.view;
    document
      .querySelectorAll("[data-view]")
      .forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    render();
  });
});

visibilityFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    visibilityFilter = button.dataset.visibilityFilter;
    visibilityFilterButtons.forEach((item) =>
      item.classList.toggle("active", item === button),
    );
    render();
  });
});

farmingFilterInputs.forEach((input) => {
  input.addEventListener("change", () => {
    if (input.dataset.farmFilter === "all" && input.checked) {
      farmingFilters = new Set(["all"]);
    } else {
      farmingFilters.delete("all");
      if (input.checked) farmingFilters.add(input.dataset.farmFilter);
      if (!input.checked) farmingFilters.delete(input.dataset.farmFilter);
      if (!farmingFilters.size) farmingFilters.add("all");
    }
    render();
  });
});

if (compactDetailQuery?.addEventListener) {
  compactDetailQuery.addEventListener("change", (event) => {
    isDetailPanelCollapsed = event.matches;
    syncDetailPanelMode();
  });
} else if (compactDetailQuery?.addListener) {
  compactDetailQuery.addListener((event) => {
    isDetailPanelCollapsed = event.matches;
    syncDetailPanelMode();
  });
}

detailPanel.addEventListener("click", (event) => {
  if (!isCompactDetailPanel() || !isDetailPanelCollapsed) return;
  event.preventDefault();
  isDetailPanelCollapsed = false;
  renderDetail();
});

searchInput.addEventListener("input", (event) => {
  searchTerm = event.target.value.trim().toLowerCase();
  renderRoster();
});

document.querySelector("#addCharacterButton").addEventListener("click", () => {
  openCharacterDialog();
});

characterForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!isAdmin()) {
    showSessionMessage(
      "관리자 권한 필요",
      "캐릭터 기본 정보는 관리자만 저장할 수 있습니다",
    );
    return;
  }
  const name = document.querySelector("#newName").value.trim();
  if (!name) return;
  const id = editCharacterId.value;
  const existing = state.characters.find((character) => character.id === id);
  let image = "";
  try {
    image = await resolveImageInput(
      document.querySelector("#newImage").value.trim(),
    );
  } catch (error) {
    showSessionMessage("이미지 저장 실패", error.message);
    return;
  }
  const payload = {
    name,
    en: document.querySelector("#newEn").value.trim(),
    element: document.querySelector("#newElement").value,
    weapon: document.querySelector("#newWeapon").value,
    rarity: document.querySelector("#newRarity").value,
    isPublic: document.querySelector("#newVisibility").value === "public",
    image,
  };

  let targetCharacter = null;
  const previousCharacter = existing ? structuredClone(existing) : null;
  const previousSelectedId = selectedId;

  if (existing) {
    Object.assign(existing, payload);
    selectedId = existing.owned ? existing.id : selectedId;
  } else {
    state.characters.push(createCharacter(payload));
  }

  saveState({ skipCloud: true });
  if (existing) {
    showSessionMessage(
      `${existing.name} 수정됨`,
      "캐릭터 기본 정보를 저장했습니다",
    );
  } else {
    showSessionMessage(`${name} 추가됨`, "새 캐릭터를 목록에 추가했습니다");
  }
  characterForm.reset();
  dialog.close();
  render();
  offerCharactersJsonDownload();
});

document.querySelector("[data-close-dialog]").addEventListener("click", () => {
  dialog.close();
});

document
  .querySelector("#newImageFile")
  .addEventListener("change", async (event) => {
    const [file] = event.target.files;
    if (!file) return;
    try {
      document.querySelector("#newImage").value =
        await readImageFileAsDataUrl(file);
      showSessionMessage("이미지 선택됨", "저장하면 캐릭터 카드에 반영됩니다");
    } catch (error) {
      event.target.value = "";
      showSessionMessage("이미지 선택 실패", error.message);
    }
  });

deleteCharacterButton.addEventListener("click", () => {
  if (!isAdmin()) {
    showSessionMessage(
      "관리자 권한 필요",
      "캐릭터 제거는 관리자만 사용할 수 있습니다",
    );
    return;
  }
  const id = editCharacterId.value;
  const character = state.characters.find((item) => item.id === id);
  if (!character) return;
  if (!confirm(`${character.name} 캐릭터를 제거할까요?`)) return;

  state.characters = state.characters.filter((item) => item.id !== id);
  if (selectedId === id)
    selectedId = getFirstOwnedCharacterId();
  saveState({ skipCloud: true });
  characterForm.reset();
  dialog.close();
  showSessionMessage(
    `${character.name} 제거됨`,
    "캐릭터 목록에서 제거했습니다",
  );
  render();
  offerCharactersJsonDownload();
});

document.querySelector("#exportButton").addEventListener("click", () => {
  const data = JSON.stringify(getPortableState(), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ww-farming-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showSessionMessage("백업 파일 생성", "현재 기록을 JSON으로 저장했습니다");
});

exportCharactersButton?.addEventListener("click", () => {
  if (!isAdmin()) return;
  downloadCharactersJson();
});

exportGoalDefaultsButton?.addEventListener("click", () => {
  if (!isAdmin()) return;
  const data = JSON.stringify(getGoalDefaultsExportData(), null, 2);
  const blob = new Blob([`${data}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "goal-defaults.json";
  link.click();
  URL.revokeObjectURL(url);
  showSessionMessage(
    "목표 JSON 생성",
    "다운로드한 파일을 data/goal-defaults.json으로 반영하세요",
  );
});

saveSnapshotButton.addEventListener("click", () => {
  isSnapshotMode = false;
  sharedSnapshot = null;
  clearShareHash();
  saveState({ force: true });
  shareNotice.classList.add("hidden");
  showSessionMessage(
    "내 기록으로 저장됨",
    "이 브라우저와 로그인 계정에 저장됩니다",
  );
  render();
});

closeShareButton.addEventListener("click", () => {
  shareNotice.classList.add("hidden");
});

importInput.addEventListener("change", async (event) => {
  const [file] = event.target.files;
  if (!file) return;

  try {
    const imported = JSON.parse(await file.text());
    if (!Array.isArray(imported.characters)) throw new Error("invalid-state");
    state = normalizeState(imported);
    selectedId =
      state.characters.find((character) => character.owned)?.id ?? null;
    isSnapshotMode = false;
    saveState({ force: true });
    render();
    showSessionMessage("불러오기 완료", "가져온 기록을 저장했습니다");
  } catch {
    showSessionMessage(
      "불러오기 실패",
      "올바른 백업 JSON 파일인지 확인해주세요",
    );
  } finally {
    importInput.value = "";
  }
});

googleButton.addEventListener("click", async () => {
  if (!hasFirebaseConfig()) {
    showSessionMessage(
      "Firebase 설정 필요",
      "app-config.js에 Firebase 웹앱 설정을 입력해주세요",
    );
    updateGoogleButton("setup");
    return;
  }

  try {
    await ensureCloud();
    if (cloud.auth.currentUser) {
      await cloud.signOut();
      return;
    }
    await cloud.signIn();
  } catch (error) {
    showSessionMessage("로그인 실패", getReadableAuthError(error));
  }
});

async function loadCharacterSeedData() {
  try {
    const response = await fetch("data/characters.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const characters = await response.json();
    characterSeed = Array.isArray(characters) ? characters : [];
  } catch {
    characterSeed = [];
    showSessionMessage("캐릭터 목록 불러오기 실패", "data/characters.json을 확인해주세요");
  }
}

function initializeState() {
  sharedSnapshot = readSharedSnapshot();
  isSnapshotMode = Boolean(sharedSnapshot);
  state = sharedSnapshot ?? loadState();
  selectedId = getFirstOwnedCharacterId();
}

function getFirstOwnedCharacterId(excludedId = "") {
  return (
    [...state.characters]
      .filter((character) => character.owned && character.id !== excludedId)
      .sort(compareCharacterNames)[0]?.id ?? null
  );
}

function compareCharacterNames(a, b) {
  return a.name.localeCompare(b.name, getCharacterSortLocale());
}

function getCharacterSortLocale() {
  return DEFAULT_CHARACTER_SORT_LOCALE;
}

function loadState() {
  const saved =
    localStorage.getItem(STORAGE_KEY) ??
    localStorage.getItem("ww-farming-tracker-v1");
  if (!saved) return createDefaultState();

  try {
    return normalizeState(JSON.parse(saved));
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return createDefaultState();
  }
}

function createDefaultState() {
  return {
    user: createDefaultUser(),
    goalDefaultsVersion: GOAL_DEFAULT_VERSION,
    characters: createSeedCharacters(),
  };
}

function normalizeState(nextState) {
  const resetGoals = nextState.goalDefaultsVersion !== GOAL_DEFAULT_VERSION;
  const characters = Array.isArray(nextState.characters)
    ? nextState.characters.map((character) =>
        normalizeCharacter(character, resetGoals),
      )
    : createSeedCharacters();

  return {
    user: normalizeUser(nextState.user),
    updatedAt: nextState.updatedAt ?? null,
    goalDefaultsVersion: GOAL_DEFAULT_VERSION,
    characters: mergeSeedCharacters(characters),
  };
}

function createSeedCharacters() {
  return characterSeed.map((character) => createCharacter(character));
}

function mergeSeedCharacters(characters) {
  const existingKeys = new Set(
    characters.map((character) => {
      const seed =
        findSeedCharacter(character.name) ?? findSeedCharacter(character.en);
      return seed?.en ?? seed?.name ?? character.en ?? character.name;
    }),
  );
  const missingSeedCharacters = createSeedCharacters().filter((character) => {
    const key = character.en || character.name;
    return !existingKeys.has(key);
  });
  return [...characters, ...missingSeedCharacters];
}

function normalizeCharacter(character, resetGoals = false) {
  const seed =
    findSeedCharacter(character.name) ?? findSeedCharacter(character.en);
  const seedCharacter = seed
    ? {
        name: seed.name,
        en: seed.en ?? "",
        element: seed.element ?? "회절",
        weapon: seed.weapon ?? "직검",
        rarity: String(seed.rarity ?? "5"),
        image: seed.image ?? "",
        isPublic: seed.isPublic ?? true,
      }
    : {};
  const merged = {
    ...createCharacter(seed ?? character),
    ...character,
    ...seedCharacter,
  };

  delete merged.version;

  return {
    ...merged,
    farm: { ...defaultFarm, ...character.farm },
    goalMode: character.goalMode === "custom" ? "custom" : "admin",
    goals: normalizeGoals(character.goals, resetGoals, merged),
    currentStats: normalizeCurrentStats(character.currentStats),
    isPublic: merged.isPublic !== false,
  };
}

function createCharacter(input = {}) {
  const character =
    typeof input === "string"
      ? { name: input, element: arguments[1], weapon: arguments[2] }
      : input;
  const seed =
    findSeedCharacter(character.name) ?? findSeedCharacter(character.en);
  return {
    id: createId(),
    name: character.name ?? seed?.name ?? "새 캐릭터",
    en: character.en ?? seed?.en ?? "",
    element: character.element ?? seed?.element ?? "회절",
    weapon: character.weapon ?? seed?.weapon ?? "직검",
    rarity: String(character.rarity ?? seed?.rarity ?? "5"),
    image: character.image ?? seed?.image ?? "",
    isPublic: character.isPublic ?? seed?.isPublic ?? true,
    owned: false,
    farm: { ...defaultFarm },
    goalMode: "admin",
    goals: normalizeGoals(character.goals, false, character),
    currentStats: normalizeCurrentStats(character.currentStats),
  };
}

function normalizeGoals(goals = {}, resetValueStats = false, character = {}) {
  return {
    admin: normalizeGoal(getAdminGoalDefault(character), false),
    custom: normalizeGoal(goals.custom, resetValueStats),
  };
}

function normalizeGoal(goal = {}, resetValueStats = false) {
  const rawStats =
    !resetValueStats && Array.isArray(goal.stats) && goal.stats.length
      ? goal.stats
      : defaultGoal.stats;
  const stats = rawStats.map(normalizeGoalStat).filter(Boolean).slice(0, 7);

  while (stats.length < 1) {
    const nextOption =
      valueStatOptions.find(
        (option) => !stats.some((stat) => stat.key === option.key),
      ) ?? valueStatOptions[0];
    stats.push(normalizeGoalStat(nextOption));
  }

  return {
    echoSet: normalizeEchoSetName(goal.echoSet ?? defaultGoal.echoSet),
    echoSets: normalizeGoalEchoSets(goal),
    mainEchoes: normalizeGoalMainEchoes(goal),
    echoBuild: String(goal.echoBuild ?? defaultGoal.echoBuild)
      .replace(/\D/g, "")
      .slice(0, 5),
    echoBuildAlt: String(goal.echoBuildAlt ?? "")
      .replace(/\D/g, "")
      .slice(0, 5),
    mainEcho: goal.mainEcho ?? defaultGoal.mainEcho,
    note: goal.note ?? defaultGoal.note,
    echoStats: normalizeGoalEchoStats(goal, stats),
    stats,
  };
}

function normalizeGoalEchoSets(goal = {}) {
  const rawEchoSets =
    Array.isArray(goal.echoSets) && goal.echoSets.length
      ? goal.echoSets
      : [
          {
            name: goal.echoSet ?? defaultGoal.echoSet,
            pieces: "5 Set",
            join: "+",
          },
        ];
  return rawEchoSets
    .map((echoSet, index) => ({
      join:
        index === 0
          ? "+"
          : echoSetJoinOptions.includes(echoSet.join)
            ? echoSet.join
            : "+",
      name: normalizeEchoSetName(echoSet.name ?? ""),
      pieces: echoSetPieceOptions.includes(echoSet.pieces)
        ? echoSet.pieces
        : "5 Set",
    }))
    .slice(0, 20);
}

function normalizeGoalMainEchoes(goal = {}) {
  const rawMainEchoes =
    Array.isArray(goal.mainEchoes) && goal.mainEchoes.length
      ? goal.mainEchoes
      : [{ join: "OR", name: goal.mainEcho ?? defaultGoal.mainEcho }];

  return rawMainEchoes
    .map((mainEcho, index) => ({
      join: index === 0 ? "기준" : "OR",
      name: String(mainEcho.name ?? "").trim(),
    }))
    .slice(0, 4);
}

function normalizeGoalEchoStats(goal = {}, fallbackStats = defaultGoal.echoStats) {
  const rawStats =
    Array.isArray(goal.echoStats) && goal.echoStats.length
      ? goal.echoStats
      : fallbackStats;
  const stats = rawStats
    .map((stat) => normalizeGoalEchoStat(stat))
    .filter(Boolean)
    .slice(0, 7);

  while (stats.length < 2) {
    const nextOption =
      statOptions.find(
        (option) => !stats.some((stat) => stat.key === option.key),
      ) ?? statOptions[0];
    stats.push(normalizeGoalEchoStat(nextOption));
  }

  return stats;
}

function normalizeGoalEchoStat(stat = {}) {
  const option =
    statOptions.find((item) => item.key === stat.key) ??
    statOptions.find((item) => item.label === stat.label) ??
    getLegacyStatLabelOption(stat.label, statOptions);
  if (!option) return null;
  return {
    key: option.key,
    label: option.label,
    cost: statCostOptions.includes(stat.cost) ? stat.cost : "COST 1",
    variant: statVariantOptions.includes(stat.variant) ? stat.variant : "-",
    branchChecked:
      statVariantOptions.includes(stat.variant) && stat.variant !== "-"
        ? Boolean(stat.branchChecked)
        : false,
  };
}

function normalizeGoalStat(stat = {}) {
  const option =
    valueStatOptions.find((item) => item.key === stat.key) ??
    valueStatOptions.find((item) => item.label === stat.label) ??
    getLegacyStatLabelOption(stat.label, valueStatOptions);
  if (!option) return null;
  return {
    key: option.key,
    label: option.label,
    target: Math.max(0, Number(stat.target ?? option.defaultTarget) || 0),
    cost: statCostOptions.includes(stat.cost) ? stat.cost : "COST 1",
    variant: statVariantOptions.includes(stat.variant) ? stat.variant : "-",
  };
}

function getLegacyStatLabelOption(label, options = statOptions) {
  if (label === "치유효과+") {
    return options.find((item) => item.key === "healingBonus") ?? null;
  }
  return null;
}

function normalizeCurrentStats(currentStats = {}) {
  const values = {
    ...defaultCurrentStats.values,
    ...(currentStats.values ?? {}),
  };
  return {
    echoSet: normalizeEchoSetName(currentStats.echoSet ?? ""),
    mainEcho: currentStats.mainEcho ?? "",
    note: currentStats.note ?? "",
    manualComplete: Boolean(currentStats.manualComplete),
    values: Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        Math.max(0, Number(value) || 0),
      ]),
    ),
  };
}

function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `character-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getSeedRarity(name) {
  return findSeedCharacter(name)?.rarity;
}

function saveAdminGoalDefaults() {
  showSessionMessage(
    "목표 기본값 편집됨",
    "목표 json 다운로드로 data/goal-defaults.json에 반영할 파일을 저장하세요",
  );
}

function getCharacterGoalKey(character = {}) {
  const seed =
    findSeedCharacter(character.en) ??
    findSeedCharacter(character.name);
  return seed?.en ?? character.en ?? character.name ?? "";
}

function getAdminGoalDefault(character = {}) {
  const key = getCharacterGoalKey(character);
  return adminGoalDefaults[key] ?? defaultGoal;
}

function persistAdminGoal(character) {
  if (!character || character.goalMode === "custom") return;
  const key = getCharacterGoalKey(character);
  if (!key) return;
  adminGoalDefaults[key] = normalizeGoal(character.goals.admin);
  saveAdminGoalDefaults();
}

function saveGoalState(character) {
  persistAdminGoal(character);
  saveState();
}

function getUserCharacterData(character) {
  return {
    id: character.id,
    name: character.name,
    owned: character.owned,
    farm: character.farm,
    goalMode: character.goalMode,
    goals: {
      custom: character.goals.custom,
    },
    currentStats: character.currentStats,
  };
}

function getUserProfileState() {
  return {
    user: createDefaultUser(),
    updatedAt: new Date().toISOString(),
    goalDefaultsVersion: GOAL_DEFAULT_VERSION,
    characters: state.characters.map(getUserCharacterData),
  };
}

function findSeedCharacter(name) {
  if (!name) return null;
  return (
    characterSeed.find((character) => {
      const names = [character.name, character.en];
      return names.includes(name);
    }) ?? null
  );
}

function saveState(options = {}) {
  state.updatedAt = new Date().toISOString();
  if (!isSnapshotMode || options.force) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  if (!options.skipCloud) scheduleCloudSave();
}

function offerCharactersJsonDownload() {
  const shouldDownload = confirm(
    "캐릭터 기본 정보 변경사항을 data/characters.json에 반영할 characters.json 파일로 다운로드할까요?",
  );
  if (shouldDownload) {
    downloadCharactersJson();
    return;
  }
  showSessionMessage(
    "JSON 반영 필요",
    "변경사항을 배포하려면 캐릭터 JSON 다운로드 후 data/characters.json에 반영하세요",
  );
}

function downloadCharactersJson() {
  const data = JSON.stringify(getCharactersExportData(), null, 2);
  const blob = new Blob([`${data}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "characters.json";
  link.click();
  URL.revokeObjectURL(url);
  showSessionMessage(
    "목록 JSON 생성",
    "다운로드한 파일을 data/characters.json으로 반영하세요",
  );
}

function getCharactersExportData() {
  return state.characters.map((character) => ({
    name: character.name,
    en: character.en ?? "",
    element: character.element,
    weapon: character.weapon,
    rarity: String(character.rarity ?? "5"),
    image: character.image ?? "",
    isPublic: character.isPublic !== false,
  }));
}

function getGoalDefaultsExportData() {
  const defaults = {};
  state.characters.forEach((character) => {
    const key = getCharacterGoalKey(character);
    if (key) defaults[key] = normalizeGoal(character.goals.admin);
  });
  return defaults;
}

function getPortableState(options = {}) {
  const portableState = normalizeState({
    ...state,
    user: createDefaultUser(),
    updatedAt: new Date().toISOString(),
  });

  portableState.characters = portableState.characters.map((character) => {
    const { version, ...characterData } = character;
    return {
      ...characterData,
      goals: {
        custom: character.goals.custom,
      },
    };
  });

  if (options.includePrivateText === false) {
    portableState.characters = portableState.characters.map((character) => ({
      ...character,
      farm: {
        ...character.farm,
        nextAction: "",
        notes: "",
      },
      currentStats: {
        ...character.currentStats,
        note: "",
      },
    }));
  }

  return portableState;
}

function closeOpenPickers(exceptPicker = null) {
  rosterList.querySelectorAll("details.echo-picker[open]").forEach((picker) => {
    if (picker !== exceptPicker) picker.open = false;
  });

  rosterList
    .querySelectorAll("[data-echo-set-combobox].open")
    .forEach((picker) => {
      if (picker !== exceptPicker) {
        picker.classList.remove("open");
        picker
          .querySelector("[data-echo-set-search]")
          ?.setAttribute("aria-expanded", "false");
      }
    });
}

function setupDetailPicker(picker) {
  const summary = picker.querySelector("summary.echo-picker-button");
  const options = [...picker.querySelectorAll(".echo-picker-options button")];
  let activeIndex = getInitialDetailPickerOptionIndex(options);

  const updateSummaryExpanded = () => {
    summary?.setAttribute("aria-expanded", picker.open ? "true" : "false");
  };

  const updateActiveOption = (nextIndex) => {
    if (!options.length) return;
    activeIndex = (nextIndex + options.length) % options.length;
    options.forEach((option) => option.classList.remove("keyboard-active"));
    options[activeIndex].classList.add("keyboard-active");
    options[activeIndex].scrollIntoView({ block: "nearest" });
  };

  const openPicker = () => {
    picker.open = true;
    closeOpenPickers(picker);
    updateSummaryExpanded();
  };

  const closePicker = () => {
    picker.open = false;
    updateSummaryExpanded();
    options.forEach((option) => option.classList.remove("keyboard-active"));
  };

  if (summary) updateSummaryExpanded();

  picker.addEventListener("toggle", () => {
    if (picker.open) {
      closeOpenPickers(picker);
      activeIndex = getInitialDetailPickerOptionIndex(options);
      updateActiveOption(activeIndex);
    }
    updateSummaryExpanded();
  });

  picker.addEventListener("focusout", (event) => {
    if (event.relatedTarget && picker.contains(event.relatedTarget)) return;
    closePicker();
  });

  if (!summary || !options.length) return;

  picker.addEventListener("keydown", (event) => {
    const navigationKeys = {
      ArrowDown: activeIndex + 1,
      ArrowUp: activeIndex - 1,
      Home: 0,
      End: options.length - 1,
      PageDown: activeIndex + 5,
      PageUp: activeIndex - 5,
    };
    if (event.key in navigationKeys) {
      event.preventDefault();
      openPicker();
      updateActiveOption(navigationKeys[event.key]);
      return;
    }
    if (event.key === "Enter" && picker.open) {
      event.preventDefault();
      options[activeIndex]?.click();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closePicker();
      summary.focus();
      return;
    }
    if (event.key === "Tab") {
      closePicker();
    }
  });

  options.forEach((option, index) => {
    option.addEventListener("mousedown", (event) => event.preventDefault());
    option.addEventListener("focus", () => updateActiveOption(index));
    option.addEventListener("click", () => closePicker());
  });
}

function getInitialDetailPickerOptionIndex(options) {
  const activeIndex = options.findIndex((option) =>
    option.classList.contains("active"),
  );
  return activeIndex >= 0 ? activeIndex : 0;
}

function render() {
  exportCharactersButton?.classList.toggle("hidden", !isAdmin());
  exportGoalDefaultsButton?.classList.toggle("hidden", !isAdmin());
  renderFocusStrip();
  renderToolbarMode();
  renderCategoryRail();
  renderRoster();
  renderDetail();
  renderStats();
  renderSnapshotNotice();
}

function keepFarmCardScrollStable(id, renderCallback) {
  const selector = `[data-farm-card="${CSS.escape(id)}"]`;
  const card = rosterList.querySelector(selector);
  if (!card || typeof card.getBoundingClientRect !== "function") {
    renderCallback();
    return;
  }

  const previousTop = card.getBoundingClientRect().top;
  renderCallback();

  const updatedCard = rosterList.querySelector(selector);
  if (!updatedCard || typeof updatedCard.getBoundingClientRect !== "function")
    return;

  const nextTop = updatedCard.getBoundingClientRect().top;
  const delta = nextTop - previousTop;
  if (Math.abs(delta) > 0.5) {
    window.scrollBy({ top: delta, left: 0, behavior: "auto" });
  }
}

function renderToolbarMode() {
  document
    .querySelector(".ownership-filter")
    .classList.toggle("hidden", activeTab !== "ownership");
  document
    .querySelector(".farming-filter")
    .classList.toggle("hidden", activeTab !== "farming");
  document
    .querySelector(".visibility-filter")
    .classList.toggle("hidden", !isAdmin());
  if (!isAdmin() && visibilityFilter !== "public") {
    visibilityFilter = "public";
    visibilityFilterButtons.forEach((button) =>
      button.classList.toggle("active", button.dataset.visibilityFilter === "public"),
    );
  }
  document
    .querySelector("#addCharacterButton")
    .classList.toggle("hidden", activeTab === "farming" || !isAdmin());
  listEyebrow.textContent = activeTab === "ownership" ? "Ownership" : "Farming";
  listTitle.textContent =
    activeTab === "ownership" ? "캐릭터 보유 현황" : "캐릭터 파밍 상태";
  farmingFilterInputs.forEach((input) => {
    input.checked = farmingFilters.has(input.dataset.farmFilter);
  });
}

function getVisibleCharacters() {
  return state.characters
    .filter((character) => {
      if (activeTab === "ownership") {
        if (currentView === "owned" && !character.owned) return false;
        if (currentView === "unowned" && character.owned) return false;
      }
      if (activeTab === "farming" && !matchesFarmingFilters(character))
        return false;
      if (!matchesVisibilityFilter(character)) return false;
      if (
        activeCategory !== "all" &&
        getCategoryValue(character) !== activeCategory
      )
        return false;
      return character.name.toLowerCase().includes(searchTerm);
    })
    .sort(sortCharacters);
}

function renderRoster() {
  const characters = getVisibleCharacters();
  if (!characters.length) {
    rosterList.innerHTML = getRosterEmptyState();
    return;
  }

  rosterList.innerHTML = characters
    .map((character) =>
      activeTab === "ownership"
        ? renderOwnershipCard(character)
        : renderFarmingCard(character),
    )
    .join("");

  bindRosterInteractions(rosterList);
}

function bindRosterInteractions(root = rosterList) {
  root.querySelectorAll("[data-owned]").forEach((button) => {
    button.addEventListener("click", () => toggleOwned(button.dataset.owned));
  });

  root.querySelectorAll("[data-select]").forEach((button) => {
    button.addEventListener("click", () => {
      const character = state.characters.find(
        (item) => item.id === button.dataset.select,
      );
      if (!character?.owned) {
        showSessionMessage(
          "보유 체크 필요",
          "체크를 켠 캐릭터만 파밍 상태를 기록할 수 있습니다",
        );
        return;
      }
      selectedId = character.id;
      renderRoster();
      renderDetail();
    });
  });

  root.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () =>
      openCharacterDialog(button.dataset.edit),
    );
  });

  root.querySelectorAll("[data-goal-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.mode !== "custom") {
        customGoalEditingId = null;
      }
      updateCharacterField(
        button.dataset.goalMode,
        "goalMode",
        button.dataset.mode,
      );
    });
  });

  root.querySelectorAll("[data-toggle-custom-goal]").forEach((button) => {
    button.addEventListener("click", () => {
      const characterId = button.dataset.toggleCustomGoal;
      customGoalEditingId =
        customGoalEditingId === characterId
          ? null
          : characterId;
      keepFarmCardScrollStable(characterId, () =>
        rerenderFarmingCard(characterId),
      );
    });
  });

  root.querySelectorAll("[data-toggle-admin-goals]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!isAdmin()) {
        showSessionMessage(
          "관리자 권한 필요",
          "관리자 목표 편집은 관리자만 사용할 수 있습니다",
        );
        return;
      }
      const card = button.closest("[data-farm-card]");
      const characterId = card?.dataset.farmCard;
      if (!characterId) {
        renderRoster();
        return;
      }

      const previousEditingId = adminGoalEditingId;
      adminGoalEditingId =
        previousEditingId === characterId ? null : characterId;

      if (previousEditingId && previousEditingId !== characterId) {
        rerenderFarmingCard(previousEditingId);
      }
      keepFarmCardScrollStable(characterId, () =>
        rerenderFarmingCard(characterId),
      );
    });
  });

  root.querySelectorAll("[data-add-stat]").forEach((button) => {
    button.addEventListener("click", () => addGoalStat(button.dataset.addStat));
  });

  root.querySelectorAll("[data-add-echo-stat]").forEach((button) => {
    button.addEventListener("click", () =>
      addGoalEchoStat(button.dataset.addEchoStat),
    );
  });

  root.querySelectorAll("[data-add-echo-set]").forEach((button) => {
    button.addEventListener("click", () =>
      addGoalEchoSet(button.dataset.addEchoSet),
    );
  });

  root.querySelectorAll("[data-add-main-echo]").forEach((button) => {
    button.addEventListener("click", () =>
      addGoalMainEcho(button.dataset.addMainEcho),
    );
  });

  root.querySelectorAll("[data-remove-stat]").forEach((button) => {
    button.addEventListener("click", () =>
      removeGoalStat(button.dataset.character, button.dataset.removeStat),
    );
  });

  root.querySelectorAll("[data-remove-echo-set]").forEach((button) => {
    button.addEventListener("click", () =>
      removeGoalEchoSet(button.dataset.character, button.dataset.removeEchoSet),
    );
  });

  root.querySelectorAll("[data-remove-main-echo]").forEach((button) => {
    button.addEventListener("click", () =>
      removeGoalMainEcho(
        button.dataset.character,
        button.dataset.removeMainEcho,
      ),
    );
  });

  root.querySelectorAll("[data-remove-echo-stat]").forEach((button) => {
    button.addEventListener("click", () =>
      removeGoalEchoStat(
        button.dataset.character,
        button.dataset.removeEchoStat,
      ),
    );
  });

  root.querySelectorAll("[data-stat-key]").forEach((field) => {
    field.addEventListener("change", () =>
      updateGoalStatKey(
        field.dataset.character,
        Number(field.dataset.index),
        field.value,
      ),
    );
  });

  root.querySelectorAll("[data-echo-stat-option]").forEach((button) => {
    button.addEventListener("click", () =>
      updateGoalEchoStatKey(
        button.dataset.character,
        Number(button.dataset.index),
        button.dataset.value,
      ),
    );
  });

  root.querySelectorAll("[data-stat-option]").forEach((button) => {
    button.addEventListener("click", () =>
      updateGoalStatKey(
        button.dataset.character,
        Number(button.dataset.index),
        button.dataset.value,
      ),
    );
  });

  root.querySelectorAll("[data-echo-stat-field]").forEach((field) => {
    field.addEventListener("change", () => {
      updateGoalEchoStatField(
        field.dataset.character,
        Number(field.dataset.index),
        field.dataset.echoStatField,
        field.type === "checkbox" ? field.checked : field.value,
      );
      if (field.dataset.echoStatField === "variant") {
        updateRenderedBranchCheckState(field);
      }
      updateRenderedValueBranchStates(field.dataset.character);
    });
  });

  root.querySelectorAll("[data-goal-stat-field]").forEach((field) => {
    const eventName = field.tagName === "INPUT" ? "blur" : "change";
    if (field.dataset.goalStatField === "target") {
      preventSignedNumberInput(field);
    }
    field.addEventListener(eventName, () => {
      if (field.dataset.goalStatField === "target") {
        field.value = sanitizeUnsignedNumberInput(field.value);
      }
      if (
        field.dataset.goalStatField === "target" &&
        Number(field.value) < 0
      ) {
        field.value = "0";
      }
      updateGoalStatField(
        field.dataset.character,
        Number(field.dataset.index),
        field.dataset.goalStatField,
        field.value,
      );
      if (field.dataset.goalStatField === "variant") {
        updateRenderedValueBranchStates(field.dataset.character);
      } else {
        updateRenderedStatRowState(
          field.dataset.character,
          Number(field.dataset.index),
          field.closest(".stat-row"),
        );
      }
    });
  });

  root.querySelectorAll("[data-main-echo-field]").forEach((field) => {
    field.addEventListener("blur", () => {
      const value = field.value.trim();
      field.value = value;
      updateGoalMainEcho(
        field.dataset.character,
        Number(field.dataset.index),
        field.dataset.mainEchoField,
        value,
      );
    });
  });

  root.querySelectorAll("[data-echo-set-field]").forEach((field) => {
    field.addEventListener("change", () =>
      updateGoalEchoSet(
        field.dataset.character,
        Number(field.dataset.index),
        field.dataset.echoSetField,
        field.value,
      ),
    );
  });

  root
    .querySelectorAll("details.echo-picker")
    .forEach(setupDetailPicker);

  root
    .querySelectorAll("[data-echo-set-combobox]")
    .forEach(setupEchoSetCombobox);

  root.querySelectorAll("[data-echo-set-option]").forEach((button) => {
    button.addEventListener("click", () => {
      updateGoalEchoSet(
        button.dataset.character,
        Number(button.dataset.index),
        "name",
        button.dataset.value,
      );
      const combobox = button.closest("[data-echo-set-combobox]");
      const input = combobox?.querySelector("[data-echo-set-search]");
      combobox?.classList.remove("open");
      input?.setAttribute("aria-expanded", "false");
    });
  });

  root.querySelectorAll("[data-clear-current]").forEach((button) => {
    button.addEventListener("click", () =>
      clearCurrentStat(button.dataset.clearCurrent, button.dataset.statKey),
    );
  });

  root.querySelectorAll("[data-manual-complete]").forEach((input) => {
    input.addEventListener("change", () =>
      updateCurrentStat(
        input.dataset.manualComplete,
        "manualComplete",
        input.checked,
      ),
    );
  });

  root.querySelectorAll("[data-current-field]").forEach((field) => {
    preventSignedNumberInput(field);
    field.addEventListener("blur", () => {
      field.value = sanitizeUnsignedNumberInput(field.value);
      const normalizedValue = Math.max(0, Number(field.value) || 0);
      field.value = String(normalizedValue);
      updateCurrentStat(
        field.dataset.character,
        field.dataset.currentField,
        normalizedValue,
      );
      updateRenderedStatRowState(
        field.dataset.character,
        Number(field.dataset.index),
        field.closest(".stat-row"),
      );
    });
  });

  root.querySelectorAll("[data-goal-field]").forEach((field) => {
    if (field.dataset.goalField === "echoBuild" || field.dataset.goalField === "echoBuildAlt") {
      field.addEventListener("input", () => {
        field.value = field.value.replace(/\D/g, "").slice(0, 5);
        updateEchoBuildPreview(field);
      });
    }

    field.addEventListener("blur", () => {
      const value =
        field.dataset.goalField === "echoBuild" || field.dataset.goalField === "echoBuildAlt"
          ? field.value.replace(/\D/g, "").slice(0, 5)
          : field.dataset.goalField === "note"
            ? field.value.trim()
            : field.value;
      field.value = value;
      updateGoal(
        field.dataset.character,
        field.dataset.goalField,
        value,
        field.dataset.goalKey,
      );
    });
  });
}

function sanitizeUnsignedNumberInput(value) {
  return String(value).replace(/[+-]/g, "");
}

function preventSignedNumberInput(field) {
  field.addEventListener("keydown", (event) => {
    if (event.key === "+" || event.key === "-") {
      event.preventDefault();
    }
  });

  field.addEventListener("beforeinput", (event) => {
    if (typeof event.data === "string" && /[+-]/.test(event.data)) {
      event.preventDefault();
    }
  });

  field.addEventListener("input", () => {
    const sanitizedValue = sanitizeUnsignedNumberInput(field.value);
    if (field.value !== sanitizedValue) {
      field.value = sanitizedValue;
    }
  });
}

function rerenderFarmingCard(id) {
  const character = state.characters.find((item) => item.id === id);
  const card = rosterList.querySelector(`[data-farm-card="${CSS.escape(id)}"]`);
  if (!character || !card || activeTab !== "farming") {
    renderRoster();
    return;
  }

  card.outerHTML = renderFarmingCard(character);
  const updatedCard = rosterList.querySelector(
    `[data-farm-card="${CSS.escape(id)}"]`,
  );
  if (updatedCard) bindRosterInteractions(updatedCard);
}

function renderCategoryRail() {
  if (sortMode === "name") {
    categoryRail.classList.add("hidden");
    categoryRail.classList.remove("category-rail--weapon");
    categoryRail.innerHTML = "";
    return;
  }

  const categories = [...new Set(state.characters.map(getCategoryValue))]
    .filter(Boolean)
    .sort(sortCategories);

  categoryRail.classList.remove("hidden");
  categoryRail.classList.toggle("category-rail--weapon", sortMode === "weapon");
  categoryRail.innerHTML = `
    <button class="${activeCategory === "all" ? "active" : ""}" data-category="all" type="button" aria-label="전체 카테고리">${renderCategoryLabel("all")}</button>
    ${categories
      .map(
        (category) => `
      <button class="${activeCategory === category ? "active" : ""}" data-category="${escapeHtml(category)}" type="button" aria-label="${escapeHtml(category)} 카테고리">${renderCategoryLabel(category)}</button>
    `,
      )
      .join("")}
  `;

  categoryRail.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      render();
    });
  });
}

function renderOwnershipCard(character) {
  const progress = getProgress(character);
  const color = elementColors[character.element] ?? "#9fd3ff";
  const isSelected = character.owned && character.id === selectedId;
  const complete = isGoalComplete(character);

  return `
    <article class="roster-card ${character.owned ? "owned" : ""} ${complete ? "complete" : ""} ${isSelected ? "selected" : ""}" style="--element-color:${color}"${isSelected ? ' aria-current="true"' : ""}>
      ${character.image ? `<img class="card-backdrop-image" src="${escapeHtml(character.image)}" alt="" loading="lazy" />` : ""}
      ${character.image ? "" : renderAvatar(character, "data-select")}
      <button class="card-body card-select-surface" data-select="${character.id}" type="button">
        <h3>${escapeHtml(character.name)}</h3>
        <div class="chips">
          ${renderCharacterMetaChips(character, { showVisibility: isAdmin() })}
          ${character.owned ? `<span class="chip">${progress}%</span>` : `<span class="chip">미보유</span>`}
        </div>
        <div class="mini-progress" aria-hidden="true">
          <span style="width:${progress}%"></span>
        </div>
      </button>
      <div class="card-actions">
        ${isAdmin() ? `<button class="icon-action" data-edit="${character.id}" type="button" title="캐릭터 편집">편집</button>` : ""}
        <button class="owned-toggle" aria-label="${escapeHtml(character.name)} 보유 여부" aria-pressed="${character.owned}" data-owned="${character.id}" type="button"></button>
      </div>
    </article>
  `;
}

function renderFarmingCard(character) {
  const color = elementColors[character.element] ?? "#9fd3ff";
  const goal = getActiveGoal(character);
  const complete = isGoalComplete(character);
  const canEditGoal = canEditActiveGoal(character);
  const isAdminGoalEditing = isAdminGoalEditEnabled(character);
  const isCustomGoalEditing = isCustomGoalEditEnabled(character);
  const rows = goal.stats
    .map((stat, index) => renderStatRow(character, stat, index, canEditGoal))
    .join("");
  const echoStatRows = goal.echoStats
    .map((stat, index) =>
      renderEchoStatRow(character, stat, index, canEditGoal),
    )
    .join("");
  const echoSetRows = goal.echoSets
    .map((echoSet, index) =>
      renderGoalEchoSetRow(character, echoSet, index, canEditGoal),
    )
    .join("");
  const mainEchoRows = goal.mainEchoes
    .map((mainEcho, index) =>
      renderGoalMainEchoRow(character, mainEcho, index, canEditGoal),
    )
    .join("");
  const shouldShowNote = canEditGoal || goal.note;

  return `
    <article class="farm-card ${character.owned ? "owned" : "locked"} ${complete ? "complete" : ""}" data-farm-card="${character.id}" style="--element-color:${color}">
      <div class="farm-card-head">
        ${renderAvatar(character, "data-select")}
        <div>
          <h3>${escapeHtml(character.name)}</h3>
          <div class="card-meta-chips">${renderCharacterMetaChips(character, { showVisibility: isAdmin() })}</div>
        </div>
        <span class="status-pill">${character.owned ? "" : "미보유 · "}${complete ? "목표달성" : "미달성"}</span>
      </div>

      <div class="goal-switch" role="group" aria-label="목표 기준">
        <button class="${character.goalMode !== "custom" ? "active" : ""}" data-goal-mode="${character.id}" data-mode="admin" type="button">목표</button>
        <button class="${character.goalMode === "custom" ? "active" : ""}" data-goal-mode="${character.id}" data-mode="custom" type="button">수동 입력</button>
        ${isAdmin() && character.goalMode !== "custom" ? `<button class="${isAdminGoalEditing ? "active" : ""}" data-toggle-admin-goals type="button" aria-label="${escapeHtml(character.name)} 관리자 목표 편집 ${isAdminGoalEditing ? "끄기" : "켜기"}">편집</button>` : ""}
        ${character.goalMode === "custom" ? `<button class="${isCustomGoalEditing ? "active" : ""}" data-toggle-custom-goal="${character.id}" type="button">편집</button>` : ""}
      </div>

      <div class="target-grid">
        <div class="echo-targets">
          <div class="field-heading">
            <span>목표 메인에코</span>
            ${canEditGoal ? `<button class="tiny-button" data-add-main-echo="${character.id}" type="button" ${goal.mainEchoes.length < 4 ? "" : "disabled"}>+</button>` : ""}
          </div>
          <div class="echo-set-list">
            ${mainEchoRows}
          </div>
        </div>
        <div class="echo-targets">
          <div class="field-heading">
            <span>목표 에코셋</span>
            ${canEditGoal ? `<button class="tiny-button" data-add-echo-set="${character.id}" type="button" ${goal.echoSets.length < 20 ? "" : "disabled"}>+</button>` : ""}
          </div>
          <div class="echo-set-list">
            ${echoSetRows}
          </div>
        </div>
      </div>

      <div class="farm-input-grid">
        <section class="farm-input-panel">
          <label>
            에코셋 구성
            ${renderEchoBuildInput(character, goal, canEditGoal)}
          </label>
          <div class="stat-table echo-stat-table ${canEditGoal ? "can-edit" : ""}" role="table" aria-label="${escapeHtml(character.name)} 에코셋 구성">
            <div class="echo-stat-row stat-head" role="row">
              <span>분기</span>
              <span>COST</span>
              <span>속성</span>
              <span></span>
            </div>
            ${echoStatRows}
          </div>
          ${
            canEditGoal
              ? `
            <div class="stat-actions">
              <button class="ghost-button" data-add-echo-stat="${character.id}" type="button" ${goal.echoStats.length < 7 ? "" : "disabled"}>에코 구성 추가</button>
              <small>에코 구성은 2개에서 7개까지 설정할 수 있습니다.</small>
            </div>
          `
              : ""
          }
        </section>

        <section class="farm-input-panel">
          <div class="field-heading table-heading">
            <span>수치입력</span>
          </div>
          <div class="stat-table" role="table" aria-label="${escapeHtml(character.name)} 목표 스테이터스">
            <div class="stat-row stat-head" role="row">
              <span>분기</span>
              <span>속성</span>
              <span>권장수치</span>
              <span>내 캐릭터</span>
              <span></span>
            </div>
            ${rows}
          </div>
          ${
            canEditGoal
              ? `
            <div class="stat-actions">
              <button class="ghost-button" data-add-stat="${character.id}" type="button" ${goal.stats.length < 7 ? "" : "disabled"}>주옵 추가</button>
              <small>주옵은 1개에서 7개까지 설정할 수 있습니다.</small>
            </div>
          `
              : ""
          }
        </section>
      </div>

      ${
        shouldShowNote
          ? `<div class="farm-note-grid">
        <label>
          비고
          <textarea data-goal-field="note" data-character="${character.id}" rows="3" placeholder="비고" ${canEditGoal ? "" : "disabled"}>${escapeHtml(goal.note)}</textarea>
        </label>
      </div>`
          : ""
      }

      <label class="complete-check">
        <input data-manual-complete="${character.id}" type="checkbox" ${character.currentStats.manualComplete ? "checked" : ""} />
        목표 달성 처리
      </label>
    </article>
  `;
}

function renderEchoBuildInput(character, goal, canEditGoal) {
  const primaryField = renderEchoBuildField(
    character.id,
    "echoBuild",
    goal.echoBuild,
    "에코셋 구성",
    canEditGoal,
  );
  const secondaryValue = String(goal.echoBuildAlt ?? "")
    .replace(/\D/g, "")
    .slice(0, 5);

  if (!canEditGoal && !secondaryValue) return primaryField;

  return `
    <span class="echo-build-group">
      ${primaryField}
      <span class="echo-build-or">OR</span>
      ${renderEchoBuildField(
        character.id,
        "echoBuildAlt",
        secondaryValue,
        "대체 에코셋 구성",
        canEditGoal,
      )}
    </span>
  `;
}

function renderEchoBuildField(characterId, fieldName, rawValue, label, canEditGoal) {
  const value = String(rawValue ?? "").replace(/\D/g, "").slice(0, 5);
  const displayValue = value || "43311";
  const digits = Array.from(displayValue.slice(0, 5));
  const digitCells = digits
    .map((digit, index) =>
      `<span class="${index === 0 ? "main-echo-cost" : ""}">${escapeHtml(digit)}</span>`,
    )
    .join("");

  return `
    <span class="echo-build-field ${value ? "" : "is-placeholder"}">
      <span class="echo-build-highlight" aria-hidden="true">${digitCells}</span>
      <input class="echo-build-input" data-goal-field="${fieldName}" data-character="${characterId}" value="${escapeHtml(value)}" placeholder="43311" inputmode="numeric" maxlength="5" aria-label="${escapeHtml(label)}" ${canEditGoal ? "" : "disabled"} />
    </span>
  `;
}

function updateEchoBuildPreview(input) {
  const field = input.closest(".echo-build-field");
  const highlight = field?.querySelector(".echo-build-highlight");
  if (!field || !highlight) return;

  const value = input.value.replace(/\D/g, "").slice(0, 5);
  const displayValue = value || "43311";
  field.classList.toggle("is-placeholder", !value);
  highlight.innerHTML = Array.from(displayValue.slice(0, 5))
    .map((digit, index) =>
      `<span class="${index === 0 ? "main-echo-cost" : ""}">${escapeHtml(digit)}</span>`,
    )
    .join("");
}

function renderGoalEchoSetRow(character, echoSet, index, canEditGoal) {
  return `
    <div class="echo-set-row">
      ${
        index === 0
          ? `<span class="echo-join-label">기준</span>`
          : `<select data-echo-set-field="join" data-character="${character.id}" data-index="${index}" ${canEditGoal ? "" : "disabled"}>
            ${echoSetJoinOptions.map((option) => `<option value="${option}" ${echoSet.join === option ? "selected" : ""}>${option}</option>`).join("")}
          </select>`
      }
      ${renderEchoSetPicker(character.id, index, echoSet.name, canEditGoal)}
      <select data-echo-set-field="pieces" data-character="${character.id}" data-index="${index}" ${canEditGoal ? "" : "disabled"}>
        ${echoSetPieceOptions.map((option) => `<option value="${option}" ${echoSet.pieces === option ? "selected" : ""}>${option}</option>`).join("")}
      </select>
      ${canEditGoal ? `<button class="stat-remove" data-character="${character.id}" data-remove-echo-set="${index}" type="button" ${index > 0 && getActiveGoal(character).echoSets.length > 1 ? "" : "disabled"} title="에코셋 제거">-</button>` : "<span></span>"}
    </div>
  `;
}

function renderGoalMainEchoRow(character, mainEcho, index, canEditGoal) {
  return `
    <div class="main-echo-row">
      <span class="echo-join-label">${index === 0 ? "기준" : "OR"}</span>
      <input data-main-echo-field="name" data-character="${character.id}" data-index="${index}" value="${escapeHtml(mainEcho.name)}" placeholder="목표 메인에코" ${canEditGoal ? "" : "disabled"} />
      ${canEditGoal ? `<button class="stat-remove" data-character="${character.id}" data-remove-main-echo="${index}" type="button" ${index > 0 && getActiveGoal(character).mainEchoes.length > 1 ? "" : "disabled"} title="메인에코 제거">-</button>` : "<span></span>"}
    </div>
  `;
}

function renderEchoStatRow(character, stat, index, canEditGoal) {
  const option = getStatOption(stat.key, statOptions);
  const hasBranch = stat.variant !== "-";

  return `
    <div class="echo-stat-row" role="row">
      <span class="branch-cell ${hasBranch ? "has-branch" : ""}">
        <label class="branch-check ${hasBranch ? "" : "hidden"}" title="이 분기 사용">
          <input data-echo-stat-field="branchChecked" data-character="${character.id}" data-index="${index}" type="checkbox" ${stat.branchChecked ? "checked" : ""} ${hasBranch ? "" : "disabled"} />
        </label>
        <select data-echo-stat-field="variant" data-character="${character.id}" data-index="${index}" ${canEditGoal ? "" : "disabled"}>
          ${statVariantOptions.map((option) => `<option value="${option}" ${stat.variant === option ? "selected" : ""}>${option}</option>`).join("")}
        </select>
      </span>
      <select data-echo-stat-field="cost" data-character="${character.id}" data-index="${index}" ${canEditGoal ? "" : "disabled"}>
        ${statCostOptions.map((option) => `<option value="${option}" ${stat.cost === option ? "selected" : ""}>${option}</option>`).join("")}
      </select>
      ${renderStatPicker(character.id, index, option.key, canEditGoal, {
        options: statOptions,
        dataAttribute: "data-echo-stat-option",
      })}
      <span class="stat-row-actions">
        ${canEditGoal ? `<button class="stat-remove" data-character="${character.id}" data-remove-echo-stat="${index}" type="button" ${getActiveGoal(character).echoStats.length > 2 ? "" : "disabled"} title="에코 구성 제거">-</button>` : ""}
      </span>
    </div>
  `;
}

function renderAvatar(character, selectAttribute) {
  const content = character.image
    ? `<img src="${escapeHtml(character.image)}" alt="" loading="lazy" />`
    : escapeHtml(getInitial(character.name));
  const attribute = selectAttribute
    ? ` ${selectAttribute}="${character.id}"`
    : "";
  const label = `${character.name} 파밍 기록 열기`;
  return `<button class="avatar" type="button"${attribute} aria-label="${escapeHtml(label)}">${content}</button>`;
}

function renderStatRow(character, stat, index, canEditGoal) {
  const currentKey = getCurrentStatValueKey(stat);
  const current = getCurrentStatValue(character, stat);
  const target = Number(stat.target ?? 0);
  const branchActive = isGoalBranchActive(getActiveGoal(character), stat.variant);
  const hasBranch = stat.variant !== "-";
  const met = branchActive && current >= target;
  const canEditCurrent = branchActive || canEditGoal;
  const inputDisabled = canEditCurrent ? "" : "disabled";
  const targetDisabled = canEditGoal ? "" : "disabled";
  const rowInactive = !branchActive && !canEditGoal;
  const option = getStatOption(stat.key, valueStatOptions);

  return `
    <div class="stat-row ${met ? "met" : ""} ${rowInactive ? "branch-inactive" : ""}" data-stat-row="${character.id}" data-index="${index}" role="row">
      <span class="branch-cell ${hasBranch ? "has-branch" : ""}">
        <label class="branch-check readonly ${hasBranch ? "" : "hidden"}" title="에코셋 구성에서 선택된 분기">
          <input type="checkbox" ${branchActive ? "checked" : ""} disabled />
        </label>
        <select data-goal-stat-field="variant" data-character="${character.id}" data-index="${index}" ${canEditGoal ? "" : "disabled"}>
          ${statVariantOptions.map((option) => `<option value="${option}" ${stat.variant === option ? "selected" : ""}>${option}</option>`).join("")}
        </select>
      </span>
      ${renderStatPicker(character.id, index, option.key, canEditGoal, {
        options: valueStatOptions,
        dataAttribute: "data-stat-option",
      })}
      <input data-goal-stat-field="target" data-character="${character.id}" data-index="${index}" type="number" min="0" step="5" value="${target}" ${targetDisabled} />
      <input data-current-field="${currentKey}" data-character="${character.id}" data-index="${index}" type="number" min="0" step="5" value="${current}" ${inputDisabled} />
      <span class="stat-row-actions">
        <button class="current-clear" data-clear-current="${character.id}" data-stat-key="${currentKey}" type="button" ${canEditCurrent ? "" : "disabled"} title="내 캐릭터 입력값 초기화">↻</button>
        ${canEditGoal ? `<button class="stat-remove" data-character="${character.id}" data-remove-stat="${index}" type="button" ${getActiveGoal(character).stats.length > 1 ? "" : "disabled"} title="주옵 제거">-</button>` : ""}
      </span>
    </div>
  `;
}

function renderIconChip(label, icon) {
  const renderedIcon = icon ? renderInlineIcon(icon) : renderUnknownIcon(label);
  return `<span class="chip icon-chip">${renderedIcon}<span class="chip-label">${escapeHtml(label)}</span></span>`;
}

function renderVisibilityChip(character) {
  return character.isPublic === false
    ? `<span class="chip visibility-chip private">비공개</span>`
    : `<span class="chip visibility-chip">공개</span>`;
}

function renderCharacterMetaChips(character, { showVisibility = false } = {}) {
  return `
    <span class="chip rarity-chip">★${escapeHtml(getRarity(character))}</span>
    ${showVisibility ? renderVisibilityChip(character) : ""}
    ${renderIconChip(character.element, elementIcons[character.element])}
    ${renderIconChip(character.weapon, weaponIcons[character.weapon])}
  `;
}

function renderInlineIcon(icon, extraClass = "") {
  const classes = ["inline-icon", extraClass].filter(Boolean).join(" ");
  return icon
    ? `<img class="${escapeHtml(classes)}" src="${escapeHtml(icon)}" alt="" loading="lazy" />`
    : "";
}

function renderUnknownIcon(label) {
  return label === "미정"
    ? `<span class="inline-icon unknown-icon" aria-hidden="true">?</span>`
    : "";
}

function extractHangulInitialConsonants(value) {
  return [...String(value ?? "")]
    .map((letter) => {
      if (letter === " ") return letter;

      const code = letter.charCodeAt(0);
      if (code < HANGUL_BASE_CODE || code > HANGUL_LAST_CODE) return letter;

      const initialIndex = Math.floor(
        (code - HANGUL_BASE_CODE) / HANGUL_SYLLABLE_COUNT,
      );
      return HANGUL_INITIAL_CONSONANTS[initialIndex] ?? letter;
    })
    .join("");
}

function isHangulConsonantQuery(query) {
  return HANGUL_COMPAT_CONSONANT_PATTERN.test(query);
}

function normalizeEchoSetInitialSearchValue(value) {
  return extractHangulInitialConsonants(value)
    .replace(/\s/g, "")
    .toLowerCase();
}

function renderEchoSetPicker(characterId, index, value, enabled) {
  const selectedValue = normalizeEchoSetName(value);
  const selectedEchoSet = echoSets.find((echoSet) => echoSet.name === selectedValue);
  const selectedLabel = selectedEchoSet?.name ?? "선택 안 함";
  const selectedIcon = selectedEchoSet
    ? renderInlineIcon(selectedEchoSet.icon)
    : `<span class="empty-icon" aria-hidden="true"></span>`;
  const buttonContent = `${selectedIcon}<span>${escapeHtml(selectedLabel)}</span>`;

  if (!enabled) {
    return `
      <div class="echo-picker echo-set-picker readonly">
        <span class="echo-picker-button">${buttonContent}</span>
      </div>
    `;
  }

  return `
    <div class="echo-picker echo-set-picker echo-set-combobox" data-echo-set-combobox data-value="${escapeHtml(selectedValue)}">
      <span class="echo-picker-button echo-set-input-shell">
        <span class="echo-set-selected-icon">${selectedIcon}</span>
        <input
          data-echo-set-search
          data-character="${escapeHtml(characterId)}"
          data-index="${index}"
          value="${selectedValue ? escapeHtml(selectedValue) : ""}"
          placeholder="에코셋 검색"
          autocomplete="off"
          role="combobox"
          aria-expanded="false"
          aria-label="목표 에코셋 검색"
        />
      </span>
      <div class="echo-picker-options echo-set-options" data-echo-set-options>
        <button type="button" data-echo-set-option data-echo-set-empty-option data-character="${escapeHtml(characterId)}" data-index="${index}" data-value="" class="${selectedValue ? "" : "active"}">
          <span class="empty-icon" aria-hidden="true"></span>
          <span>선택 안 함</span>
        </button>
        ${echoSets
          .map(
            (echoSet) => `
              <button type="button" data-echo-set-option data-echo-set-name="${escapeHtml(echoSet.name.toLowerCase())}" data-echo-set-initials="${escapeHtml(normalizeEchoSetInitialSearchValue(echoSet.name))}" data-character="${escapeHtml(characterId)}" data-index="${index}" data-value="${escapeHtml(echoSet.name)}" class="${echoSet.name === selectedValue ? "active" : ""}">
                ${renderInlineIcon(echoSet.icon)}
                <span>${escapeHtml(echoSet.name)}</span>
              </button>
            `,
          )
          .join("")}
        <span class="echo-set-empty-results" data-echo-set-empty-results hidden>일치하는 에코셋이 없습니다</span>
      </div>
    </div>
  `;
}

function setupEchoSetCombobox(combobox) {
  const input = combobox.querySelector("[data-echo-set-search]");
  const options = [...combobox.querySelectorAll("[data-echo-set-option]")];
  const emptyOption = combobox.querySelector("[data-echo-set-empty-option]");
  const emptyResults = combobox.querySelector("[data-echo-set-empty-results]");
  if (!input) return;

  let activeIndex = getInitialEchoSetOptionIndex(options);
  let restoreValueOnBlur = combobox.dataset.value || "";

  const openOptions = () => {
    closeOpenPickers(combobox);
    combobox.classList.add("open");
    input.setAttribute("aria-expanded", "true");
  };

  const closeOptions = () => {
    combobox.classList.remove("open");
    input.setAttribute("aria-expanded", "false");
  };

  const resetInputValue = () => {
    input.value = combobox.dataset.value || restoreValueOnBlur;
    filterEchoSetOptions(combobox, activeIndex);
  };

  const updateActiveOption = (nextIndex) => {
    const visibleOptions = getVisibleEchoSetOptions(options);
    if (!visibleOptions.length) {
      activeIndex = -1;
      options.forEach((option) => option.classList.remove("keyboard-active"));
      return;
    }

    activeIndex = (nextIndex + visibleOptions.length) % visibleOptions.length;
    options.forEach((option) => option.classList.remove("keyboard-active"));
    visibleOptions[activeIndex].classList.add("keyboard-active");
    visibleOptions[activeIndex].scrollIntoView({ block: "nearest" });
  };

  input.addEventListener("focus", () => {
    restoreValueOnBlur = combobox.dataset.value || "";
    input.value = "";
    openOptions();
    activeIndex = filterEchoSetOptions(combobox, 0);
  });

  combobox.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest("[data-echo-set-option]")) return;
    if (document.activeElement !== input) {
      input.focus();
      return;
    }
    openOptions();
    activeIndex = filterEchoSetOptions(combobox, 0);
  });

  input.addEventListener("input", () => {
    openOptions();
    activeIndex = filterEchoSetOptions(combobox, 0);
  });

  input.addEventListener("keydown", (event) => {
    const visibleOptions = getVisibleEchoSetOptions(options);
    const navigationKeys = {
      ArrowDown: activeIndex + 1,
      ArrowUp: activeIndex - 1,
      Home: 0,
      End: visibleOptions.length - 1,
      PageDown: activeIndex + 5,
      PageUp: activeIndex - 5,
    };
    if (event.key in navigationKeys) {
      event.preventDefault();
      openOptions();
      updateActiveOption(navigationKeys[event.key]);
      return;
    }
    if (event.key === "Enter" && combobox.classList.contains("open")) {
      event.preventDefault();
      const selectedOption =
        visibleOptions[activeIndex] ?? visibleOptions[0] ?? null;
      selectedOption?.click();
      return;
    }
    if (event.key === "Escape") {
      resetInputValue();
      closeOptions();
      input.blur();
      return;
    }
    if (event.key === "Tab") {
      resetInputValue();
      closeOptions();
    }
  });

  combobox.addEventListener("focusout", (event) => {
    if (event.relatedTarget && combobox.contains(event.relatedTarget)) return;
    resetInputValue();
    closeOptions();
  });

  options.forEach((option) => {
    option.addEventListener("mousedown", (event) => event.preventDefault());
  });

  if (emptyOption) emptyOption.hidden = Boolean(input.value.trim());
  if (emptyResults) emptyResults.hidden = true;
  filterEchoSetOptions(combobox, activeIndex);
}

function getInitialEchoSetOptionIndex(options) {
  const activeIndex = options.findIndex((option) =>
    option.classList.contains("active"),
  );
  return activeIndex >= 0 ? activeIndex : 0;
}

function getVisibleEchoSetOptions(options) {
  return options.filter((option) => !option.hidden);
}

function filterEchoSetOptions(combobox, preferredIndex = 0) {
  const input = combobox.querySelector("[data-echo-set-search]");
  const options = [...combobox.querySelectorAll("[data-echo-set-option]")];
  const emptyOption = combobox.querySelector("[data-echo-set-empty-option]");
  const emptyResults = combobox.querySelector("[data-echo-set-empty-results]");
  const query = input.value.trim().toLowerCase();
  const initialQuery = normalizeEchoSetInitialSearchValue(query);
  const useInitialSearch = Boolean(initialQuery) && isHangulConsonantQuery(query);
  let visibleCount = 0;

  if (emptyOption) emptyOption.hidden = Boolean(query);

  options.forEach((option) => {
    if (option === emptyOption) return;
    const optionName = option.dataset.echoSetName ?? "";
    const optionInitials = option.dataset.echoSetInitials ?? "";
    const visible =
      !query ||
      optionName.includes(query) ||
      (useInitialSearch && optionInitials.includes(initialQuery));
    option.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  if (emptyResults) emptyResults.hidden = visibleCount > 0;

  const visibleOptions = getVisibleEchoSetOptions(options);
  options.forEach((option) => option.classList.remove("keyboard-active"));
  if (!visibleOptions.length) return -1;

  const nextIndex = Math.min(Math.max(preferredIndex, 0), visibleOptions.length - 1);
  visibleOptions[nextIndex].classList.add("keyboard-active");
  return nextIndex;
}

function renderStatPicker(
  characterId,
  index,
  value,
  enabled,
  { options = statOptions, dataAttribute = "data-stat-option" } = {},
) {
  const selectedOption = getStatOption(value, options);
  const buttonContent = `${renderInlineIcon(selectedOption.icon)}<span>${escapeHtml(selectedOption.label)}</span>`;

  if (!enabled) {
    return `
      <div class="echo-picker stat-picker readonly">
        <span class="echo-picker-button">${buttonContent}</span>
      </div>
    `;
  }

  return `
    <details class="echo-picker stat-picker">
      <summary class="echo-picker-button" aria-haspopup="listbox" aria-expanded="false">${buttonContent}</summary>
      <div class="echo-picker-options" role="listbox">
        ${options
          .map(
            (option) => `
              <button type="button" ${dataAttribute} data-character="${escapeHtml(characterId)}" data-index="${index}" data-value="${escapeHtml(option.key)}" class="${option.key === selectedOption.key ? "active" : ""}" role="option" aria-selected="${option.key === selectedOption.key}">
                ${renderInlineIcon(option.icon)}
                <span>${escapeHtml(option.label)}</span>
              </button>
            `,
          )
          .join("")}
      </div>
    </details>
  `;
}

function getEchoSetIcon(name) {
  return (
    echoSets.find((echoSet) => echoSet.name === normalizeEchoSetName(name))
      ?.icon ?? ""
  );
}

function normalizeEchoSetName(name) {
  if (!name) return "";
  const exact = echoSets.find(
    (echoSet) => echoSet.name === name || echoSet.en === name,
  );
  return exact?.name ?? name;
}

function getStatOption(key, options = statOptions) {
  return options.find((option) => option.key === key) ?? options[0];
}

function isGoalBranchActive(goal, variant) {
  if (variant === "-") return true;
  return goal.echoStats.some(
    (stat) => stat.variant === variant && stat.branchChecked,
  );
}

function getCurrentStatValueKey(stat) {
  return stat?.variant && stat.variant !== "-"
    ? `${stat.variant}:${stat.key}`
    : stat.key;
}

function getCurrentStatBaseKey(valueKey = "") {
  const [, variantStatKey] = String(valueKey).split(":");
  return variantStatKey || String(valueKey);
}

function getMatchingCurrentStatKeys(character, valueKey) {
  const baseKey = getCurrentStatBaseKey(valueKey);
  return getActiveGoal(character).stats
    .filter((stat) => stat.key === baseKey)
    .map(getCurrentStatValueKey);
}

function getCurrentStatValue(character, stat) {
  return Number(character.currentStats.values[getCurrentStatValueKey(stat)] ?? 0);
}

function getActiveGoalStats(character) {
  const goal = getActiveGoal(character);
  return goal.stats.filter((stat) => isGoalBranchActive(goal, stat.variant));
}

function isCustomGoalEditEnabled(character) {
  return character.goalMode === "custom" && customGoalEditingId === character.id;
}

function isAdminGoalEditEnabled(character) {
  return (
    character.goalMode !== "custom" &&
    isAdmin() &&
    adminGoalEditingId === character.id
  );
}

function canEditActiveGoal(character) {
  return isCustomGoalEditEnabled(character) || isAdminGoalEditEnabled(character);
}

function sortCharacters(a, b) {
  if (sortMode === "element") {
    return (
      getElementSortScore(a.element) - getElementSortScore(b.element) ||
      a.element.localeCompare(b.element, "ko") ||
      compareCharacterNames(a, b)
    );
  }
  if (sortMode === "weapon") {
    return (
      getWeaponSortScore(a.weapon) - getWeaponSortScore(b.weapon) ||
      compareCharacterNames(a, b)
    );
  }
  if (sortMode === "rarity") {
    return (
      Number(getRarity(b)) - Number(getRarity(a)) ||
      compareCharacterNames(a, b)
    );
  }
  return compareCharacterNames(a, b);
}

function getCategoryValue(character) {
  if (sortMode === "rarity") return `★${getRarity(character)}`;
  if (sortMode === "weapon") return character.weapon;
  return character.element;
}

function sortCategories(a, b) {
  if (sortMode === "rarity")
    return Number(b.replace("★", "")) - Number(a.replace("★", ""));
  if (sortMode === "weapon")
    return getWeaponSortScore(a) - getWeaponSortScore(b);
  if (sortMode === "element")
    return (
      getElementSortScore(a) - getElementSortScore(b) ||
      a.localeCompare(b, "ko")
    );
  return a.localeCompare(b, "ko");
}

function renderCategoryLabel(category) {
  const label = category === "all" ? (sortMode === "rarity" ? "ALL" : "전체") : category;
  const icon = renderCategoryIcon(category);
  return `${icon}<span class="category-label">${escapeHtml(label)}</span>`;
}

function renderCategoryIcon(category) {
  if (category === "all") return `<span class="category-icon" aria-hidden="true">＊</span>`;
  if (sortMode === "element") return renderInlineIcon(elementIcons[category]) || renderUnknownIcon(category);
  if (sortMode === "weapon")
    return renderInlineIcon(weaponIcons[category], "weapon-category-icon") || renderUnknownIcon(category);
  if (sortMode === "rarity") return "";
  return "";
}

function getRarity(character) {
  return String(character.rarity ?? "5");
}

function getWeaponSortScore(weapon) {
  const index = weaponOrder.indexOf(weapon);
  return index === -1 ? weaponOrder.length : index;
}

function getElementSortScore(element) {
  return element === "미정" ? 1 : 0;
}

function matchesVisibilityFilter(character) {
  if (visibilityFilter === "public") return character.isPublic !== false;
  if (visibilityFilter === "private") return character.isPublic === false;
  return true;
}

function matchesFarmingFilters(character) {
  if (farmingFilters.has("all")) return true;

  const ownershipMatch =
    (!farmingFilters.has("owned") && !farmingFilters.has("unowned")) ||
    (farmingFilters.has("owned") && character.owned) ||
    (farmingFilters.has("unowned") && !character.owned);
  const completionMatch =
    (!farmingFilters.has("complete") && !farmingFilters.has("incomplete")) ||
    (farmingFilters.has("complete") && isGoalComplete(character)) ||
    (farmingFilters.has("incomplete") && !isGoalComplete(character));

  return ownershipMatch && completionMatch;
}

function updateCharacterField(id, field, value) {
  const character = state.characters.find((item) => item.id === id);
  if (!character || character[field] === value) return;
  character[field] = value;
  saveState();

  if (field === "goalMode") {
    renderStats();
    renderFocusStrip();
    rerenderFarmingCard(id);
    return;
  }

  render();
}

function updateCurrentStat(id, field, value) {
  const character = state.characters.find((item) => item.id === id);
  if (!character) return;

  const wasComplete = isGoalComplete(character);
  const isCurrentValueField =
    field in character.currentStats.values ||
    field.includes(":") ||
    valueStatOptions.some((option) => option.key === field);

  if (field === "manualComplete") {
    character.currentStats.manualComplete = Boolean(value);
    character.farm.priority = value
      ? "done"
      : character.farm.priority === "done"
        ? "mid"
        : character.farm.priority;
  } else if (isCurrentValueField) {
    updateCurrentStatValuesByAttribute(character, field, value);
  } else {
    character.currentStats[field] = value;
  }

  saveState();
  renderStats();
  renderFocusStrip();

  const isComplete = isGoalComplete(character);
  if (shouldRerenderFarmingCardAfterCompletionChange(wasComplete, isComplete)) {
    renderRoster();
    if (id === selectedId) renderDetail();
    return;
  }

  updateRenderedFarmingCardCompletionState(id, isComplete);
  if (isCurrentValueField) {
    updateRenderedCurrentStatValues(id, field);
  }
  if (field === "manualComplete" || !isCurrentValueField) {
    rerenderFarmingCard(id);
    if (id === selectedId) renderDetail();
  }
}

function updateCurrentStatValuesByAttribute(character, field, value) {
  const normalizedValue = Math.max(0, Number(value) || 0);
  const matchingKeys = getMatchingCurrentStatKeys(character, field);
  const keys = matchingKeys.length ? matchingKeys : [field];

  keys.forEach((key) => {
    character.currentStats.values[key] = normalizedValue;
  });
}

function updateRenderedCurrentStatValues(id, field) {
  const character = state.characters.find((item) => item.id === id);
  if (!character) return;

  const matchingKeys = new Set(getMatchingCurrentStatKeys(character, field));
  if (!matchingKeys.size) matchingKeys.add(field);

  document
    .querySelectorAll(`[data-current-field][data-character="${CSS.escape(id)}"]`)
    .forEach((input) => {
      if (!matchingKeys.has(input.dataset.currentField)) return;
      input.value = String(character.currentStats.values[input.dataset.currentField] ?? 0);
      updateRenderedStatRowState(
        id,
        Number(input.dataset.index),
        input.closest(".stat-row"),
      );
    });
}

function shouldRerenderFarmingCardAfterCompletionChange(wasComplete, isComplete) {
  if (wasComplete === isComplete) return false;
  return farmingFilters.has("complete") || farmingFilters.has("incomplete");
}

function updateRenderedFarmingCardCompletionState(id, complete) {
  const card = rosterList.querySelector(`[data-farm-card="${CSS.escape(id)}"]`);
  if (!card) return;

  card.classList.toggle("complete", complete);
  const statusPill = card.querySelector(".status-pill");
  if (!statusPill) return;

  const character = state.characters.find((item) => item.id === id);
  const ownershipPrefix = character?.owned ? "" : "미보유 · ";
  statusPill.textContent = `${ownershipPrefix}${complete ? "목표달성" : "미달성"}`;
}

function updateGoalRenderStateAfterEdit(character, wasComplete) {
  renderStats();
  renderFocusStrip();

  const isComplete = isGoalComplete(character);
  if (shouldRerenderFarmingCardAfterCompletionChange(wasComplete, isComplete)) {
    renderRoster();
    if (character.id === selectedId) renderDetail();
    return;
  }

  updateRenderedFarmingCardCompletionState(character.id, isComplete);
}

function updateRenderedEchoSetCombobox(id, index, value) {
  const input = rosterList.querySelector(
    `[data-echo-set-search][data-character="${CSS.escape(id)}"][data-index="${CSS.escape(String(index))}"]`,
  );
  const combobox = input?.closest("[data-echo-set-combobox]");
  if (!input || !combobox) return;

  const selectedValue = normalizeEchoSetName(value);
  const selectedEchoSet = echoSets.find((echoSet) => echoSet.name === selectedValue);
  combobox.dataset.value = selectedValue;
  input.value = selectedValue;

  const selectedIcon = combobox.querySelector(".echo-set-selected-icon");
  if (selectedIcon) {
    selectedIcon.innerHTML = selectedEchoSet
      ? renderInlineIcon(selectedEchoSet.icon)
      : `<span class="empty-icon" aria-hidden="true"></span>`;
  }

  combobox.querySelectorAll("[data-echo-set-option]").forEach((option) => {
    option.classList.toggle("active", option.dataset.value === selectedValue);
  });

  filterEchoSetOptions(
    combobox,
    getInitialEchoSetOptionIndex([
      ...combobox.querySelectorAll("[data-echo-set-option]"),
    ]),
  );
}

function updateGoal(id, field, value, statKey) {
  const character = state.characters.find((item) => item.id === id);
  if (!character) return;
  if (!canEditActiveGoal(character)) return;
  const goal = getActiveGoal(character);
  const wasComplete = isGoalComplete(character);

  if (field === "target") {
    const stat = goal.stats.find((item) => item.key === statKey);
    if (!stat) return;
    const nextTarget = Number(value);
    if (Number(stat.target ?? 0) === nextTarget) return;
    stat.target = nextTarget;
  } else {
    if (goal[field] === value) return;
    goal[field] = value;
  }

  saveGoalState(character);
  if (field === "note" || field === "echoBuild" || field === "echoBuildAlt") return;
  updateGoalRenderStateAfterEdit(character, wasComplete);
}

function updateGoalEchoSet(id, index, field, value) {
  const character = state.characters.find((item) => item.id === id);
  if (!character || !canEditActiveGoal(character)) return;
  const targetIndex = Number(index);
  const echoSet = getActiveGoal(character).echoSets[targetIndex];
  if (!echoSet) return;

  const nextValue =
    field === "name"
      ? normalizeEchoSetName(value)
      : field === "pieces"
        ? echoSetPieceOptions.includes(value)
          ? value
          : "5 Set"
        : field === "join"
          ? echoSetJoinOptions.includes(value)
            ? value
            : "+"
          : null;
  if (nextValue === null || echoSet[field] === nextValue) return;

  echoSet[field] = nextValue;
  saveGoalState(character);
  updateRenderedEchoSetCombobox(id, targetIndex, echoSet.name);
}

function updateGoalMainEcho(id, index, field, value) {
  const character = state.characters.find((item) => item.id === id);
  if (!character || !canEditActiveGoal(character)) return;
  const goal = getActiveGoal(character);
  const targetIndex = Number(index);
  const mainEcho = goal.mainEchoes[targetIndex];
  if (!mainEcho) return;

  if (field !== "name") return;
  const nextName = String(value ?? "").trim();
  if (mainEcho.name === nextName) return;

  mainEcho.name = nextName;
  if (targetIndex === 0) goal.mainEcho = mainEcho.name;

  saveGoalState(character);
}

function addGoalEchoSet(id) {
  const character = state.characters.find((item) => item.id === id);
  if (!character || !canEditActiveGoal(character)) return;
  const goal = getActiveGoal(character);
  if (goal.echoSets.length >= 20) return;

  goal.echoSets.push({ join: "+", name: "", pieces: "2 Set" });
  saveGoalState(character);
  rerenderFarmingCard(id);
}

function addGoalMainEcho(id) {
  const character = state.characters.find((item) => item.id === id);
  if (!character || !canEditActiveGoal(character)) return;
  const goal = getActiveGoal(character);
  if (goal.mainEchoes.length >= 4) return;

  goal.mainEchoes.push({ join: "OR", name: "" });
  saveGoalState(character);
  rerenderFarmingCard(id);
}

function removeGoalEchoSet(id, index) {
  const character = state.characters.find((item) => item.id === id);
  if (!character || !canEditActiveGoal(character)) return;
  const goal = getActiveGoal(character);
  const targetIndex = Number(index);
  if (goal.echoSets.length <= 1 || targetIndex <= 0) return;

  goal.echoSets.splice(targetIndex, 1);
  saveGoalState(character);
  rerenderFarmingCard(id);
}

function removeGoalMainEcho(id, index) {
  const character = state.characters.find((item) => item.id === id);
  if (!character || !canEditActiveGoal(character)) return;
  const goal = getActiveGoal(character);
  const targetIndex = Number(index);
  if (goal.mainEchoes.length <= 1 || targetIndex <= 0) return;

  goal.mainEchoes.splice(targetIndex, 1);
  saveGoalState(character);
  rerenderFarmingCard(id);
}

function updateGoalEchoStatKey(id, index, key) {
  const character = state.characters.find((item) => item.id === id);
  if (!character || !canEditActiveGoal(character)) return;
  const option = getStatOption(key, statOptions);
  const stat = getActiveGoal(character).echoStats[Number(index)];
  if (!stat) return;

  stat.key = option.key;
  stat.label = option.label;

  saveGoalState(character);
  rerenderFarmingCard(id);
}

function updateGoalEchoStatField(id, index, field, value) {
  const character = state.characters.find((item) => item.id === id);
  if (!character) return;
  const isBranchCheck = field === "branchChecked";
  if (!isBranchCheck && !canEditActiveGoal(character)) return;
  const stat = getActiveGoal(character).echoStats[Number(index)];
  if (!stat) return;

  const wasComplete = isGoalComplete(character);
  if (field === "cost") {
    const nextCost = statCostOptions.includes(value) ? value : "COST 1";
    if (stat.cost === nextCost) return;
    stat.cost = nextCost;
  }
  if (field === "variant") {
    const nextVariant = statVariantOptions.includes(value) ? value : "-";
    if (stat.variant === nextVariant) return;
    stat.variant = nextVariant;
    stat.branchChecked =
      nextVariant !== "-" && isGoalBranchActive(getActiveGoal(character), nextVariant);
  }
  if (field === "branchChecked") {
    const nextChecked = stat.variant !== "-" && Boolean(value);
    const matchingStats = getActiveGoal(character).echoStats.filter(
      (echoStat) => echoStat.variant === stat.variant,
    );
    if (matchingStats.every((echoStat) => echoStat.branchChecked === nextChecked)) return;
    matchingStats.forEach((echoStat) => {
      echoStat.branchChecked = nextChecked;
    });
  }

  saveGoalState(character);
  if (field === "variant" || isBranchCheck) {
    updateRenderedEchoBranchCheckStates(character.id);
    updateGoalRenderStateAfterEdit(character, wasComplete);
  }
}

function updateRenderedEchoBranchCheckStates(id) {
  const character = state.characters.find((item) => item.id === id);
  if (!character) return;
  const goal = getActiveGoal(character);

  document
    .querySelectorAll(
      `[data-echo-stat-field="branchChecked"][data-character="${CSS.escape(id)}"]`,
    )
    .forEach((checkbox) => {
      const stat = goal.echoStats[Number(checkbox.dataset.index)];
      if (!stat) return;
      checkbox.checked = stat.variant !== "-" && stat.branchChecked;
    });
}

function updateRenderedBranchCheckState(field) {
  const row = field.closest(".echo-stat-row");
  const branchCell = row?.querySelector(".branch-cell");
  const checkLabel = row?.querySelector(".branch-check");
  const checkbox = row?.querySelector('[data-echo-stat-field="branchChecked"]');
  if (!checkLabel || !checkbox) return;

  const hasBranch = field.value !== "-";
  branchCell?.classList.toggle("has-branch", hasBranch);
  checkLabel.classList.toggle("hidden", !hasBranch);
  checkbox.disabled = !hasBranch || field.disabled;
  if (!hasBranch) checkbox.checked = false;
}

function updateRenderedValueBranchStates(id) {
  const character = state.characters.find((item) => item.id === id);
  if (!character) return;
  const goal = getActiveGoal(character);

  document
    .querySelectorAll(`[data-stat-row="${CSS.escape(id)}"]`)
    .forEach((row) => {
      const stat = goal.stats[Number(row.dataset.index)];
      if (!stat) return;
      const hasBranch = stat.variant !== "-";
      const branchActive = isGoalBranchActive(goal, stat.variant);
      const branchCell = row.querySelector(".branch-cell");
      const branchCheck = row.querySelector(".branch-check");
      const branchCheckbox = branchCheck?.querySelector("input");
      const targetInput = row.querySelector("[data-goal-stat-field='target']");
      const currentInput = row.querySelector("[data-current-field]");
      const clearButton = row.querySelector("[data-clear-current]");
      const canEditGoal = canEditActiveGoal(character);

      branchCell?.classList.toggle("has-branch", hasBranch);
      branchCheck?.classList.toggle("hidden", !hasBranch);
      if (branchCheckbox) branchCheckbox.checked = branchActive;
      row.classList.toggle("branch-inactive", !branchActive && !canEditGoal);
      if (targetInput) targetInput.disabled = !canEditGoal;
      if (currentInput) currentInput.disabled = !branchActive && !canEditGoal;
      if (clearButton) clearButton.disabled = !branchActive && !canEditGoal;
      updateRenderedStatRowState(id, Number(row.dataset.index), row);
    });
}

function removeGoalEchoStat(id, index) {
  const character = state.characters.find((item) => item.id === id);
  if (!character || !canEditActiveGoal(character)) return;
  const goal = getActiveGoal(character);
  if (goal.echoStats.length <= 2) return;

  const targetIndex = Number(index);
  goal.echoStats.splice(targetIndex, 1);
  saveGoalState(character);
  renderStats();
  renderFocusStrip();
  rerenderFarmingCard(id);
}

function updateGoalStatField(id, index, field, value) {
  const character = state.characters.find((item) => item.id === id);
  if (!character || !canEditActiveGoal(character)) return;
  const stat = getActiveGoal(character).stats[Number(index)];
  if (!stat) return;

  const wasComplete = isGoalComplete(character);
  if (field === "target") {
    const nextTarget = Math.max(0, Number(value) || 0);
    if (Number(stat.target ?? 0) === nextTarget) return;
    stat.target = nextTarget;
  }
  if (field === "cost") {
    const nextCost = statCostOptions.includes(value) ? value : "COST 1";
    if (stat.cost === nextCost) return;
    stat.cost = nextCost;
  }
  if (field === "variant") {
    const nextVariant = statVariantOptions.includes(value) ? value : "-";
    if (stat.variant === nextVariant) return;
    stat.variant = nextVariant;
  }

  saveGoalState(character);
  updateGoalRenderStateAfterEdit(character, wasComplete);
}

function updateRenderedStatRowState(id, index, row) {
  const character = state.characters.find((item) => item.id === id);
  const stat = character ? getActiveGoal(character).stats[Number(index)] : null;
  if (!character || !stat || !row) return;

  const current = getCurrentStatValue(character, stat);
  const target = Number(stat.target ?? 0);
  const canEditGoal = canEditActiveGoal(character);
  const branchActive = isGoalBranchActive(getActiveGoal(character), stat.variant);
  row.classList.toggle("branch-inactive", !branchActive && !canEditGoal);

  const currentInput = row.querySelector("[data-current-field]");
  const clearButton = row.querySelector("[data-clear-current]");
  if (currentInput) currentInput.disabled = !branchActive && !canEditGoal;
  if (clearButton) clearButton.disabled = !branchActive && !canEditGoal;
  row.classList.toggle("met", branchActive && current >= target);
}

function clearCurrentStat(id, key) {
  const character = state.characters.find((item) => item.id === id);
  if (!character) return;

  const wasComplete = isGoalComplete(character);
  updateCurrentStatValuesByAttribute(character, key, 0);
  character.currentStats.manualComplete = false;
  if (character.farm.priority === "done") character.farm.priority = "mid";

  saveState();
  renderStats();
  renderFocusStrip();

  const isComplete = isGoalComplete(character);
  if (shouldRerenderFarmingCardAfterCompletionChange(wasComplete, isComplete)) {
    renderRoster();
    if (id === selectedId) renderDetail();
    return;
  }

  updateRenderedFarmingCardCompletionState(id, isComplete);
  updateRenderedCurrentStatValues(id, key);
  updateRenderedManualCompleteInput(id);
  if (id === selectedId) renderDetail();
}

function updateRenderedManualCompleteInput(id) {
  const character = state.characters.find((item) => item.id === id);
  if (!character) return;

  document
    .querySelectorAll(`[data-manual-complete="${CSS.escape(id)}"]`)
    .forEach((input) => {
      input.checked = character.currentStats.manualComplete;
    });
}

function addGoalStat(id) {
  const character = state.characters.find((item) => item.id === id);
  if (!character || !canEditActiveGoal(character)) return;
  const goal = getActiveGoal(character);
  if (goal.stats.length >= 7) return;

  const option =
    valueStatOptions.find(
      (item) => !goal.stats.some((stat) => stat.key === item.key),
    ) ?? valueStatOptions[0];
  goal.stats.push({
    key: option.key,
    label: option.label,
    target: option.defaultTarget,
    cost: "COST 1",
    variant: "-",
  });
  saveGoalState(character);
  renderStats();
  renderFocusStrip();
  rerenderFarmingCard(id);
}

function addGoalEchoStat(id) {
  const character = state.characters.find((item) => item.id === id);
  if (!character || !canEditActiveGoal(character)) return;
  const goal = getActiveGoal(character);
  if (goal.echoStats.length >= 7) return;

  const option =
    statOptions.find(
      (item) => !goal.echoStats.some((stat) => stat.key === item.key),
    ) ?? statOptions[0];
  goal.echoStats.push({
    key: option.key,
    label: option.label,
    cost: "COST 1",
    variant: "-",
    branchChecked: false,
  });
  saveGoalState(character);
  rerenderFarmingCard(id);
}

function removeGoalStat(id, index) {
  const character = state.characters.find((item) => item.id === id);
  if (!character || !canEditActiveGoal(character)) return;
  const goal = getActiveGoal(character);
  if (goal.stats.length <= 1) return;

  const targetIndex = Number(index);
  goal.stats.splice(targetIndex, 1);
  saveGoalState(character);
  renderStats();
  renderFocusStrip();
  rerenderFarmingCard(id);
}

function updateGoalStatKey(id, index, key) {
  const character = state.characters.find((item) => item.id === id);
  if (!character || !canEditActiveGoal(character)) return;
  const goal = getActiveGoal(character);
  const stat = goal.stats[Number(index)];
  if (!stat) return;
  if (!isGoalBranchActive(goal, stat.variant) && !canEditActiveGoal(character)) return;
  const option = getStatOption(key, valueStatOptions);

  stat.key = option.key;
  stat.label = option.label;
  stat.target = option.defaultTarget;
  const currentKey = getCurrentStatValueKey(stat);
  if (!(currentKey in character.currentStats.values)) {
    character.currentStats.values[currentKey] = 0;
  }
  saveGoalState(character);
  renderStats();
  renderFocusStrip();
  rerenderFarmingCard(id);
}

function getRosterEmptyState() {
  let title = "조건에 맞는 캐릭터가 없습니다";
  let description = "검색어와 필터를 조정하면 다시 목록을 볼 수 있습니다.";

  if (searchTerm) {
    title = `"${searchTerm}" 검색 결과가 없습니다`;
    description = "캐릭터 이름을 다시 확인하거나 검색어를 줄여보세요.";
  } else if (activeTab === "farming") {
    title = "조건에 맞는 파밍 카드가 없습니다";
    description =
      "보유/달성 필터를 조정하거나 캐릭터 보유 상태를 먼저 변경해보세요.";
  } else if (currentView === "owned") {
    title = "아직 보유 체크된 캐릭터가 없습니다";
    description = "캐릭터 카드의 체크 버튼을 켜면 보유 목록에 표시됩니다.";
  } else if (currentView === "unowned") {
    title = "모든 캐릭터가 보유 상태입니다";
    description =
      "미보유 캐릭터만 보고 싶다면 보유 체크를 끈 캐릭터가 있어야 합니다.";
  }

  return `
    <article class="roster-empty">
      <p class="eyebrow">No Results</p>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(description)}</p>
    </article>
  `;
}

function renderFocusStrip() {
  const focusItems = getVisibleFocusCharacters();

  if (!focusItems.length) {
    focusStrip.innerHTML = `
      <article class="focus-card empty-focus">
        <p class="eyebrow">Focus</p>
        <h2>보유 처리된 캐릭터가 없습니다</h2>
      </article>
    `;
    return;
  }

  focusStrip.innerHTML = focusItems
    .map((character, index) => {
      const progress = getProgress(character);
      const color = elementColors[character.element] ?? "#9fd3ff";
      const complete = isGoalComplete(character);
      return `
        <article class="focus-card ${complete ? "complete" : ""}" style="--element-color:${color}">
          ${character.image ? `<img class="card-backdrop-image" src="${escapeHtml(character.image)}" alt="" loading="lazy" />` : ""}
          <div>
            <p class="eyebrow priority-label priority-${escapeHtml(character.farm.priority)}">${escapeHtml(getPriorityLabel(character.farm.priority))}</p>
            <h2>${escapeHtml(character.name)}</h2>
            <div class="focus-meta">
              ${renderCharacterMetaChips(character)}
              <strong>${progress}%</strong>
            </div>
            ${character.farm.nextAction ? `<p class="focus-action">${escapeHtml(character.farm.nextAction)}</p>` : ""}
          </div>
          <button class="ghost-button focus-open" data-focus="${character.id}" type="button">열기</button>
        </article>
      `;
    })
    .join("");

  focusStrip.querySelectorAll("[data-focus]").forEach((button) => {
    button.addEventListener("click", () => {
      openFarmingCard(button.dataset.focus);
    });
  });
}

function getVisibleFocusCharacters() {
  return state.characters
    .filter((character) => character.owned)
    .filter(matchesActiveToolbarCriteria)
    .sort(sortFocusCharacters);
}

function matchesActiveToolbarCriteria(character) {
  if (activeTab === "ownership") {
    if (currentView === "owned" && !character.owned) return false;
    if (currentView === "unowned" && character.owned) return false;
  }
  if (activeTab === "farming" && !matchesFarmingFilters(character)) return false;
  if (!matchesVisibilityFilter(character)) return false;
  if (
    activeCategory !== "all" &&
    getCategoryValue(character) !== activeCategory
  )
    return false;
  return character.name.toLowerCase().includes(searchTerm);
}

function sortFocusCharacters(a, b) {
  const completeScore = Number(isGoalComplete(a)) - Number(isGoalComplete(b));
  if (completeScore) return completeScore;
  return sortCharacters(a, b);
}

function openFarmingCard(id) {
  const character = state.characters.find((item) => item.id === id);
  if (!character?.owned) return;

  selectedId = id;
  setActiveTab("farming", { resetCategory: false });
  render();
  requestAnimationFrame(() => {
    const card = rosterList.querySelector(
      `[data-farm-card="${CSS.escape(id)}"]`,
    );
    if (!card) return;
    card.classList.add("spotlight");
    card.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => card.classList.remove("spotlight"), 900);
  });
}

function isCompactDetailPanel() {
  return Boolean(compactDetailQuery?.matches);
}

function syncDetailPanelMode() {
  const isCompact = isCompactDetailPanel();
  const canCollapse = Boolean(detailPanel.querySelector(".detail-content"));
  detailPanel.classList.toggle("is-floating", isCompact);
  detailPanel.classList.toggle(
    "is-collapsed",
    isCompact && isDetailPanelCollapsed && canCollapse,
  );
}

function toggleOwned(id) {
  const character = state.characters.find((item) => item.id === id);
  if (!character) return;

  character.owned = !character.owned;
  if (character.owned) selectedId = id;
  if (!character.owned && selectedId === id) {
    selectedId = getFirstOwnedCharacterId(id);
  }
  saveState();
  render();
}

function openCharacterDialog(id = "") {
  if (!isAdmin()) {
    showSessionMessage(
      "관리자 권한 필요",
      "캐릭터 기본 정보 관리는 관리자만 사용할 수 있습니다",
    );
    return;
  }
  const character = state.characters.find((item) => item.id === id);
  editCharacterId.value = character?.id ?? "";
  document.querySelector("#newName").value = character?.name ?? "";
  document.querySelector("#newEn").value = character?.en ?? "";
  document.querySelector("#newImage").value = character?.image ?? "";
  document.querySelector("#newImageFile").value = "";
  document.querySelector("#newElement").value = character?.element ?? "회절";
  document.querySelector("#newWeapon").value = character?.weapon ?? "직검";
  document.querySelector("#newRarity").value = getRarity(character ?? {});
  document.querySelector("#newVisibility").value =
    character?.isPublic === false ? "private" : "public";
  deleteCharacterButton.classList.toggle("hidden", !character);
  dialog.querySelector("h2").textContent = character
    ? "캐릭터 편집"
    : "캐릭터 추가";
  dialog.showModal();
  document.querySelector("#newName").focus();
}

function renderDetail() {
  const character = state.characters.find(
    (item) => item.id === selectedId && item.owned,
  );
  detailPanel.classList.toggle("is-empty", !character);
  if (!character) {
    detailPanel.innerHTML = `
      <div class="empty-state">
        <p class="eyebrow">Farming</p>
        <h2>보유 캐릭터를 선택하세요</h2>
        <p>체크를 켠 캐릭터만 파밍 상태를 기록할 수 있습니다.</p>
      </div>
    `;
    syncDetailPanelMode();
    return;
  }

  const fragment = detailTemplate.content.cloneNode(true);
  const color = elementColors[character.element] ?? "#9fd3ff";
  fragment.querySelector(".avatar").style.setProperty("--element-color", color);
  fragment.querySelector(".avatar").innerHTML = character.image
    ? `<img src="${escapeHtml(character.image)}" alt="" loading="lazy" />`
    : escapeHtml(getInitial(character.name));
  fragment.querySelector(".detail-element").textContent = character.owned
    ? "보유 캐릭터"
    : "미보유 캐릭터";
  fragment.querySelector(".detail-name").textContent = character.name;
  fragment.querySelector(".detail-meta").innerHTML =
    renderCharacterMetaChips(character);

  fragment.querySelectorAll("[data-field]").forEach((field) => {
    const key = field.dataset.field;
    if (key === "manualComplete") {
      field.classList.toggle("active", character.currentStats.manualComplete);
      field.setAttribute(
        "aria-pressed",
        String(character.currentStats.manualComplete),
      );
      field.addEventListener("click", () =>
        updateCurrentStat(
          character.id,
          key,
          !character.currentStats.manualComplete,
        ),
      );
      return;
    }
    field.value = character.farm[key];
    field.addEventListener("input", (event) =>
      updateFarm(character.id, key, event.target.value),
    );
    if (key === "notes") {
      field.addEventListener("blur", () => {
        const trimmedValue = field.value.trim();
        if (field.value !== trimmedValue) {
          field.value = trimmedValue;
          updateFarm(character.id, key, trimmedValue);
        }
      });
    }
  });

  detailPanel.innerHTML = "";
  detailPanel.append(fragment);
  detailPanel
    .querySelector("[data-detail-panel-toggle]")
    ?.addEventListener("click", (event) => {
      event.stopPropagation();
      isDetailPanelCollapsed = true;
      syncDetailPanelMode();
    });
  syncDetailPanelMode();
}

function updateFarm(id, key, value) {
  const character = state.characters.find((item) => item.id === id);
  if (!character) return;

  character.farm[key] = isTextFarmField(key) ? value : Number(value);
  saveState();
  if (key === "priority") {
    syncDetailMeta(character);
    renderStats();
    renderFocusStrip();
    renderRoster();
    return;
  }
  if (key === "notes" || key === "nextAction") {
    renderStats();
    renderFocusStrip();
    renderRoster();
    return;
  }
  if (isProgressFarmField(key)) {
    renderStats();
    renderFocusStrip();
    renderRoster();
    return;
  }
  renderDetail();
  renderStats();
  renderFocusStrip();
  renderRoster();
}

function syncDetailMeta(character) {
  const meta = detailPanel.querySelector(".detail-meta");
  if (meta) meta.innerHTML = renderCharacterMetaChips(character);
}

function completeFarm(id) {
  const character = state.characters.find((item) => item.id === id);
  if (!character) return;

  character.farm = {
    ...character.farm,
    level: 100,
    weapon: 100,
    skill: 100,
    echo: 100,
    material: 100,
    priority: "done",
    nextAction: "",
  };
  character.currentStats.manualComplete = true;
  getActiveGoal(character).stats.forEach((stat) => {
    character.currentStats.values[getCurrentStatValueKey(stat)] = Number(
      stat.target ?? 0,
    );
  });
  saveState();
  showSessionMessage(
    `${character.name} 완료`,
    "파밍 진행률을 100%로 저장했습니다",
  );
  render();
}

function resetFarmProgress(id) {
  const character = state.characters.find((item) => item.id === id);
  if (!character) return;

  character.farm = {
    ...character.farm,
    level: 0,
    weapon: 0,
    skill: 0,
    echo: 0,
    material: 0,
    priority: "mid",
  };
  character.currentStats.manualComplete = false;
  character.currentStats.values = { ...defaultCurrentStats.values };
  saveState();
  showSessionMessage(
    `${character.name} 초기화`,
    "메모와 다음 할 일은 유지했습니다",
  );
  render();
}

function renderStats() {
  const owned = state.characters.filter((character) => character.owned);
  const farming = owned.filter((character) => !isGoalComplete(character));
  const average = owned.length
    ? Math.round(
        owned.reduce((sum, character) => sum + getProgress(character), 0) /
          owned.length,
      )
    : 0;

  ownedCount.textContent = owned.length;
  activePlans.textContent = farming.length;
  avgProgress.textContent = `${average}%`;
}

function renderSnapshotNotice() {
  shareNotice.classList.toggle("hidden", !isSnapshotMode);
}

function getProgress(character) {
  const { level, weapon, skill, echo, material } = character.farm;
  const legacyProgress = Math.round(
    (level + weapon + skill + echo + material) / 5,
  );
  return Math.max(legacyProgress, getGoalProgress(character));
}

function getGoalProgress(character) {
  if (character.currentStats.manualComplete) return 100;
  const stats = getActiveGoalStats(character);
  if (!stats.length) return 0;
  const metCount = stats.filter(
    (stat) =>
      getCurrentStatValue(character, stat) >=
      Number(stat.target ?? 0),
  ).length;
  return Math.round((metCount / stats.length) * 100);
}

function isGoalComplete(character) {
  if (character.currentStats.manualComplete) return true;
  return getGoalProgress(character) >= 100;
}

function getActiveGoal(character) {
  return character.goalMode === "custom"
    ? character.goals.custom
    : character.goals.admin;
}

function getInitial(name) {
  return [...name][0] ?? "?";
}

function getPriorityLabel(priority) {
  return {
    high: "우선순위 높음",
    mid: "우선순위 보통",
    low: "우선순위 낮음",
    done: "완료",
  }[priority];
}

function getPriorityScore(priority) {
  return (
    {
      high: 3,
      mid: 2,
      low: 1,
      done: 0,
    }[priority] ?? 0
  );
}

function isTextFarmField(key) {
  return key === "notes" || key === "priority" || key === "nextAction";
}

function isProgressFarmField(key) {
  return ["level", "weapon", "skill", "echo", "material"].includes(key);
}

function createShareUrl(options = {}) {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = `share=${encodeShareState(getPortableState(options))}`;
  return url.toString();
}

async function copyShareUrl(options) {
  const shareUrl = createShareUrl(options);
  if (shareUrl.length > SHARE_URL_WARN_LENGTH) {
    showSessionMessage(
      "공유 링크가 깁니다",
      "메모가 많은 기록은 백업 JSON으로 공유하는 편이 안정적입니다",
    );
    return;
  }

  try {
    await copyText(shareUrl);
    showSessionMessage(options.successTitle, options.successHint);
  } catch {
    showSessionMessage(
      "복사 실패",
      "브라우저 권한 문제일 수 있습니다. 백업 JSON을 사용해주세요",
    );
  }
}

function readSharedSnapshot() {
  return null;
  const params = new URLSearchParams(window.location.hash.slice(1));
  const payload = params.get("share");
  if (!payload) return null;

  try {
    return normalizeState(decodeShareState(payload));
  } catch {
    return null;
  }
}

function encodeShareState(value) {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeShareState(value) {
  const base64 = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

async function resolveImageInput(value) {
  if (!value) return "";
  if (value.startsWith("data:")) return validateDataUrlSize(value);
  if (!/^https?:\/\//i.test(value)) return value;

  let response;
  try {
    response = await fetch(value);
  } catch {
    throw new Error("이미지 URL을 가져올 수 없습니다");
  }
  if (!response.ok) throw new Error("유효하지 않은 이미지 URL입니다");

  const blob = await response.blob();
  await validateImageBlob(blob);
  return readBlobAsDataUrl(blob);
}

function validateDataUrlSize(value) {
  const base64 = value.split(",")[1] ?? "";
  const estimatedBytes = Math.ceil((base64.length * 3) / 4);
  if (estimatedBytes > MAX_IMAGE_BYTES)
    throw new Error("2MB 이하 이미지만 업로드할 수 있습니다");
  if (!value.startsWith("data:image/"))
    throw new Error("이미지 파일만 업로드할 수 있습니다");
  return value;
}

async function readImageFileAsDataUrl(file) {
  await validateImageBlob(file);
  return readBlobAsDataUrl(file);
}

async function validateImageBlob(blob) {
  if (!blob.type.startsWith("image/"))
    throw new Error("이미지 파일만 업로드할 수 있습니다");
  if (blob.size > MAX_IMAGE_BYTES)
    throw new Error("2MB 이하 이미지만 업로드할 수 있습니다");
  await ensureImageDecodes(blob);
}

function ensureImageDecodes(blob) {
  if (typeof createImageBitmap === "function") {
    return createImageBitmap(blob)
      .then((bitmap) => {
        bitmap.close?.();
      })
      .catch(() => {
        throw new Error("유효하지 않은 이미지입니다");
      });
  }

  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(blob);
    image.addEventListener("load", () => {
      URL.revokeObjectURL(url);
      resolve();
    });
    image.addEventListener("error", () => {
      URL.revokeObjectURL(url);
      reject(new Error("유효하지 않은 이미지입니다"));
    });
    image.src = url;
  });
}

function readBlobAsDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(blob);
  });
}

function clearShareHash() {
  const url = new URL(window.location.href);
  url.hash = "";
  history.replaceState(null, "", url);
}

function showSessionMessage(title, hint) {
  sessionName.textContent = title;
  sessionHint.textContent = hint;
}

function getSignedInSessionTitle(adminEnabled = isAdmin()) {
  return adminEnabled ? "관리자 로그인됨" : "일반 사용자 로그인됨";
}

function updateGoogleButton(mode) {
  const labels = {
    setup: { text: "!", title: "Firebase 설정 필요" },
    signedOut: { text: "로그인", title: "로그인" },
    signedIn: { text: "로그아웃", title: "로그아웃" },
  };
  const label = labels[mode] ?? labels.signedOut;
  googleButton.textContent = label.text;
  googleButton.title = label.title;
  googleButton.setAttribute("aria-label", label.title);
  googleButton.dataset.authState = mode;
}

function hasFirebaseConfig() {
  const firebase = CONFIG.firebase ?? {};
  return Boolean(
    firebase.apiKey &&
    firebase.authDomain &&
    firebase.projectId &&
    firebase.appId,
  );
}

async function ensureCloud() {
  if (cloud) return cloud;

  showSessionMessage("Google 연결 중", "로그인 모듈을 불러오고 있습니다");

  const [appModule, authModule, firestoreModule] = await Promise.all([
    import(
      `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app.js`
    ),
    import(
      `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-auth.js`
    ),
    import(
      `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-firestore.js`
    ),
  ]);

  const app = appModule.initializeApp(CONFIG.firebase);
  const auth = authModule.getAuth(app);
  const db = firestoreModule.getFirestore(app);
  const provider = new authModule.GoogleAuthProvider();

  cloud = {
    auth,
    db,
    doc: firestoreModule.doc,
    getDoc: firestoreModule.getDoc,
    setDoc: firestoreModule.setDoc,
    signIn: () => authModule.signInWithPopup(auth, provider),
    signOut: () => authModule.signOut(auth),
  };

  authModule.onAuthStateChanged(auth, async (user) => {
    if (!user) {
      state.user = createDefaultUser();
      adminGoalEditingId = null;
      showSessionMessage("로컬 저장 중", "이 브라우저에 자동 저장됩니다");
      updateGoogleButton("signedOut");
      render();
      return;
    }

    state.user = createGoogleUser(user);
    showSessionMessage(
      getSignedInSessionTitle(false),
      "클라우드 기록을 확인하고 있습니다",
    );

    try {
      const ref = cloud.doc(db, "profiles", user.uid);
      const snapshot = await cloud.getDoc(ref);
      if (snapshot.exists() && !isSnapshotMode) {
        const remoteState = normalizeState(snapshot.data());
        state = chooseNewerState(state, remoteState);
        state.user = createGoogleUser(user);
        selectedId = getFirstOwnedCharacterId();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch (error) {
      logCloudError(error, {
        action: "load-profile",
        path: `profiles/${user.uid}`,
      });
      showSessionMessage(
        "클라우드 불러오기 실패",
        getReadableCloudError(error),
      );
      updateGoogleButton("signedIn");
      return;
    }

    const adminEnabled = await refreshAdminRole(user);
    render();

    showSessionMessage(
      getSignedInSessionTitle(adminEnabled),
      adminEnabled
        ? "관리자 권한으로 클라우드에 동기화합니다"
        : "변경사항을 클라우드에 동기화합니다",
    );
    updateGoogleButton("signedIn");
    scheduleCloudSave();
  });

  return cloud;
}

function scheduleCloudSave() {
  if (!cloud?.auth.currentUser || isSnapshotMode) return;
  clearTimeout(cloudSaveTimer);
  cloudSaveTimer = setTimeout(saveCloudState, 500);
}

async function saveCloudState() {
  if (!cloud?.auth.currentUser || isSnapshotMode) return;
  try {
    const ref = cloud.doc(cloud.db, "profiles", cloud.auth.currentUser.uid);
    await cloud.setDoc(ref, getUserProfileState(), { merge: true });
    showSessionMessage(
      getSignedInSessionTitle(),
      "클라우드 저장 완료",
    );
  } catch (error) {
    logCloudError(error, {
      action: "save-profile",
      path: `profiles/${cloud.auth.currentUser.uid}`,
    });
    showSessionMessage("클라우드 저장 실패", getReadableCloudError(error));
  }
}

async function loadGoalDefaultsData() {
  try {
    const response = await fetch("data/goal-defaults.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const defaults = await response.json();
    adminGoalDefaults = defaults && typeof defaults === "object" ? defaults : {};
  } catch {
    adminGoalDefaults = {};
    showSessionMessage("목표 기본값 불러오기 실패", "data/goal-defaults.json을 확인해주세요");
  }
  applyAdminGoalDefaults();
}

function applyAdminGoalDefaults() {
  state.characters = state.characters.map((character) =>
    normalizeCharacter({
      ...character,
      goals: {
        ...character.goals,
        admin: getAdminGoalDefault(character),
      },
    }),
  );
}

function chooseNewerState(localState, remoteState) {
  if (!remoteState.updatedAt) return localState;
  if (!localState.updatedAt) return remoteState;
  return new Date(remoteState.updatedAt) > new Date(localState.updatedAt)
    ? remoteState
    : localState;
}

function getReadableAuthError(error) {
  if (error?.code === "auth/popup-closed-by-user")
    return "로그인 창이 닫혔습니다";
  if (error?.code === "auth/unauthorized-domain")
    return "Firebase 승인 도메인에 현재 주소를 추가해주세요";
  return "Firebase 설정과 브라우저 팝업 허용 상태를 확인해주세요";
}

function logCloudError(error, context) {
  console.error("Firebase cloud operation failed", {
    action: context.action,
    path: context.path,
    code: error?.code ?? "unknown",
    message: error?.message ?? String(error),
  });
}

function getReadableCloudError(error) {
  if (error?.code === "permission-denied")
    return "Firestore 규칙 배포 상태와 로그인 계정을 확인해주세요";
  if (error?.code === "unavailable") return "네트워크 연결 후 다시 시도됩니다";
  return "Firebase 설정, 규칙, 네트워크 상태를 확인해주세요";
}

function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (match) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[match],
  );
}

let shouldRenderImmediately = true;

initializeApp();

async function initializeApp() {
  await loadCharacterSeedData();
  initializeState();
  await loadGoalDefaultsData().catch(() => {});

  if (isSnapshotMode) {
    showSessionMessage(
      "공유 기록 보기",
      "내 기록으로 저장하기 전까지 기존 저장소는 유지됩니다",
    );
  } else if (hasFirebaseConfig()) {
    shouldRenderImmediately = false;
    ensureCloud().catch(() => {
      showSessionMessage(
        "로컬 저장 중",
        "Google 버튼으로 다시 연결할 수 있습니다",
      );
      updateGoogleButton("signedOut");
      render();
    });
  } else {
    updateGoogleButton("setup");
  }

  registerServiceWorker();
  if (shouldRenderImmediately) render();
}

function isPrPreviewPath(pathname = window.location.pathname) {
  return /(?:^|\/)pr-preview\/pr-\d+\//.test(pathname);
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || window.location.protocol === "file:")
    return;
  if (isPrPreviewPath()) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js", { scope: "./" }).catch(() => {
      showSessionMessage(
        "로컬 저장 중",
        "오프라인 캐시는 다음 접속 때 다시 시도합니다",
      );
    });
  });
}
