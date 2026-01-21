
import './App.css'
import Login from './Login'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Landing from './Landing'


function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element = {<Login />} />
        <Route path = "/home" element={<Landing />}/>
      </Routes>   
    </BrowserRouter>
  )
}

export default App
