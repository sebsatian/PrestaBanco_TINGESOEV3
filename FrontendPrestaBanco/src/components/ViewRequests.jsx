import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import requestService from '../services/request.service.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/ViewRequests.css';

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loanTypes, setLoanTypes] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('Location state:', location.state); // Verify the location state

    const fetchRequests = async () => {
      try {
        let response;
        if (location.state?.rut) {
          response = await requestService.getRequestsByRut(location.state.rut);
        } else {
          response = await requestService.getAllRequests();
        }
        const requestsData = response.data;
        requestsData.sort((a, b) => new Date(a.creationDate) - new Date(b.creationDate));
        
        const loanTypeNames = {};
        for (const request of requestsData) {
          if (!loanTypeNames[request.loanType]) {
            try {
              const response = await requestService.getLoanTypeById(request.loanType);
              loanTypeNames[request.loanType] = response.data.type;
            } catch (error) {
              console.error('Error al obtener el tipo de préstamo:', error);
              setError('No se pudo obtener el tipo de préstamo. Por favor, vuelva a intentarlo.');
              return;
            }
          }
        }

        setLoanTypes(loanTypeNames);
        setRequests(requestsData);
      } catch (error) {
        console.error('Error al obtener las solicitudes:', error);
        setError('No se pudo obtener las solicitudes. Por favor, vuelva a intentarlo.');
      }
    };

    fetchRequests();
  }, [location.state]); 

  if (error) {
    return <div className="alert alert-danger mt-4">{error}</div>;
  }

  return (
    <div className="container-fluid mt">
      <h2 className="text-center mb-4">Lista de Solicitudes</h2>
      {requests.length === 0 ? (
        <div className="alert alert-danger text-center">No hay solicitudes</div>
      ) : (
        <div className="table-responsive" style={{ borderRadius: '5px' }}>
          <table className="table table-striped table-hover table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th className="text-center">#</th>
                <th className="text-center">Fecha de Creación</th>
                <th className="text-center">RUT del Cliente</th>
                <th className="text-center">Tipo de Préstamo</th>
                <th className="text-center">Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr key={request.id}>
                  <th scope="row" className="text-center">{index + 1}</th>
                  <td className="text-center">{new Date(request.creationDate).toLocaleString()}</td>
                  <td className="text-center">{request.clientRut}</td>
                  <td className="text-center">{loanTypes[request.loanType] || 'Cargando...'}</td>
                  <td className="text-center">{request.currentStatus}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        console.log('Received state:', location.state);
                        if (location.state?.from === 'ejecutivo') {
                          console.log('Navigating to evaluate-request with state:', { key: request.id });
                          if (request.currentStatus === 'Aprobada' || request.currentStatus === 'Pre-Aprobada') {
                            navigate(`/request-details/${request.id}`, { state: { from: 'ejecutivo' } });
                          } else if (request.currentStatus !== 'En evaluación') {
                            navigate(`/evaluate-request/${request.id}`, { state: { key: request.id } });
                          } else {
                            navigate(`/evaluation/${request.id}`);
                          }
                        } else {
                          if (['En Aprobación Final', 'Pre-Aprobada'].includes(request.currentStatus) && location.state?.from === 'ejecutivo') {
                            console.log('Navigating to request-details with state:', { from: 'ejecutivo' });
                            navigate(`/request-details/${request.id}`, { state: { from: 'ejecutivo' } });
                          } else {
                            console.log('Navigating to request-details with state:', { from: 'cliente' });
                            navigate(`/request-details/${request.id}`, { state: { from: 'cliente' } });
                          }
                        }
                      }}
                    >
                      {location.state?.from === 'ejecutivo' ? 'Evaluar' : 'Ver Detalles'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewRequests;