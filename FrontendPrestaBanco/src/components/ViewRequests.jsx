import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import requestService from '../services/request.service.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/ViewRequests.css';
import DatePicker from 'react-datepicker';

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loanTypes, setLoanTypes] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchRut, setSearchRut] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
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
            const res = await requestService.getLoanTypeById(request.loanType);
            loanTypeNames[request.loanType] = res.data.type;
          }
        }

        setLoanTypes(loanTypeNames);
        setRequests(requestsData);
      } catch (err) {
        console.error('Error al obtener las solicitudes:', err);
        setError('No se pudo obtener las solicitudes. Por favor, vuelva a intentarlo.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [location.state]);

  const filteredRequests = requests.filter((request) => {
    const matchesRut = request.clientRut.toLowerCase().includes(searchRut.toLowerCase());
    const matchesStatus = request.currentStatus.toLowerCase().includes(searchStatus.toLowerCase());
    const matchesStartDate = startDate ? new Date(request.creationDate) >= startDate : true;
    const matchesEndDate = endDate ? new Date(request.creationDate) <= endDate : true;
    return matchesRut && matchesStatus && matchesStartDate && matchesEndDate;
  });

  if (error) {
    return <div className="alert alert-danger mt-4">{error}</div>;
  }

  return (
    <div className="container-fluid mt-4">
      <h2 className="text-center mb-4">Lista de Solicitudes</h2>
      {!loading && location.state?.from === 'ejecutivo' && (
        <div className="search-container d-flex justify-content-between mb-1">
          <div className="w-50 pe-3">
            <div className="input-group mb-3">
              <span className="input-group-text"><i className="fas fa-search"></i></span>
              <input
                type="text"
                placeholder="Buscar por RUT"
                value={searchRut}
                onChange={(e) => setSearchRut(e.target.value)}
                className="form-control bg-white"
                style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
              />
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text"><i className="fas fa-search"></i></span>
              <input
                type="text"
                placeholder="Buscar por Estado"
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
                className="form-control bg-white"
                style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
              />
            </div>
          </div>
          <div className="w-50 ps-3 d-flex justify-content-end">
            <div className="input-group mb-3 me-2 flex-column align-items-center">
              <i className="fas fa-calendar-alt mb-2"></i>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Fecha de Inicio"
                className="form-control bg-white"
                style={{ boxShadow: '10 40px 12px rgba(0, 0, 0, 0.1)' }}
              />
            </div>
            <div className="input-group mb-3 flex-column align-items-center">
              <i className="fas fa-calendar-alt mb-2"></i>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="Fecha de Fin"
                className="form-control bg-white"
                style={{ boxShadow: '10 40px 12px rgba(0, 0, 0, 0.1)' }}
              />
            </div>
          </div>
        </div>
      )}
      {loading ? (
        <div className="text-center">Cargando solicitudes...</div>
      ) : requests.length === 0 ? (
        <div className="alert alert-info text-center">No hay solicitudes</div>
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
              {filteredRequests.map((request, index) => {
                const isRed =
                  request.currentStatus === 'Cancelada por el Cliente' ||
                  request.currentStatus === 'Rechazada';

                return (
                  <tr
                    key={request.id}
                    style={{
                      backgroundColor: isRed ? '#f8d7da' : 'inherit',
                      color: isRed ? '#721c24' : 'inherit',
                    }}
                  >
                    <th scope="row" className="text-center">
                      {index + 1}
                    </th>
                    <td className="text-center">
                      {new Date(request.creationDate).toLocaleString()}
                    </td>
                    <td className="text-center">{request.clientRut}</td>
                    <td className="text-center">{loanTypes[request.loanType] || 'Cargando...'}</td>
                    <td className="text-center">{request.currentStatus}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          if (location.state?.from === 'ejecutivo') {
                            if (
                              request.currentStatus === 'Aprobada' ||
                              request.currentStatus === 'Pre-Aprobada'
                            ) {
                              navigate(`/request-details/${request.id}`, {
                                state: { from: 'ejecutivo' },
                              });
                            } else if (request.currentStatus !== 'En evaluación') {
                              navigate(`/evaluate-request/${request.id}`, {
                                state: { key: request.id },
                              });
                            } else {
                              navigate(`/evaluation/${request.id}`);
                            }
                          } else {
                            if (
                              ['En Aprobación Final', 'Pre-Aprobada'].includes(request.currentStatus) &&
                              location.state?.from === 'ejecutivo'
                            ) {
                              navigate(`/request-details/${request.id}`, {
                                state: { from: 'ejecutivo' },
                              });
                            } else {
                              navigate(`/request-details/${request.id}`, {
                                state: { from: 'cliente' },
                              });
                            }
                          }
                        }}
                      >
                        {location.state?.from === 'ejecutivo'
                          ? 'Evaluar'
                          : 'Ver Detalles'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewRequests;