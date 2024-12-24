import axios from 'axios'
import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2'
import Logo2 from '../../imagenes/logotienda2.jpg'


function Registrar() {
    const [values, setValues] = useState({
        nombre: '',
        apellido: '',
        password: '',
        foto:''
    });

    const navigate = useNavigate();

    const handleSubmit =(evt) =>{
        evt.preventDefault();
        axios.post('/registrar',values)
        .then((res) => {
            if(res.data.success === 'OK'){
                Swal.fire({
                    title: "Añadido",
                    text: "El usuario se añadió con éxito",
                    icon: "success"
                  });
                navigate('/login')
            }else{
                Swal.fire({
                    title: "Error",
                    text: "El usuario no se añadió",
                    icon: "error"
                  });
            }
        })
        .catch((err)=>
            console.log(err)
        );
    };

  return (
    <>
        <div className='container-fluid d-flex flex-column justify-content-center align-items-center vh-100 vw-100 p-0' style={{backgroundColor: "#22332F"}}>
        <img src={Logo2} className='img-fluid  rounded-circle mb-3' alt="" style={{width:'200px', height: '200px', }}/>
            <h2 className="form-label text-white">Registrate</h2>
            <h3 className="form-label text-white">--como empleado--</h3>
            <form className='needs-validation w-50 d-flex flex-column justify-content-center align-items-center' onSubmit={handleSubmit} >
                <div className='mb-3 d-flex flex-column justify-content-center align-items-center'>
                    <input className='form-control' type="text" placeholder='Ingresa Usuario' onChange={e => setValues({...values, nombre: e.target.value})} style={{borderTopRightRadius:'30px'}}/>
                    <label className="form-label text-white" htmlFor="user">Nombre</label>
                </div>
                <div className='mb-3 d-flex flex-column justify-content-center align-items-center'>
                    <input className='form-control' type="text" placeholder='Ingresa Apellido' onChange={e => setValues({...values, apellido: e.target.value})} style={{borderTopRightRadius:'30px'}}/>
                    <label className="form-label text-white" htmlFor="user">Apellido</label>
                </div>
                <div className='mb-3 d-flex flex-column justify-content-center align-items-center'>
                    <input className='form-control' type="password" placeholder='Ingresa contraseña' onChange={e => setValues({...values, password: e.target.value})} style={{borderTopRightRadius:'30px'}}/>
                    <label className="form-label text-white" htmlFor="password">Contraseña</label>
                </div>
                <div className='mb-3 d-flex flex-column justify-content-center align-items-center'>
                    <button className="btn btn-primary w-100" style={{backgroundColor: "#224A2F", borderRadius:'30px'}}>Registrarse</button>
                </div>
            </form>
        </div>
    </>
  )
}

export default Registrar