import axios from 'axios'
import React, { useEffect, useState } from 'react';
import {useNavigate, useParams, Link } from 'react-router-dom';
import NavBar from '../NavBar';
import Swal from 'sweetalert2';

function EditPlayeras() {
  const {id} = useParams();
  const [rol, setRol] = useState(null);
  const navigate = useNavigate();
  const [color, setColor] = useState([]);
  const [tipo, setTipo] = useState([]);
  const [talla, setTalla] = useState([]);
  const [data, setData] = useState({
    id:'',
    Cantidad_Disponible: '',
    Tipo:'',
    Talla:'',
    Color:''
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
        axios.get(`/get_pla/${id}`)
        .then((res)=>{
          setData(res.data);
          //console.log(res.data);
        })
        .catch((err)=>console.log(`error: ${err}`));
      }
      //Obtener colores de playera
        axios.get('/color')
        .then((res)=>{
          setColor(res.data[0])
          //console.log(res.data[0]);
        })
        .catch((err)=>console.log(`error: ${err}`));

        //Obtener tipo de playera
        axios.get('/tipo')
        .then((res)=>{
          setTipo(res.data[0])
          //console.log(res.data[0]);
        })
        .catch((err)=>console.log(`error: ${err}`));

        //Obtener talla de playera
        axios.get('/talla')
        .then((res)=>{
          setTalla(res.data[0])
          //console.log(res);
        })
        .catch((err)=>console.log(`error: ${err}`));
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
      //console.log(data);
      if(data.Color == 0 || data.Color == null){
        Swal.fire({
          icon: "error",
          title: "Debe seleccionar el color",
          width: 600,
          padding: "3em",
          color: "#716add",
              
        });
        //alert("Debe ingresar el costo")
        return;
      }
      
      if(data.Tipo == 0 || data. Tipo == null){
        Swal.fire({
          icon: "error",
          title: "Debe seleccionar un tipo",
          width: 600,
          padding: "3em",
          color: "#716add",
              
        });
        //alert("Debe ingresar el costo")
        return;
      }

      if(data.Talla == 0 || data.Talla == null){
        Swal.fire({
          icon: "error",
          title: "Debe seleccionar una talla",
          width: 600,
          padding: "3em",
          color: "#716add",
              
        });
        return;
      }
    
      if(id == 0){
      //Agregar tipo de playera
        //console.log(data);
        axios.post('/add_pla', data)
        .then((res) => {
            const result = res.data;
            if (result.message === 'Playera ya ingresada') {
                Swal.fire({
                    icon: "error",
                    title: "Esta playera ya está ingresada",
                    width: 600,
                    padding: "3em",
                    color: "#716add",
                });
            } else if(result.message === 'Playera ingresada exitosamente') {
                navigate('/playeras');
            }else{
              Swal.fire({
                icon: "error",
                title: "ERROR, Intenta de nuevo",
                width: 600,
                padding: "3em",
                color: "#716add",
            });
            }
        })
        .catch((err) => console.log(`Error: ${err}`));


    
        }else{
          //Si se necesita actualizar
          data.id = id;
          //console.log(data)
          axios.post(`/edit_pla`, data)
          .then((res)=>{
            console.log(res.data)
            const result = res.data;
            if (result.message === 'Playera ya ingresada') {
              Swal.fire({
                  icon: "error",
                  title: "Esta playera ya está ingresada",
                  width: 600,
                  padding: "3em",
                  color: "#716add",
              });
          } else if(result.message === 'Playera actualizada exitosamente') {
              navigate('/playeras');
          }else{
            Swal.fire({
              icon: "error",
              title: "ERROR, Intenta de nuevo",
              width: 600,
              padding: "3em",
              color: "#716add",
          });
          }
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
        {id==0 ? (<h3 className='text-white'>Agregar Playera Disponible</h3>):(<h3 className='text-white'>Editar Playera Disponible</h3>)}

        <div className='col bg-light w-100 m-0 rounded p-3 h-50 overflow-auto'>
          {id==0 ? (<label></label> ):(<label># {id}</label> )}
          <form className="container-fluid d-flex flex-column align-items-center w-90" onSubmit={handleSubmit} style={{minWidth:'100px', maxWidth:'1000px' }}>
            <div className='form-group d-flex flex-column w-100 align-items-center'>
                <label htmlFor="tipo">Color de playera</label>                            
                  <select className='form-select' name="Scolor" id="colorS" value={data.Id_Color_Play} onChange={(e)=>setData({...data, Color: e.target.value})}>
                      <option value="0" >Selecciona</option>
                        {color.map((color)=>{
                          return(
                            <option value={color.Id_Color_Play} key={color.Id_Color_Play}>{color.Des_Color_Play}</option>
                          );
                        })}
                   </select>
            </div>
            <div className='form-group d-flex flex-column w-100 align-items-center'>
              <label htmlFor="tipo">Tipo de playera</label>                
                <select className='form-select' name="Scolor" id="colorS" value={data.Id_TipoP} onChange={(e)=>setData({...data, Tipo: e.target.value})}>
                  <option value="0" >Selecciona</option>
                    {tipo.map((tip)=>{
                      return(
                        <option value={tip.Id_TipoP} key={tip.Id_TipoP}>{tip.Des_TipoP}</option>
                      );
                    })}
                </select>
            </div>
            <div className='form-group d-flex flex-column w-100 align-items-center'>
              <label htmlFor="tipo">Talla de playera</label>                
                <select className='form-select' name="Stalla" id="tallaS" value={data.Id_Talla} onChange={(e)=>setData({...data, Talla: e.target.value})}>
                  <option value="0" >Selecciona</option>
                    {talla.map((ta)=>{
                      return(
                        <option value={ta.Id_Talla} key={ta.Id_Talla}>{ta.Nom_Talla}</option>
                      );
                    })}
                </select>
            </div>
            <div className='form-group d-flex flex-column w-100 align-items-center'>
              <label htmlFor="tipo">Cantidad Existente</label>                
              <input className='form-control' type="text" name='cant' required value={data.Cantidad_Disponible} onChange={(e)=>setData({...data, Cantidad_Disponible: e.target.value})} placeholder='Ingresa cantidad'/>
            </div>
            <div  className='form-group d-flex justify-content-center w-100 align-items-center' key={'Button'}>
              {id==0 ? (<button  type='submit' className='btn btn-primary m-3'  style={{backgroundColor: "#224A2F"}}>Agregar</button>)
                :(<button type='submit' className='btn btn-primary m-3'  style={{backgroundColor: "#224A2F"}}>Guardar</button>)}
              <Link className='btn btn-primary m-3'  style={{backgroundColor: "#224A2F"}} to={'/playeras'}>volver</Link>
            </div>
          </form>
        </div>


      </div>

    </div>
  </>
  )
}

export default EditPlayeras