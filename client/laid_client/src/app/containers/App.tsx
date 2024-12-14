import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from '../../pages/login';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute.tsx';
import {useAuth} from "../../hooks/useAuth.ts";
import Profile from "../../pages/profile";
import {Box, CssBaseline} from '@mui/material';
import {SideMenu} from "../../components/SideMenu";

function DefaultRoute() {
  const {isAuthenticated} = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace/> : <Navigate to="/auth" replace/>;
}

function App() {
  const {isAuthenticated} = useAuth();

  return (
    <Router>
      <CssBaseline />
      <Box sx={{display: 'flex'}}>
        {isAuthenticated && <SideMenu/>}

        <Box
          component="main"
          sx={{
            flex: 1,
            padding: '20px',
            ml: isAuthenticated ? '250px' : '0px',
            transition: 'all 0.3s ease',
            minHeight: '100vh'
          }}
        >
          <Routes>
            <Route path="/" element={<DefaultRoute/>}/>
            <Route path="/auth" element={<Login/>}/>
            <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;