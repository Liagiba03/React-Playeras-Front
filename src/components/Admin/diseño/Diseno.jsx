import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NavBar from '../NavBar';
import Swal from 'sweetalert2';

function Diseno() {
  const [rol, setRol] = useState(null);
  const navigate = useNavigate();
  const [deletedDis, setDeletedDis] = useState(true);
  const [diseno, setDiseno] = useState([]);
  const [selectedDiseno, setSelectedDiseno] = useState(null);
  const [temporadasPorDiseno, setTemporadasPorDiseno] = useState({});

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
  }, [navigate]);
  // PARA OBTENER NOMBRE END

  // USE EFFECT DE VALIDACION INIT
  useEffect(() => {
    if (rol !== null) {
      if (rol !== 1) {
        navigate('/login');
      }
    }
  }, [rol, navigate]);
  // USE EFFECT DE VALIDACION END

  // MOSTRAR DISEÑOS
  useEffect(() => {
    if (deletedDis) {
      setDeletedDis(false);
      axios.get('/disenos')
        .then((res) => {
          const disenos = res.data;
          setDiseno(disenos);
          //console.log(res.data);

        // Para cada diseño, obtener sus temporadas
        disenos.forEach(d => {
          axios.get(`/get_temporadas_by_diseno/${d.Id_Diseño}`)
            .then((res) => {
              //console.log(res.data)
              setTemporadasPorDiseno(prevState => ({
                ...prevState,
                [d.Id_Diseño]: res.data[0].length > 0 ? res.data[0].map(t => t.Nombre_Temporada) : ["No asignada"]
              }));
            })
            .catch((err) => console.log(`Error al obtener temporadas: ${err}`));
        });


        })
        .catch((err) => console.log(`error: ${err}`));
    }
  }, [deletedDis]);

  // Manejar la eliminación del diseño
  const handleDelete = () => {
    if (selectedDiseno) {
      Swal.fire({
        title: `¿Seguro que deseas eliminar el diseño?`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        denyButtonText: `Mantener`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          //Eliminar
          axios.delete(`/delete-dis/${selectedDiseno}`)
          .then((res) => {
            setDeletedDis(true);
          })
          .catch((err) => console.log(`Error: ${err}`));

          Swal.fire("Eliminado!", "", "success");
        } else if (result.isDenied) {
          Swal.fire("No eliminado", "", "info");
          
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Debe seleccionar un diseño",
        width: 600,
        padding: "3em",
        color: "#716add",
      });
    }
  };

  // Manejar la edición del diseño
  const handleEdit = () => {
    if (selectedDiseno) {
      navigate(`/editDis/${selectedDiseno}`);
    } else {
      Swal.fire({
        icon: "error",
        title: "Debe seleccionar un diseño",
        width: 600,
        padding: "3em",
        color: "#716add",
      });
    }
  };

  if (rol === null) {
    return <div>Cargando...</div>; // Mostrar un mensaje de carga mientras se obtiene el rol
  }

  return (
    <>
      <div className=" d-flex justify-content-left  vh-100 vw-100 p-0 " style={{backgroundColor:'#243330'}}>
        <NavBar />
        
        <div className="container-fluid d-flex flex-column align-items-center m-0 p-3" style={{minWidth:'80px', minHeight:'300px', width:'100%', overflowY: 'auto', overflowX:'auto', backgroundColor:'#243330 ' }}>
          <h2 className='text-white'>Añadir/ Actualizar/Quitar diseños</h2>
          
            <div className='d-flex flex-wrap justify-content-center m-3 p3'>
            {diseno.map(dis => {
              return (
                <div className='card m-2 align-items-center justify-content-center' style={{ backgroundColor:'#D9D9D9', minWidth:'180px'}} key={dis.Id_Diseño}>
                  <input
                    type="radio"
                    name="selectedDiseno"
                    value={dis.Id_Diseño}
                    checked={selectedDiseno === dis.Id_Diseño}
                    onChange={() => setSelectedDiseno(dis.Id_Diseño)}
                  />
                  <img src={`http://localhost:5000/images/${dis.Diseño}`} alt="Imagen desde el servidor" width="200" height="200" />
                  <p>Nombre: {dis.Nombre_Diseno}</p>
                  <p>Color de diseño: {dis.Id_Color}</p>
                  <p>Catálogo no: {dis.Id_Catalogo}</p>
                  <p>Página: {dis.No_Pagina}</p>
                  <p>Descripción: {dis.Des_Diseño}</p>
                  <p>Temporadas: {temporadasPorDiseno[dis.Id_Diseño] ? temporadasPorDiseno[dis.Id_Diseño].join(', ') : "Cargando..."}</p>
                </div>
              );
            })}
            </div>

          <div className="buttons">
            <Link  className='btn btn-primary m-3' to={`/editDis/0`} style={{backgroundColor:'#204437'}}>Nuevo</Link>
            <button className='btn btn-primary m-3' style={{backgroundColor:'#204437'}} onClick={handleEdit}>Editar</button>
            <button className='btn btn-primary m-3' style={{backgroundColor:'#204437'}} onClick={handleDelete}>Eliminar</button>
            <Link className='btn btn-primary m-3' to={`/inicio`} style={{backgroundColor:'#204437'}}>Volver</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Diseno;
