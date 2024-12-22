import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const SeleccionarPago = () => {
    const [metodoPago, setMetodoPago] = useState('efectivo');
    const [compradores, setCompradores] = useState([]);
    const [compradorSeleccionado, setCompradorSeleccionado] = useState('');
    const [rol, setRol] = useState(null);
    const navigate = useNavigate();

    // PARA OBTENER NOMBRE INIT
    useEffect(() => {
        axios.get('http://localhost:5000', { withCredentials: true })
        .then((res) => {
            if (res.data.valid) {
            setRol(res.data.IdRol);
            } else {
            navigate('/login');
            }
        })
        .catch((err) => console.log(`Error en home: ${err}`));
    }, [navigate, rol]);
    // PARA OBTENER NOMBRE END

    useEffect(() => {
        // Función para obtener los compradores desde la API
        axios.get('/compradores')
        .then((res)=>{
            setCompradores(res.data[0])
        })
        .catch(err =>console.log(`Eroor en compradores${err}`));
    }, []);

    const handleContinuar = () => {
        if (!compradorSeleccionado) {
            Swal.fire({
                icon: 'error',
                title: 'Selecciona un comprador',
                text: 'Por favor, selecciona un comprador antes de continuar.',
            });
            return;
        }

        // Navegar a la página de finalizar venta con los detalles seleccionados
        navigate('/finalizarVenta', { state: { metodoPago, compradorSeleccionado } });
    };

            // VERIFICACION DE CARGADO INIT
        if (rol === null) {
            return <div>Cargando...</div>; // Mostrar un mensaje de carga mientras se obtiene el rol
        }
        // VERIFICACION DE CARGADO END

    return (
        <div className="container-fluid d-flex flex-column  align-items-center m-0 p-3 vh-100" style={{minWidth:'400px', minHeight:'600px', width:'100%', overflowY: 'auto', overflowX:'auto', backgroundColor:'#243330 ' }}>
            <br />
            <h2 className='text-white'>Seleccionar Método de Pago y Comprador</h2>
            <br />

            <div className='container-fluid d-flex flex-column rounded' style={{backgroundColor:'white'}}>
            <div className='d-flex flex-column align-items-center'>
                <h3>Método de Pago</h3>
                <label>
                    <input
                        type="radio"
                        value="efectivo"
                        checked={metodoPago === 'efectivo'}
                        onChange={(e) => setMetodoPago(e.target.value)}
                    />
                    Efectivo
                </label>
                <label>
                    <input
                        type="radio"
                        value="abonos"
                        checked={metodoPago === 'abonos'}
                        onChange={(e) => setMetodoPago(e.target.value)}
                    />
                    Abonos
                </label>
            </div>
            <div className='d-flex flex-column align-items-center'>
                <h3>Seleccionar Comprador</h3>
                <select className='form-select' value={compradorSeleccionado} onChange={(e) => setCompradorSeleccionado(e.target.value)}>
                    <option value="" disabled>Selecciona un comprador</option>
                    {compradores.map((comprador) => (
                        <option key={comprador.Id_Usuario} value={comprador.Id_Usuario}>
                            {comprador.Nombre_Usuario}
                        </option>
                    ))}
                </select>
            </div>
            <br />
            <div className='d-flex alig-items-center justify-content-center'>
                <Link className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} to={`/editCom/0`}>Agregar comprador</Link>
                <button className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} onClick={handleContinuar}>Continuar</button>
                <Link className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} to={`/inicioEmpleado`}>Volver</Link>
            </div>
            </div>
            
        </div>
    );
};

export default SeleccionarPago;
