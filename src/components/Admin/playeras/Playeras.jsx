import React, {useState, useEffect}from 'react'
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';
import NavBar from '../NavBar';

function Playeras() {
  const [tipo, setTipo] = useState([]);
  const [color, setColor] = useState([]);
  const [talla, setTalla] = useState([]);
  const [playeras, setPlayeras] = useState([]);
  const [deletedT, setDeletedT] = useState(true);
  const [deletedC, setDeletedC] = useState(true);
  const [deletedTa, setDeletedTa] = useState(true);
  const [deletedPla, setDeletedPla] = useState(true);
  const [rol, setRol] = useState(null);
  const navigate = useNavigate();


      // PARA OBTENER NOMBRE INIT
      useEffect(()=>{
        axios.get('http://localhost:5000', { withCredentials: true })
        .then((res)=>{
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
    //get TIPO
    if(deletedT){
      setDeletedT(false);
    axios.get('/tipo')
    .then((res)=>{
      setTipo(res.data[0])
      //console.log(res);
    })
    .catch((err)=>console.log(`error: ${err}`));
  }},[deletedT]);

useEffect(()=>{
  //GET COLOR
  if(deletedC){
    axios.get('/color')
    .then((res)=>{
      setColor(res.data[0])
      //console.log(res);
      setDeletedC(false);
    })
    .catch((err)=>console.log(`error: ${err}`));
}}, [deletedC]);

useEffect(()=>{
  //GET TALLA
  if(deletedTa){
    axios.get('/talla')
    .then((res)=>{
      setTalla(res.data[0])
      //console.log(res);
      setDeletedTa(false);
    })
    .catch((err)=>console.log(`error: ${err}`));
}}, [deletedTa]);

useEffect(()=>{
  //GET PLAYERAS
  if(deletedPla){
    axios.get('/playeras')
    .then((res)=>{
      setPlayeras(res.data[0])
      //console.log(res);
      setDeletedPla(false);
    })
    .catch((err)=>console.log(`error: ${err}`));
}}, [deletedPla]);
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
  function deleteTipo(id){
    eliminar('el tipo de playera', () =>{
      axios.delete(`/deleteTipo/${id}`)
        .then((res)=>{
          setDeletedT(true);
  
        })
        .catch((err)=>{ console.log(`Error in delete: ${err}`)});
    });
  }

  function deleteColor(id){
    eliminar('el color', () =>{
      axios.delete(`/deleteColor/${id}`)
      .then((res)=>{
        setDeletedC(true);
    
      })
      .catch((err)=>{ console.log(`Error in delete: ${err}`)});
    });
  }

  function deleteTalla(id){
    eliminar('la talla', () =>{
      axios.delete(`/deleteTalla/${id}`)
      .then((res)=>{
        setDeletedTa(true);
    
      })
      .catch((err)=>{ console.log(`Error in delete: ${err}`)});
    });
  }

  function deletePlayera(id){
    eliminar('la playera disponible', () =>{
      axios.delete(`/deletePlayera/${id}`)
      .then((res)=>{
        setDeletedPla(true);
    
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
      <div className='d-flex justify-content-left vh-100 p-0 m-0'>
        <NavBar />
        

        <div className="container-fluid d-flex flex-column justify-content-start align-items-center m-0 p-3 vh-100 " style={{minWidth:'800px', minHeight:'600px', width:'100%', overflowY: 'auto', overflowX:'auto', backgroundColor:'#243330 ' }}>
        <h2 className='text-white'>Playeras - Características</h2>
        {/*tabla1*/}
        <div className="container-fluid d-flex flex-column align-items-center m-0 p-0 " >
          <h3 className='text-white'>Tipo de Playera</h3>
          <Link className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} to={`/editTipoP/0`}>Agregar nuevo</Link>
          <div className='table table-responsive p-0 m-0' style={{ borderRadius: '20px', overflow: 'auto' }}>
          <table className="table table-striped table-bordered table-hover rounded" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <thead className='' style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr className="text-center align-middle">
                <th scope="col">#</th>
                <th scope="col">Playera</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            <tbody>
              {
                tipo.map((tip) =>{
                  return(<tr className="text-center align-middle" key={tip.Id_TipoP}>
                    <td className="text-center align-middle">{tip.Id_TipoP}</td>
                    <td className="text-center align-middle">{tip.Des_TipoP}</td>
                    <td className="text-center align-middle">
                      <Link className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} to={`/editTipoP/${tip.Id_TipoP}`}>Editar</Link>
                      <button className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} key={'delete'} onClick={()=>deleteTipo(tip.Id_TipoP)}>Eliminar</button>
                    </td>
                  </tr>)
                })
              }
            </tbody>
          </table>
          </div>
        </div>
        {/*tabla2*/}
        <div className="container-fluid d-flex flex-column align-items-center m-0 p-0 " >
          <h3 className='text-white'>Color de Playera</h3>
          <Link className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} to={`/editColor/0`}>Agregar nuevo</Link>
          <div className='table table-responsive p-0 m-0' style={{ borderRadius: '20px', overflow: 'auto' }}>
          <table className="table table-striped table-bordered table-hover rounded" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <thead className='' style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr className="text-center align-middle">
                <th scope="col">#</th>
                <th scope="col">Color</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            <tbody>
              {
                color.map((co) =>{
                  return(<tr key={co.Id_Color_Play}>
                    <td className="text-center align-middle">{co.Id_Color_Play}</td>
                    <td className="text-center align-middle">{co.Des_Color_Play}</td>
                    <td className="text-center align-middle">
                    <Link className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} to={`/editColor/${co.Id_Color_Play}`}>Editar</Link>
                    <button className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} key={'delete'} onClick={()=>deleteColor(co.Id_Color_Play)}>Eliminar</button>
                    </td>
                  </tr>)
                })
              }
            </tbody>
          </table>
          </div>
        </div>
        {/*tabla3*/}
        <div className="container-fluid d-flex flex-column align-items-center m-0 p-0 " >
          <h3 className='text-white'>Talla de Playera</h3>
          <Link className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} to={`/editTalla/0`}>Agregar nuevo</Link>
          <div className='table table-responsive p-0 m-0' style={{ borderRadius: '20px', overflow: 'auto' }}>
          <table className="table table-striped table-bordered table-hover rounded" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <thead className='' style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr className="text-center align-middle">
                <th scope="col">#</th>
                <th scope="col">Talla</th>
                <th scope="col">Descripción de medidas</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {
                talla.map((ta) =>{
                  return(<tr key={ta.Id_Talla}>
                    <td className="text-center align-middle">{ta.Id_Talla}</td>
                    <td className="text-center align-middle">{ta.Nom_Talla}</td>
                    <td className="text-center align-middle">{ta.Medidas}</td>
                    <td className="text-center align-middle">
                      <Link className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} to={`/editTalla/${ta.Id_Talla}`}>Editar</Link>
                      <button className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} onClick={()=>deleteTalla(ta.Id_Talla)}>Eliminar</button>
                    </td>
                  </tr>)
                })
              }
            </tbody>
          </table>
          </div>
        </div>
        {/*tabla4*/}
        <div className="container-fluid d-flex flex-column align-items-center m-0 p-0 " >
          <h3 className='text-white'>Playeras disponibles</h3>
          <Link className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} to={`/editPla/0`}>Agregar nuevo</Link>
          <div className=' table table-responsive p-0 m-0' style={{ borderRadius: '20px', overflow: 'auto' }}>
          <table className="table table-striped table-bordered table-hover rounded" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <thead className='' style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr className="text-center align-middle">
                <th scope="col">#</th>
                <th scope="col">Color de playera</th>
                <th scope="col">Tipo de playera</th>
                <th scope="col">Talla</th>
                <th scope="col">Cantidad disponible</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            <tbody>
            {
                playeras.map((pla) =>{
                  return(<tr key={pla.Id}>
                    <td className="text-center align-middle">{pla.Id}</td>
                    <td className="text-center align-middle">{pla.Color}</td>
                    <td className="text-center align-middle">{pla.Tipo}</td>
                    <td className="text-center align-middle">{pla.Talla}</td>
                    <td className="text-center align-middle">{pla.Cantidad_Disponible}</td>
                    <td className="text-center align-middle">
                      <Link className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} to={`/editPla/${pla.Id}`}>Editar</Link>
                      <button className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} key={'delete'} onClick={()=>deletePlayera(pla.Id)}>Eliminar</button>
                    </td>
                  </tr>)
                })
              }
            </tbody>
          </table>
          </div>
        </div>
        
        <div>

        </div>
        </div>


      </div>
    </>
  )
}

export default Playeras