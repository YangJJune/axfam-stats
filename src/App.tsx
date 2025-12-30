import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import { DataProvider } from './context/DataContext';
import { Layout } from './components/Layout/Layout';
import { PlayerList } from './pages/PlayerList/PlayerList';
import { PlayerDetail } from './pages/PlayerDetail/PlayerDetail';
import { MapStats } from './pages/MapStats/MapStats';
import { MapDetail } from './pages/MapDetail/MapDetail';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <DataProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<PlayerList />} />
              <Route path="/player/:playerId" element={<PlayerDetail />} />
              <Route path="/player/:playerId/map/:mapCode" element={<MapDetail />} />
              <Route path="/maps" element={<MapStats />} />
            </Routes>
          </Layout>
        </Router>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
