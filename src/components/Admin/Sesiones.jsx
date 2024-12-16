import axios from 'axios'
import React, { useEffect, useState } from 'react';
import {useNavigate, Link } from 'react-router-dom';
import NavBar from './NavBar';
import Swal from 'sweetalert2';

function Sesiones() {
  const [rol, setRol] = useState(null);
  const navigate = useNavigate();
  const [sesiones, setSesiones] = useState([]);
  const [deletedS, setDeletedS] = useState(true);

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
    if(deletedS){
        setDeletedS(false);
    //GET COMPRADORES
      axios.get('/sesiones')
      .then((res)=>{
        setSesiones(res.data);
        //console.log(res.data)
      })
      .catch((err)=>console.log(`error: ${err}`));
    }}, [deletedS]); 

  //DELETE USER
  const deleteUser = (id)=>{
    Swal.fire({
      title: `¿Seguro que deseas eliminar este usuario?`,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: `Mantener`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        //Eliminar
        axios.delete(`/deleteUser/${id}`)
      .then((res)=>{
        setDeletedS(true);
        //console.log(res)
    
      })
      .catch((err)=>{ console.log(`Error in delete: ${err}`)});
      
        Swal.fire("Eliminado!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("No eliminado", "", "info"); 
      }
    });
  }


  //VERIFICACION DE CARGADO INIT
  if (rol === null) {
    return <div>Cargando...</div>; // Mostrar un mensaje de carga mientras se obtiene el rol
  }
  //VERIFICACION DE CARGADO END

  return (
    <>
      <div className='d-flex justify-content-left vh-100 p-0 m-0'>
        <NavBar />
        
        <div className="container-fluid d-flex flex-column justify-content-start align-items-center m-0 p-3 vh-100 " style={{minWidth:'400px', minHeight:'600px', width:'100%', overflowY: 'auto', overflowX:'auto', backgroundColor:'#243330 ' }}>
          <h2 className='text-white'>Sesiones</h2>
          <br />
          <h3 className='text-white'>Usuarios</h3>
          <br />
          <Link className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} to={`/sesionesEd/0`}>Agregar nuevo</Link>
          <br />
          <div className='table table-responsive p-0 m-0' style={{ borderRadius: '20px', overflow: 'auto' }}>
          <table className="table table-striped table-bordered table-hover rounded" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <thead className='' style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr className="text-center align-middle">
                <th scope="col">Nombre</th>
                <th scope="col">Apellido</th>
                <th scope="col">Foto</th>
                <th scope="col">Rol</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {
                sesiones.map((ve) =>{
                  return(<tr className="text-center align-middle" key={ve.Id_Usuario}>
                    <td className="text-center align-middle">{ve.Nombre}</td>
                    <td className="text-center align-middle">{ve.Apellido1}</td>
                    <td className="text-center align-middle" >
                      <img src={`http://localhost:5000/images/${ve.Foto}`} alt="Imagen desde el servidor" width="100" height="100" />
                    </td>
                    <td className="text-center align-middle">{ve.Rol}</td>
                    <td className="text-center align-middle">
                        <Link className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} to={`/sesionesEd/${ve.Id_Usuario}`}>Editar</Link>
                        <button className='btn btn-primary m-3'  style={{backgroundColor: "#224A2F"}} key={'delete'} onClick={()=>deleteUser(ve.Id_Usuario)}>Eliminar</button>
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

export default Sesiones