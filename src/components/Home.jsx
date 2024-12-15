import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom';
import IAdmin from './Admin/IAdmin';
import IEmpleado from './Empleado/IEmpleado';


const Home = () => {
  const [rol, setRol] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(()=>{
    axios.get('http://localhost:5000', { withCredentials: true })
    .then((res)=>{
      //console.log(res);
      if(res.data.valid){
        setRol(res.data.IdRol);
        setName(res.data.Nombre);
        //console.log(rol);
      }else{
        navigate('/login');
      }
    })
    .catch((err) => console.log(`Eroor en home${err}`))
  },[navigate]);
  return (
    <>
    <div className='header d-flex flex-column ' style={{width:'100%', backgroundColor:'#224A2F'}}>
      <div className='container-fluid p-0 d-flex w-100'>
        <div className='header d-flex justify-content-left align-items-left text-white  ' style={{backgroundColor: "#224A2F", fontSize:'7px'}}>HOME CON ROL: {rol}</div>
        <div className='header d-flex justify-content-left align-items-left text-white ' style={{backgroundColor: "#224A2F", fontSize:'7px'}}>NOMBRE: {name}</div>
      </div>
    </div>
    
    
    {rol===1 && <IAdmin />}
    {rol ===2 && <IEmpleado />}
    </>
  )
}

export default Home