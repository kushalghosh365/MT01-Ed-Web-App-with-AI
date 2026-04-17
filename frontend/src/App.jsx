import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import SetNewPassword from "./pages/SetNewPassword";
import AddExperience from "./components/AddExperience";
import AddLinks from "./components/AddLinks";
import AiAssistant from "./components/AiAssistant";
import CsFundamentals from "./pages/CsFundamentals";
import CodeEditor from "./pages/CodeEditor";
function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/courses' element={<Home/>}></Route>
        <Route path='/explore' element={<Home/>}></Route>
        <Route path='/contact' element={<Home/>}></Route>
        <Route path='/articles' element={<Home/>}></Route>
        <Route path='/tutorials' element={<Home/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/forgotpassword' element={<ForgotPassword/>}></Route>
        <Route path='/profile' element={<Profile/>} />
        <Route path ="/setnewpassword" element={<SetNewPassword/>}></Route>
        <Route path ="/studymetarials/csfundamentals" element={<CsFundamentals/>}></Route>
        <Route path ="/mt01/codeeditor" element={<CodeEditor/>}></Route>

      </Routes>
    </Router>
  );
}

export default App;
