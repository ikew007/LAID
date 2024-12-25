import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import OAuthTest from "../../pages/integration";

function DefaultRoute() {
  return <Navigate to="/oauthtest"/>;
}

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<DefaultRoute/>}/>
        <Route path="/oauthtest" element={<OAuthTest/>}/>
      </Routes>
    </Router>
  );
}

export default App;