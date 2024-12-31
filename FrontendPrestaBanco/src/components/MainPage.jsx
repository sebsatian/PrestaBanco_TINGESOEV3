import { Link } from 'react-router-dom';
import '../styles/MainPage.css';

function MainPage() {
  return (
    <div>
      <div className="fixed-button-container">
        <Link to="/">
          <button className="fixed-button">Inicio</button>
        </Link>
      </div>
      
      <div className="container">
        <h1>PrestaBanco - Créditos Hipotecarios</h1>
        <Link to="/register">
          <button className="action-button">Registrar Cliente</button>
        </Link>
        <Link to="/simulate">
          <button className="action-button">Simular un crédito y Pedir Préstamoo</button>
        </Link>
        <Link to="/loan-types/view">
          <button className="action-button">Tasa de interés Anual</button>
        </Link>
        <Link to="/view-requests" state={{ from: 'ejecutivo' }}>
          <button className="action-button">Ejecutivo</button>
        </Link>
        <Link to="/check-request-status">
          <button className="action-button">Ver estado de mi solicitud</button>
        </Link>
      </div>
    </div>
  );
}

export default MainPage;