import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

const HeaderContent = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    padding: 0;
  }
`;

const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  background: ${({ theme }) => theme.colors.accent.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Nav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.accent.cyan : theme.colors.text.secondary};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent.cyan};
  }
`;

const Main = styled.main`
  max-width: 1080px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    padding: ${({ theme }) => theme.spacing.xl} 0;
  }
`;

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <LayoutContainer>
      <Header>
        <HeaderContent>
          <Logo to="/">AX FAM STATS</Logo>
          <Nav>
            <NavLink to="/" $active={location.pathname === '/'}>
              선수 목록
            </NavLink>
            <NavLink to="/maps" $active={location.pathname === '/maps'}>
              맵 통계
            </NavLink>
          </Nav>
        </HeaderContent>
      </Header>
      <Main>{children}</Main>
    </LayoutContainer>
  );
};
