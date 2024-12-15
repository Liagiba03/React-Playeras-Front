// src/components/Cart.js
import React, { useEffect, useState, useContext } from 'react';
import { CartContext } from '../CartContext';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const Cart = () => {
    const { cartItems, updateCartItem, removeFromCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [rol, setRol] = useState(null);

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
      console.log(cartItems)
  }, [navigate, rol]);
  // PARA OBTENER NOMBRE END

    const handleQuantityChange = (index, newQuantity) => {
        const item = cartItems[index];
        if (newQuantity <= 0) {
            newQuantity = 1;
        }
        if (newQuantity > item.cantidadDisponible) {
            newQuantity = item.cantidadDisponible;
            Swal.fire({
                icon: 'error',
                title: 'Cantidad no disponible',
                text: `Solo hay ${item.cantidadDisponible} unidades disponibles de este producto.`,
            });
        }
        updateCartItem(index, newQuantity);
    };

    const handleRemove = (index) => {
        removeFromCart(index);
        Swal.fire({
            icon: 'success',
            title: 'Producto Eliminado',
            text: 'El producto ha sido eliminado del carrito.',
        });
    };

    const handleSubmit = () => {
        if(cartItems.length === 0){
            Swal.fire({
                icon: 'error',
                title: 'No puedes seguir con la venta',
                text: 'El carrito debe de tener elementos',
            });
            return
        }else{
            navigate('/seleccionarPago');
        }
    };

    // VERIFICACION DE CARGADO INIT
  if (rol === null) {
    return <div>Cargando...</div>; // Mostrar un mensaje de carga mientras se obtiene el rol
  }
  // VERIFICACION DE CARGADO END

    return (
        <div className="container-fluid d-flex flex-column  align-items-center m-0 p-3 vh-100" style={{minWidth:'400px', minHeight:'600px', width:'100%', overflowY: 'auto', overflowX:'auto', backgroundColor:'#243330 ' }}>
            <h2 className='text-white'>Carrito de Compras</h2>
            {cartItems.length === 0 ? (
                <p className='text-white'>No hay productos en el carrito.</p>
            ) : (
                
                <table className="table table-striped table-bordered table-hover rounded" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                    <thead className='' style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                        <tr className="text-center align-middle">
                            <th scope="col">Diseño</th>
                            <th scope="col">Tipo</th>
                            <th scope="col">Talla</th>
                            <th scope="col">Color</th>
                            <th scope="col">Cantidad</th>
                            <th scope="col">Monto</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item, index) => (
                            <tr className="text-center align-middle" key={index}>
                                <td className="text-center align-middle">{item.diseño}</td>
                                <td className="text-center align-middle">{item.tipo}</td>
                                <td className="text-center align-middle">{item.talla}</td>
                                <td className="text-center align-middle">{item.color}</td>
                                <td>
                                    <button onClick={() => handleQuantityChange(index, item.cantidad - 1)}>-</button>
                                    <input
                                        
                                        type="number"
                                        value={item.cantidad}
                                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                                    />
                                    <button onClick={() => handleQuantityChange(index, item.cantidad + 1)}>+</button>
                                </td>
                                <td className="text-center align-middle">${item.monto * item.cantidad}</td>
                                <td className="text-center align-middle">
                                    <button className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} onClick={() => handleRemove(index)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div className='d-flex align-items-center justify-content-center'>
                <Link className='btn btn-primary m-1' style={{backgroundColor:'#204437'}}  to={`/nuevaVenta`}>Volver</Link>
                <button className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} onClick={handleSubmit}>Comprar carrito</button>
            </div>
            
        </div>
    );
};

export default Cart;
