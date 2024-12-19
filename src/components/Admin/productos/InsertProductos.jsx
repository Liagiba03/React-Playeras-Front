import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NavBar from '../NavBar';
import Swal from 'sweetalert2';
import SelectWithImages from './SelectWithImages';  // Asegúrate de ajustar la ruta según tu estructura de proyecto

function InsertProductos() {
  const [rol, setRol] = useState(null);
  const navigate = useNavigate();
  const [playeras, setPlayeras] = useState([]);
  const [diseno, setDiseno] = useState([]);
  const [data, setData] = useState({
    id: '',
    diseno: '',
    playera: '',
    Des_Producto: '',
    Precio: ''

  });

  // PARA OBTENER NOMBRE INIT
  useEffect(() => {
    axios.get('http://localhost:5000', { withCredentials: true })
      .then((res) => {
        if (res.data.valid) {
          setRol(res.data.IdRol);
        } else {
          navigate('/login');
        }
      })
      .catch((err) => console.log(`Error en home${err}`));

    //CONSULTAR LAS PLAYERAS DISPONIBLES
    axios.get('/playeras')
      .then((res) => {
        setPlayeras(res.data[0]);
      })
      .catch((err) => console.log(`error: ${err}`));

    axios.get('/disenos')
      .then((res) => {
        const disenos = res.data;
        setDiseno(disenos);
        //console.log(disenos)
      })
      .catch((err) => console.log(`error: ${err}`));

  }, [navigate]);
  // PARA OBTENER NOMBRE END

  //USE EFFECT DE VALIDACION INIT
  useEffect(() => {
    if (rol !== null) {
      if (rol !== 1) {
        navigate('/login');
      }
    }
  }, [rol, navigate]);
  //USE EFFECT DE VALIDACION END

  //ENVIAR LOS DATOS INIT
  const handleSubmit = (evt) => {
    evt.preventDefault();

    if (data.diseno==0) {
      Swal.fire({
        icon: "error",
        title: "Debe seleccionar un diseño",
        width: 600,
        padding: "3em",
        color: "#716add",
      });
      return;
    }
    if (data.playera==="" || data.playera== null) {
      Swal.fire({
        icon: "error",
        title: "Debe seleccionar una playera",
        width: 600,
        padding: "3em",
        color: "#716add",
      });
      return;
    }
    if(!data.Des_Producto.trim()){
      Swal.fire({
          icon: "error",
          title: "Debe ingresar una descripción",
          width: 600,
          padding: "3em",
          color: "#716add",
        
        });
      //alert("Debe ingresar el costo")
      return;
    }
    if(!data.Precio || isNaN(data.Precio) || data.Precio <= 0){
      Swal.fire({
          icon: "error",
          title: "Debe ingresar un precio válido",
          width: 600,
          padding: "3em",
          color: "#716add",
        
        });
      //alert("Debe ingresar el costo")
      return;
    }

    //Agregar producto
        console.log(data);
        
       axios.post('/add_producto', data)
        .then((res) => {
            const result = res.data;
            console.log(res.data)
            if (result.message === 'Producto ya ingresado') {
                Swal.fire({
                    icon: "error",
                    title: "Este prodcuto ya está ingresado",
                    width: 600,
                    padding: "3em",
                    color: "#716add",
                });
            } else if(result.message === 'Producto ingresado exitosamente') {
                navigate('/productos');
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

  }
  //ENVIAR LOS DATOS END

  //VERIFICACION DE CARGADO INIT
  if (rol === null) {
    return <div>Cargando...</div>; // Mostrar un mensaje de carga mientras se obtiene el rol
  }
  //VERIFICACION DE CARGADO END

  const handleDisenoChange = (value) => {
    setData({ ...data, diseno: value });
  };
  //Generar el folio
  const handleFolioGenerate = () => {
    const timestamp = Date.now().toString(36); // Convertir el timestamp a base 36
    const randomStr = Math.random().toString(36).substring(2, 8); // Generar una cadena aleatoria
    const folio = (timestamp + randomStr).substring(0, 10).toUpperCase(); // Concatenar y tomar los primeros 10 caracteres
    setData({ ...data, id: folio });
  };

  return (
    <>
      <div className=" d-flex justify-content-left vh-100 vw-100 p-0 " >
        <NavBar />
      
        <div className="d-flex flex-column align-items-center m-0 p-3 " style={{minWidth:'80px', minHeight:'300px', width:'100%', overflowY: 'auto', overflowX:'auto', backgroundColor:'#243330 ' }}>
          <h2 className='text-white'>Productos</h2>
          <h3 className='text-white'>Agregar Producto</h3>
          
          <div className='col bg-light w-100 m-0 rounded p-3 h-50 overflow-auto'>
          <form className="container-fluid d-flex flex-column align-items-center w-90" onSubmit={handleSubmit} style={{minWidth:'100px', maxWidth:'1000px' }}>
          <div className='form-group d-flex flex-column w-100 align-items-center'>
              <label htmlFor="id">Folio</label>
              <input className='form-control' type="text" name='id' required value={data.id} onChange={(e) => setData({ ...data, id: e.target.value })} placeholder='Ingresa el folio' />
              <button className='btn btn-primary m-3'  style={{backgroundColor: "#224A2F"}} type="button" onClick={handleFolioGenerate}>Generar</button>
            </div>

            <div className='form-group d-flex flex-column w-100 align-items-center overflow-auto'>
              <label htmlFor="dise">Diseños: </label>
              {diseno.length > 0 ? (
                <SelectWithImages
                  options={diseno.map((dis) => ({ label: dis.Nombre_Diseno, value: dis.Id_Diseño, image: dis.Diseño }))}
                  onChange={handleDisenoChange}
                />
              ) : (
                <div>Cargando diseños...</div>
              )}
            </div>

            <div className='form-group d-flex flex-column w-100 align-items-center'>
              <label htmlFor="pla">Playeras disponibles: </label>
              <select className='form-select' name="pla" id="pla" required defaultValue={0} onChange={(e) => setData({ ...data, playera: e.target.value })}>
                <option value="0">Selecciona</option>
                {playeras.map((playera) => {
                  return (
                    <option value={playera.Id} key={playera.Id}>{playera.Color} - {playera.Tipo} - {playera.Talla}</option>
                  );
                })}
              </select>
            </div>

            <div className='form-group d-flex flex-column w-100 align-items-center'>
              <label htmlFor="des">Descripción de producto</label>
              <input className='form-control' type="text" name='des' required onChange={(e) => setData({ ...data, Des_Producto: e.target.value })} placeholder='Ingresa descripción' />
            </div>

            <div className='form-group d-flex flex-column w-100 align-items-center'>
              <label htmlFor="pre">Precio</label>
              <input className='form-control' type="number" name='pre' required onChange={(e) => setData({ ...data, Precio: parseFloat(e.target.value) })} placeholder='Ingresa precio' />
            </div>

            <div className='form-group d-flex justify-content-center w-100 align-items-center'>
              <button className='btn btn-primary m-3'  style={{backgroundColor: "#224A2F"}} type='submit'>Agregar</button>
              <Link className='btn btn-primary m-3'  style={{backgroundColor: "#224A2F"}} to={'/productos'}>volver</Link>
            </div>
          </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default InsertProductos;
