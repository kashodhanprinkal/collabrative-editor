// src/app/App.Routers.jsx
import { Routes, Route } from 'react-router-dom';
import { Login } from '../components/Auth/Login';
import { SignUp } from '../components/Auth/SignUp';
import Editor from '../components/Editor/main';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<Editor />} />
      <Route path="/editor" element={<Editor />} />  {/* Added this too */}
    </Routes>
  );
}

export default AppRoutes;