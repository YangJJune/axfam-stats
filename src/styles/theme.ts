export const theme = {
  colors: {
    // 배경색
    background: {
      primary: '#161618',
      secondary: '#27282e',
      tertiary: '#2d2f37',
      card: '#1e1f24',
    },
    // 강조색
    accent: {
      cyan: '#57EFD6',
      blue: '#33C2FF',
      purple: '#C623FF',
      gradient: 'linear-gradient(90deg, #3FE6FD, #C623FF)',
    },
    // 텍스트
    text: {
      primary: '#ffffff',
      secondary: '#cfd1d7',
      tertiary: '#848999',
      disabled: '#5a5b62',
    },
    // 종족 색상
    race: {
      T: '#FF6B6B',  // Terran - 빨강
      P: '#4ECDC4',  // Protoss - 청록
      Z: '#FFE66D',  // Zerg - 노랑
    },
    // 상태
    status: {
      win: '#57EFD6',
      loss: '#FF6B6B',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '24px',
    xxl: '36px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1280px',
  },
};

export type Theme = typeof theme;
