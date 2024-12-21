import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import NavBar from '../../Admin/NavBar';
import Swal from 'sweetalert2';

function Abonar() {
    const { id } = useParams();
    const [rol, setRol] = useState(null);
    const navigate = useNavigate();
    const [abono, setAbono] = useState([]);
    const [totales, setTotales] = useState({});
    const [data, setData] = useState({
        fecha: '',
        Abono: '',
        id: id
        
        
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

    // MOSTRAR EN TABLAS INIT
    useEffect(() => {
        // GET Abono
            axios.get(`/get-detalles-abonar/${id}`)
            .then((res) => {
                setAbono(res.data[0]);
                setTotales(res.data[1][0])
                //const totalesData = res.data[1][0];
                //totalesData.UFecha_Abono = formatDateTime(totalesData.UFecha_Abono);
                //setTotales(totalesData);
                //console.log(totalesData);
                console.log(res.data)
            })
            .catch((err) => console.log(`error: ${err}`));
        
    }, [id]);

    // HANDLER PARA ABONO
    const handleAbonoChange = (e) => {
        const value = parseFloat(e.target.value);
        setData({ ...data, Abono: isNaN(value) ? '' : value });
    };


    // FUNCIÓN PARA OBTENER FECHA Y HORA ACTUAL EN FORMATO 'YYYY-MM-DD HH:MM:SS'
    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleAbonar = () => {
        if (data.Abono) {
            if(data.Abono>totales.Deuda || data.Abono<=0){
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Colocar una cantidad válida",
                    width: 600,
                    padding: "3em",
                    color: "#716add",
                });
                setData({...data,Abono:''})
                return;
            }else{
                const fechaActual = getCurrentDateTime();
                const lastAbonoDate = new Date(totales.UFecha_Abono);
                const currentDateTime = new Date(fechaActual);
                //console.log(lastAbonoDate)
                //console.log(currentDateTime)

                if (currentDateTime < lastAbonoDate) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Ajusta la hora de tu sistema",
                        width: 600,
                        padding: "3em",
                        color: "#716add",
                    });
                    return;
                }
                setData((prevData) => ({ ...prevData, fecha: fechaActual }));

                // Usar setTimeout para asegurar que setData actualice el estado antes de la solicitud de Axios
                setTimeout(() => {
                    axios.post('/add_abono', { ...data, fecha: fechaActual })
                        .then((res) => {
                            if (res) {
                                Swal.fire({
                                    icon: "success",
                                    title: "ABONADO CON ÉXITO",
                                    width: 600,
                                    padding: "3em",
                                    color: "#716add",
                                });
                                // Actualizar los totales después del abono
                                axios.get(`/get-detalles-abonar/${id}`)
                                    .then((res) => {
                                        setAbono(res.data[0]);
                                        setTotales(res.data[1][0]);
                                        setData({ ...data, Abono: '' });
                                    })
                                    .catch((err) => console.log(`error: ${err}`));
                                    navigate('/AbonoEmple')
                            }
                            //console.log(res);
                        })
                        .catch((err) => console.log(`Error: ${err}`));
                }, 0);
            }
        } else {
            Swal.fire('Error', 'Debe ingresar un monto para abonar', 'error');
        }
    };

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
                        <h2 className='text-white'>NUEVO ABONO</h2>
                        <label className='text-white'>Monto a abonar: </label>
                        <input className='form-control w-50' type="number" required value={data.Abono} onChange={handleAbonoChange} />
                        <br />
                        <button className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} onClick={handleAbonar}>REALIZAR ABONO</button>
                        
                        <br />
                        <table className="table table-striped table-bordered table-hover rounded" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                            <thead className='' style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                <tr className="text-center align-middle">
                                    <th scope="col">Producto</th>
                                    <th scope="col">Descripción</th>
                                    <th scope="col">Total Abonado</th>
                                    <th scope="col">Deuda</th>
                                </tr>
                            </thead>
                            <tbody>
                            {abono.map((detalle, index) => (
                                <tr className="text-center align-middle" key={index}>
                                    <td className="text-center align-middle">{detalle.Producto}</td>
                                    <td className="text-center align-middle">{detalle["Descripción"]}</td>
                                    {index === 0 && (
                                        <>
                                            <td className="text-center align-middle" rowSpan={abono.length}>{totales.Total_Abonado}</td>
                                            <td className="text-center align-middle" rowSpan={abono.length}>{totales.Deuda}</td>
                                        </>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div className='d-flex align-items-center justify-content-center'>
                            <Link className='btn btn-primary m-1' style={{backgroundColor:'#204437'}} to={'/AbonoEmple'}>VOLVER</Link>
                        </div>
                    </div>



            </div>

            
        </>
    );
}

export default Abonar;
