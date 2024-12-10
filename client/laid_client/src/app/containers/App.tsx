import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from '../../pages/login';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute.tsx';
import {useAuth} from "../../hooks/useAuth.ts";
import Profile from "../../pages/profile";
import {Box} from '@mui/material';
import {SideMenu} from "../../components/SideMenu";

function DefaultRoute() {
  const {isAuthenticated} = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace/> : <Navigate to="/auth" replace/>;
}

function App() {
  const {isAuthenticated} = useAuth();

  return (
    <Router>
      <Box sx={{display: 'flex'}}>
        {isAuthenticated && <SideMenu/>}

        <Box sx={{flex: 1, marginLeft: isAuthenticated ? '250px' : '0px'}}>
          <Routes>
            {/* Default Route */}
            <Route path="/" element={<DefaultRoute/>}/>

            {/* Public Route */}
            <Route path="/auth" element={<Login/>}/>

            {/* Protected Route */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Profile/>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;