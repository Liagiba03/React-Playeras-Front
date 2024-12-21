import axios from 'axios'
import React, { useEffect, useState } from 'react';
import {useNavigate, Link } from 'react-router-dom';
import NavBar from '../NavBar';

function Ventas() {
  const [rol, setRol] = useState(null);
  const navigate = useNavigate();
  const [venta, setVenta] = useState([]);

    // FORMATEAR FECHA Y HORA
    const formatDateTime = (dateString) => {
      const options = {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false,
      };
      return new Date(dateString).toLocaleString('es-ES', options).replace(',', '');
    }

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
      //GET CATALOGOS
        axios.get('/venta')
        .then((res)=>{
          setVenta(res.data[0]);
          //console.log(res.data[0])
        })
        .catch((err)=>console.log(`error: ${err}`));
    }, []); 


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
          <h2 className='text-white'>Ventas y Abonos</h2>
          <h3 className='text-white'>Ventas</h3>
          <div className='table table-responsive p-0 m-0' style={{ borderRadius: '20px', overflow: 'auto' }}>
          <table  className="table table-striped table-bordered table-hover rounded" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <thead className='' style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr className="text-center align-middle">
                <th scope="col"> Folio</th>
                <th scope="col">Fecha / Hora</th>
                <th scope="col">Cantidad</th>
                <th scope="col">Total</th>
                <th scope="col">Comprador</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {
                venta.map((ve) =>{
                  return(<tr className="text-center align-middle" key={ve.Folio_Venta}>
                    <td className="text-center align-middle">{ve.Folio_Venta}</td>
                    <td className="text-center align-middle">{formatDateTime(ve.Fecha_Venta)}</td>
                    <td className="text-center align-middle">{ve.Cantidad_Playera}</td>
                    <td className="text-center align-middle">{ve.Precio_Total}</td>
                    <td className="text-center align-middle">{ve.Comprador}</td>
                    <td className="text-center align-middle">{ve.Estado}</td>
                    <td className="text-center align-middle">
                      
                      <Link  className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} key={'link'} to={`/detalleV/${ve.Folio_Venta}`}>Detalles</Link>
                    </td>
                  </tr>)
                })
              }
            </tbody>
          </table>
          </div>
        </div>



      </div>

    </>
  )
}

export default Ventas