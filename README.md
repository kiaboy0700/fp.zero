# 🌱 탄소 다이어트 챌린지 (Carbon Diet Challenge)

> 제 2기 경산시 탄소중립지원센터 **퍼스트펭귄 팀**의 탄소 다이어트 챌린지 소개 및 참여 안내 랜딩페이지입니다.

일상 속 작은 탄소중립 실천을 독려하고 실시간 참여 현황을 확인하여 누구나 쉽게 참여할 수 있도록 돕는 웹페이지입니다.

---

## ✨ 주요 기능 및 특징
* **챌린지 소개 및 혜택**: 텀블러 사용, 분리배출, 에코백 사용 등 환경 보호 혜택 및 친환경 리워드 소개
* **간단한 참여 방법 안내**: 탄소중립 실천 ➡️ 인증샷 촬영 ➡️ 인스타그램 스토리 업로드
* **실시간 현황판 연동**: Google Sheets 실시간 통계 보드 바로가기 지원
* **반응형 웹 디자인**: 모바일, 태블릿, 데스크톱 등 모든 디바이스에서 최적화된 Tailwind CSS UI 적용
* **멀티 배포 호환성**: GitHub Pages와 Vercel 배포를 모두 매끄럽게 호환하도록 설정 완료

---

## 🛠️ 개발 및 기술 스택
* **Core**: React 19 (Functional Components)
* **Build Tool**: Vite 8
* **Styling**: Tailwind CSS v4

---

## 💻 로컬에서 실행하기

1. **의존성 패키지 설치**
   ```bash
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   npm run dev
   ```

3. **프로덕션 빌드**
   ```bash
   npm run build
   ```

---

## 🚀 배포하기 (Deployment)

### 1. Vercel로 배포하기 (가장 추천 ⭐)
이 프로젝트는 **Vercel** 배포에 완벽히 호환되도록 구성되었습니다. `vite.config.js`가 빌드 환경을 감지하여 Vercel에서는 루트 경로(`/`)를, GitHub Pages에서는 하위 경로(`/fp.zero/`)를 사용하도록 자동 분기 처리되어 있습니다.

1. [Vercel](https://vercel.com)에 로그인 후 **Add New Project**를 선택합니다.
2. 이 GitHub 저장소 (`kiaboy0700/fp.zero`)를 연동하고 **Deploy**를 누르면 자동으로 실시간 배포 주소가 생성됩니다.
3. 이후 `main` 브랜치에 코드를 푸시할 때마다 Vercel이 감지하여 실시간으로 자동 업데이트됩니다.

### 2. GitHub Pages로 배포하기
```bash
npm run deploy
```
* `gh-pages` 라이브러리를 통해 `dist` 빌드 폴더를 기존 GitHub Pages 브랜치로 자동 배포합니다.
