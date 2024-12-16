import axios from 'axios'
import React, { useEffect, useState } from 'react';
import {useNavigate, Link } from 'react-router-dom';
import NavBar from '../NavBar';
import Swal from 'sweetalert2';


function CatTemp() {

  const [rol, setRol] = useState(null);
  const navigate = useNavigate();
  const [temporada, setTemporada] = useState([]);
  const [catalogo, setCatalogo] = useState([]);
  const [deletedC, setDeletedC] = useState(true);
  const [deletedT, setDeletedT] = useState(true);


  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };
  
    // PARA OBTENER NOMBRE INIT
    useEffect(()=>{
      axios.get('http://localhost:5000', { withCredentials: true })
      .then((res)=>{
        //console.log('dis')
        //console.log(res)
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
      if(deletedC){
        axios.get('/catalogo')
        .then((res)=>{
          const formattedCatalogs = res.data[0].map(cat => ({
            ...cat,
            fecha: formatDate(cat.fecha)
          }));
          setCatalogo(formattedCatalogs);
          setDeletedC(false);
        })
        .catch((err)=>console.log(`error: ${err}`));
    }}, [deletedC]); 

    useEffect(()=>{
      //GET TEMPORADAS
      if(deletedT){
        axios.get('/temporada')
        .then((res)=>{
          setTemporada(res.data[0])
          //console.log(res);
          setDeletedT(false);
        })
        .catch((err)=>console.log(`error: ${err}`));
    }}, [deletedT]); 
    //MOSTRAR EN TABLAS END

  //FUNCIONES DELETE INIT
  const eliminar = (elim, onDelete) =>{
    Swal.fire({
      title: `¿Seguro que deseas eliminar ${elim}?`,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: `Mantener`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        //Eliminar
        onDelete();
        Swal.fire("Eliminado!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("No eliminado", "", "info");
        
      }
    });
  }
  function deleteTemp(id){
    eliminar('la temporada', () =>{
      axios.delete(`/deleteTemp/${id}`)
        .then((res)=>{
          setDeletedT(true);
  
        })
        .catch((err)=>{ console.log(`Error in delete: ${err}`)});
    });
  }

  function deleteCat(id){
    eliminar('el catalogo', () =>{
      axios.delete(`/deleteCat/${id}`)
      .then((res)=>{
        setDeletedC(true);
    
      })
      .catch((err)=>{ console.log(`Error in delete: ${err}`)});
    });
  }
  //FUNCIONES DELETE END
    
     if (rol === null) {
      return <div>Cargando...</div>; // Mostrar un mensaje de carga mientras se obtiene el rol
    }
  
  return (
   <>
      <div className=" d-flex justify-content-left  vh-100 vw-100 p-0 " style={{backgroundColor:'#243330'}}>
        <NavBar />
        
        <div className="container-fluid d-flex flex-column align-items-center m-0 p-3" style={{minWidth:'80px', minHeight:'300px', width:'100%', overflowY: 'auto', overflowX:'auto', backgroundColor:'#243330 ' }}>
        <h2 className='text-white'>Catalogos y temporadas</h2>

        <h3 className='text-white'>Catalogos</h3>
        <Link className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} to={`/editCat/0`}>Agregar nuevo</Link>
        <div className='table table-responsive p-0 m-0' style={{ borderRadius: '20px', overflow: 'auto' }}>
          <table className="table table-striped table-bordered table-hover rounded" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <thead className='' style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr className="text-center align-middle">
                <th scope="col">#</th>
                <th scope="col">No.Páginas</th>
                <th scope="col">Fecha Salida</th>
                <th scope="col">Accion</th>
              </tr>
            </thead>
            <tbody>
              {
                catalogo.map((cat) =>{
                  return(<tr className="text-center align-middle" key={cat.id}>
                    <td className="text-center align-middle">{cat.id}</td>
                    <td className="text-center align-middle">{cat.pag}</td>
                    <td className="text-center align-middle">{cat.fecha}</td>
                    <td className="text-center align-middle">
                      
                      <Link className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} to={`/editCat/${cat.id}`}>Editar</Link>
                      <button className='btn btn-primary' style={{backgroundColor: "#224A2F"}} onClick={()=>deleteCat(cat.id)}>Eliminar</button>
                    </td>
                  </tr>)
                })
              }
            </tbody>
          </table>
        </div>

        <h3 className='text-white'>Temporadas</h3>
        <Link className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} to={`/editTemp/0`}>Agregar nuevo</Link>
        <div className='table table-responsive p-0 m-0' style={{ borderRadius: '20px', overflow: 'auto' }}>
          <table className="table table-striped table-bordered table-hover rounded" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <thead className='' style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr className="text-center align-middle">
                <th scope="col">#</th>
                <th scope="col">Nombre de temporada</th>
                <th scope="col">Accion</th>
              </tr>
            </thead>
            <tbody>
              {
                temporada.map((temp) =>{
                  return(<tr className="text-center align-middle" key={temp.Id_Temporada}>
                    <td className="text-center align-middle">{temp.Id_Temporada}</td>
                    <td className="text-center align-middle">{temp.Nombre_Temporada}</td>
                    <td className="text-center align-middle">
                      
                      <Link className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} to={`/editTemp/${temp.Id_Temporada}`}>Editar</Link>
                      <button className='btn btn-primary m-1' style={{backgroundColor: "#224A2F"}} key={'delete'} onClick={()=>deleteTemp(temp.Id_Temporada)}>Eliminar</button>
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
export default CatTemp