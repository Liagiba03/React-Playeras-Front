import axios from 'axios'
import React, { useEffect, useState } from 'react';
import {useNavigate, Link } from 'react-router-dom';
import NavBar from '../NavBar';
import Swal from 'sweetalert2';


function Comprador() {
  const [rol, setRol] = useState(null);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [deletedU, setDeletedU] = useState(true);


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
    //get USERS
    if(deletedU){
      setDeletedU(false);
    axios.get('/compradores')
    .then((res)=>{
      setUsers(res.data[0])
      //console.log(res.data[0]);
    })
    .catch((err)=>console.log(`error: ${err}`));
  }},[deletedU]);

  //Eliminar un producto
  const deleteAbono = (id)=>{
    Swal.fire({
      title: `¿Seguro que deseas eliminar a el comprador?`,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: `Mantener`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        //Eliminar
        axios.delete(`/deleteComprador/${id}`)
      .then((res)=>{
        setDeletedU(true);
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
          <h2 className='text-white'>Compradores</h2>
          <br />
          <h3 className='text-white'  >Ventas</h3>
          <br />
          <Link className='btn btn-primary m-1'  style={{backgroundColor:'#204437'}} to={`/editCom/0`}>Agregar nuevo</Link>
          <br />
          <div className='table table-responsive p-0 m-0' style={{ borderRadius: '20px', overflow: 'auto' }}>
          <table className="table table-striped table-bordered table-hover rounded" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <thead className='' style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr className="text-center align-middle">
                <th scope="col">#</th>
                <th scope="col">Nombre</th>
                <th scope="col">Telefono</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            <tbody>
              {
                users.map((ve) =>{
                  return(<tr className="text-center align-middle" key={ve.Id_Usuario}>
                    <td className="text-center align-middle">{ve.Id_Usuario}</td>
                    <td className="text-center align-middle">{(ve.Nombre_Usuario)}</td>
                    <td className="text-center align-middle">{ve.telefono}</td>
                    <td className="text-center align-middle">
                    <Link className='btn btn-primary m-1'  style={{backgroundColor:'#204437'}} to={`/editCom/${ve.Id_Usuario}`}>Editar</Link>
                      <button className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} onClick={()=>deleteAbono(ve.Id_Usuario)}>Eliminar</button>
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

export default Comprador