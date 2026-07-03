# 내가 어디까지 잘 키웠더라

명조 캐릭터 보유 여부를 체크하고, 보유 캐릭터에 한해 파밍 상태를 기록하는 정적 웹앱입니다.

기능 설명서는 `SPEC.md`에 정리되어 있습니다.

## 현재 구현

- 캐릭터 보유 여부 체크
- 보유 관리/파밍 관리 탭 전환
- 이름/등급/속성/무기 정렬과 정렬 기준별 카테고리 필터
- 관리자용 캐릭터 추가/편집/제거
- 캐릭터 이미지 URL/파일, 무기, 속성, 등급, 공개 여부 관리
- 이미지 URL 입력 시 유효 이미지와 2MB 이하 용량 검증 후 저장
- Prydwen 기반 속성, 무기, 스테이터스, 에코셋 아이콘 표시
- 보유 관리 카드의 자물쇠 아이콘, 등급/속성/보유 상태, 캐릭터 배경 이미지 표시
- 기본 캐릭터 목록의 로컬 캐릭터 이미지 표시
- 보유 캐릭터 상세에서 목표달성, 우선순위, 다음 할 일, 메모 기록
- 관리자 목표/내 목표 스테이터스 전환
- 목표/수동 입력 스테이터스 전환
- 주옵 항목 3-5개 추가/삭제와 주옵 종류 선택
- 에코셋, 메인에코, 권장수치, 현재수치, 비고 기반 파밍 카드
- 현재 스테이터스와 목표 스테이터스 비교 및 목표 달성 표시
- 사용자 수동 목표 달성 체크
- 파밍 관리 탭의 전체/보유/미보유/목표달성/미달성 다중 필터
- 진행률, 보유 수, 파밍 중 캐릭터 수 요약
- 검색, 보유/파밍 중 필터, 이름/등급/속성/무기 정렬
- 캐릭터 직접 추가
- `data/characters.js` 기반 기본 캐릭터 목록
- 브라우저 `localStorage` 자동 저장
- JSON 백업/불러오기
- Firebase 설정 시 Google 로그인 및 Firestore 동기화
- 로그인 상태 표시와 Google 로그아웃
- 클라우드 저장 성공과 불러오기/저장 실패 안내
- Firebase 설정 예시 `app-config.example.js`
- 개인별 저장을 위한 `firestore.rules`
- GitHub Pages Actions 배포 워크플로
- Firebase CLI용 `firebase.json`
- 배포 전 정적 검증 스크립트 `scripts/verify.mjs`
- GitHub Pages에 바로 올릴 수 있는 정적 파일 구조
- GitHub Pages용 `.nojekyll` 포함
- 설치형 웹앱을 위한 `manifest.webmanifest`, 앱 아이콘, 오프라인 캐시

## 실행

`index.html`을 브라우저에서 열면 됩니다.

GitHub Pages에 배포할 때는 이 폴더의 `index.html`, `styles.css`, `app.js`, `assets/`를 그대로 올리면 됩니다.

`manifest.webmanifest`, `sw.js`, `.nojekyll`, `app-config.js`, `data/characters.js`도 같은 루트에 함께 올려야 설치형 웹앱과 오프라인 캐시가 정상 동작합니다.

`app-config.js`, `data/characters.js`는 배포 후 갱신이 잦은 파일이라 서비스워커가 네트워크 우선으로 확인합니다. 관리자 목표 기본값은 런타임 파일이 아니라 Firestore `goal/data` 문서에서 읽습니다.

## GitHub Pages 배포

`.github/workflows/pages.yml`이 루트의 정적 파일을 그대로 GitHub Pages에 배포합니다.

1. GitHub 저장소에 이 폴더 내용을 올립니다.
2. 저장소 Settings > Pages에서 Source를 `GitHub Actions`로 설정합니다.
3. `main` 브랜치에 push하거나 Actions에서 수동 실행합니다.

Firebase 로그인까지 쓰려면 배포된 GitHub Pages 주소를 Firebase Authentication의 승인 도메인에 추가해야 합니다.

배포 워크플로는 업로드 전에 아래 검증을 자동 실행합니다.

```bash
node scripts/verify.mjs
```

이 검증은 로컬 파일 참조, DOM 선택자 일치, PWA manifest, 캐릭터 seed, 서비스워커 캐시 전략, Firestore 규칙, 앱 초기화 스모크 로드를 확인합니다.

## 캐릭터 목록 갱신

기본 캐릭터 목록은 `data/characters.js`에서 관리하고, 관리자 목표 기본값은 Firestore `goal/data` 문서에서 관리합니다.

새 캐릭터가 추가되면 아래 형식으로 항목을 더하면 됩니다.

```js
{
  name: "캐릭터명",
  en: "English Name",
  element: "속성",
  weapon: "무기",
  rarity: "5",
  image: characterImage("character-slug")
}
```

이미 저장된 사용자의 보유 여부와 파밍 기록은 유지되고, seed에 새로 추가된 캐릭터만 미보유 상태로 병합됩니다.

## 백업

