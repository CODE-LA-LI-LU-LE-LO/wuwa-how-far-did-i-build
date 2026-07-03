# 관리자 기능 진입점 목록

이 문서는 관리자 인증과 관리자/일반 사용자 기능 분리를 구현하기 전에, 현재 코드에서 관리자 전용으로 보호해야 할 기능과 일반 사용자에게 유지해야 할 기능의 진입점을 정리한 메모입니다.

## 분리 기준

### 관리자 전용 기능

관리자 전용 기능은 캐릭터 기본 데이터 또는 모든 사용자가 참고하는 관리자 목표 기본값을 바꾸는 동작입니다. 캐릭터 기본 데이터는 Firestore가 아니라 `data/characters.json`에서 관리하고, 관리자 목표 기본값도 정적 JSON 파일 `data/goal-defaults.json`에서 앱 시작 시 한 번 공개 로드합니다.

| 기능 | UI 진입점 | 이벤트 핸들러/저장 위치 | 보호해야 할 데이터 |
| --- | --- | --- | --- |
| 캐릭터 추가 | `index.html`의 `#addCharacterButton` 버튼 | `app.js`의 `#addCharacterButton` 클릭 핸들러가 `openCharacterDialog()`를 호출하고, `#characterForm` submit 핸들러가 새 캐릭터를 `state.characters`에 추가 | 캐릭터 이름, 이미지, 속성, 무기, 등급, 공개 여부 |
| 캐릭터 편집 | 캐릭터 카드의 `[data-edit]` 버튼 | `app.js`의 `[data-edit]` 클릭 핸들러가 `openCharacterDialog(id)`를 호출하고, `#characterForm` submit 핸들러가 기존 캐릭터에 `Object.assign(existing, payload)` 적용 | 캐릭터 이름, 이미지, 속성, 무기, 등급, 공개 여부 |
| 캐릭터 제거 | 캐릭터 편집 다이얼로그의 `#deleteCharacterButton` 버튼 | `app.js`의 `#deleteCharacterButton` 클릭 핸들러가 `state.characters`에서 대상 캐릭터를 제거 | 캐릭터 목록 |
| 캐릭터 공개/비공개 변경 | 캐릭터 추가/편집 다이얼로그의 `#newVisibility` select | `app.js`의 `#characterForm` submit 핸들러가 `isPublic` 값을 저장 | 캐릭터 공개 여부 |
| 관리자 목표 스테이터스 기본값 편집 | 파밍 카드의 `[data-toggle-admin-goals]` 편집 버튼과 `[data-goal-field]`, 목표 스탯/에코 관련 입력 UI | `app.js`의 `[data-toggle-admin-goals]` 클릭 핸들러가 `adminGoalEditing`을 토글하고, 목표 입력 핸들러들이 `updateGoal()` 및 관련 목표 수정 함수로 관리자 목표를 수정 | `data/goal-defaults.json`, `character.goals.admin`, `adminGoalDefaults` |

## 일반 사용자 기능

일반 사용자 기능은 개인 보유 상태, 개인 파밍 상태, 개인 목표, 백업/불러오기, 로그인 저장처럼 사용자 본인의 기록만 바꾸는 동작입니다. 관리자는 일반 사용자 기능도 모두 사용할 수 있습니다.

| 기능 | UI 진입점 | 이벤트 핸들러/저장 위치 | 유지해야 할 데이터 범위 |
| --- | --- | --- | --- |
| 캐릭터 보유 여부 변경 | 캐릭터 카드의 `[data-owned]` 버튼 | `app.js`의 `[data-owned]` 클릭 핸들러가 `toggleOwned(id)` 호출 | `character.owned`, 선택된 캐릭터 |
| 개인 파밍 상태 입력 | 상세 패널과 파밍 카드의 현재 수치/진행도/메모 입력 | `app.js`의 현재 스탯 및 파밍 필드 핸들러가 `updateCurrentStat()` 등 개인 상태 수정 함수 호출 | `character.currentStats`, `character.farm` |
| 개인 목표 입력 | 파밍 카드의 `수동 입력` 목표 모드와 목표 입력 UI | `[data-goal-mode]` 클릭 핸들러가 `goalMode`를 `custom`으로 바꾸고, `canEditActiveGoal()`이 custom 목표 편집을 허용 | `character.goals.custom` |
| 관리자 목표/내 목표 전환 | 파밍 카드의 `목표`/`수동 입력` 버튼 | `[data-goal-mode]` 클릭 핸들러가 `updateCharacterField(id, "goalMode", mode)` 호출 | `character.goalMode` |
| 내 목표 스테이터스 기본값 편집 | `수동 입력` 목표 모드에서 활성화되는 목표 입력 UI | `canEditActiveGoal()`이 `character.goalMode === "custom"`일 때 편집 허용 | `character.goals.custom` |
| 백업/불러오기 | `#exportButton`, `#importInput`, `#exportGoalDefaultsButton` | 백업 버튼은 `getPortableState()`를 JSON으로 내보내고, 불러오기는 JSON을 개인 상태로 병합/적용합니다. 관리자 로그인 시 목표 JSON 다운로드 버튼은 현재 관리자 목표 편집 결과를 `goal-defaults.json`으로 내려받습니다. | 개인 기록 JSON, `data/goal-defaults.json` |
| Google 로그인 저장 | `#googleButton` | Firebase Auth 로그인 후 `profiles/{uid}` 문서를 읽고 쓰는 클라우드 저장 흐름 | 사용자별 `profiles/{uid}` |

## 겹치지 않도록 유지할 규칙

- 캐릭터 기본 정보(`name`, `image`, `element`, `weapon`, `rarity`, `isPublic`)를 바꾸는 모든 진입점은 관리자 전용이며, 배포용 기본 데이터는 `data/characters.json`에 반영해야 합니다.
- `character.goals.admin`, `adminGoalDefaults`를 바꾸고 `data/goal-defaults.json` 다운로드 파일을 생성하는 모든 진입점은 관리자 전용입니다.
- `character.owned`, `character.farm`, `character.currentStats`, `character.goalMode`, `character.goals.custom`은 일반 사용자 기능으로 유지합니다.
- 관리자는 일반 사용자 기능도 사용할 수 있으므로, 관리자 권한 검사는 일반 사용자 기능을 막지 않아야 합니다.
- UI 숨김만으로는 부족하므로 이후 관리자 인증 구현 시 관리자 전용 이벤트 핸들러와 저장 함수에도 권한 검사를 추가해야 합니다.

## 공개 목표 데이터 로딩

- 공개 목표 데이터는 `loadGoalDefaultsData()`가 `data/goal-defaults.json`을 앱 시작 시 한 번 조회해 적용합니다.
- signed-out, signed-in, 관리자 흐름 모두 같은 정적 JSON 기본값을 사용하며, 페이지/탭 전환마다 다시 조회하지 않습니다.
- 캐릭터 기본 데이터는 로그인 흐름에서 Firestore로 조회하지 않고 `data/characters.json` 정적 파일만 사용합니다.
- Firestore Rules에는 목표 데이터용 `goal/{docId}` 규칙을 두지 않습니다.
