import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';
import Dashboardv2 from './pages/Dashboardv2.jsx';
import Login from './pages/Auth/Login.jsx';
import PrivateRoute from './pages/Auth/PrivateRoute.jsx';
import Homepage from './pages/Homepage.jsx';
import AddSection from './pages/AddSection';
import AddPoint from './pages/AddPoint';
import AddMarqueur from './pages/AddMarqueur';
import ListSections from './pages/ListSections';
import ListPoints from './pages/ListPoints';
import ListMarqueurs from './pages/ListMarqueurs';


const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/login" element={<Login />} />
          {/* Routes protégée pour le dashboard */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboardv2 /></PrivateRoute>}>
           <Route index element={<Homepage />} />
           <Route path="/dashboard/home" element={<Homepage/>} />
          <Route path="/dashboard/add-section" element={<AddSection />} />
          <Route path="/dashboard/add-point" element={<AddPoint />} />
          <Route path="/dashboard/add-marqueur" element={<AddMarqueur />} />
          <Route path="/dashboard/list-sections" element={<ListSections />} />
          <Route path="/dashboard/list-points" element={<ListPoints />} />
          <Route path="/dashboard/list-marqueurs" element={<ListMarqueurs />} />
        </Route>
      </Routes>
    </Router>
  );
}   
export default AppRouter;