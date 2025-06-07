import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Register from "./pages/Register";
import Election from "./pages/Election";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import CreateUser from "./pages/CreateUser";
import CreateSociety from "./pages/CreateSociety";
import ElectionResults from "./pages/ElectionResults";

export default function App() {
  console.log("token: ", localStorage.getItem('token'));
  return (
    <>
      {/* <Login /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route index path="/election" element={<Election/>}/>
            <Route index path="/edit-election" element={<Election mode="edit"/>}/>
            <Route path="/home" element={<Home/>}/>
            <Route path="/create-user" element={<CreateUser/>}/>
            <Route path="/create-society" element={<CreateSociety/>}/>
            <Route path="/election-results" element={<ElectionResults/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}