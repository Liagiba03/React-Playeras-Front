// src/components/ElejirPlayera.js
import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import NavBar from '../../Admin/NavBar';
import Swal from 'sweetalert2';
import { CartContext } from '../../../CartContext';

function ElejirPlayera() {
    const { id } = useParams();
    const [rol, setRol] = useState(null);
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const [productos, setProductos] = useState([]);
    const [tiposPlayera, setTiposPlayera] = useState([]);
    const [tallas, setTallas] = useState([]);
    const [colores, setColores] = useState([]);

    const [selectedTipo, setSelectedTipo] = useState('');
    const [selectedTalla, setSelectedTalla] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [folioPlayera, setFolioPlayera] = useState('');
    const [costoIndividual, setCostoIndividual] = useState(0);
    const [cantidadDisponible, setCantidadDisponible] = useState(0);

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

    //CONSULTAR PRODUCTOS
    useEffect(() => {
        axios.get(`/get_elejir_playera/${id}`)
            .then((res) => {
                const products = res.data[0];
                setProductos(products);

                // Obtener tipos de playera únicos
                const uniqueTiposPlayera = Array.from(
                    new Set(products.map(prod => prod.Id_TipoP))
                ).map(id => {
                    return {
                        id: id,
                        tipo: products.find(prod => prod.Id_TipoP === id).TipoPlayera
                    };
                });

                setTiposPlayera(uniqueTiposPlayera);
            })
            .catch((err) => console.log(`error: ${err}`));
    }, [id]);

    // Manejar cambios en el tipo de playera
    const handleTipoChange = (e) => {
        const tipoId = e.target.value;
        setSelectedTipo(tipoId);
        setSelectedTalla('');
        setSelectedColor('');
        setFolioPlayera('');
        setCostoIndividual(0);
        setCantidadDisponible(0);

        // Filtrar tallas disponibles para el tipo de playera seleccionado
        const filteredTallas = Array.from(
            new Set(productos.filter(prod => prod.Id_TipoP == tipoId).map(prod => prod.Id_Talla))
        ).map(id => {
            return {
                id: id,
                talla: productos.find(prod => prod.Id_Talla === id).Talla
            };
        });

        setTallas(filteredTallas);
        setColores([]); // Limpiar colores cuando se cambia el tipo de playera
    };

    // Manejar cambios en la talla
    const handleTallaChange = (e) => {
        const tallaId = e.target.value;
        setSelectedTalla(tallaId);
        setSelectedColor('');
        setFolioPlayera('');
        setCostoIndividual(0);
        setCantidadDisponible(0);

        // Filtrar colores disponibles para el tipo de playera y talla seleccionados
        const filteredColores = Array.from(
            new Set(productos.filter(prod => prod.Id_TipoP == selectedTipo && prod.Id_Talla == tallaId).map(prod => prod.Id_ColorPlay))
        ).map(id => {
            return {
                id: id,
                color: productos.find(prod => prod.Id_ColorPlay === id).ColorPlayera
            };
        });

        setColores(filteredColores);
    };

    // Manejar cambios en el color
    const handleColorChange = (e) => {
        const colorId = e.target.value;
        setSelectedColor(colorId);

        // Encontrar Folio_Playera correspondiente
        const selectedProducto = productos.find(prod =>
            prod.Id_TipoP == selectedTipo &&
            prod.Id_Talla == selectedTalla &&
            prod.Id_ColorPlay == colorId
        );

        if (selectedProducto) {
            setFolioPlayera(selectedProducto.Folio_Playera);
            setCostoIndividual(selectedProducto.Costo_Individual);
            setCantidadDisponible(selectedProducto.Cantidad_Disponible);
        }
    };

    const handleNext = () => {
        if (!selectedTipo || !selectedTalla || !selectedColor || !folioPlayera) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Debes seleccionar un tipo de playera, talla y color antes de continuar!',
            });
        } else {
            addToCart({
                diseño: productos.find(prod => prod.Folio_Playera === folioPlayera).Des_Playera,
                tipo: productos.find(prod => prod.Folio_Playera === folioPlayera).TipoPlayera,
                talla: productos.find(prod => prod.Folio_Playera === folioPlayera).Talla,
                color: productos.find(prod => prod.Folio_Playera === folioPlayera).ColorPlayera,
                cantidad: 1,
                monto: costoIndividual,
                folio: folioPlayera,
                cantidadDisponible: cantidadDisponible
            });
            navigate(`/cart`);
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
                    <Link className='btn btn-primary m-1'  style={{backgroundColor:'#204437'}} to={`/cart`}>Carro</Link>
                    <h2 className='text-white'>NUEVA VENTA</h2>
                    <div className='d-flex flex-column align-items-center justify-content-center m-3 p3 rounded coverflow-auto w-90 p-3' style={{backgroundColor:'white', minWidth:'400px'}}>
                        <h3>ELIGE EL TIPO DE PLAYERA, TALLA Y COLOR</h3>
                        
                            <label>Tipo de Playera: </label>
                            <select className='form-select' value={selectedTipo} onChange={handleTipoChange}>
                                <option value="">Seleccione un tipo</option>
                                {tiposPlayera.map(tipo => (
                                    <option key={`tipo-${tipo.id}`} value={tipo.id}>{tipo.tipo}</option>
                                ))}
                            </select>
                        
                        
                            <label>Talla: </label>
                            <select className='form-select' value={selectedTalla} onChange={handleTallaChange} disabled={!selectedTipo}>
                                <option value="">Seleccione una talla</option>
                                {tallas.map(talla => (
                                    <option key={`talla-${talla.id}`} value={talla.id}>{talla.talla}</option>
                                ))}
                            </select>
                        
                        
                            <label>Color: </label>
                            <select className='form-select' value={selectedColor} onChange={handleColorChange} disabled={!selectedTalla}>
                                <option value="">Seleccione un color</option>
                                {colores.map(color => (
                                    <option key={`color-${color.id}`} value={color.id}>{color.color}</option>
                                ))}
                            </select>
                        
                    </div>

                    <div className="d-flex justify-content-center align-items-center">
                        <button className='btn btn-primary m-3' style={{backgroundColor:'#204437'}} onClick={handleNext}>SIGUIENTE</button>
                        <Link className='btn btn-primary m-3' style={{backgroundColor:'#204437'}} to={`/nuevaVenta`}>Volver</Link>
                    </div>
            </div>



            </div>
            
        </>
    )
}

export default ElejirPlayera;
