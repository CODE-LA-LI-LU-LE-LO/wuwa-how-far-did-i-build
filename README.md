# 명조 육성 기록장

명조 캐릭터 보유 여부를 체크하고, 보유 캐릭터에 한해 파밍 상태를 기록하는 정적 웹앱입니다.

기능 설명서는 `SPEC.md`에 정리되어 있습니다.

## 현재 구현

- 캐릭터 보유 여부 체크
- 보유 관리/파밍 관리 탭 전환
- 이름/등급/속성/무기/출시 버전 정렬과 정렬 기준별 카테고리 필터
- 관리자용 캐릭터 추가/편집/제거
- 캐릭터 이미지 URL/파일, 무기, 속성, 출시 버전, 등급 관리
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
- 검색, 보유/파밍 중 필터, 이름/등급/속성/무기/출시 버전 정렬
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

`app-config.js`와 `data/characters.js`는 배포 후 갱신이 잦은 파일이라 서비스워커가 네트워크 우선으로 확인합니다.

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

기본 캐릭터 목록은 `data/characters.js`에서 관리합니다.

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

개인별 저장을 위한 Firestore 규칙은 `firestore.rules`에 포함되어 있습니다.

Firebase CLI를 쓴다면 `firebase.json`이 `firestore.rules`를 가리키므로 아래 명령으로 규칙만 배포할 수 있습니다.

```bash
firebase deploy --only firestore:rules
```

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```
