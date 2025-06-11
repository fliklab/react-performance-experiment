# 이 템플릿에서 프로젝트 생성하는 방법

이 템플릿에서 새로운 프로젝트를 생성하려면 다음 단계를 따르세요.

## 1. Github.com에서 생성하는 방법

1. **템플릿 저장소로 이동**: GitHub에서 [vibe-code-template 저장소](https://github.com/fliklab/vibe-code-template)로 이동합니다.

2. **이 템플릿 사용**: 파일 목록 위에 있는 "Use this template" 버튼을 클릭합니다.

3. **새 저장소 생성**: 새 저장소의 이름, 설명을 입력하고 공개 또는 비공개 여부를 선택합니다.

4. **저장소 생성**: "Create repository from template" 버튼을 클릭하여 새 프로젝트를 생성합니다.

새 저장소는 템플릿과 동일한 파일 및 구조로 생성되며, 즉시 프로젝트 작업을 시작할 수 있습니다.

## 2. CLI에서 템플릿을 사용하여 프로젝트 생성하는 방법

CLI를 사용하여 이 템플릿에서 새로운 프로젝트를 생성하려면 다음 단계를 따르세요:

1. **템플릿 저장소를 복제**: 터미널에서 다음 명령어를 실행하여 템플릿 저장소를 로컬로 복제합니다.

   ```bash
   git clone fliklab/vibe-code-template
   ```

2. **새로운 저장소 생성**: `gh` CLI를 사용하여 새로운 저장소를 생성합니다.

- [이 명령](https://cli.github.com/manual/gh_repo_create)은 github 계정에 저장소를 생성합니다.
  `NEW_REPO_NAME`을 새로 만들 저장소 이름으로 바꿔서 입력하세요.

- [Github CLI](htpps://https://cli.github.com/manual/ "Github CLI")가 설치되어있어야 하며 로그인되어있어야 합니다.
- gh cli 설치 방법은 [관련 문서](https://github.com/cli/cli#installation)를 참고하세요.

  ```bash
  gh repo create NEW_REPO_NAME --private --source=. --remote=origin
  ```

3. **새로운 저장소로 푸시**: 새로운 저장소에 코드를 푸시합니다.
   ```bash
   git push -u origin main
   ```

이 과정을 통해 CLI에서 직접 템플릿을 사용하여 새로운 프로젝트를 생성할 수 있습니다. `NEW_REPO_NAME`을 원하는 저장소 이름으로 변경하여 사용하세요.
