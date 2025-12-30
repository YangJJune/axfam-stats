# AX FAM Stats - 데이터 업데이트 스크립트

Google Drive와 Google Sheets에서 자동으로 데이터를 가져와서 프로젝트를 업데이트하는 스크립트입니다.

## 설정 방법

### Python 패키지 설치

```bash
pip install -r scripts/requirements.txt
```

또는

```bash
pip install requests gdown
```

## 사용 방법

### 데이터 업데이트

```bash
python scripts/update_data.py
```

스크립트는 다음을 수행합니다:
1. Google Sheets에서 CSV 데이터 다운로드 → `public/data.csv`
2. Google Drive 폴더에서 프로필 이미지 다운로드 → `public/profile/`

## 업데이트되는 파일

- `public/data.csv` - 스프레드시트 데이터
- `public/profile/*.png` - 선수 프로필 이미지들

## 데이터 소스

- **스프레드시트**: [AX FAM Stats 데이터](https://docs.google.com/spreadsheets/d/1B5Pks-vO3JRDAHyxCm2qF3P_LkZTzKZ0o_-rgHy9lw4/edit)
- **프로필 이미지**: [Google Drive 폴더](https://drive.google.com/drive/folders/1fKbLHIZGWXjjbykk8YLY4JUMJ7ARyEUX)

## 요구 사항

스프레드시트와 드라이브 폴더가 **"링크가 있는 모든 사용자"**로 공유되어 있어야 합니다.

### 공유 설정 방법

1. **스프레드시트 공유**:
   - 스프레드시트 열기
   - 우측 상단 "공유" 버튼 클릭
   - "일반 액세스" 변경 → "링크가 있는 모든 사용자"
   - 권한: "뷰어" 선택

2. **드라이브 폴더 공유**:
   - 폴더 우클릭 → "공유" 선택
   - "일반 액세스" 변경 → "링크가 있는 모든 사용자"
   - 권한: "뷰어" 선택

## 문제 해결

### 스프레드시트 다운로드 실패

- 스프레드시트가 공개되어 있는지 확인
- 인터넷 연결 확인

### 프로필 이미지 다운로드 실패

- Drive 폴더가 공개되어 있는지 확인
- 폴더 크기가 크면 시간이 걸릴 수 있습니다

### gdown 오류

gdown 최신 버전으로 업데이트:
```bash
pip install --upgrade gdown
```

## 주의사항

- 이 스크립트는 OAuth 인증이 필요 없습니다
- 공개 링크로 직접 다운로드하므로 빠르고 간단합니다
- 기존 파일을 덮어쓰므로 주의하세요
