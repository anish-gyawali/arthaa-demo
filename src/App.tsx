import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Store from './pages/Store';
import Success from './pages/Success';
import Failed from './pages/Failed';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<Store />}   />
        <Route path="/success" element={<Success />} />
        <Route path="/failed"  element={<Failed />}  />
      </Routes>
    </BrowserRouter>
  );
}
