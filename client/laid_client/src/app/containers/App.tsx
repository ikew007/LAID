import {BrowserRouter as Router, Routes, Route, Navigate, useLocation} from 'react-router-dom';
import Login from '../../pages/login';
import OAuth from '../../pages/oauth';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute.tsx';
import {useAuth} from "../../hooks/useAuth.ts";
import Profile from "../../pages/profile";
import Verify from "../../pages/verify";
import Integrations from "../../pages/integrations";
import {Box, CssBaseline} from '@mui/material';
import {SideMenu} from "../../components/SideMenu";

function DefaultRoute() {
  const {isAuthenticated} = useAuth();
  return isAuthenticated ? <Navigate to="/profile" replace/> : <Navigate to="/auth" replace/>;
}

function App() {
  const {isAuthenticated} = useAuth();
  const location = useLocation();

  const shouldShowSideMenu = isAuthenticated && location.pathname !== '/oauth';

  return (
    <>
      <CssBaseline />
      <Box sx={{display: 'flex'}}>
        {shouldShowSideMenu && <SideMenu/>}

        <Box
          component="main"
          sx={{
            flex: 1,
            padding: '20px',
            ml: shouldShowSideMenu ? '250px' : '0px',
            transition: 'all 0.3s ease',
            minHeight: '100vh'
          }}
        >
          <Routes>
            <Route path="/" element={<DefaultRoute/>}/>
            <Route path="/auth" element={<Login/>}/>
            <Route path="/oauth" element={<OAuth/>}/>
            <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
            <Route path="/verify" element={<ProtectedRoute><Verify/></ProtectedRoute>}/>
            <Route path="/integrations" element={<ProtectedRoute><Integrations/></ProtectedRoute>}/>
          </Routes>
        </Box>
      </Box>
    </>
  );
}

export default App;
