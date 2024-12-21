import axios from 'axios'
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import NavBar from '../../Admin/NavBar';
import Swal from 'sweetalert2';

function AbonoEmple() {
    const [rol, setRol] = useState(null);
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [abono, setAbono] = useState([]);
    const [abonar, setAbonar] = useState(null);
    const [faltante, setFaltante] = useState(null);

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
    }, [navigate, rol]);
    // PARA OBTENER NOMBRE END

    // MOSTRAR EN TABLAS INIT
    useEffect(() => {
        // GET Abono
        axios.get(`/get-detalles-abonos`)
            .then((res) => {
                setAbono(res.data[0]);
                //console.log(res.data[0])
            })
            .catch((err) => console.log(`error: ${err}`));
    }, []);

    const searcher = (e) => {
        setSearch(e.target.value)
    }
    const results = !search ? abono : abono.filter((dato) => dato.Nombre_Usuario.toLowerCase().includes(search.toLocaleLowerCase()));

    const handleRowClick = (folio, falta) => {
        setAbonar(folio);
        setFaltante(falta);
    }

    const handleAbonarClick = () => {
        if (abonar) {
            if(faltante == 0){
                Swal.fire({
                    icon: "error",
                    title: "Debe tener una deuda para poder abonar",
                    width: 600,
                    padding: "3em",
                    color: "#716add",
                  
                  });
                //alert("Debe ingresar el costo")
                return;
            }else{
                navigate(`/abonar/${abonar}`);
            }
            
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor, seleccione una fila antes de abonar!',
            });
        }
    }

    // VERIFICACION DE CARGADO INIT
    if (rol === null) {
        return <div>Cargando...</div>; // Mostrar un mensaje de carga mientras se obtiene el rol
    }
    // VERIFICACION DE CARGADO END

    return (
        <>
            <div className=" d-flex justify-content-left vh-100 vw-100 p-0 ">
                <NavBar />

                <div className="container-fluid d-flex flex-column align-items-center m-0 p-3 " style={{minWidth:'400px', minHeight:'600px', width:'100%', overflowY: 'auto', overflowX:'auto', backgroundColor:'#243330 ' }}>
                    <h2 className='text-white'>BUSCAR ABONOS</h2>
                    <br />
                    <div className="content">
                    <label className='text-white'>NOMBRE COMPRADOR: </label>
                    <input className='form-control' type="search" value={search} onChange={searcher} placeholder='Buscar' />
                    <br />

                    <table className="table table-striped table-bordered table-hover rounded" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                        <thead className='' style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                            <tr className="text-center align-middle">
                                <th scope="col">Folio</th>
                                <th scope="col">Descripción</th>
                                <th scope="col">Total Abonado</th>
                                <th scope="col">Deuda</th>
                                <th scope="col">Deudor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                results.map((ve) => (
                                    <tr className="text-center align-middle"  key={ve.Folio_Venta} onClick={() => handleRowClick(ve.Folio_Venta, ve.Deuda)} style={{ backgroundColor: abonar === ve.Folio_Venta ? '#f0f0f0' : 'transparent' }}>
                                        <td className="text-center align-middle">{ve.Folio_Venta}</td>
                                        <td className="text-center align-middle">{ve.Descripcion}</td>
                                        <td className="text-center align-middle">{ve.Total_Abonado}</td>
                                        <td className="text-center align-middle">{ve.Deuda}</td>
                                        <td className="text-center align-middle">{ve.Nombre_Usuario}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <br />

                    <div className='d-flex align-items-center justify-content-center'>
                        <button className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} onClick={handleAbonarClick}>ABONAR</button>
                        <Link className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} to={'/abonos'}>VER ABONOS</Link>
                        <Link className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} to={'/inicioEmpleado'}>VOLVER</Link>
                    </div>
                    </div>

                </div>
            </div>

            
        </>
    )
}

export default AbonoEmple;
