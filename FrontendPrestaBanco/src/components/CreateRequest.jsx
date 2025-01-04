import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import http from '../http-common';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Modal, Button } from 'react-bootstrap';
import '../App.css';

const CreateRequest = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState({});
  const [loanType, setLoanType] = useState(null);
  const [simulation, setSimulation] = useState(null);
  const [error, setError] = useState('');
  const [loanTypeName, setLoanTypeName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPDFErrorModal, setShowPDFErrorModal] = useState(false);
  

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

  const checkFilesArePDF = () => {
    for (const key in documents) {
      if (key !== 'monthlyIncome' && documents[key]) {
        const file = documents[key];
        if (!file.name.toLowerCase().endsWith('.pdf')) {
          return false;
        }
      }
    }
    return true;
  };

  const fileNamesInSpanish = {
    appraisalCertificate: 'Certificado de Avalúo',
    incomeProof: 'Comprobante de Ingresos',
    savingsAccount: 'Cuenta de Ahorro',
    jobContract: 'Contrato de Trabajo',
    creditHistory: 'Historial Crediticio',
    firstHomeDeed: 'Escritura de la Primera Vivienda',
    businessPlan: 'Plan de Negocios',
    financialStatement: 'Estado Financiero',
    remodelingBudget: 'Presupuesto de Remodelación',
    
  };
  const validateMonthlyIncome = () => {
    const monthlyIncome = documents.monthlyIncome || '';
    const numericValue = parseFloat(monthlyIncome.replace(/[^0-9]/g, ''));
    if (monthlyIncome.trim() === '' || isNaN(numericValue)) {
      setError('El ingreso mensual es requerido y debe ser un valor válido.');
      setShowModal(true);
      return false;
    }
    return true;
  };


  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateMonthlyIncome()) {
      return;
    }    
  
    const requiredDocs = getRequiredDocuments(loanType);
    const missingDocs = requiredDocs.filter(doc => !documents[doc]);
  
    if (missingDocs.length > 0) {
      // Map missing document keys to their Spanish names
      const missingNames = missingDocs.map(doc => fileNamesInSpanish[doc] || doc).join(', ');
      setError(`Faltan archivos por subir: ${missingNames}`);
      setShowModal(true);
      return;
    }
  
    if (!simulation) {
      setError('No se pudo obtener la simulación.');
      setShowModal(true);
      return;
    }
  
    if (!checkFilesArePDF()) {
      setShowPDFErrorModal(true);
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('simulation', new Blob([JSON.stringify(simulation)], { type: 'application/json' }));
      formData.append('incomeProof', documents.incomeProof);
      formData.append('appraisalCertificate', documents.appraisalCertificate);
      formData.append('savingsAccount', documents.savingsAccount);
      formData.append('monthlyIncome', parseFloat(documents.monthlyIncome.replace(/[^0-9]/g, '')));
  
      let response;
      switch (loanType) {
        case 1:
          formData.append('jobContract', documents.jobContract);
          formData.append('creditHistory', documents.creditHistory);
          response = await http.post('/firsthomereq/create', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          break;
        case 2:
          formData.append('jobContract', documents.jobContract);
          formData.append('creditHistory', documents.creditHistory);
          formData.append('firstHomeDeed', documents.firstHomeDeed);
          response = await http.post('/secondhomereq/create', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          break;
        case 3:
          formData.append('businessPlan', documents.businessPlan);
          formData.append('financialStatement', documents.financialStatement);
          response = await http.post('/businessreq/create', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          break;
        case 4:
          formData.append('remodelingBudget', documents.remodelingBudget);
          response = await http.post('/remodelingreq/create', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          break;
        default:
          setError('Tipo de préstamo no válido.');
          setShowModal(true);
          return;
      }
  
      if (response && response.status === 200) {
        setShowSuccessModal(true); // Mostrar modal de éxito
      } else {
        setError('Hubo un error al enviar la solicitud. Por favor, inténtalo de nuevo.');
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      setError('Hubo un error al enviar la solicitud. Por favor, inténtalo de nuevo.');
      setShowModal(true);
    }
  };
  const getRequiredDocuments = (loanType) => {
    switch (loanType) {
      case 1:
        return ['appraisalCertificate', 'incomeProof', 'savingsAccount', 'jobContract', 'creditHistory'];
      case 2:
        return ['appraisalCertificate', 'incomeProof', 'savingsAccount', 'jobContract', 'creditHistory', 'firstHomeDeed'];
      case 3:
        return ['appraisalCertificate', 'incomeProof', 'savingsAccount', 'businessPlan', 'financialStatement'];
      case 4:
        return ['appraisalCertificate', 'incomeProof', 'savingsAccount', 'remodelingBudget'];
      default:
        return [];
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/'); // Redirige a la página principal
  };

  const handlePDFErrorClose = () => {
    setShowPDFErrorModal(false);
  };

  if (!loanType) {
    return <div className="container mt-4">Cargando solicitud de préstamo...</div>;
  }

  return (
    <div className="container mt-5" style={{ width: '60rem' }}>
      <div className="background-white-container">
        <h2>
          <i className="fas fa-hand-holding-usd" style={{ marginRight: '8px' }}></i>
          Solicitar Préstamo - {loanTypeName}
        </h2>
        <form onSubmit={handleSubmit}>
        <div className="form-group mt-3 mb-3">
            <label htmlFor="monthlyIncome">
              <i className="fas fa-dollar-sign" style={{ marginRight: '8px' }}></i>
              Ingreso Mensual
            </label>
            <input
              type="text"
              className="form-control"
              id="monthlyIncome"
              name="monthlyIncome"
              value={documents.monthlyIncome || ''}
              placeholder="Ingrese su ingreso mensual en pesos chilenos"
              onChange={handleInputChange}
            />
          </div>
          <h4> Documentos (Solo PDF)</h4>
          <div className="form-group mt-3">
            <label htmlFor="appraisalCertificate">
              <i className="fas fa-file-alt" style={{ marginRight: '8px' }}></i>
              Certificado de Avalúo
            </label>
            <input
              type="file"
              className="form-control"
              id="appraisalCertificate"
              name="appraisalCertificate"
              onChange={handleDocumentChange}
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="incomeProof">
              <i className="fas fa-file-invoice" style={{ marginRight: '8px' }}></i>
              Comprobante de Ingresos
            </label>
            <input
              type="file"
              className="form-control"
              id="incomeProof"
              name="incomeProof"
              onChange={handleDocumentChange}
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="savingsAccount">
              <i className="fas fa-piggy-bank" style={{ marginRight: '8px' }}></i>
              Cuenta de Ahorro
            </label>
            <input
              type="file"
              className="form-control"
              id="savingsAccount"
              name="savingsAccount"
              onChange={handleDocumentChange}
            />
          </div>

          {loanType === 1 && (
            <>
              <div className="form-group mt-3">
                <label htmlFor="jobContract">
                  <i className="fas fa-file-contract" style={{ marginRight: '8px' }}></i>
                  Contrato de Trabajo
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="jobContract"
                  name="jobContract"
                  onChange={handleDocumentChange}
                />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="creditHistory">
                  <i className="fas fa-history" style={{ marginRight: '8px' }}></i>
                  Historial Crediticio
                </label>
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
                <label htmlFor="jobContract">
                  <i className="fas fa-file-contract" style={{ marginRight: '8px' }}></i>
                  Contrato de Trabajo
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="jobContract"
                  name="jobContract"
                  onChange={handleDocumentChange}
                />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="creditHistory">
                  <i className="fas fa-history" style={{ marginRight: '8px' }}></i>
                  Historial Crediticio
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="creditHistory"
                  name="creditHistory"
                  onChange={handleDocumentChange}
                />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="firstHomeDeed">
                  <i className="fas fa-file-alt" style={{ marginRight: '8px' }}></i>
                  Escritura de la Primera Vivienda
                </label>
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
                <label htmlFor="businessPlan">
                  <i className="fas fa-file-alt" style={{ marginRight: '8px' }}></i>
                  Plan de Negocios
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="businessPlan"
                  name="businessPlan"
                  onChange={handleDocumentChange}
                />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="financialStatement">
                  <i className="fas fa-file-alt" style={{ marginRight: '8px' }}></i>
                  Estado Financiero
                </label>
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
              <label htmlFor="remodelingBudget">
                <i className="fas fa-file-alt" style={{ marginRight: '8px' }}></i>
                Presupuesto de Remodelación
              </label>
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
            <i className="fas fa-paper-plane" style={{ marginRight: '8px' }}></i>
            Enviar Solicitud
          </button>
        </form>
      </div>

      {showModal && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>{error}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {showPDFErrorModal && (
        <Modal show={showPDFErrorModal} onHide={handlePDFErrorClose}>
          <Modal.Header closeButton>
            <Modal.Title>Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>Todos los archivos deben ser PDF.</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handlePDFErrorClose}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {showSuccessModal && (
        <Modal show={showSuccessModal} onHide={handleSuccessClose}>
          <Modal.Header closeButton>
            <Modal.Title>Solicitud Enviada</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>¡Tu solicitud ha sido enviada exitosamente!</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleSuccessClose}>
              Volver a Inicio
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {showModal && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>{error}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {showModal && (
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    )}
    </div>
  );
};

export default CreateRequest;