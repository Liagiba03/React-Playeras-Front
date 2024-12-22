// src/components/VentaFinalizada.js
import React, { useContext, useState, useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../../../CartContext';
import axios from 'axios';


const VentaFinalizada = () => {
    const location = useLocation();
    const { folioVenta, fechaVenta, compradorSeleccionado, totalAPagar, pagaCon } = location.state;
    const { cartItems, clearCart } = useContext(CartContext);
    const [compra, setCompra] = useState('');
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

    //Obtener comprador
    axios.get(`/get_user/${compradorSeleccionado}`)
      .then((res)=>{
        setCompra(res.data[0][0].Nombre_Usuario);
        console.log(res.data[0][0].Nombre_Usuario)
        
      })
      .catch((err)=>console.log(`error: ${err}`));

      //Limpiar carrito
      const handleClearCart=()=>{
        clearCart();
        navigate(`/inicioEmpleado`);
      }

    if (rol === null) {
        return <div>Cargando...</div>; // Mostrar un mensaje de carga mientras se obtiene el rol
    }
    // VERIFICACION DE CARGADO END

    //sclearCart();
    return (
        <div className="container-fluid d-flex flex-column  align-items-center m-0 p-3 vh-100" style={{minWidth:'400px', minHeight:'600px', width:'100%', overflowY: 'auto', overflowX:'auto', backgroundColor:'#243330 ' }}>
            <h2 className='text-white'>Venta Finalizada</h2>
            <h3 className='text-white'>Folio de Venta: {folioVenta}</h3>
            <h3 className='text-white'>Fecha de Venta: {fechaVenta}</h3>
            <table className="table table-striped table-bordered table-hover rounded" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <thead className='' style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                    <tr className="text-center align-middle">
                        <th scope="col">Diseño</th>
                        <th scope="col">Tipo</th>
                        <th scope="col">Talla</th>
                        <th scope="col">Color</th>
                        <th scope="col">Cantidad</th>
                        <th scope="col">Monto</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map((item, index) => (
                        <tr className="text-center align-middle" key={index}>
                            <td className="text-center align-middle">{item.diseño}</td>
                            <td className="text-center align-middle">{item.tipo}</td>
                            <td className="text-center align-middle">{item.talla}</td>
                            <td className="text-center align-middle">{item.color}</td>
                            <td className="text-center align-middle">{item.cantidad}</td>
                            <td className="text-center align-middle">${item.monto * item.cantidad}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h3 className='text-white'>Total a Pagar: ${totalAPagar}</h3>
            <h3 className='text-white'>Total Recibido: ${pagaCon}</h3>
            <h3 className='text-white'>Comprador: {compra}</h3>
            <button className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} onClick={handleClearCart}>Página principal</button>
        </div>
    );
};

export default VentaFinalizada;
