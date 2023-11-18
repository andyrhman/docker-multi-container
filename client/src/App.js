
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OtherPage from './public/OtherPage';
import Fib from './public/Fib';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact element={<Fib />} />
          <Route path="/fib" element={<Fib />} />
          <Route path="/otherpage" element={<OtherPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