상단 도구막대의 `백업` 버튼을 누르면 현재 기록을 JSON 파일로 저장합니다.

저장한 JSON 파일은 `불러오기`로 다시 가져올 수 있습니다.

## Google 로그인 연결

1. Firebase Console에서 웹앱을 생성합니다.
2. Authentication에서 Google 제공업체를 활성화합니다.
3. Authentication의 승인 도메인에 GitHub Pages 도메인을 추가합니다.
4. Firestore Database를 생성합니다.
5. `app-config.js`의 `firebase` 값을 Firebase 웹앱 설정으로 채웁니다.

설정이 완료되면 우측 상단 `G` 버튼으로 로그인할 수 있고, 로그인 후 같은 버튼을 다시 누르면 로그아웃됩니다.

`app-config.example.js`를 참고해 Firebase Console의 웹앱 설정값을 `app-config.js`에 넣으면 됩니다.

```js
window.WW_TRACKER_CONFIG = {
  firebase: {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    appId: "YOUR_FIREBASE_APP_ID",
  },
};
```

Firebase 웹앱 설정값은 브라우저 앱에서 쓰는 공개 식별자입니다. 단, 서비스 계정 키나 비공개 관리자 키는 절대 `app-config.js`에 넣지 마세요.

### 관리자 권한 등록

GitHub Pages 배포 환경에서는 별도 서버 없이 Firestore의 `admins/{uid}` 문서 존재 여부로 관리자 여부를 판정합니다. `app-config.example.js`와 실제 `app-config.js`에는 Firebase 공개 설정값만 두고, 관리자 이메일이나 UID 목록은 추가하지 않습니다.

최초 관리자는 앱에서 직접 등록하지 않고 Firebase Console에서 수동으로 등록합니다.

1. 관리자로 사용할 Google 계정으로 앱에 한 번 로그인합니다.
2. Firebase Console > Authentication > Users에서 해당 사용자의 UID를 확인합니다.
3. Firebase Console > Firestore Database에서 `admins` 컬렉션을 생성합니다.
4. `admins` 컬렉션 안에 문서 ID가 해당 UID인 `admins/{uid}` 문서를 생성합니다.
5. 문서에 최소한 아래 필드를 추가합니다.

```js
{
  enabled: true
}
```

6. 앱에 다시 접속하거나 새로고침한 뒤 우측 상단 상태가 `관리자 로그인됨`으로 바뀌고 관리자 UI가 표시되는지 확인합니다.

관리자 판정은 로그인 시 `admins/{uid}` 문서를 단건 조회해 앱 상태에 캐시합니다. Firestore는 읽기 횟수가 과금/한도에 영향을 주므로 화면을 열 때마다 전체 관리자 데이터를 반복 조회하지 않습니다.

관리자 설정 시 보안 주의사항은 다음과 같습니다.

- 관리자 이메일 또는 UID 목록을 프론트엔드 설정 파일에 넣지 않습니다.
- `app-config.js`는 브라우저에서 내려받는 파일이므로 숨겨야 할 정보를 넣지 않습니다.
- Firebase 공개 설정값(`apiKey`, `authDomain`, `projectId`, `appId` 등)은 `app-config.js`에 포함할 수 있습니다.
- 서비스 계정 키, private key, Admin SDK 인증 정보는 절대 저장소나 프론트엔드 설정 파일에 넣지 않습니다.
- 관리자 권한의 실제 보안은 Firestore Security Rules에서 `admins/{uid}` 문서 기준으로 보호합니다.

개인별 기록과 관리자 공용 데이터는 Firestore 저장 경로를 분리합니다. 일반 사용자의 보유 여부, 파밍 상태, 개인 목표, 현재 스테이터스는 `profiles/{uid}`에 저장합니다. 관리자가 관리하는 캐릭터 기본 데이터는 `admin/characters`, 관리자 목표 스테이터스 기본값은 `goal/data`에 저장합니다. `goal/{docId}`는 비로그인 사용자도 최초 접속 시 공개 목표 데이터를 볼 수 있도록 읽기를 공개하고, 생성/수정/삭제는 `admins/{uid}` 문서의 `enabled` 값이 `true`인 관리자만 허용합니다. 이렇게 분리하면 개인 기록 저장 시 캐릭터 기본 데이터나 관리자 목표 기본값을 함께 덮어쓰지 않습니다.

개인별 저장, 관리자 판정, 관리자 공용 데이터 저장을 위한 Firestore 규칙은 `firestore.rules`에 포함되어 있습니다.

Firebase CLI를 쓴다면 `firebase.json`이 `firestore.rules`를 가리키므로 아래 명령으로 규칙만 배포할 수 있습니다.

