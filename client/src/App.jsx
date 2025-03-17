import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';
import Todos from './Pages/Todo/Todos';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import Navbar from './Components/Navbar';
import { ForgotPassword } from './Components/ForgotPassword';
import { ResetPassword } from './Components/ResetPassword';

const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Todos />
            </>
          }
        />
      </Route>
    </Routes>
  </Router>
);

export default App;
