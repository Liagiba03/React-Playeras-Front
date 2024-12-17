import axios from 'axios'
import React, { useEffect, useState } from 'react';
import {useNavigate, useParams, Link } from 'react-router-dom';
import NavBar from '../NavBar';
import Swal from 'sweetalert2';

function EditComprador() {
  const {id} = useParams();
  const [rol, setRol] = useState(null);
  const navigate = useNavigate();
  const [data, setData] = useState({
    id: ' ',
    Nombre_Usuario: ' ',
    telefono: ' '
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

    if(id !== '0'){
      //Para obtener los valores para editar
      axios.get(`/get_user/${id}`)
      .then((res)=>{
        setData(res.data[0][0]);
        console.log(res.data[0][0])
        
      })
      .catch((err)=>console.log(`error: ${err}`));
    }

  },[navigate, id]);
  // PARA OBTENER NOMBRE END

  //ENVIAR LOS DATOS INIT
  const handleSubmit = (evt) =>{
    evt.preventDefault();

    if(!data.Nombre_Usuario.trim()){
      Swal.fire({
          icon: "error",
          title: "Debe ingresar el nombre del usuario",
          width: 600,
          padding: "3em",
          color: "#716add",
        
        });
      //alert("Debe ingresar el costo")
      return;
    }

    if(!data.telefono.trim() || data.telefono.length !== 10){
      Swal.fire({
          icon: "error",
          title: "Debe ingresar el telefono corectamente",
          width: 600,
          padding: "3em",
          color: "#716add",
        
        });
      //alert("Debe ingresar el costo")
      return;
    }

    if(id == "0"){
      //Agregar comprador
      
      axios.post('/add_comprador', data)
      .then((res)=>{
        if(rol===2){
          navigate('/seleccionarPago');
        }else{
          navigate('/comprador');
        }
          //console.log(res);
      })
      .catch((err)=>console.log(`Error: ${err}`)); 

    }else{
      //Si se necesita actualizar
      //console.log(data)
      axios.post(`/edit_comprador`, data)
      .then((res)=>{
        
          navigate('/comprador')
          console.log(res)
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
      <div className='d-flex justify-content-left vh-100 p-0 m-0'>
      {rol==1? (
        <>
        <NavBar /> 
        </>
        ):('')}
        

        <div className="d-flex flex-column align-items-center m-0 p-3 " style={{minWidth:'80px', minHeight:'300px', width:'100%', overflowY: 'auto', overflowX:'auto', backgroundColor:'#243330 ' }}>
          {id==0 ? (<h3 className='text-white'>Agregar Comprador</h3>):(<h3  className='text-white'>Editar Comprador</h3>)}
          <br />
          <h2  className='text-white'>Playeras - Características</h2>
          <br />

          <div className='col bg-light w-100 m-0 rounded p-3 h-50 overflow-auto'>
            {id==0 ? (<label></label> ):(<label># {id}</label> )}
            <form className="container-fluid d-flex flex-column align-items-center w-90" onSubmit={handleSubmit} style={{minWidth:'100px', maxWidth:'1000px' }}>
              <div className='form-group d-flex flex-column w-100 align-items-center'>
                <label htmlFor="name">Nombre</label>                
                <input className='form-control' type="text" name='name' required value={data.Nombre_Usuario} onChange={(e)=>setData({...data, Nombre_Usuario: e.target.value})} placeholder='Ingresa nombre'/>
              </div>
              <div className='form-group d-flex flex-column w-100 align-items-center'>
                <label htmlFor="telefono">Telefono</label>                
                <input className='form-control' type="number" name='telefono' required value={data.telefono} onChange={(e)=>setData({...data, telefono: e.target.value})} placeholder='Ingresa telefono'/>
                <br />
              </div>
              <div className='form-group d-flex justify-content-center w-100 align-items-center' key={'Button'}>
                {id==0 ? (<button type='submit' className='btn btn-primary m-3'  style={{backgroundColor: "#224A2F"}}>Agregar</button>)
                  :(<button  type='submit' className='btn btn-primary m-3'  style={{backgroundColor: "#224A2F"}}>Guardar</button>)}
                <Link className='btn btn-primary m-3'  style={{backgroundColor: "#224A2F"}} to={'/comprador'}>volver</Link>
              </div>
            </form>
        </div>

        </div>

        
      </div>
    </>
  )
}

export default EditComprador