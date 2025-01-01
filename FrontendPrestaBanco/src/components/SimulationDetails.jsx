import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import simulateService from '../services/simulate.service';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/SimulationDetails.css';
const SimulationDetails = () => {
  const { simulationId } = useParams();
  const [simulation, setSimulation] = useState(null);
  const [rut, setRut] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSimulation = async () => {
      try {
        const response = await simulateService.getSimulationById(simulationId);
        setSimulation(response.data.simulation);
        setRut(response.data.rut);
      } catch (err) {
        console.error(err);
        setError('No se pudo obtener la simulación. Por favor, inténtelo de nuevo más tarde.');
      }
    };

    fetchSimulation();
  }, [simulationId]);

  if (error) {
    return <div className="alert alert-danger mt-4">{error}</div>;
  }

  if (!simulation) {
    return <div className="container mt-4">Cargando simulación...</div>;
  }

  const finalValue = Number(simulation.finalAmount).toLocaleString();

  return (
    
    <div className="container mt-3" style={{ maxWidth: '1400px' }}>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Detalles de la Simulación</h2>
        <button 
          className="btn btn-secondary ms-4"
          onClick={() => navigate(`/simulation/change/${simulationId}`)} 
          >
            Editar
        </button>
      </div>
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Préstamo {getLoanType(simulation.loanType)}</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <p><strong>RUT:</strong> {rut}</p>
              <p><strong>Valor de la Propiedad:</strong> ${Number(simulation.propertyValue).toLocaleString()}</p>
              <p><strong>Porcentaje a cubrir:</strong> {(simulation.percentage ? Math.round(simulation.percentage * 100) : 0)}%</p>
              <p><strong>Monto del Préstamo:</strong> ${Number(simulation.loanAmount).toLocaleString()}</p>
            </div>
            <div className="col-md-6 mb-3">
              <p><strong>Número de Pagos:</strong> {simulation.numberOfPayments}</p>
              <p><strong>Pago Mensual:</strong> ${Number(simulation.monthlyPayment).toLocaleString()}</p>
              <p><strong>Tasa de Interés Anual:</strong> {simulation.annualInterestRate}%</p>
              <p><strong>Años:</strong> {simulation.years}</p>
              <p><strong>Valor Final:</strong> ${finalValue}</p>
              
            </div>
            
            <div className="d-flex justify-content-end mt-4">
              <button
                className="btn btn-primary"
                onClick={() => navigate('/create-request', { state: { simulation: simulation } })}
                >
                  Pedir Préstamo
              </button>
            </div>
          </div>
          <div className="card-footer text-muted mt-2" style={{ paddingTop: '10px'}}>
              Esto puede estar sujeto a adiciones al pago mensual y total, debido a seguros y comisiones. Te serán detalladas las condiciones y adiciones en caso de ser aprobada tu solicitud.
          </div>
          
        </div>
      </div>
      
    </div>
    
  );
};

const getLoanType = (loanType) => {
  switch (loanType) {
    case 1:
      return 'Primera vivienda';
    case 2:
      return 'Segunda vivienda';
    case 3:
      return 'Propiedades comerciales';
    case 4:
      return 'Remodelación';
    default:
      return 'Desconocido';
  }
};

export default SimulationDetails;
