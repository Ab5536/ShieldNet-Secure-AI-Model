import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import Signup from './Pages/Signup/Signup';
import Signin from './Pages/Signin/Signin';
import Homepage from './Pages/Homepage/Homepage';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Homepage/>}></Route>
          <Route path='/signup' element={<Signup/>}></Route>
          <Route path='/signin'element={<Signin/>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
