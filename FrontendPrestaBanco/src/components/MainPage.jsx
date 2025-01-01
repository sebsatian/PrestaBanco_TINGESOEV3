import { Link } from 'react-router-dom';
import '../styles/MainPage.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function MainPage() {
  return (
    
    <div className="main-page-container" style={{ width: '100%', height: 1000 }}>
      <h1>¡Bienvenido! </h1>

      <h4 className="mt-4"></h4><h3>Selecciona una opción</h3> 
      
      {/* Contenedor para secciones */}
      <div className="sections-container mt-4" style={{ width: '100%', display: 'flex', justifyContent: "space-between" }}>
        
        {/* Sección para Ejecutivo */}
        <div className="executive-section" style={{ marginRight: '2rem' }}>
          <h2>Ejecutivo</h2>
          <Link to="/loan-types/view">
            <button type="button" className="action-button">
              <i className="fas fa-percentage" style={{ marginRight: '8px' }}></i>
              Tasa de interés Anual
            </button>
          </Link>
          <Link to="/view-requests" state={{ from: 'ejecutivo' }}>
            <button type="button" className="action-button">
              <i className="fas fa-user-tie" style={{ marginRight: '8px' }}></i>
              Evaluar Solicitudes
            </button>
          </Link>
        </div>
        
        {/* Sección para Usuario */}
        <div className="user-section">
          <h2>Usuario</h2>
          <Link to="/register">
            <button type="button" className="action-button">
              <i className="fas fa-user-plus" style={{ marginRight: '8px' }}></i>
              Registrarse como Cliente
            </button>
          </Link>
          <Link to="/simulate">
            <button type="button" className="action-button">
              <i className="fas fa-calculator" style={{ marginRight: '8px' }}></i>
              Simular un Crédito y Pedir Préstamo
            </button>
          </Link>
          <Link to="/check-request-status">
            <button type="button" className="action-button">
              <i className="fas fa-file-alt" style={{ marginRight: '8px' }}></i>
              Ver estado de mi solicitud
            </button>
          </Link>
        </div>
        
      </div>
    </div>
  );
}

export default MainPage;
