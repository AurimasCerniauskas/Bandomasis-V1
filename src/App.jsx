import './App.scss';
import 'bootstrap/dist/js/bootstrap.bundle';
import { BrowserRouter, Routes, Route, Navigate, useNavigate} from "react-router-dom";
import { login, logout, authConfig } from './Functions/auth';
import Nav from './Components/Nav';
import Home from './Components/home/Main';
import CreateStory from './Components/create/Main';
import MainOff from './Components/offers/Main';
// import MainMov from './Components/movies/Main';
import axios from 'axios';
import {useState, useEffect} from 'react';


function App() {
  const [roleChange, setRoleChange] = useState(Date.now());
  return (
    <BrowserRouter>
    <ShowNav  roleChange={roleChange}/>
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/create" element={<CreateStory />}></Route>
      <Route path="/login" element={<LoginPage setRoleChange={setRoleChange} />} />
      <Route path="/logout" element={<LogoutPage setRoleChange={setRoleChange} />} />
      <Route path="/offers" element={<RequireAuth role="admin"><MainOff/></RequireAuth>}></Route>
      {/* <Route path="/movies" element={<RequireAuth role="admin"><MainMov/></RequireAuth>}></Route> */}
    </Routes>
    </BrowserRouter>
  );
}

function ShowNav({roleChange}){
  const [status, setStatus] = useState(1);
  useEffect(() => {
    axios.get('http://localhost:3003/login-check?role=admin', authConfig())
      .then(res => {
        setStatus(res.data.status);
      })

  }, [roleChange]);
  return <Nav status={status} />
}

function RequireAuth({ children, role }) {
  const [view, setView] = useState(<h2>Please wait...</h2>);

  useEffect(() => {
    axios.get('http://localhost:3003/login-check?role=' + role, authConfig())
      .then(res => {
        if ('ok' === res.data.msg) {
          setView(children);
        } else if (res.data.status === 2){
          setView(<h2>Unauthorize...</h2>)
        } else {
          setView(<Navigate to="/login" replace />);
        }
      })

  }, [children, role]);

  return view;
}





function LoginPage({setRoleChange}) {
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const doLogin = () => {
    axios.post('http://localhost:3003/login', { user, pass })
      .then(res => {
        setRoleChange(Date.now());
        if ('ok' === res.data.msg) {
          login(res.data.key);
          navigate('/', { replace: true });
        }
      })
  }
  return (
    <div className='container'>
      <div className='row justify-content-center'>
        <div className='col col-md-12 col-lg-4'>
          <div className='card m-4'>
            <h5 className='card-header'>Login</h5>
            <div className='card-body'>
              <div className='mb-3'>
                <label className='form-label'>Name</label>
                <input type="text" className='form-control' value={user} onChange={e => setUser(e.target.value)}></input>
              </div>
              <div className='mb-3'>
                <label className='form-label'>Password</label>
                <input type="password" className='form-control' value={pass} onChange={e => setPass(e.target.value)}></input>
              </div>
              <button type='button' className='btn btn-outline-success' onClick={doLogin}>Login</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LogoutPage({setRoleChange}) {
  useEffect(() => {
    logout();
    setRoleChange(Date.now());
  }, [setRoleChange]);
  return (
    <Navigate to="/login" replace />
  )
}

export default App;