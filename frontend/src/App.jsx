
import './index.css'
import Login from './Login'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Landing from './Landing'
import Signup from './Signup'
import Inventory from './Inventory'
import ProtectedRoute from './ProtectedRoute'
import Account from './Account'
import Navbar from './Navbar'


function App() {


  return (
    <BrowserRouter>
    <div className="app">
      <Navbar />
      <div className="content">
        <Routes>
          <Route path='/' element = {<Login />} />
          <Route path = "/home" element={<Landing />}/>
          <Route path='/Signup' element={<Signup/>}/>
          <Route path='/inventory' element={<ProtectedRoute><Inventory/></ProtectedRoute>}/>
          <Route path='/account' element={<ProtectedRoute><Account/></ProtectedRoute>}/>
        </Routes>
      </div>   
    </div>
    </BrowserRouter>
  )
}

export default App
