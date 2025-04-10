import { BrowserRouter, Route, Routes } from 'react-router-dom';

import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './App.css';

import AdminPanel from './Pages/AdminPanel';
import UserPanel from './Pages/UserPanel';
import JobDetail from './Pages/JobDetail';
import ApplyForm from './Pages/ApplyForm';


function App() {
  return (
    <BrowserRouter>
      <>
        <Routes>
          <Route path="/" element={<UserPanel/>} />
          <Route path="/viewjob/:id" element={<JobDetail/>}/>
          <Route path="/applyjob/:id" element={<ApplyForm/>}/>
          <Route path="/admin" element={<AdminPanel />} /> 
        </Routes>
      </>
    </BrowserRouter>
  );
}

export default App;