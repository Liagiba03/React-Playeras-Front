import React, { useState, useEffect } from 'react'
import axios from 'axios';
import {useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2'
import Logo2 from '../../imagenes/logotienda2.jpg'

function Login() {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    axios.defaults.withCredentials = true; 

    useEffect(()=>{
        axios.get('http://localhost:5000')
        .then((res)=>{
          //console.log(res);
          if(res.data.valid){
            navigate('/');
          }else{
            navigate('/login');
          }
        })
        .catch((err) => console.log(`Eror en home${err}`))
      },[navigate]);

    const handleSubmit =(evt) =>{
        evt.preventDefault();
        //console.log(`USER: '${user}' Y PASS: '${password}'`);
        axios.post('/login',{user, password})
        .then((res) => {
            console.log(res);
            if(res.data.Status === 'Success'){
                navigate('/');
            }else if(res.data.Status === 'Usuario incorrecto'){
                Swal.fire({
                    title: "Usuario incorrecto",
                    text: "Intenta de nuevo",
                    icon: "error"
                  });
            }else if(res.data.Status === 'Password incorrecto'){
              Swal.fire({
                title: "Password incorrecto",
                text: "Intenta de nuevo",
                icon: "error"
              });
            }
        })
        .catch((err)=>
            console.log(err)
        );
    }
  return (
    <>
    <div className='container-fluid d-flex flex-column justify-content-center align-items-center vh-100 vw-100 p-0' style={{backgroundColor: "#22332F"}}>
        <img src={Logo2} className='img-fluid  rounded-circle mb-3' alt="" style={{width:'200px', height: '200px', }}/>
        
        <form className='needs-validation w-50 d-flex flex-column justify-content-center align-items-center' onSubmit={handleSubmit}>
            <div className='mb-3 d-flex flex-column justify-content-center align-items-center'>
                <input className='form-control' type="text" placeholder='Ingresa Usuario' onChange={e => setUser(e.target.value)} style={{borderTopRightRadius: '30px'}}/>
                <label  className="form-label text-white" htmlFor="user">Usuario</label>
            </div>
            <div className='mb-3 d-flex flex-column justify-content-center align-items-center'>
                <input className='form-control' type="password" placeholder='Ingresa Usuario' onChange={e => setPassword(e.target.value)} style={{borderTopRightRadius: '30px'}}/>
                <label  className="form-label text-white" htmlFor="password">Contraseña</label>
            </div>
            <div className='mb-3 d-flex flex-column justify-content-center align-items-center'>
                <button className="btn btn-primary w-100" style={{backgroundColor: "#224A2F", borderRadius:'30px'}} >Iniciar sesión</button>
            </div>
            <div className='mb-3'>
                <Link to='/registrar'>¿Sin cuenta? Registrate</Link>
            </div>
        </form>
    </div>
    </>
  )
}

export default Login