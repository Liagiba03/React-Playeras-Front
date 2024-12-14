import React from "react";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from "./components/logeo/Login";
import Home from "./components/Home";
import Registrar from "./components/logeo/Registrar";
import Playeras from "./components/Admin/playeras/Playeras";
import EditColor from "./components/Admin/playeras/EditColor";
import EditPlayeras from "./components/Admin/playeras/EditPlayeras";
import EditTalla from "./components/Admin/playeras/EditTalla";
import IAdmin from "./components/Admin/IAdmin";
import CatTemp from "./components/Admin/catYtemp/CatTemp";
import Comprador from "./components/Admin/comprador/Comprador";
import Diseno from "./components/Admin/diseño/Diseno";
import Ventas from "./components/Admin/ventas/Ventas";
import EditTipo from "./components/Admin/playeras/EditTipo";
import EditTemp from "./components/Admin/catYtemp/EditTemp";
import EditCat from "./components/Admin/catYtemp/EditCat";
import DetalleV from "./components/Admin/ventas/DetalleV";
import EditDis from "./components/Admin/diseño/EditDis";
import ListProducts from "./components/Admin/productos/ListProducts";
import Abonos from "./components/Admin/ventas/Abonos";
import EditComprador from "./components/Admin/comprador/EditComprador";
import Sesiones from "./components/Admin/Sesiones";
import EditSesiones from "./components/Admin/EditSesiones";
import InsertProductos from "./components/Admin/productos/InsertProductos";
//bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

//bootstrap
import IEmpleado from "./components/Empleado/IEmpleado";
import AbonoEmple from "./components/Empleado/Abonos/AbonoEmple";
import NuevaVenta from "./components/Empleado/VentasEmple/NuevaVenta";
import Abonar from "./components/Empleado/Abonos/Abonar";
import ElejirPlayera from "./components/Empleado/VentasEmple/ElejirPlayera";
import Cart from "./components/Cart";
import SeleccionarPago from "./components/Empleado/VentasEmple/SeleccionarPago";
import FinalizarVenta from "./components/Empleado/VentasEmple/FinalizarVenta";
import VentaFinalizada from "./components/Empleado/VentasEmple/VentaFinalizada";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*LOGIN, REGISTRAR Y HOME */}
        <Route path="/login" element={<Login />} />
        <Route path='/' element={<Home/>}/>
        <Route path="/registrar" element={<Registrar />}/>
        {/*RUTAS DE ADMINISTRADOR */}
        <Route path="/inicio" element={<IAdmin />} />

        <Route path="/playeras" element={<Playeras />}/>
        <Route path="/editTipoP/:id" element={<EditTipo />} />
        <Route path='/editColor/:id' element={<EditColor />}/>
        <Route path='/editPla/:id' element={<EditPlayeras />}/>
        <Route path='/editTalla/:id' element={<EditTalla />}/>

        <Route path='/catTem' element={<CatTemp />}/>
        <Route path='/editTemp/:id' element={<EditTemp />}/>
        <Route path='/editCat/:id' element={<EditCat />}/>

        <Route path='/ventas' element={<Ventas />}/>
        <Route path='/detalleV/:id' element={<DetalleV />}/>
        <Route path='/abonos' element={<Abonos />}/>

        <Route path='/comprador' element={<Comprador />}/>
        <Route path='/editCom/:id' element={<EditComprador />}/>

        <Route path='/diseno' element={<Diseno />}/>
        <Route path='/editDis/:id' element={<EditDis />}/>

        <Route path='/productos' element={<ListProducts />}/>
        <Route path='/insProductos' element={<InsertProductos />}/>
        
        <Route path='/sesiones' element={<Sesiones />}/>
        <Route path='/sesionesEd/:id' element={<EditSesiones />}/>
        
        {/*RUTAS DE EMPLEADO */}
        <Route path="/inicioEmpleado" element={<IEmpleado />} />
        <Route path='/AbonoEmple' element={<AbonoEmple />}/>
        <Route path='/abonar/:id' element={<Abonar />}/>
        
        <Route path='/nuevaVenta' element={<NuevaVenta />}/>
        <Route path='/elejirPlayera/:id' element={<ElejirPlayera />}/>
        <Route path="/cart" element={<Cart />} />
        <Route path="/seleccionarPago" element={<SeleccionarPago />} />
        <Route path="/finalizarVenta" element={<FinalizarVenta />} />
        <Route path="/ventaFinalizada" element={<VentaFinalizada />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
