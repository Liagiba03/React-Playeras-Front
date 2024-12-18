    import axios from 'axios'
    import React, { useEffect, useState } from 'react';
    import {useNavigate, useParams, Link } from 'react-router-dom';
    import NavBar from '../NavBar';
    import Swal from 'sweetalert2';

    function EditDis() {
        const {id} = useParams();
        const [rol, setRol] = useState(null);
        const navigate = useNavigate();
        const [catalogo, setCatalogo] = useState([]);
        const [catSeleccionado, setCatSeleccionado] = useState(null);
        const [color, setColor] = useState([]);
        const [paginasDisponibles, setPaginasDisponibles] = useState([]);
        const [preview, setPreview] = useState(null);
        const [imageFile, setImageFile] = useState(null);
        const [temporadas, setTemporadas] = useState([]);
        const [selectedTemporadas, setSelectedTemporadas] = useState([]);
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        const MAX_BLOB_SIZE = 16 * 1024 * 1024; // 16MB for mediumblob
        const [data, setData] = useState({
        id:'',
        Nombre_Diseno: '',
        Diseño:'',
        Des_Diseño: '',
        Id_Catalogo: '',
        No_Pagina:'',
        Id_Color:'',
        Tipo_imagen: ''
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
    
            if(id !== 0){
            //Para obtener los valores para editar , en caso id !0
            axios.get(`/get_dis/${id}`)
            .then((res)=>{
                const designData = res.data[0][0]; // Accede al primer elemento del primer array
                setData({
                    id: designData.Id_Diseño,
                    Nombre_Diseno: designData.Nombre_Diseno,
                    Diseño: designData.Diseño,
                    Des_Diseño: designData.Des_Diseño,
                    Id_Catalogo: designData.Id_Catalogo.toString(),
                    No_Pagina: designData.No_Pagina.toString(),
                    Id_Color: designData.Id_Color,
                    Tipo_imagen: designData.Tipo_imagen
                });
                setCatSeleccionado(designData.Id_Catalogo.toString());
                //console.log(res.data[0][0])
            })
            .catch((err)=>console.log(`error: ${err}`));

            // Obtener las temporadas del diseño
            axios.get(`/get_temporadas_by_diseno/${id}`)
                .then((res) => {
                    setSelectedTemporadas(res.data[0].map(t => t.Id_Temporada));
                    //console.log(res.data[0])
                })
                .catch((err) => console.log(`error: ${err}`));

            }
            //Obtener las páginas disponibles
            axios.get('/colorDis')
            .then((res)=>{
            setColor(res.data)
            //console.log(res.data[0]);
            })
            .catch((err)=>console.log(`error: ${err}`));

            //Obtener colores de playera
            axios.get('/catalogo')
            .then((res)=>{
            setCatalogo(res.data[0])
            //console.log(res.data[0]);
            })
            .catch((err)=>console.log(`error: ${err}`));
        
            //Obtener temporadas
            axios.get('/temporadas')
            .then((res) => {
                setTemporadas(res.data);
                //console.log(res.data)
            })
            .catch((err) => console.log(`error: ${err}`));
            
    
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


        //USE EFFECT DE OBTENER PAGINAS DISPONIBLES INIT
        useEffect(() => {
            if (data.Id_Catalogo !== "0") {
            const catalogoSeleccionado = catalogo.find(cat => cat.id.toString() === data.Id_Catalogo);
            if (catalogoSeleccionado) {
                const totalPaginas = catalogoSeleccionado.pag;
                axios.get(`/get_paginas_disponibles/${data.Id_Catalogo}`)
                .then((res) => {
                    let paginasUsadas = [];
                        paginasUsadas = res.data[0].map(pagina => Number(pagina.No_Pagina));
                    const todasLasPaginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);
                    let paginasLibres = todasLasPaginas.filter(pagina => !paginasUsadas.includes(pagina));
                    // Excluir el número almacenado en data.No_Pagina
                    if (data.No_Pagina  && catSeleccionado === data.Id_Catalogo) {
                        //console.log('Entrada')
                        paginasLibres.push(parseInt(data.No_Pagina, 10));
                    }
                    setPaginasDisponibles(paginasLibres);
                })
                .catch((err) => console.log(`Error: ${err}`));
            }
            } else {
            setPaginasDisponibles([]);
            }
        }, [data.Id_Catalogo, data.No_Pagina, catalogo]);
    //USE EFFECT DE OBTENER PAGINAS DISPONIBLES END

        //CAMBIAR LOS DATOS DE LAS TEMPORADAS
        const handleSeasonChange = (evt) => {
            const { value, checked } = evt.target;
            if (checked) {
                setSelectedTemporadas([...selectedTemporadas, parseInt(value, 10)]);
            } else {
                setSelectedTemporadas(selectedTemporadas.filter(t => t !== parseInt(value, 10)));
            }
            //console.log(selectedTemporadas);
        };


        //ENVIAR LOS DATOS INIT
        const handleSubmit = (evt) =>{
            evt.preventDefault();
    
            if(!data.Nombre_Diseno.trim()){
            Swal.fire({
                icon: "error",
                title: "Debe ingresar el nombre del diseño",
                width: 600,
                padding: "3em",
                color: "#716add",
                });
            return;
            }
            if(data.Id_Catalogo == 0 || data.Id_Catalogo == null){
                Swal.fire({
                    icon: "error",
                    title: "Debe seleccionar un catalogo",
                    width: 600,
                    padding: "3em",
                    color: "#716add",
                });
                return;
            }
            //console.log(data.No_Pagina)
            if(data.No_Pagina == 0 || data.No_Pagina == ""){
                Swal.fire({
                    icon: "error",
                    title: "Debe seleccionar un número de página",
                    width: 600,
                    padding: "3em",
                    color: "#716add",
                });
                return;
            }
            if(!data.Des_Diseño.trim()){
                Swal.fire({
                    icon: "error",
                    title: "Debe ingresar una descripción del diseño",
                    width: 600,
                    padding: "3em",
                    color: "#716add",
                });
                return;
            }
            if(data.Id_Color == 0 || data.Id_Color == null){
                Swal.fire({
                    icon: "error",
                    title: "Debe seleccionar un color de diseño",
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
            formData.append('Nombre_Diseno', data.Nombre_Diseno);
            formData.append('Des_Diseno', data.Des_Diseño);
            formData.append('Id_Catalogo', data.Id_Catalogo);
            formData.append('No_Pagina', data.No_Pagina);
            formData.append('Id_Color', data.Id_Color);
            formData.append('temporadas', JSON.stringify(selectedTemporadas));
            //console.log(JSON.stringify(selectedTemporadas));
            if (imageFile) {
                formData.append('Diseno', imageFile);
                formData.append('Tipo_imagen', imageFile.type);
            }else{
                formData.append('Diseno', '');
            }


            if(id == 0){
            //Agregar tipo de playera
            //console.log('Añadir')
            axios.post('/add_dis', formData)
            .then((res)=>{
                navigate('/diseno');
                //console.log(res);
            })
            .catch((err)=>console.log(`Error: ${err}`));
    
            }else{
            //Si se necesita actualizar
            //console.log(data)
            axios.post(`/edit_dis`, formData)
            .then((res)=>{
                
                navigate('/diseno')
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
            {id==0 ? (<h2 className='text-white'>Añadir Diseño</h2>):(<h2 className='text-white'>Actualizar Diseño</h2>)}

            <div className='col bg-light w-100 m-0 rounded p-3 h-50 overflow-auto'>
                <form className="container-fluid d-flex flex-column align-items-center w-90" onSubmit={handleSubmit} style={{minWidth:'100px', maxWidth:'1000px' }}>
                    <div className='form-group d-flex flex-column w-100 align-items-center'>
                        {preview ? (
                            <img  src={preview} alt="Vista previa" width="200" height="200" />
                        ) : (
                            data.Diseño ? (
                                <img src={`http://localhost:5000/images/${data.Diseño}`} alt="Imagen desde el servidor" width="200" height="200" />
                            ) : (
                                ''
                            )
                        )}
                        <input className='form-control' type="file" name='txtFile' accept="image/jpeg, image/png" onChange={handleImageChange} />
                    </div>
                    <div className='form-group d-flex flex-column w-100'>
                        <label htmlFor="tipo">Nombre de diseño</label>                
                        <input  className='form-control' type="text" name='temp' required value={data.Nombre_Diseno} onChange={(e)=>setData({...data, Nombre_Diseno: e.target.value})} placeholder='Ingresa nombre'/>
                    </div>
                    <div className='form-group d-flex flex-column w-100'>
                        <label htmlFor="Scolor">Catalogo</label>                            
                        <select  className='form-select' name="Scolor" id="colorS" required value={data.Id_Catalogo} onChange={(e)=>setData({...data, Id_Catalogo: e.target.value})}>
                        <option value="0" >Selecciona</option>
                        {catalogo.map((cat)=>{
                            return(
                                <option value={cat.id} key={cat.id}>{cat.id}</option>
                            );
                        })}
                        </select>
                    </div>
                    <div className='form-group d-flex flex-column w-100'>
                        <label htmlFor="Pcolor">Número de página</label>                            
                        <select  className='form-select' name="Pcolor" id="colorP" required value={catSeleccionado === data.Id_Catalogo ?(data.No_Pagina):(null)} onChange={(e)=>setData({...data, No_Pagina: e.target.value})}>
                        <option value="0" >Selecciona</option>
                        {paginasDisponibles.map((pagina)=>{
                            return(
                                <option value={pagina} key={pagina}>{pagina}</option>
                            );
                        })}
                        </select>
                    </div>
                    <div className='form-group d-flex flex-column w-100'>
                        <label htmlFor="tipo">Descripción</label>                
                        <input className='form-control' type="text" name='des' required value={data.Des_Diseño} onChange={(e)=>setData({...data, Des_Diseño: e.target.value})} placeholder='Escribe Descripción'/>
                    </div>

                    <div className='form-group d-flex flex-column w-100'>
                        <label htmlFor="tipo">Color de diseño</label>
                        <select  className='form-select' name="Dcolor" id="colorD" value={data.Id_Color} onChange={(e)=>setData({...data, Id_Color: e.target.value})}>
                        <option value="0">Selecciona</option>
                        {Object.keys(color).map((key) => (
                            <option value={color[key].Id_Color} key={color[key].Id_Color}>{color[key].Des_Color}</option>
                        ))}
                        </select>
                    </div>

                    <div className='form-group d-flex flex-column w-100'>
                        <label>Temporadas</label>
                        {temporadas.map(temp => (
                            <div key={temp.Id_Temporada} >
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value={temp.Id_Temporada}
                                    id={`temp${temp.Id_Temporada}`}
                                    checked={selectedTemporadas.includes(temp.Id_Temporada)}
                                    onChange={handleSeasonChange}
                                />
                                <label className="form-check-label" htmlFor={`temp${temp.Id_Temporada}`}>
                                    {temp.Nombre_Temporada}
                                </label>
                            </div>
                        ))}
                    </div>
                
                <div className='form-group d-flex flex-column w-100' key={'Button'}>
                {id==0 ? (<button type='submit' className='btn btn-success'>Agregar</button>)
                :(<button className='btn btn-primary m-1' style={{backgroundColor:'#204437'}}>Guardar</button>)}
                <Link className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} to={'/diseno'}>volver</Link>
                </div>
            </form>
            </div>


            </div>
            
        </div>
        </>
    )
    }

    export default EditDis