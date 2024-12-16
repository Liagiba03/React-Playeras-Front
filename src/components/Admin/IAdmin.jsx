import axios from 'axios'
import React, { useEffect, useState } from 'react';
import {useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import Diseños from '../../imagenes/diseños.jpg'
import Abonos from '../../imagenes/abonos.jpg'
import Playeras from '../../imagenes/playeras.webp'
import Cat_y_Temp from '../../imagenes/catalogosTemp.jpg'
import Usuarios from '../../imagenes/usuarios.jpg'

function IAdmin() { 
  const [name, setName] = useState('');
  const navigate = useNavigate();

  
  // PARA OBTENER NOMBRE INIT
  useEffect(()=>{
    axios.get('http://localhost:5000', { withCredentials: true })
    .then((res)=>{
      console.log(res);
      if(res.data.valid){
        setName(res.data.Nombre);
      }else{
        navigate('/login');
      }
    })
    .catch((err) => console.log(`Eroor en home${err}`))
  },[navigate]);
  // PARA OBTENER NOMBRE END
  
  return (
    <>
      <div className=" d-flex justify-content-left vh-100 vw-100 p-0 " >
        <NavBar />
        <div className="container-fluid p-0 vh-100 d-felx m-0 "   style={{minHeight:'600px', overflowY: 'auto', backgroundColor:'#243330 ' }}>
        <div className='container-fluid d-flex flex-column'>
          <div className='container d-flex flex-column justify-content-center align-items-center'>
            <label className='text-white text-center align-middle ' style={{fontFamily:''}}>¡Viste tu pasión!</label>
            <label className='text-white text-center align-middle '>Anime, Videojuegos y Comics en cada puntada</label>
          </div>
          {/* cards container*/}


          {/* cards nuevos*/}

          <div className='container-fluid d-flex align-items-justify justify-content-center p-3'>
            <div className='d-flex flex-wrap justify-content-center row w-100'>
              {/*card1 */}
              <div className='col-8 col-sm-6 col-md-4 col-lg-3 m-1 d-flex flex-column justify-content-center '>
                <div className='card m-2 align-items-center justify-content-center' style={{ backgroundColor:'#D9D9D9', minWidth:'180px'}}>
                  <img src={Diseños} alt="" className='card-img-top d-flex align-items-center p-1' style={{width:'80%', height:'220px', objectFit:'cover'}}/>
                  <div className='card-body'>
                    <button className='btn btn-primary h-100 w-100' style={{backgroundColor:'#204437'}} onClick={() => navigate('/diseno')}>DISEÑOS</button>
                  </div>
                </div>
              </div>
              {/*card1 */}
              {/*card1 */}
              <div className='col-8 col-sm-6 col-md-4 col-lg-3 m-1 d-flex flex-column justify-content-center '>
                <div className='card m-2 align-items-center justify-content-center' style={{ backgroundColor:'#D9D9D9', minWidth:'180px'}}>
                  <img src={Playeras} alt="" className='card-img-top d-flex align-items-center p-1' style={{width:'80%', height:'220px', objectFit:'cover'}}/>
                  <div className='card-body'>
                    <button className='btn btn-primary h-100 w-100' style={{backgroundColor:'#204437'}} onClick={() => navigate('/PLAYERAS')}>PLAYERAS</button>
                  </div>
                </div>
              </div>
              {/*card1 */}
              {/*card1 */}
              <div className='col-8 col-sm-6 col-md-4 col-lg-3 m-1 d-flex flex-column justify-content-center '>
                <div className='card m-2 align-items-center justify-content-center' style={{ backgroundColor:'#D9D9D9', minWidth:'180px'}}>
                  <img src={Usuarios} alt="" className='card-img-top d-flex align-items-center p-1' style={{width:'80%', height:'220px', objectFit:'cover'}}/>
                  <div className='card-body'>
                    <button className='btn btn-primary h-100 w-100' style={{backgroundColor:'#204437'}} onClick={() => navigate('/comprador')}>USUARIOS</button>
                  </div>
                </div>
              </div>
              {/*card1 */}
              {/*card1 */}
              <div className='col-8 col-sm-6 col-md-4 col-lg-3 m-1 d-flex flex-column justify-content-center '>
                <div className='card m-2 align-items-center justify-content-center' style={{ backgroundColor:'#D9D9D9', minWidth:'180px'}}>
                  <img src={Cat_y_Temp} alt="" className='card-img-top d-flex align-items-center p-1' style={{width:'80%', height:'210px', objectFit:'cover'}}/>
                  <div className='card-body'>
                    <button className='btn btn-primary h-100 w-100 m-0 p-0' style={{fontSize:'18px', backgroundColor:'#204437'}} onClick={() => navigate('/catTem')}>CATALOGOS Y TEMPORADAS</button>
                  </div>
                </div>
              </div>
              {/*card1 */}
              {/*card1 */}
              <div className='col-8 col-sm-6 col-md-4 col-lg-3 m-1 d-flex flex-column justify-content-center'>
                <div className='card  align-items-center justify-content-center' style={{ backgroundColor:'#D9D9D9', minWidth:'180px'}}>
                  <img src={Abonos} alt="" className='card-img-top d-flex align-items-center p-1' style={{width:'80%', height:'220px', objectFit:'cover'}}/>
                  <div className='card-body d-flex flex-row justify-content-center align-items-center m-0 p-0'>
                    <button className='btn btn-primary h-60 w-100 m-1' style={{backgroundColor:'#204437', }} onClick={() => navigate('/ventas')}>VENTAS</button>
                    <button className='btn btn-primary h-60 w-100 m-1' style={{backgroundColor:'#204437'}} onClick={() => navigate('/abonos')}>ABONOS</button>
                  </div>
                </div>
              </div>
              {/*card1 */}
            </div>
          </div>

          {/* cards nuevos*/}
          </div>
          </div>
        </div>
          {/*cards container */}
        

    </>
  )
}

export default IAdmin