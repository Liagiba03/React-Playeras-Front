import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import NavBar from '../../Admin/NavBar';
import Swal from 'sweetalert2';
import SelectWithImages from '../../Admin/productos/SelectWithImages';

function NuevaVenta() {
  const { id } = useParams();
  const [rol, setRol] = useState(null);
  const navigate = useNavigate();
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
      .catch((err) => console.log(`Error en home: ${err}`));
  }, [navigate, rol]);
  // PARA OBTENER NOMBRE END

  // MOSTRAR DISEÑOS
  useEffect(() => {
    axios.get('/disenos_vender')
      .then((res) => {
        const disenos = res.data;
        setDiseno(disenos);
      })
      .catch((err) => console.log(`error: ${err}`));
  }, []);

  //CAMBIO DEL DISEÑO
  const handleDisenoChange = (value) => {
    setData({ ...data, diseno: value });
  };

  // Función para manejar el clic en el botón "SIGUIENTE"
  const handleNext = () => {
    if (!data.diseno) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debes seleccionar un diseño antes de continuar!',
      });
    } else {
      navigate(`/elejirPlayera/${data.diseno}`);
    }
  };

  // VERIFICACION DE CARGADO INIT
  if (rol === null) {
    return <div>Cargando...</div>; // Mostrar un mensaje de carga mientras se obtiene el rol
  }
  // VERIFICACION DE CARGADO END

  return (
    <>
      <div className=" d-flex justify-content-left vh-100 vw-100 p-0 " >
        <NavBar />
        

        <div className="container-fluid d-flex flex-column align-items-center m-0 p-3 " style={{minWidth:'400px', minHeight:'600px', width:'100%', overflowY: 'auto', overflowX:'auto', backgroundColor:'#243330 ' }}>
          <Link className='btn btn-primary m-1'  style={{backgroundColor:'#204437'}} to={`/cart`}>Carro</Link>
          <h2 className='text-white'>NUEVA VENTA</h2>
          <div className='d-flex flex-column align-items-center justify-content-center m-3 p3 rounded coverflow-auto w-90 p-3' style={{backgroundColor:'white', minWidth:'400px'}}>
            <h3 className='text-white'>ELIGE TU DISEÑO</h3>
            {diseno.length > 0 ? (
              <SelectWithImages
                options={diseno.map((dis) => ({ label: dis.Nombre_Diseno, value: dis.Id_Diseño, image: dis.Diseño }))}
                onChange={handleDisenoChange}
              />
             ) : (
            <div>Cargando diseños...</div>
          )}
          </div>

          <div className="container-fluid d-flex justify-content-center align-items-center m-0 p-3 ">
            <button className='btn btn-primary m-3' style={{backgroundColor:'#204437'}} onClick={handleNext}>SIGUIENTE</button>
            <Link className='btn btn-primary m-3' style={{backgroundColor:'#204437'}} to={`/inicioEmpleado`}>Volver</Link>
          </div>
        </div>



      </div>

      
    </>
  );
}

export default NuevaVenta;
