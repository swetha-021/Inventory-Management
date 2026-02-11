
import './index.css'
import Login from './Login'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Landing from './Landing'
import Signup from './Signup'
import Inventory from './Inventory'
import ProtectedRoute from './ProtectedRoute'



function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element = {<Login />} />
        <Route path = "/home" element={<Landing />}/>
        <Route path='/Signup' element={<Signup/>}/>
        <Route path='/inventory' element={<ProtectedRoute><Inventory/></ProtectedRoute>}/>
      </Routes>   
    </BrowserRouter>
  )
}

export default App
