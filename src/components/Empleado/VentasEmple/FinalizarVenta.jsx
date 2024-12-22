import React, { useContext, useState , useEffect} from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../../../CartContext';
import Swal from 'sweetalert2';
import axios from 'axios';

const FinalizarVenta = () => {
    const { cartItems, clearCart } = useContext(CartContext);
    const location = useLocation();
    const navigate = useNavigate();
    const { metodoPago, compradorSeleccionado } = location.state;
    const [pagaCon, setPagaCon] = useState(null);
    const [rol, setRol] = useState(null);

    const totalAPagar = cartItems.reduce((acc, item) => acc + item.cantidad * item.monto, 0);

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

    //TOMAR FECHA DE VENTA ACTUAL
    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleFinalizar = async () => {
        if (metodoPago === 'abonos' && (pagaCon <= 0 || pagaCon> totalAPagar)) {
            Swal.fire({
                icon: 'error',
                title: 'Cantidad incorrecta',
                text: 'Por favor, introduce una cantidad válida para el pago con abonos.',
            });
            return;
        }
        if (metodoPago === 'efectivo' && (pagaCon <= 0 || pagaCon < totalAPagar || pagaCon> totalAPagar)) {
            Swal.fire({
                icon: 'error',
                title: 'Cantidad incorrecta',
                text: 'Por favor, introduce una cantidad válida para el pago en efectivo.',
            });
            return;
        }
        

        const folioVenta = `${new Date().getTime()}`; // Generar un folio único basado en la fecha y hora actual
        const fechaVenta = getCurrentDateTime();

        try {
            // Insertar en la tabla venta
            await axios.post('/ventas', {
                folioVenta,
                fechaVenta,
                cantidadPlayera: cartItems.length,
                precioTotal: totalAPagar,
                idUsuario: compradorSeleccionado,
                idEstadoV: metodoPago === 'efectivo' ? 1 : 2,
            });

            // Insertar en la tabla detalle_venta
            for (const item of cartItems) {
                console.log(cartItems)
                await axios.post('/detalle_venta', {
                    cantidadInd: item.cantidad,
                    folio: folioVenta,
                    folioPla: item.folio,
                    precioU: item.monto,
                });
            }


            // Si es abonos, insertar en la tabla abonos
            if (metodoPago === 'abonos') {
                const fechaAbono = getCurrentDateTime();
                await axios.post('/abonos', {
                    fechaAbono,
                    abono: pagaCon,
                    folioVenta,
                });
            }

            navigate('/ventaFinalizada', { state: { folioVenta, fechaVenta, cartItems, compradorSeleccionado, totalAPagar, pagaCon } });
        } catch (error) {
            console.error('Error al finalizar la venta:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al finalizar la venta',
                text: 'Hubo un problema al procesar la venta. Por favor, intenta nuevamente.',
            });
        }
    };

        // VERIFICACION DE CARGADO INIT
        if (rol === null) {
            return <div>Cargando...</div>; // Mostrar un mensaje de carga mientras se obtiene el rol
        }
        // VERIFICACION DE CARGADO END

    return (
        <div className="container-fluid d-flex flex-column  align-items-center m-0 p-3 vh-100" style={{minWidth:'400px', minHeight:'600px', width:'100%', overflowY: 'auto', overflowX:'auto', backgroundColor:'#243330 ' }}>
            <br />
            <h2 className='text-white'>Finalizar Venta</h2>
            <br />
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
                <div className='d-flex flex-column align-items-center justify-content-center'>
                    <label className='text-white' htmlFor="pagaCon">Paga con:</label>
                    <input
                        className='form-control'
                        type="number"
                        id="pagaCon"
                        value={pagaCon}
                        onChange={(e) => setPagaCon(Number(e.target.value))}
                    />
                </div>
                <br />
            <div className='d-flex  align-items-center justify-content-center'>   
                <button className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} onClick={handleFinalizar}>FINALIZAR</button>
                <Link  className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} to={`/inicioEmpleado`}>Volver</Link>
            </div>
        </div>
    );
};

export default FinalizarVenta;
