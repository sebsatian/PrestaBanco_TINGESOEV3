import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import requestService from '../services/request.service.js';
import evaluationService from '../services/evaluation.service.js';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/EvaluateRequest.css';

const EvaluateRequest = () => {
  const location = useLocation();
  const initialId = location.state?.key || localStorage.getItem('requestId') || null;
  const [id] = useState(initialId);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    request: {},
    creationSavingAccountDate: '',
    jobStatus: false,
    balance: '1',
    sumAllDeposits: '1',
    balance12MonthsAgo: '1',
    biggestWithdrawalLast12Months: '1',
    balanceAfterBw12Months: '1',
    biggestWithdrawalLast6Months: '1',
    balanceAfterBw6Months: '1',
    numDepositsFirst4Months: '1',
    numDepositsLast4Months: '1',
    numDepositsSecond4Months: '1',
    creditHistory: false,
    sumAllDebts: '1'
  });

  const [error, setError] = useState('');
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showViewer, setShowViewer] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [request, setRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [details, setDetails] = useState('');

  useEffect(() => {
    if (id) {
      const fetchRequest = async () => {
        try {
          const response = await requestService.getRequestById(id);
          setRequest(response.data);
        } catch (error) {
          console.error('Error al obtener la solicitud:', error);
          setError('No se pudo obtener la solicitud. Por favor, vuelva a intentarlo.');
        }
      };

      fetchRequest();
    }
  }, [id]);

  const formatCurrency = (value) => {
    if (!value) return '';
    return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let formattedValue = value;
  
    // Formatear los campos específicos
    if ([
      'balance',
      'sumAllDebts',
      'sumAllDeposits',
      'balance12MonthsAgo',
      'biggestWithdrawalLast12Months',
      'balanceAfterBw12Months',
      'biggestWithdrawalLast6Months',
      'balanceAfterBw6Months'
    ].includes(name)) {
      formattedValue = formatCurrency(value.replace(/\D/g, '')); 
    }
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : formattedValue,
    }));
  };
  const formatToNumber = (value) => {
    return parseFloat(value.replace(/[^0-9.-]+/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const cleanedFormData = {
      ...formData,
      balance: formatToNumber(formData.balance),
      sumAllDeposits: formatToNumber(formData.sumAllDeposits),
      balance12MonthsAgo: formatToNumber(formData.balance12MonthsAgo),
      biggestWithdrawalLast12Months: formatToNumber(formData.biggestWithdrawalLast12Months),
      balanceAfterBw12Months: formatToNumber(formData.balanceAfterBw12Months),
      biggestWithdrawalLast6Months: formatToNumber(formData.biggestWithdrawalLast6Months),
      balanceAfterBw6Months: formatToNumber(formData.balanceAfterBw6Months),
      sumAllDebts: formatToNumber(formData.sumAllDebts),
    };
  
    try {
      const response = await evaluationService.evaluateRequest({
        request: request,
        creationSavingAccountDate: cleanedFormData.creationSavingAccountDate,
        jobStatus: cleanedFormData.jobStatus,
        balance: cleanedFormData.balance,
        sumAllDeposits: cleanedFormData.sumAllDeposits,
        balance12MonthsAgo: cleanedFormData.balance12MonthsAgo,
        biggestWithdrawalLast12Months: cleanedFormData.biggestWithdrawalLast12Months,
        balanceAfterBw12Months: cleanedFormData.balanceAfterBw12Months,
        biggestWithdrawalLast6Months: cleanedFormData.biggestWithdrawalLast6Months,
        balanceAfterBw6Months: cleanedFormData.balanceAfterBw6Months,
        numDepositsFirst4Months: cleanedFormData.numDepositsFirst4Months,
        numDepositsLast4Months: cleanedFormData.numDepositsLast4Months,
        numDepositsSecond4Months: cleanedFormData.numDepositsSecond4Months,
        creditHistory: cleanedFormData.creditHistory,
        sumAllDebts: cleanedFormData.sumAllDebts,
      });
  
      console.log('Evaluación creada exitosamente:', response.data);
  
      await requestService.updateRequestStatus(id, 'En Evaluación');
  
      alert('Evaluación creada exitosamente.');
      navigate(`/evaluation/${id}`); 
  
    } catch (error) {
      console.error('Error al crear la evaluación:', error);
      setError('No se pudo crear la evaluación. Por favor, vuelva a intentarlo.');
    }
  };

  const showDocument = (documentData, buttonId) => {
    if (activeButton === buttonId && showViewer) {
      closeDocument();
    } else if (documentData) {
      const byteCharacters = atob(documentData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setShowViewer(true);
      setActiveButton(buttonId);
    }
  };

  const closeDocument = () => {
    setShowViewer(false);
    setActiveButton(null);
  };

  const handleUpdateDetails = async () => {
    try {
      await requestService.updateRequestDetails(id, details);
      await requestService.updateRequestStatus(id, 'Pendiente de Documentación');
      setShowModal(false);
      alert('El estado se actualizó correctamente.');
      navigate('/');
    } catch (error) {
      console.error('Error al actualizar los detalles de la solicitud:', error);
      alert('Error al actualizar los detalles de la solicitud.');
    }
  };

  if (error) {
    return <div className="alert alert-danger mt-4">{error}</div>;
  }

  if (!request) {
    return <div className="container mt-4">Cargando solicitud...</div>;
  }

  return (
    <div className={`evaluate-request-container ${showViewer ? 'split-view' : ''}`}>
      <div className="evaluate-request-details" style={{ width: showViewer ? '40%' : '40%' }}>
        <div className="button-container-right">
          <Button
            variant="danger"
            onClick={() => setShowModal(true)}
          >
            Error en documentos
          </Button>
        </div>

        <h2>Detalles de la Solicitud</h2>
        <ul className="list-group">
          
          <li className="list-group-item">
            <strong>Certificado de Avalúo:</strong>
            <div className="button-container">
              <button className="document-button" onClick={() => showDocument(request.appraisalCertificate, 'appraisalCertificate')}>
                {activeButton === 'appraisalCertificate' && showViewer ? 'Cerrar PDF' : 'Ver Documento'}
              </button>
            </div>
          </li>
          <li className="list-group-item">
            <strong>Comprobante de Ingresos:</strong>
            <div className="button-container">
              <button className="document-button" onClick={() => showDocument(request.incomeProof, 'incomeProof')}>
                {activeButton === 'incomeProof' && showViewer ? 'Cerrar PDF' : 'Ver Documento'}
              </button>
            </div>
          </li>
          {(() => {
            switch (request.loanType) {
              case 1: {
                return (
                  <>
                    {request.creditHistory && (
                      <li className="list-group-item">
                        <strong>Historial Crediticio:</strong>
                        <div className="button-container">
                          <button className="document-button" onClick={() => showDocument(request.creditHistory, 'creditHistory')}>
                            {activeButton === 'creditHistory' && showViewer ? 'Cerrar PDF' : 'Ver Documento'}
                          </button>
                        </div>
                      </li>
                    )}
                    {request.jobContract && (
                      <li className="list-group-item">
                        <strong>Contrato de Trabajo:</strong>
                        <div className="button-container">
                          <button className="document-button" onClick={() => showDocument(request.jobContract, 'jobContract')}>
                            {activeButton === 'jobContract' && showViewer ? 'Cerrar PDF' : 'Ver Documento'}
                          </button>
                        </div>
                      </li>
                    )}
                  </>
                );
              }
              case 2: {
                return (
                  <>
                    {request.firstHomeDeed && (
                      <li className="list-group-item">
                        <strong>Escritura de la Primera Vivienda:</strong>
                        <div className="button-container">
                          <button className="document-button" onClick={() => showDocument(request.firstHomeDeed, 'firstHomeDeed')}>
                            {activeButton === 'firstHomeDeed' && showViewer ? 'Cerrar PDF' : 'Ver Documento'}
                          </button>
                        </div>
                      </li>
                    )}
                    {request.creditHistory && (
                      <li className="list-group-item">
                        <strong>Historial Crediticio:</strong>
                        <div className="button-container">
                          <button className="document-button" onClick={() => showDocument(request.creditHistory, 'creditHistory')}>
                            {activeButton === 'creditHistory' && showViewer ? 'Cerrar PDF' : 'Ver Documento'}
                          </button>
                        </div>
                      </li>
                    )}
                    {request.jobContract && (
                      <li className="list-group-item">
                        <strong>Contrato de Trabajo:</strong>
                        <div className="button-container">
                          <button className="document-button" onClick={() => showDocument(request.jobContract, 'jobContract')}>
                            {activeButton === 'jobContract' && showViewer ? 'Cerrar PDF' : 'Ver Documento'}
                          </button>
                        </div>
                      </li>
                    )}
                  </>
                );
              }
              case 3: {
                return (
                  <>
                    {request.businessPlan && (
                      <li className="list-group-item">
                        <strong>Plan de Negocios:</strong>
                        <div className="button-container">
                          <button className="document-button" onClick={() => showDocument(request.businessPlan, 'businessPlan')}>
                            {activeButton === 'businessPlan' && showViewer ? 'Cerrar PDF' : 'Ver Documento'}
                          </button>
                        </div>
                      </li>
                    )}
                    {request.financialStatement && (
                      <li className="list-group-item">
                        <strong>Estado Financiero:</strong>
                        <div className="button-container">
                          <button className="document-button" onClick={() => showDocument(request.financialStatement, 'financialStatement')}>
                            {activeButton === 'financialStatement' && showViewer ? 'Cerrar PDF' : 'Ver Documento'}
                          </button>
                        </div>
                      </li>
                    )}
                  </>
                );
              }
              case 4: {
                return (
                  <>
                    {request.remodelingBudget && (
                      <li className="list-group-item">
                        <strong>Presupuesto de Remodelación:</strong>
                        <div className="button-container">
                          <button className="document-button" onClick={() => showDocument(request.remodelingBudget, 'remodelingBudget')}>
                            {activeButton === 'remodelingBudget' && showViewer ? 'Cerrar PDF' : 'Ver Documento'}
                          </button>
                        </div>
                      </li>
                    )}
                  </>
                );
              }
              default: {
                return null;
              }
            }
          })()}
        </ul>
        <h2 className="text-center mb-4">Evaluar Solicitud</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mt-3">
            <label htmlFor="creationSavingAccountDate">Fecha de Creación de la Cuenta de Ahorro</label>
            <input
              type="date"
              className="form-control"
              id="creationSavingAccountDate"
              name="creationSavingAccountDate"
              value={formData.creationSavingAccountDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="jobStatus">Marcar si el cliente tiene estabilidad laboral y económica</label>
            <input
              type="checkbox"
              className="form-check-input border border-primary shadow-sm"
              id="jobStatus"
              name="jobStatus"
              checked={formData.jobStatus}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="balance">Saldo</label>
            <input
              type="text"
              className="form-control"
              id="balance"
              name="balance"
              value={formData.balance}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="creditHistory">Marcar si el cliente NO tiene morosidades importantes</label>
            <input
              type="checkbox"
              className="form-check-input border border-primary shadow-sm"
              id="creditHistory"
              name="creditHistory"
              checked={formData.creditHistory}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="sumAllDebts">Suma de Todas las Deudas</label>
            <input
              type="text"
              className="form-control"
              id="sumAllDebts"
              name="sumAllDebts"
              value={formData.sumAllDebts}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="sumAllDeposits">Suma de Todos los Depósitos</label>
            <input
              type="text"
              className="form-control"
              id="sumAllDeposits"
              name="sumAllDeposits"
              value={formData.sumAllDeposits}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="balance12MonthsAgo">Saldo Hace 12 Meses</label>
            <input
              type="text"
              className="form-control"
              id="balance12MonthsAgo"
              name="balance12MonthsAgo"
              value={formData.balance12MonthsAgo}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="biggestWithdrawalLast12Months">Mayor Retiro en los Últimos 12 Meses</label>
            <input
              type="text"
              className="form-control"
              id="biggestWithdrawalLast12Months"
              name="biggestWithdrawalLast12Months"
              value={formData.biggestWithdrawalLast12Months}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="balanceAfterBw12Months">Saldo Después del Mayor Retiro en los Últimos 12 Meses</label>
            <input
              type="text"
              className="form-control"
              id="balanceAfterBw12Months"
              name="balanceAfterBw12Months"
              value={formData.balanceAfterBw12Months}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="biggestWithdrawalLast6Months">Mayor Retiro en los Últimos 6 Meses</label>
            <input
              type="text"
              className="form-control"
              id="biggestWithdrawalLast6Months"
              name="biggestWithdrawalLast6Months"
              value={formData.biggestWithdrawalLast6Months}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="balanceAfterBw6Months">Saldo Después del Mayor Retiro en los Últimos 6 Meses</label>
            <input
              type="text"
              className="form-control"
              id="balanceAfterBw6Months"
              name="balanceAfterBw6Months"
              value={formData.balanceAfterBw6Months}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="numDepositsFirst4Months">Número de Depósitos en los Primeros 4 Meses</label>
            <input
              type="number"
              className="form-control"
              id="numDepositsFirst4Months"
              name="numDepositsFirst4Months"
              value={formData.numDepositsFirst4Months}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="numDepositsSecond4Months">Número de Depósitos en los Segundos 4 Meses</label>
            <input
              type="number"
              className="form-control"
              id="numDepositsSecond4Months"
              name="numDepositsSecond4Months"
              value={formData.numDepositsSecond4Months}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group mt-3">
          <label htmlFor="numDepositsLast4Months">Número de Depósitos en los Últimos 4 Meses</label>
            <input
              type="number"
              className="form-control"
              id="numDepositsLast4Months"
              name="numDepositsLast4Months"
              value={formData.numDepositsLast4Months}
              onChange={handleInputChange}
              required
            />
          </div>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          <button type="submit" className="btn btn-primary mt-4">Crear Evaluación</button>
        </form>
      </div>
      <div className="pdf-preview">
        <iframe
          src={pdfUrl + "#toolbar=1"}
          title="Documento PDF"
          style={{ width: '75%', height: '100%' }}
        />
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDetails">
              <Form.Label>Escribir detalles:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleUpdateDetails}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EvaluateRequest;