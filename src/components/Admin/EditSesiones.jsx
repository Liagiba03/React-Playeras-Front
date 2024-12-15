import axios from 'axios'
import React, { useEffect, useState } from 'react';
import {useNavigate, useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import NavBar from './NavBar';

function EditSesiones() {
  const {id} = useParams();
  const [rol, setRol] = useState(null);
  const navigate = useNavigate();
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_BLOB_SIZE = 16 * 1024 * 1024; // 16MB for mediumblob
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [rolUser, setRolUser] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    id:'',
    Nombre: '',
    Apellido1:'',
    Contrasenia: '',
    Foto:'',
    IdRol:''
  });

  // Función para manejar la selección de archivos
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    //console.log(file)
    if (file) {
        if (file.size > MAX_FILE_SIZE) {
            Swal.fire({
                icon: "error",
                title: "Archivo demasiado grande",
                text: "Por favor, seleccione una imagen de menos de 5MB",
                width: 600,
                padding: "3em",
                color: "#716add",
            });
            return;
        }
        if (file.type === 'image/jpeg' || file.type === 'image/png') {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                //console.log(`Tamaño del dato base64: ${base64String.length} bytes`);
                if (base64String.length > MAX_BLOB_SIZE) {
                    Swal.fire({
                        icon: "error",
                        title: "Imagen demasiado grande",
                        text: "La imagen convertida es demasiado grande para almacenar.",
                        width: 600,
                        padding: "3em",
                        color: "#716add",
                    });
                    return;
                }
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            Swal.fire({
                icon: "error",
                title: "Formato no válido",
                text: "Por favor, seleccione una imagen en formato jpg o png",
                width: 600,
                padding: "3em",
                color: "#716add",
            });
        }
    }
};

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
      axios.get(`/get_sesion/${id}`)
      .then((res)=>{
        //console.log(res.data[0])
        const designData = res.data[0];
        setData({
          id: designData.Id_Usuario,
          Nombre : designData.Nombre,
          Apellido1:designData.Apellido1,
          Contrasenia: designData.Contrasenia,
          IdRol:designData.IdRol,
          Foto:designData.Foto
        });
        //console.log(res.data[0])
      })
      .catch((err)=>console.log(`error: ${err}`));
    }

    axios.get('/get-roles')
      .then((res)=>{
        setRolUser(res.data);
        //console.log(res.data)
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

    if(!data.Nombre.trim()){
      Swal.fire({
          icon: "error",
          title: "Debe ingresar el nombre",
          width: 600,
          padding: "3em",
          color: "#716add",
        
        });
      //alert("Debe ingresar el costo")
      return;
    }
    if(!data.Apellido1.trim()){
      Swal.fire({
          icon: "error",
          title: "Debe ingresar el apellido",
          width: 600,
          padding: "3em",
          color: "#716add",
        
        });
      //alert("Debe ingresar el costo")
      return;
    }
    if(!data.Contrasenia.trim() && id ==0){
      Swal.fire({
          icon: "error",
          title: "Debe ingresar una contraseña válida",
          width: 600,
          padding: "3em",
          color: "#716add",
        
        });
      //alert("Debe ingresar el costo")
      return;
    }
    if(data.IdRol == 0 || data.IdRol == null){
      Swal.fire({
          icon: "error",
          title: "Debe seleccionar un rol",
          width: 600,
          padding: "3em",
          color: "#716add",
      });
      return;
  }
    if (!imageFile && id==0) {
      Swal.fire({
          icon: "error",
          title: "Debe seleccionar una imagen",
          width: 600,
          padding: "3em",
          color: "#716add",
      });
      return;
  }

  const formData = new FormData();
  formData.append('id', id);
  formData.append('Nombre', data.Nombre);
  formData.append('Apellido1', data.Apellido1);
  formData.append('Contrasenia', data.Contrasenia);
  formData.append('IdRol', data.IdRol);
  if (imageFile) {
    formData.append('Foto', imageFile);
  }else{
    formData.append('Foto', '');
  }
  //console.log(formData)

    if(id == '0'){
      //Agregar tipo de playera
      
      axios.post('/add_sesion', formData)
      .then((res)=>{
          navigate('/sesiones');
          //console.log(res);
      })
      .catch((err)=>console.log(`Error: ${err}`)); 

    }else{
      //Si se necesita actualizar
      //console.log(data)
      axios.post(`/edit_sesion`, formData)
      .then((res)=>{
        
          navigate('/sesiones')
          //console.log(res)
      })
      .catch((err)=>console.log(`Error en Edit: ${err}`));
    }
  }
  //ENVIAR LOS DATOS END

  // Función para alternar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
          <h2 className='text-white'>Sesiones</h2>
          {id==0 ? (<h3 className='text-white'>Agregar Usuario</h3>):(<h3 className='text-white'>Editar Usuario</h3>)}


        <div className='col bg-light w-100 m-0 rounded p-3 h-50 overflow-auto'>
        {id==0 ? (<label></label> ):(<label># {id}</label> )}
        <form className="container-fluid d-flex flex-column align-items-center w-90" onSubmit={handleSubmit} style={{minWidth:'100px', maxWidth:'1000px' }}>
          <div className='form-group d-flex flex-column w-100 align-items-center'>
            {preview ? (
              <img src={preview} alt="Vista previa" width="200" height="200" />
                ) : (
                  data.Foto ? (
                    <img src={`http://localhost:5000/images/${data.Foto}`} alt="Imagen desde el servidor" width="200" height="200" />
                  ) : (
                    ''
                  )
                )}
            <input className='form-control' type="file" name='txtFile' accept="image/jpeg, image/png" onChange={handleImageChange} />
          </div>
          <div className='form-group d-flex flex-column w-100 align-items-center'>
              <label htmlFor="nom">Nombre</label>                
              <input className='form-control' type="text" name='nom' required value={data.Nombre} onChange={(e)=>setData({...data, Nombre: e.target.value})} placeholder='Ingresa el nombre'/>
          </div>
          <div className='form-group d-flex flex-column w-100 align-items-center'>
              <label htmlFor="ape">Apellido</label>                
              <input className='form-control' type="text" name='ape' required value={data.Apellido1} onChange={(e)=>setData({...data, Apellido1: e.target.value})} placeholder='Ingresa el apellido'/>
          </div>
          <div className='form-group d-flex flex-column w-100 align-items-center'>
              <label htmlFor="com">Ingresa una nueva contraseña</label>
              <div className='form-group d-flex flex-column w-100 align-items-center'>
                <input className='form-control' type={showPassword ? "text" : "password"} name='com' required={id === '0'} onChange={(e)=>setData({...data, Contrasenia: e.target.value})} placeholder='Contraseña'/>
                <button className='btn btn-primary m-3'  style={{backgroundColor: "#224A2F"}} type="button" onClick={togglePasswordVisibility}>{showPassword ? "Ocultar" : "Mostrar"}</button>
              </div>
          </div>
          <div className='form-group d-flex flex-column w-100 align-items-center'>
            <label htmlFor="rol">Rol</label>                            
            <select className='form-select' name="rol" id="rol" value={data.IdRol} onChange={(e)=>setData({...data, IdRol: e.target.value})}>
              <option value="0" >Selecciona</option>
              {rolUser.map((color)=>{
                  return(
                      <option value={color.IdRol} key={color.IdRol}>{color.Rol}</option>
                  );
              })}
            </select>
        </div>
          <div className='form-group d-flex justify-content-center w-100 align-items-center' key={'Button'}>
          {id==0 ? (<button type='submit' className='btn btn-primary m-3'  style={{backgroundColor: "#224A2F"}}>Agregar</button>)
          :(<button className='btn btn-primary m-3'  style={{backgroundColor: "#224A2F"}} type='submit'>Guardar</button>)}
          <Link className='btn btn-primary m-3'  style={{backgroundColor: "#224A2F"}} to={'/sesiones'}>volver</Link>
          </div>
        </form>
        </div>


        </div>

        
      </div>
    </>
  )
}

export default EditSesiones