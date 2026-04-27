import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Store        from './pages/Store';
import Success      from './pages/Success';
import Failed       from './pages/Failed';
import PaymentLinks from './pages/PaymentLinks';
import Status       from './pages/Status';
import Subscriptions from './pages/Subscriptions';
import Nav from './components/Navbar';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: '#F6F6F9', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <style>{`* { box-sizing: border-box; } body { margin: 0; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <Nav />
        <Routes>
          <Route path="/"              element={<Store />}         />
          <Route path="/success"       element={<Success />}       />
          <Route path="/failed"        element={<Failed />}        />
          <Route path="/payment-links" element={<PaymentLinks />}  />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/status"        element={<Status />}        />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
