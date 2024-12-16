import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Logo2 from '../../imagenes/logotienda2.jpg'

function NavBar() {

    axios.defaults.withCredentials = true;
    const [rol, setRol] = useState(null);
    const [name, setName] = useState('');
    const navigate = useNavigate();

    // PARA OBTENER NOMBRE INIT
    useEffect(() => {
        axios.get('http://localhost:5000', { withCredentials: true })
            .then((res) => {
                //console.log(res);
                if (res.data.valid) {
                    setName(res.data.Nombre);
                    setRol(res.data.IdRol);
                } else {
                    navigate('/login');
                }
            })
            .catch((err) => console.log(`Eroor en home${err}`))
    }, [navigate]);
    // PARA OBTENER NOMBRE END

    // PARA CERRAR SESIÓN INIT
    const handleOutput = () => {
        axios.get('/close')
            .then(res => {
                window.location.reload();
            })
            .catch(err => console.log(err))
    }
    // PARA CERRAR SESIÓN END

    // VERIFICACION DE CARGADO INIT
    if (rol === null) {
        return <div>Cargando...</div>; // Mostrar un mensaje de carga mientras se obtiene el rol
    }
    // VERIFICACION DE CARGADO END

    return (
        <>
            <div id="sidebar" className="sidebar d-flex flex-column align-items-center mt-auto p-3" style={{backgroundColor:"#0F1511", minHeight:'600px', height:'100%', overflowY:'auto', minWidth:'180px'}}>
            <img src={Logo2} className='img-fluid  rounded-circle mb-3 ' alt="" style={{width:'80px', height: '80px', }}/>
                <h2 className='text-white '>{name}</h2>
                <ul className='d-flex flex-column align-items-left'>
                    {rol === 1 ? (
                        <>
                            <li className='nav-item'><Link className='nav-link text-white' to="/inicio">INICIO</Link></li>
                            <li className='nav-item'><Link className='nav-link text-white' to="/productos">Productos</Link></li>
                            <li className='nav-item'><Link className='nav-link text-white' to="/abonos">Abonos</Link></li>
                            <li className='nav-item'><Link className='nav-link text-white' to="/diseno">Diseños</Link></li>
                            <li className='nav-item'><Link className='nav-link text-white' to="/catTem">Catálogos y Temporadas</Link></li>
                            <li className='nav-item'><Link className='nav-link text-white' to="/playeras">Playeras</Link></li>
                            <li className='nav-item'><Link className='nav-link text-white' to="/ventas">Ventas</Link></li>
                            <li className='nav-item'><Link className='nav-link text-white' to="/comprador">Compradores</Link></li>
                            <li className='nav-item'><Link className='nav-link text-white' to="/sesiones">Sesiones</Link></li>
                        </>
                    ) : (
                      <>
                            <li className='nav-item'><Link className='nav-link text-white' to="/inicioEmpleado">INICIO</Link></li>
                            <li className='nav-item'><Link className='nav-link text-white' to="/nuevaVenta">Nueva Venta</Link></li>
                            <li className='nav-item'><Link className='nav-link text-white' to="/AbonoEmple">Abonos</Link></li>
                        </>
                    )}
                    
                </ul>
                <button className="btn btn-primary mt-auto" style={{backgroundColor: "#224A2F", borderRadius:'30px', marginRight:'30px', fontSize:'10px', }} onClick={handleOutput}>CERRAR SESIÓN</button>
            </div>
        </>
    )
}

export default NavBar;
