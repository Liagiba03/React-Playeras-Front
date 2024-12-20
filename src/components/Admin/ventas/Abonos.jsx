import axios from 'axios'
import React, { useEffect, useState } from 'react';
import {useNavigate, Link} from 'react-router-dom';
import NavBar from '../NavBar';
import Swal from 'sweetalert2';


function Abonos() {
    const [rol, setRol] = useState(null);
  const navigate = useNavigate();
  const [abono, setAbono] = useState([]);
  const [filtro, setFiltro] = useState('1');
  const [search, setSearch]= useState('');
  const [deletedAbono, setDeletedAbono] = useState(true);

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
  /*useEffect(() => {
    if (rol !== null) {
      //console.log(rol); // Ahora esto se ejecutará después de que rol se haya actualizado
      if (rol !== 1) {
        navigate('/login');
      }
    }
  }, [rol, navigate]);*/
  //USE EFFECT DE VALIDACION END

    //Funcion de filtrado
    const searcher = (e) =>{
      setSearch(e.target.value)
      //console.log(e.target.value)
    }
    /*let results =[]
    if(!search){
      results = abono;
    }else{
      results = abono.filter((dato) => 
        dato.Nombre_Usuario.toLowerCase().includes(search.toLocaleLowerCase()) 
    )
    }*/
    const results = !search ? abono : abono.filter((dato) =>
      dato.Nombre_Usuario.toLowerCase().includes(search.toLowerCase()) ||
      dato.Folio_Venta.toLowerCase().includes(search.toLowerCase())
    );

  //MOSTRAR EN TABLAS INIT
  useEffect(()=>{
    if (deletedAbono || filtro) {
        setDeletedAbono(false);
        //GET Abono
        axios.get(`/get-abonos/${filtro}`)
        .then((res)=>{
            setAbono(res.data[0]);
            //console.log(res.data[0])
        })
        .catch((err)=>console.log(`error: ${err}`));
    }
  }, [deletedAbono,filtro]); 



  //Eliminar un abono
   const deleteAbono = (id)=>{
    Swal.fire({
      title: `¿Seguro que deseas eliminar el abono?`,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: `Mantener`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        //Eliminar
        axios.delete(`/deleteAbono/${id}`)
      .then((res)=>{
        setDeletedAbono(true);
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
      <div className=" d-flex justify-content-left  vh-100 vw-100 p-0 " style={{backgroundColor:'#243330'}}>
        <NavBar />

        <div className="container-fluid d-flex flex-column align-items-center m-0 p-3" style={{minWidth:'80px', minHeight:'300px', width:'100%', overflowY: 'auto', overflowX:'auto', backgroundColor:'#243330 ' }}>
        <h2 className='text-white'>Abonos</h2>
        <input className='form-control w-50' type="search" value={search} onChange={searcher} placeholder='Buscar'/>
        <br />

        <label className='text-white' htmlFor="filtro">Mostrar:</label>                            
          <select className='form-select w-50' name="filtro" id="filtro" required defaultValue={1} onChange={(e)=>setFiltro(e.target.value)}>
          <option value="1" >Todos</option>
          <option value="2" >Por pagar</option>
          <option value="3" >Pagados</option>
        </select>
        <br />
        <div className='table table-responsive p-0 m-0' style={{ borderRadius: '20px', overflow: 'auto' }}>
        <table className="table table-striped table-bordered table-hover rounded" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <thead className='' style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <tr className="text-center align-middle">
                  <th scope="col">Folio de Venta</th>
                  <th scope="col">Última fecha de abono</th>
                  <th scope="col">Cantidad abonada</th>
                  <th scope="col">Cantidad Restante</th>
                  <th scope="col">Deudor</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {
                  results.map((ve, index) =>{
                    return(<tr className="text-center align-middle" key={index}>
                      <td className="text-center align-middle">{ve.Folio_Venta}</td>
                      <td className="text-center align-middle">{formatDateTime(ve.Ultima_Fecha_Abono)}</td>
                      <td className="text-center align-middle">{ve.Abono}</td>
                      <td className="text-center align-middle">{ve.Precio_Total - ve.PagadoActual}</td>
                      <td className="text-center align-middle">{ve.Nombre_Usuario}</td>
                      <td>
                        {rol===1?(<><button key={'delete'} className='btn btn-primary' style={{backgroundColor: "#224A2F"}}  onClick={()=>deleteAbono(ve.Id_Abono)}>Eliminar</button></>):('')}
                      </td>
                    </tr>)
                  })
                }
            </tbody>
          </table>
          </div>

          <div>
            <br />
            {rol ===1?(<><Link to={'/inicio'} className='btn btn-primary m-1' style={{backgroundColor:'#204437'}}>Regresar</Link></>):(<><Link to={'/AbonoEmple'} className='btn btn-primary' style={{backgroundColor: "#224A2F"}}>Regresar</Link></>)}
          
          </div>

      </div>

      </div>
      
      
    </>
  )
}

export default Abonos