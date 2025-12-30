# -*- coding: utf-8 -*-
"""
AX FAM Stats Data Updater

Google Drive와 Google Sheets에서 데이터를 가져와서
- public/data.csv (스프레드시트)
- public/profile/* (프로필 이미지들)
를 업데이트합니다.

필요한 패키지:
pip install requests gdown

사용법:
python scripts/update_data.py
"""

import os
import sys
import requests
import subprocess

# 구글 스프레드시트 ID와 드라이브 폴더 ID (환경변수에서 가져오기)
SPREADSHEET_ID = os.environ.get('SPREADSHEET_ID')
DRIVE_FOLDER_ID = os.environ.get('DRIVE_FOLDER_ID')

# 프로젝트 경로
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
PUBLIC_DIR = os.path.join(PROJECT_ROOT, 'public')
PROFILE_DIR = os.path.join(PUBLIC_DIR, 'profile')
CSV_PATH = os.path.join(PUBLIC_DIR, 'data.csv')


def download_spreadsheet_as_csv():
    """Google Sheets를 CSV로 다운로드"""
    print("[CSV] 스프레드시트 다운로드 중...")

    try:
        # Google Sheets를 CSV로 export하는 URL
        csv_url = f'https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/export?format=csv'

        # CSV 다운로드
        response = requests.get(csv_url)
        response.raise_for_status()

        # 파일 저장
        os.makedirs(PUBLIC_DIR, exist_ok=True)
        with open(CSV_PATH, 'wb') as f:
            f.write(response.content)

        # 줄 수 세기
        line_count = len(response.content.decode('utf-8').split('\n'))

        print(f"[OK] CSV 파일 저장 완료: {CSV_PATH}")
        print(f"     총 {line_count} 행")
        return True

    except requests.exceptions.RequestException as e:
        print(f"[ERROR] 스프레드시트 다운로드 실패: {e}")
        print("        스프레드시트가 '링크가 있는 모든 사용자'로 공유되어 있는지 확인하세요.")
        return False
    except Exception as e:
        print(f"[ERROR] 예상치 못한 오류: {e}")
        return False


def download_drive_folder():
    """Google Drive 폴더에서 프로필 이미지 다운로드"""
    print("\n[PROFILE] 프로필 이미지 다운로드 중...")
    print("          (50개 이상의 파일을 다운로드합니다)")

    try:
        # profile 폴더 생성
        os.makedirs(PROFILE_DIR, exist_ok=True)

        # Google Drive 폴더 URL
        folder_url = f'https://drive.google.com/drive/folders/{DRIVE_FOLDER_ID}'

        # gdown 명령줄로 실행 (--remaining-ok 옵션으로 50개 제한 우회)
        print("          gdown으로 다운로드 중...")

        result = subprocess.run(
            ['gdown', '--folder', folder_url, '-O', PROFILE_DIR, '--remaining-ok'],
            capture_output=True,
            text=True,
            encoding='utf-8'
        )

        if result.returncode != 0:
            print("[WARN] gdown 명령줄 실패, Python API 시도...")

            # Python API로 재시도
            try:
                import gdown
                gdown.download_folder(
                    url=folder_url,
                    output=PROFILE_DIR,
                    quiet=False,
                    use_cookies=False,
                    remaining_ok=True
                )
            except Exception as e2:
                print(f"[ERROR] Python API도 실패: {e2}")
                print("\n        수동 다운로드 방법:")
                print(f"        1. {folder_url} 방문")
                print(f"        2. 모든 파일 선택 후 다운로드")
                print(f"        3. 압축 해제 후 {PROFILE_DIR}에 복사")
                return False

        print(f"[OK] 프로필 이미지 다운로드 완료")

        # 다운로드된 파일 수 세기
        if os.path.exists(PROFILE_DIR):
            file_count = len([f for f in os.listdir(PROFILE_DIR)
                            if os.path.isfile(os.path.join(PROFILE_DIR, f))])
            print(f"     총 {file_count}개 파일")

        return True

    except FileNotFoundError:
        print("[ERROR] gdown이 설치되어 있지 않습니다.")
        print("        pip install gdown 으로 설치해주세요.")
        return False
    except Exception as e:
        print(f"[ERROR] 프로필 이미지 다운로드 실패: {e}")
        print("\n        대체 방법:")
        print(f"        1. {folder_url} 방문")
        print(f"        2. 모든 파일 선택 후 다운로드")
        print(f"        3. 압축 해제 후 {PROFILE_DIR}에 복사")
        return False


def main():
    """메인 함수"""
    print("=" * 60)
    print("AX FAM Stats - 데이터 업데이트 스크립트")
    print("=" * 60)
    print()

    # 스프레드시트 다운로드
    csv_success = download_spreadsheet_as_csv()

    # 프로필 이미지 다운로드
    images_success = download_drive_folder()

    # 결과 요약
    print("\n" + "=" * 60)
    print("업데이트 결과")
    print("=" * 60)
    print(f"CSV 데이터:      {'성공' if csv_success else '실패'}")
    print(f"프로필 이미지:   {'성공' if images_success else '실패'}")
    print()

    if csv_success and images_success:
        print("모든 데이터 업데이트 완료!")
        return 0
    else:
        print("일부 데이터 업데이트 실패")
        print("\n문제 해결:")
        print("1. 스프레드시트와 드라이브 폴더가 '링크가 있는 모든 사용자'로 공유되어 있는지 확인")
        print("2. 인터넷 연결 확인")
        print("3. 필요한 패키지 설치 확인: pip install requests gdown")
        return 1


if __name__ == '__main__':
    sys.exit(main())
