import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import NavBar from '../NavBar';
import Swal from 'sweetalert2';
import Playeras from '../playeras/Playeras';
import Diseno from '../diseño/Diseno';



function List_products() {
  const [rol, setRol] = useState(null);
  const navigate = useNavigate();
  const [deletedPro, setDeletedPro] = useState(true);
  const [filtro, setFiltro] = useState('3');
  const [producto, setProducto] = useState([]);
  const [playerasPorDiseno, setplayerasPorDiseno] = useState({});
  const [selected, setSelected] = useState(null);


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
    if (deletedPro || filtro) {
      setDeletedPro(false);
      axios.get(`/productos/${filtro}`)
        .then((res) => {
          const products = res.data[0];
          setProducto(products);
          //console.log(products);

          // Para cada producto, obtener las playeras
        products.forEach(d => {
          axios.get(`/get_pla/${d.Id_TipoDPlayera}`)
            .then((res) => {
              //console.log(res.data)
              setplayerasPorDiseno(prevState => ({
                ...prevState,
                [d.Id_TipoDPlayera]: res.data
              }));
            })
            .catch((err) => console.log(`Error al obtener playeras: ${err}`));
        });


        })
        .catch((err) => console.log(`error: ${err}`));
    }
  }, [deletedPro, filtro]);

  //Eliminar un producto
  function deleteProducto(id){
    Swal.fire({
      title: `¿Seguro que deseas eliminar este producto?`,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: `Mantener`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        //Eliminar
        axios.delete(`/deleteProducto/${id}`)
      .then((res)=>{
        setDeletedPro(true);
        console.log(res)
    
      })
      .catch((err)=>{ console.log(`Error in delete: ${err}`)});
      
        Swal.fire("Eliminado!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("No eliminado", "", "info");
        
      }
    });

  }


  if (rol === null) {
    return <div>Cargando...</div>; // Mostrar un mensaje de carga mientras se obtiene el rol
  }
  
  return (
    <>
      <div  className=" d-flex justify-content-left vh-100 vw-100 p-0 " >
        <NavBar />
        

          <div  className="container-fluid d-flex flex-column align-items-center m-0 p-3 " style={{minWidth:'800px', minHeight:'600px', width:'100%', overflowY: 'auto', overflowX:'auto', backgroundColor:'#243330 ' }}>
            <h2 className='text-white'>Productos</h2>
            <Link className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} to={`/insProductos`}>Agregar nuevo</Link>
            <br />
            <label className='text-white' htmlFor="filtro">Ordenar por:</label>                          
            <select className="form-select w-50 " name="filtro" id="filtro" required defaultValue={3} onChange={(e)=>setFiltro(e.target.value)}>
              <option value="3" >Folio</option>
              <option value="1" >Diseño</option>
              <option value="2" >Playera</option>
            </select>
            <br />

            <div className='table table-responsive p-0 m-0' style={{ borderRadius: '20px', overflow: 'auto' }}>
            <table className="table table-striped table-bordered table-hover rounded" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <thead className='' style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <tr className="text-center align-middle">
                  <th scope="col">Folio</th>
                  <th scope="col">Costo unitario</th>
                  <th scope="col">Descripción</th>
                  <th scope="col">Diseño</th>
                  <th scope="col">Playera</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody >
                {
                  producto.map((item) =>{
                    return(<tr key={item.Folio_Playera}>
                      <td className="text-center align-middle">{item.Folio_Playera}</td>
                      <td className="text-center align-middle">{item.Costo_Individual}</td>
                      <td className="text-center align-middle">{item.Des_Playera}</td>
                      <td className="text-center align-middle"> 
                        <img src={`http://localhost:5000/images/${item.Diseño}`} alt="Imagen desde el servidor" width="100" height="100" />
                      </td>
                      <td className="text-center align-middle">
                          {playerasPorDiseno[item.Id_TipoDPlayera] ? (
                          <div>
                            <div>Color: {playerasPorDiseno[item.Id_TipoDPlayera].Color}</div>
                            <div>Tipo: {playerasPorDiseno[item.Id_TipoDPlayera].Tipo}</div>
                            <div>Talla: {playerasPorDiseno[item.Id_TipoDPlayera].Talla}</div>
                            <div>Cantidad Disponible: {playerasPorDiseno[item.Id_TipoDPlayera].Cantidad_Disponible}</div>
                          </div>
                        ) : (
                          <div>No hay playera disponible</div>
                        )}
                      </td>
                      <td className="text-center align-middle">
                        <button className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} onClick={()=>deleteProducto(item.Folio_Playera)}>Eliminar</button>
                      </td>
                    </tr>)
                  })
                }
              </tbody>
            </table>
            </div>

            <div className="component-toggle">
              <br />
              <button className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} onClick={() => navigate('/playeras')}>Mostrar Playeras</button>
              <button className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} onClick={() => navigate('/diseno')}>Mostrar Diseño</button>
              <br />
              <div>
                <br />
              </div>
            </div>

            <div >
              {/*{selected === 'Playeras' && <Playeras />}*/}
              {/*{selected === 'Diseno' && <Diseno />}*/}
            </div>

        </div>

      </div>

      

    </>
  )
}

export default List_products