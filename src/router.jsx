import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';
import Dashboardv2 from './pages/Dashboardv2.jsx';
import Login from './pages/Auth/Login.jsx';
import PrivateRoute from './pages/Auth/PrivateRoute.jsx';
import Homepage from './pages/Homepage.jsx';
import AddSection from './pages/AddSection';
import ListSections from './pages/ListSections';
import EditSection from './pages/EditSection';
import ViewSection from './pages/ViewSection';
import ListPoints from './pages/ListPoints';
import AddPoint from './pages/AddPoint';
import ListPti from './pages/ListPti';
import EditPoint from './pages/EditPoint';
import ViewPoint from './pages/ViewPoint';
import SettingsPage from './pages/SettingsPage.jsx';
import UserView from './pages/UserView.jsx';
import Register from './pages/Auth/Register.jsx';
import ListUsers from './pages/Auth/ListUsers.jsx';
import NotFound from './pages/NotFound.jsx';
import ListMarqueurs from './pages/ListMarqueurs.jsx';
import AddMarqueur from './pages/AddMarqueur.jsx';
import EditMarqueur from './pages/EditMarqueur.jsx';
import ViewMarqueur from './pages/ViewMarqueur.jsx';



const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
          {/* Routes protégée pour le dashboard */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboardv2 /></PrivateRoute>}>
           <Route index element={<Homepage />} />
           <Route path="/dashboard/home" element={<Homepage/>} />
          <Route path="/dashboard/user/profile" element={<UserView />} />
          <Route path="/dashboard/register" element={<Register />} />
          <Route path="/dashboard/list-users" element={<ListUsers />} />
          { /* Routes pour les points */}
          <Route path="/dashboard/list-points" element={<ListPoints />} />
          <Route path="/dashboard/incidents" element={<ListPti/>} />
          <Route path="/dashboard/add-point" element={<AddPoint />} />
          <Route path="/dashboard/point/view/:id" element={<ViewPoint />} />
          <Route path="/dashboard/point/edit/:id" element={<EditPoint />} />
          { /* Routes pour les sections */}
          <Route path="/dashboard/list-sections" element={<ListSections />} />
          <Route path="/dashboard/add-section" element={<AddSection />} />
          <Route path="/dashboard/section/view/:id" element={<ViewSection />} />
          <Route path="/dashboard/section/edit/:id" element={<EditSection />} />
          { /* Routes pour les marqueurs */}
          <Route path="/dashboard/list-marqueurs" element={<ListMarqueurs />} />
          <Route path="/dashboard/add-marqueur" element={<AddMarqueur />} />
          <Route path="/dashboard/marqueur/view/:id" element={<ViewMarqueur />} />
          <Route path="/dashboard/marqueur/edit/:id" element={<EditMarqueur />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
          
        </Route>
      </Routes>
    </Router>
  );
}   
export default AppRouter;