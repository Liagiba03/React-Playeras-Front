import axios from 'axios'
import React, { useEffect, useState } from 'react';
import {useNavigate, useParams, Link } from 'react-router-dom';
import NavBar from '../NavBar';
import Swal from 'sweetalert2';

function EditTalla() {
  const {id} = useParams();
  const [rol, setRol] = useState(null);
  const navigate = useNavigate();
  const [data, setData] = useState({
    id:'',
    Nom_Talla: '',
    Medidas:''
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
        axios.get(`/get_talla/${id}`)
        .then((res)=>{
          setData(res.data);
          //console.log(res.data)
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
    
      if(!data.Nom_Talla.trim()){
        Swal.fire({
          icon: "error",
          title: "Debe ingresar la talla",
          width: 600,
          padding: "3em",
          color: "#716add",
              
        });
        //alert("Debe ingresar el costo")
        return;
      }
      if(!data.Medidas.trim()){
        Swal.fire({
          icon: "error",
          title: "Debe ingresar una descripción de medidas",
          width: 600,
          padding: "3em",
          color: "#716add",
              
        });
        //alert("Debe ingresar el costo")
        return;
      }
    
      if(id == 0){
      //Agregar tipo de playera
            
        axios.post('/add_talla', data)
        .then((res)=>{
          navigate('/playeras');
          console.log(res);
        })
        .catch((err)=>console.log(`Error: ${err}`)); 
    
        }else{
          //Si se necesita actualizar
          data.id = id;
          //console.log(data)
          axios.post(`/edit_talla`, data)
          .then((res)=>{
              
            navigate('/playeras')
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
    <div className='d-flex justify-content-left vh-100 p-0 m-0'>
      <NavBar />
      
      <div className="d-flex flex-column align-items-center m-0 p-3 " style={{minWidth:'80px', minHeight:'300px', width:'100%', overflowY: 'auto', overflowX:'auto', backgroundColor:'#243330 ' }}>
        <h2 className='text-white'>Playeras - Características</h2>
        {id==0 ? (<h3 className='text-white'>Agregar Talla Playera</h3>):(<h3 className='text-white'>Editar Talla Playera</h3>)}

        <div className='col bg-light w-100 m-0 rounded p-3 h-50 overflow-auto'>
          {id==0 ? (<label></label> ):(<label className='text-black'># {id}</label> )}
          <form className="container-fluid d-flex flex-column align-items-center w-90" onSubmit={handleSubmit} style={{minWidth:'100px', maxWidth:'1000px' }}>
            <div className='form-group d-flex flex-column w-100 align-items-center'>
              <label htmlFor="tipo">Talla de playera</label>                
              <input className='form-control' type="text" name='name' required value={data.Nom_Talla} onChange={(e)=>setData({...data, Nom_Talla: e.target.value})} placeholder='Ingresa talla'/>
            </div>
            <div className='form-group d-flex flex-column w-100 align-items-center'>
              <label htmlFor="tipo">Descripción de medidas</label>                
              <input className='form-control' type="text" name='des' required value={data.Medidas} onChange={(e)=>setData({...data, Medidas: e.target.value})} placeholder='Ingresa una descripción'/>
            </div>
            <div className='form-group d-flex justify-content-center w-100 align-items-center' key={'Button'}>
              {id==0 ? (<button type='submit' className='btn btn-primary m-3' style={{backgroundColor: "#224A2F"}}>Agregar</button>)
                  :(<button type='submit' className='btn btn-primary m-3' style={{backgroundColor: "#224A2F"}}>Guardar</button>)}
                <Link className='btn btn-primary m-3' style={{backgroundColor: "#224A2F"}} to={'/playeras'}>volver</Link>
            </div>
          </form>
      </div>

      </div>

    </div>
  </>
  )
}

export default EditTalla