```bash
firebase deploy --only firestore:rules
```

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return signedIn()
        && exists(/databases/$(database)/documents/admins/$(request.auth.uid))
        && get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.enabled == true;
    }

    match /admins/{userId} {
      allow get: if signedIn() && request.auth.uid == userId;
      allow list: if false;
      allow create, update, delete: if false;
    }

    match /admin/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /profiles/{userId} {
      allow read, write: if signedIn() && request.auth.uid == userId;
    }

    match /publicCharacters/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /goal/{docId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### `클라우드 불러오기 실패` 확인 순서

로그인 직후 `클라우드 불러오기 실패`와 `Firestore 규칙 배포 상태와 로그인 계정을 확인해주세요`가 표시되면 아래 순서로 확인합니다.

1. 브라우저 개발자 도구 Console에서 `Firebase cloud operation failed` 로그의 `action`, `path`, `code`를 확인합니다.
2. `action`이 `load-profile`이고 `path`가 `profiles/{로그인한 UID}`인지 확인합니다. 이 앱은 로그인 직후 `profiles/{uid}` 문서를 먼저 읽습니다.
3. 저장소의 `firestore.rules`가 Firebase Console 또는 Firebase CLI로 실제 프로젝트에 배포되어 있는지 확인합니다. 로컬 파일만 수정되어 있고 배포되지 않으면 배포된 규칙은 바뀌지 않습니다.
4. Firebase Console > Authentication > Users의 UID와 Console 로그의 `profiles/{uid}` UID가 같은지 확인합니다.
5. `app-config.js`의 `projectId`가 규칙을 배포한 Firebase 프로젝트와 같은지 확인합니다.

현재 저장소 규칙 기준으로는 로그인한 사용자가 자기 `profiles/{uid}` 문서를 읽고 쓸 수 있어야 합니다. 따라서 Console 로그가 `permission-denied`이고 경로가 자기 UID의 `profiles/{uid}`라면, 먼저 실제 Firebase 프로젝트에 최신 `firestore.rules`가 배포되었는지 확인하세요.

## 권한별 화면 회귀 테스트

관리자 UI와 저장 경로를 변경한 뒤에는 아래 세 가지 상태를 나눠 확인합니다. Google/Firebase 실계정 확인이 필요한 항목은 배포된 GitHub Pages 주소가 Firebase Authentication 승인 도메인에 등록된 상태에서 진행합니다.

정적 검증은 아래 명령으로 실행합니다.

```bash
node scripts/verify.mjs
```

이 검증은 필수 정적 파일, 로컬 참조, Firebase 공개 설정 예시, 관리자 이메일/UID 목록 미사용, `isAdmin()`의 비로그인 기본값, Firebase 설정 누락 시 안전한 로드, 관리자 저장 함수의 `isAdmin()` 가드, Firestore Rules의 `admins/{uid}` 보호 규칙을 확인합니다.

### 1. 비로그인 사용자

- 우측 상단 세션 상태가 `로컬 저장 중`으로 표시됩니다.
- 보유 관리에서 캐릭터 보유 여부를 변경할 수 있습니다.
- 파밍 관리에서 현재 스테이터스, 진행도, 우선순위, 다음 할 일, 메모를 입력할 수 있습니다.
- `수동 입력` 목표 모드에서 내 목표 스테이터스를 편집할 수 있습니다.
- 변경사항이 브라우저 `localStorage`에 저장되고 새로고침 후에도 유지됩니다.
- 캐릭터 추가 버튼, 캐릭터 편집 버튼, 캐릭터 삭제 버튼, 공개/비공개 변경 UI, 관리자 목표 편집 버튼이 보이지 않습니다.

### 2. 일반 Google 로그인 사용자

- 우측 상단 세션 상태가 `일반 사용자 로그인됨`으로 표시됩니다.
- 보유 여부, 개인 파밍 상태, 내 목표 스테이터스를 수정하면 `profiles/{uid}`에 개인 데이터가 저장됩니다.
- 공개된 관리자 캐릭터 데이터와 관리자 목표 기본값을 볼 수 있고, `목표`/`수동 입력` 전환으로 관리자 목표와 내 목표를 비교할 수 있습니다.
- 캐릭터 추가 버튼, 캐릭터 편집 버튼, 캐릭터 삭제 버튼, 공개/비공개 변경 UI, 관리자 목표 편집 버튼이 보이지 않습니다.
- 개발자 도구로 숨겨진 관리자 버튼을 강제로 노출하거나 이벤트를 호출해도 관리자 전용 데이터가 저장되지 않습니다.

### 3. 관리자 Google 로그인 사용자

- Firebase Console에서 해당 사용자의 `admins/{uid}` 문서에 `enabled: true`가 설정되어 있어야 합니다.
- 우측 상단 세션 상태가 `관리자 로그인됨`으로 표시됩니다.
- 일반 사용자와 동일하게 보유 여부, 개인 파밍 상태, 내 목표 스테이터스를 수정할 수 있습니다.
- 캐릭터 추가, 편집, 삭제, 공개/비공개 변경 UI가 표시되고 변경 시 `admin/characters`에 관리자 캐릭터 데이터가 저장됩니다.
- 관리자 목표 편집 버튼이 표시되고 관리자 목표 기본값 변경 시 `goal/data`에 저장됩니다.
- 로그아웃하면 세션 상태가 `로컬 저장 중`으로 돌아가고 관리자 전용 버튼과 폼이 다시 숨겨집니다.
