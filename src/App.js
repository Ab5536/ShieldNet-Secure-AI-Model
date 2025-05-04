import './App.css';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import Signup from './Pages/Signup/Signup';
import Signin from './Pages/Signin/Signin';
import Homepage from './Pages/Homepage/Homepage';
import Term from "./Pages/Terms/Terms";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Homepage/>}></Route>
          <Route path='/signup' element={<Signup/>}></Route>
          <Route path='/signin'element={<Signin/>}></Route>
          <Route path="/terms" element={<Term/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
