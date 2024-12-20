import axios from 'axios'
import React, { useEffect, useState } from 'react';
import {useNavigate, Link, useParams } from 'react-router-dom';
import NavBar from '../NavBar';

function DetalleV() {
  const {id} = useParams();
  const [rol, setRol] = useState(null);
  const navigate = useNavigate();
  const [dVenta, setDventa] = useState([]);
  const [deletedV, setDeletedV] = useState(true);

  // PARA OBTENER NOMBRE INIT
  useEffect(()=>{
    axios.get('http://localhost:5000', { withCredentials: true })
    .then((res)=>{
      //console.log('dis')
      //console.log(res);
      if(res.data.valid){
        setRol(res.data.IdRol);
        
      }else{
        navigate('/login');
      }
    })
    .catch((err) => console.log(`Eroor en home${err}`));

  },[navigate]);
  // PARA OBTENER NOMBRE END

  //USE EFFECT DE VALIDACION INIT
  useEffect(() => {
    if (rol !== null) {
      //console.log(rol); // Ahora esto se ejecutará después de que rol se haya actualizado
      if (rol !== 1) {
        navigate('/login');
      }
    }
  }, [rol, navigate]);
  //USE EFFECT DE VALIDACION END

  //MOSTRAR EN TABLAS INIT
  useEffect(()=>{
    //GET detalle venta
    if(deletedV){
      setDeletedV(false);
      axios.get(`/get-detalleVenta/${id}`)
      .then((res)=>{
        setDventa(res.data[0]);
        console.log(res.data)
      })
      .catch((err)=>console.log(`error: ${err}`));
  }}, [deletedV]); 

   // Cálculo del total
  const total = dVenta.reduce((sum, ve) => sum + ve.Subtotal, 0);

  //VERIFICACION DE CARGADO INIT
  if (rol === null) {
    return <div>Cargando...</div>; // Mostrar un mensaje de carga mientras se obtiene el rol
  }
  //VERIFICACION DE CARGADO END
  return (
    <>
      <div className='d-flex justify-content-left vh-100 p-0 m-0'>
        <NavBar />

        <div className="container-fluid d-flex flex-column justify-content-start align-items-center m-0 p-3 vh-100 " style={{minWidth:'800px', minHeight:'600px', width:'100%', overflowY: 'auto', overflowX:'auto', backgroundColor:'#243330 ' }}>
          <br />
          <h2 className='text-white'>Ventas</h2>
          <br />
          <h3 className='text-white'>Folio: {id}</h3>
          <br />
          <div className='table table-responsive p-0 m-0' style={{ borderRadius: '20px', overflow: 'auto' }}>
          <table className="table table-striped table-bordered table-hover rounded" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <thead className='' style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr className="text-center align-middle">
                <th scope="col">Diseño</th>
                <th scope="col">Tipo de playera</th>
                <th scope="col">Talla</th>
                <th scope="col">Color</th>
                <th scope="col">Costo individual</th>
                <th scope="col">Cantidad</th>
                <th scope="col">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {
                dVenta.map((ve, index) =>{
                  return(<tr className="text-center align-middle" key={index}>
                    <td>
                      <img src={`http://localhost:5000/images/${ve.Diseño}`} alt="Imagen desde el servidor" width="100" height="100" />
                      </td>
                    <td className="text-center align-middle">{ve.Des_TipoP}</td>
                    <td className="text-center align-middle">{ve.Nom_Talla}</td>
                    <td className="text-center align-middle">{ve.Des_Color_Play}</td>
                    <td className="text-center align-middle">{ve.Precio_Unitario}</td>
                    <td className="text-center align-middle">{ve.Cantidad_IndPlayera}</td>
                    <td className="text-center align-middle">{ve.Subtotal}</td>
                  </tr>)
                })
              }
            </tbody>
          </table>
          </div>
          <br />
          <label className='text-white'>Total: {total}</label>

          <div>
            <br />
          <Link className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} to={'/ventas'}>Regresar</Link>
          </div>
        </div>

      </div>

      

    </>
  )
}

export default DetalleV