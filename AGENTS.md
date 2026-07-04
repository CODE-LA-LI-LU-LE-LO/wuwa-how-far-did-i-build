# Repository Agent Instructions

## Communication

- 모든 사용자 응답은 한국어로 작성한다.
- 최종 응답 전, 사용자에게 전달되는 설명이 한국어인지 한 번 더 확인한다.

## Documentation

- 기능 변경 또는 문제 수정 시 사양서, README, 기타 관련 문서 변경이 필요한지 함께 검토한다.
- 문서 변경이 필요한 경우 코드 변경과 같은 작업 단위에 포함한다.

## Pull Request Body

- PR 본문은 가능한 경우 `Korean` 섹션과 `English` 섹션을 분리해 작성한다.
- 한 언어 섹션 안에 다른 언어 설명을 섞지 않는다.
- PR 본문은 다음 구조를 우선 사용한다.

```md
Korean
--
Motivation
<한국어로 작성>

Description
<한국어로 작성>

Testing
KO: <한국어로 작성>
---

English
---
Motivation
<Write in English>

Description
<Write in English>

Testing
<Write in English>
```

- PR 작성 전, Korean / English 섹션 분리가 적용되었는지 한 번 더 확인한다.

## Pull Request Follow-up Updates

- 기존 PR 본문을 직접 수정할 수 있는 도구 또는 권한이 확인되면, 기존 PR 본문을 최신 내용으로 직접 수정한다.
- 기존 PR 본문을 직접 수정할 수 없고 추가 커밋이 발생했다면, PR 본문을 수정했다고 말하지 않는다.
- 기존 PR 본문을 직접 수정할 수 없는 경우, 추가 커밋 내역은 PR 코멘트용 업데이트 내용으로 작성한다.
- PR 코멘트용 업데이트 내용도 `Korean` 섹션과 `English` 섹션을 분리한다.
- 추가 코드 변경 없이 PR 본문만 수정해야 하는 상황에서는 `make_pr`를 반복 호출하지 않는다.
- GitHub UI 또는 `gh pr edit`이 필요한 경우, 사용자가 직접 적용할 수 있는 PR 본문 또는 PR 코멘트 텍스트를 제공한다.
