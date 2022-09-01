import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SlotsPage from './pages/SlotsPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/slots' element={<SlotsPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
