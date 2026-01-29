
import './App.css'
import Login from './Login'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Landing from './Landing'
import Signup from './Signup'
import Inventory from './Inventory'


function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element = {<Login />} />
        <Route path = "/home" element={<Landing />}/>
        <Route path='/Signup' element={<Signup/>}/>
        <Route path='/inventory' element={<Inventory/>}/>
      </Routes>   
    </BrowserRouter>
  )
}

export default App
