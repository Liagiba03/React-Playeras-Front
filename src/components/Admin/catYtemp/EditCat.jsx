import axios from 'axios'
import React, { useEffect, useState } from 'react';
import {useNavigate, useParams, Link } from 'react-router-dom';
import NavBar from '../NavBar';
import Swal from 'sweetalert2';

function EditCat() {
  const {id} = useParams();
  const [rol, setRol] = useState(null);
  const navigate = useNavigate();
  const [data, setData] = useState({
    id:'',
    pag: '',
    fecha: ''
  });

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

    if(id !== 0){
      //Para obtener los valores para editar
      axios.get(`/get_Cat/${id}`)
      .then((res)=>{
        const catalogoData = res.data;
          // Convertir la fecha al formato YYYY-MM-DD
          const formattedDate = new Date(catalogoData.fecha).toISOString().split('T')[0];
          setData({ ...catalogoData, fecha: formattedDate });
        
      })
      .catch((err)=>console.log(`error: ${err}`));
    }

  },[navigate, id]);
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

  //ENVIAR LOS DATOS INIT
  const handleSubmit = (evt) =>{
    evt.preventDefault();

    if(!data.pag.trim() || data.pag<=0){
      Swal.fire({
          icon: "error",
          title: "Debe ingresar el número de páginas válido",
          width: 600,
          padding: "3em",
          color: "#716add",
        
        });
      //alert("Debe ingresar el costo")
      return;
    }
    if(id == 0){
      //Comprobaciónd de la fecha actual con la ingresada
      const today = new Date().toISOString().split('T')[0];
      if(data.fecha < today){
        Swal.fire({
            icon: "error",
            title: "La fecha de salida no puede ser anterior a la fecha actual",
            width: 600,
            padding: "3em",
            color: "#716add",
        });
        return;
      }
    }

    if(id == 0){
      //Agregar tipo de playera
      //console.log(data);
      axios.post('/add_Cat', data)
      .then((res)=>{
          navigate('/catTem');
          //console.log(res);
      })
      .catch((err)=>console.log(`Error: ${err}`)); 

    }else{
      //Si se necesita actualizar
      //console.log(data)
      data.id = id;
      axios.post(`/edit_Cat`, data)
      .then((res)=>{
        
          navigate('/catTem')
          //console.log(res)
      })
      .catch((err)=>console.log(`Error en Edit: ${err}`));
    }
  }
  //ENVIAR LOS DATOS END

  //VERIFICACION DE CARGADO INIT
  if (rol === null) {
    return <div>Cargando...</div>; // Mostrar un mensaje de carga mientras se obtiene el rol
  }
  //VERIFICACION DE CARGADO END

  return (
    <>
      <div className=" d-flex justify-content-left  vh-100 vw-100 p-0 " style={{backgroundColor:'#243330'}}>
        <NavBar />

        <div className="d-flex flex-column align-items-center m-0 p-3 rounded" style={{minWidth:'80px', minHeight:'300px', width:'100%', overflowY: 'auto', overflowX:'auto', backgroundColor:'#243330 ' }}>
          <h2 className='text-white'>Playeras - Características</h2>
          <br />
          <br />
          {id==0 ? (<h3 className='text-white'>Agregar Catalogo</h3>):(<h3 className='text-white'>Editar Catalogo</h3>)}
          <br />

          <div className='col bg-light w-100 m-0 rounded p-3 h-50 overflow-auto'>
              {id==0 ? (<label></label> ):(<label># {id}</label> )}
            <form className="container-fluid d-flex flex-column align-items-center w-90" onSubmit={handleSubmit} style={{minWidth:'100px', maxWidth:'1000px' }}>
              <div  className='form-group d-flex flex-column w-100 align-items-center'>
                <label htmlFor="tipo">No.páginas</label>                
                <input className='form-control' type="number" name='pag' required value={data.pag} onChange={(e)=>setData({...data, pag: e.target.value})} placeholder='Ingresa no.pág'/>
                <br />
              </div>
              <div  className='form-group d-flex flex-column w-100 align-items-center'>
                <label htmlFor="tipo">Fecha_salida</label>                
                <input className='form-control' type="date" name='fecha' required value={data.fecha} onChange={(e)=>setData({...data, fecha: e.target.value})} placeholder='año-mes-día'/>
                <br />
              </div>
              <div  className='form-group d-flex flex-column w-100 align-items-center' key={'Button'}>
                {id==0 ? (<button type='submit' className='btn btn-primary' style={{backgroundColor: "#224A2F"}}>Agregar</button>)
                  :(<button type='submit' className='btn btn-primary m-1' style={{backgroundColor: "#224A2F"}}>Guardar</button>)}
                <Link className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} to={'/catTem'}>volver</Link>
              </div>
            </form>
        </div>


        </div>
        
      </div>
    </>
  )
}

export default EditCat