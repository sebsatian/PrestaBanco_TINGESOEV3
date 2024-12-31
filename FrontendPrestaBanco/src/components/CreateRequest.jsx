import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import http from '../http-common'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateRequest = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState({});
  const [loanType, setLoanType] = useState(null);
  const [simulation, setSimulation] = useState(null);
  const [error, setError] = useState('');
  const [loanTypeName, setLoanTypeName] = useState('');

  useEffect(() => {
    if (location.state && location.state.simulation) {
      setSimulation(location.state.simulation);
      setLoanType(location.state.simulation.loanType);
      http.get(`/loan-types/${location.state.simulation.loanType}`)
        .then((response) => {
          setLoanTypeName(response.data.type);
        })
        .catch((error) => {
          console.error('Error al obtener el tipo de préstamo:', error);
          setError('No se pudo obtener el tipo de préstamo. Por favor, vuelva a intentarlo.');
        });
    } else {
      setError('No se pudo obtener la simulación. Por favor, vuelva a intentarlo.');
    }
  }, [location.state]);

  const formatCurrency = (value) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    return cleanValue.length > 11 ? documents.monthlyIncome : `$${cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDocuments((prev) => ({
      ...prev,
      [name]: name === 'monthlyIncome' ? formatCurrency(value) : value,
    }));
  };

  const handleDocumentChange = (e) => {
    setDocuments({
      ...documents,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!simulation) {
      setError('No se pudo obtener la simulación.');
      return;
    }

    try {
      // Create a new FormData object
      const formData = new FormData();

      // Add the simulation data
      formData.append('simulation', new Blob([JSON.stringify(simulation)], { type: 'application/json' }));

      // Add the documents
      formData.append('incomeProof', documents.incomeProof);
      formData.append('appraisalCertificate', documents.appraisalCertificate);
      formData.append('savingsAccount', documents.savingsAccount);

      // Add the monthly income
      const monthlyIncomeValue = parseFloat(documents.monthlyIncome.replace(/[^0-9]/g, ''));
      formData.append('monthlyIncome', monthlyIncomeValue);

      let response;
      switch (loanType) {
        case 1:
          formData.append('jobContract', documents.jobContract);
          formData.append('creditHistory', documents.creditHistory);
          response = await http.post('/firsthomereq/create', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          break;
        case 2:
          formData.append('jobContract', documents.jobContract);
          formData.append('creditHistory', documents.creditHistory);
          formData.append('firstHomeDeed', documents.firstHomeDeed);
          response = await http.post('/secondhomereq/create', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          break;
        case 3:
          formData.append('businessPlan', documents.businessPlan);
          formData.append('financialStatement', documents.financialStatement);
          response = await http.post('/businessreq/create', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          break;
        case 4:
          formData.append('remodelingBudget', documents.remodelingBudget);
          response = await http.post('/remodelingreq/create', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          break;
        default:
          setError('Tipo de préstamo no válido.');
          return;
      }

      if (response && response.status === 200) {
        navigate('/view-requests'); // Redirect to the requests view
      } else {
        setError('Hubo un error al enviar la solicitud. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      setError('Hubo un error al enviar la solicitud. Por favor, inténtalo de nuevo.');
    }
  };

  if (error) {
    return <div className="alert alert-danger mt-4">{error}</div>;
  }

  if (!loanType) {
    return <div className="container mt-4">Cargando solicitud de préstamo...</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Solicitar Préstamo - {loanTypeName}</h2>
      <form onSubmit={handleSubmit}>
        {}
        <div className="form-group mt-3">
          <label htmlFor="appraisalCertificate">Certificado de Avalúo</label>
          <input
            type="file"
            className="form-control"
            id="appraisalCertificate"
            name="appraisalCertificate"
            onChange={handleDocumentChange}
            required
          />
        </div>
        
        <div className="form-group mt-3">
          <label htmlFor="monthlyIncome">Ingreso Mensual</label>
          <input
            type="text"
            className="form-control"
            id="monthlyIncome"
            name="monthlyIncome"
            value={documents.monthlyIncome || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="incomeProof">Comprobante de Ingresos</label>
          <input
            type="file"
            className="form-control"
            id="incomeProof"
            name="incomeProof"
            onChange={handleDocumentChange}
            required
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="savingsAccount">Cuenta de Ahorro</label>
          <input
            type="file"
            className="form-control"
            id="savingsAccount"
            name="savingsAccount"
            onChange={handleDocumentChange}
            required
          />
        </div>

        {}
        {loanType === 1 && (
          <>
            <div className="form-group mt-3">
              <label htmlFor="jobContract">Contrato de Trabajo</label>
              <input
                type="file"
                className="form-control"
                id="jobContract"
                name="jobContract"
                onChange={handleDocumentChange}
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="creditHistory">Historial Crediticio</label>
              <input
                type="file"
                className="form-control"
                id="creditHistory"
                name="creditHistory"
                onChange={handleDocumentChange}
              />
            </div>
          </>
        )}
        {loanType === 2 && (
          <>
            <div className="form-group mt-3">
              <label htmlFor="jobContract">Contrato de Trabajo</label>
              <input
                type="file"
                className="form-control"
                id="jobContract"
                name="jobContract"
                onChange={handleDocumentChange}
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="creditHistory">Historial Crediticio</label>
              <input
                type="file"
                className="form-control"
                id="creditHistory"
                name="creditHistory"
                onChange={handleDocumentChange}
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="firstHomeDeed">Escritura de la Primera Vivienda</label>
              <input
                type="file"
                className="form-control"
                id="firstHomeDeed"
                name="firstHomeDeed"
                onChange={handleDocumentChange}
              />
            </div>
          </>
        )}
        {loanType === 3 && (
          <>
            <div className="form-group mt-3">
              <label htmlFor="businessPlan">Plan de Negocios</label>
              <input
                type="file"
                className="form-control"
                id="businessPlan"
                name="businessPlan"
                onChange={handleDocumentChange}
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="financialStatement">Estado Financiero</label>
              <input
                type="file"
                className="form-control"
                id="financialStatement"
                name="financialStatement"
                onChange={handleDocumentChange}
              />
            </div>
          </>
        )}
        {loanType === 4 && (
          <div className="form-group mt-3">
            <label htmlFor="remodelingBudget">Presupuesto de Remodelación</label>
            <input
              type="file"
              className="form-control"
              id="remodelingBudget"
              name="remodelingBudget"
              onChange={handleDocumentChange}
            />
          </div>
        )}

        <button type="submit" className="btn btn-primary mt-4">
          Enviar Solicitud
        </button>
      </form>
    </div>
  );
};

export default CreateRequest;