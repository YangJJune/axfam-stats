// 맵 정보 설정
// 개발자가 직접 추가/수정할 수 있습니다

export interface MapInfo {
  code: string; // CSV에 있는 맵 코드
  name: string; // 실제 맵 이름
  thumbnail?: string; // 썸네일 이미지 경로 (선택사항)
}

export const mapConfig: MapInfo[] = [
  {
    code: "ckt.brk",
    name: "써킷 브레이커",
    thumbnail: "/maps/ckt-brk.jpg",
  },
  {
    code: "death.v",
    name: "데스 밸리",
    thumbnail: "/maps/death-v.webp",
  },
  {
    code: "dejavu",
    name: "데자뷰",
    thumbnail: "/maps/dejavu.webp",
  },
  {
    code: "dom.",
    name: "도미네이터",
    thumbnail: "/maps/dom.webp",
  },
  {
    code: "dark",
    name: "다크오리진",
    thumbnail: "/maps/dark.jpg",
  },
  {
    code: "eclipse",
    name: "이클립스",
    thumbnail: "/maps/eclipse.jpg",
  },
  {
    code: "투혼",
    name: "투혼",
    thumbnail: "/maps/투혼.webp",
  },
  {
    code: "forfeit",
    name: "몰수",
    thumbnail: "/maps/forfeit.webp",
  },
  {
    code: "k.o",
    name: "녹아웃",
    thumbnail: "/maps/ko.webp",
  },
  {
    code: "litmus",
    name: "리트머스",
    thumbnail: "/maps/litmus.jpg",
  },
  {
    code: "polstar",
    name: "폴스타",
    thumbnail: "/maps/polstar.webp",
  },
  {
    code: "poly",
    name: "폴리포이드",
    thumbnail: "/maps/poly.jpg",
  },
  {
    code: "radeon",
    name: "라데온",
    thumbnail: "/maps/radeon.webp",
  },
  {
    code: "u.d.m",
    name: "울둘목",
    thumbnail: "/maps/udm.webp",
  },
  {
    code: "verm.",
    name: "버미어",
    thumbnail: "/maps/verm.jpg",
  },
];

// 맵 코드로 맵 정보 찾기
export const getMapInfo = (code: string): MapInfo => {
  const mapInfo = mapConfig.find((m) => m.code === code);
  return (
    mapInfo || {
      code,
      name: code, // 매핑되지 않은 경우 코드를 그대로 이름으로 사용
    }
  );
};
