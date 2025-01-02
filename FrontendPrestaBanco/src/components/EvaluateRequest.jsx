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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showInvalidDateModal, setShowInvalidDateModal] = useState(false);
const [invalidDateMessage, setInvalidDateMessage] = useState('');

  const [formData, setFormData] = useState({
    request: {},
    creationSavingAccountDate: '',
    jobStatus: false,
    balance: '',
    sumAllDeposits: '',
    balance12MonthsAgo: '',
    biggestWithdrawalLast12Months: '',
    balanceAfterBw12Months: '',
    biggestWithdrawalLast6Months: '',
    balanceAfterBw6Months: '',
    numDepositsFirst4Months: '',
    numDepositsLast4Months: '',
    numDepositsSecond4Months: '',
    creditHistory: false,
    sumAllDebts: ''
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
    return parseInt(value.replace(/[^0-9-]+/g, ''), 10);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const currentDate = new Date();
    const creationDate = new Date(formData.creationSavingAccountDate);
  
    if (creationDate > currentDate) {
      setInvalidDateMessage('La fecha de creación de la cuenta de ahorro no puede ser una fecha futura.');
      setShowInvalidDateModal(true);
      return;
    }
  
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
      console.log('Detalles de la solicitud:', cleanedFormData);
  
      await requestService.updateRequestStatus(id, 'En Evaluación');
  
      setShowSuccessModal(true); // Mostrar modal de éxito
  
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
          <hr className="my-2" />
          <h4 className="text-left">Deudas y cuenta de ahorro</h4>
          <hr className="my-2" />
          <form onSubmit={handleSubmit}>
  <div className="form-group mt-3">
    <label htmlFor="jobStatus">
      <i className="fas fa-briefcase" style={{ marginRight: '8px' }}></i>
      Marcar si el cliente tiene estabilidad laboral y económica
    </label>
    <input
      type="checkbox"
      className="form-check-input  ms-3"
      id="jobStatus"
      name="jobStatus"
      checked={formData.jobStatus}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group mt-3">
    <label htmlFor="creditHistory">
      <i className="fas fa-history" style={{ marginRight: '8px' }}></i>
      Marcar si el cliente NO tiene morosidades importantes
    </label>
    <input
      type="checkbox"
      className="form-check-input border border-primary shadow-sm ms-4"
      id="creditHistory"
      name="creditHistory"
      checked={formData.creditHistory}
      onChange={handleInputChange}
    />
  </div>
  <div className="form-group mt-3">
    <label htmlFor="creationSavingAccountDate">
      <i className="fas fa-calendar-alt" style={{ marginRight: '8px' }}></i>
      Fecha de Creación de la Cuenta de Ahorro
    </label>
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
    <label htmlFor="balance">
      <i className="fas fa-dollar-sign" style={{ marginRight: '8px' }}></i>
      Saldo
    </label>
    <input
      type="text"
      className="form-control"
      id="balance"
      name="balance"
      placeholder="Saldo actual de la cuenta de ahorro del cliente"
      value={formData.balance}
      onChange={handleInputChange}
      maxLength={15}
      required
    />
  </div>
  <div className="form-group mt-3">
    <label htmlFor="sumAllDebts">
      <i className="fas fa-money-bill-wave" style={{ marginRight: '8px' }}></i>
      Total deudas
    </label>
    <input
      type="text"
      className="form-control"
      id="sumAllDebts"
      name="sumAllDebts"
      placeholder="Suma $$ de todas las deudas del cliente (revisar en Dicom)"
      value={formData.sumAllDebts}
      onChange={handleInputChange}
      maxLength={15}
      required
    />
  </div>
  <div className="form-group mt-3">
    <label htmlFor="sumAllDeposits">
      <i className="fas fa-piggy-bank" style={{ marginRight: '8px' }}></i>
      Total depósitos
    </label>
    <input
      type="text"
      className="form-control"
      id="sumAllDeposits"
      name="sumAllDeposits"
      placeholder="Suma $$ de todos los depósitos del cliente a su cuenta de ahorro"
      value={formData.sumAllDeposits}
      onChange={handleInputChange}
      maxLength={15}
      required
    />
  </div>
  <div className="form-group mt-3" style={{ paddingBottom: '20px' }}>
    <label htmlFor="balance12MonthsAgo">
      <i className="fas fa-calendar-alt" style={{ marginRight: '8px' }}></i>
      Saldo hace 12 meses
    </label>
    <input
      type="text"
      className="form-control"
      id="balance12MonthsAgo"
      name="balance12MonthsAgo"
      placeholder="Saldo de la cuenta de ahorro del cliente hace 12 meses"
      value={formData.balance12MonthsAgo}
      onChange={handleInputChange}
      maxLength={15}
      required
    />
  </div>
  <hr className="my-2" />
  <h4 className="text-left" style={{ marginBottom: '10px' }}>Retiros y depósitos en el último año</h4>
  <hr className="my-2" style={{ paddingBottom: '10px' }} />
  <h5 className="text-left" style={{ marginBottom: '0px' }}>Últimos 12 meses</h5>
  <div className="form-group mt-3">
    <label htmlFor="biggestWithdrawalLast12Months">
      <i className="fas fa-hand-holding-usd" style={{ marginRight: '8px' }}></i>
      Mayor retiro en los últimos 12 meses
    </label>
    <input
      type="text"
      className="form-control"
      id="biggestWithdrawalLast12Months"
      placeholder="Cantidad $$ del mayor retiro del cliente en los últimos 12 meses"
      name="biggestWithdrawalLast12Months"
      value={formData.biggestWithdrawalLast12Months}
      onChange={handleInputChange}
      maxLength={15}
      required
    />
  </div>
  <div className="form-group mt-3">
    <label htmlFor="balanceAfterBw12Months">
      <i className="fas fa-dollar-sign" style={{ marginRight: '8px' }}></i>
      Saldo después del retiro
    </label>
    <input
      type="text"
      className="form-control"
      id="balanceAfterBw12Months"
      name="balanceAfterBw12Months"
      value={formData.balanceAfterBw12Months}
      placeholder="Saldo después del mayor retiro en los últimos 12 meses"
      onChange={handleInputChange}
      maxLength={15}
      required
    />
  </div>
  <hr className="my-2" style={{ paddingBottom: '10px' }} />
  <h5 className="text-left" style={{ marginBottom: '0px' }}>Últimos 6 meses</h5>
  <div className="form-group mt-3">
    <label htmlFor="biggestWithdrawalLast6Months">
      <i className="fas fa-hand-holding-usd" style={{ marginRight: '8px' }}></i>
      Mayor retiro en los últimos 6 meses
    </label>
    <input
      type="text"
      className="form-control"
      id="biggestWithdrawalLast6Months"
      name="biggestWithdrawalLast6Months"
      placeholder="Cantidad $$ del mayor retiro del cliente en los últimos 6 meses"
      value={formData.biggestWithdrawalLast6Months}
      onChange={handleInputChange}
      maxLength={15}
      required
    />
  </div>
  <div className="form-group mt-3" style={{ paddingBottom: '10px' }}>
    <label htmlFor="balanceAfterBw6Months">
      <i className="fas fa-dollar-sign" style={{ marginRight: '8px' }}></i>
      Saldo después del retiro
    </label>
    <input
      type="text"
      className="form-control"
      id="balanceAfterBw6Months"
      name="balanceAfterBw6Months"
      placeholder="Saldo después del mayor retiro en los últimos 6 meses"
      value={formData.balanceAfterBw6Months}
      onChange={handleInputChange}
      maxLength={15}
      required
    />
  </div>
  <hr className="my-2" />
  <h4 className="text-left" style={{ marginBottom: '10px' }}>Depósitos por trimestre en el último año</h4>
  <hr className="my-2" style={{ paddingBottom: '10px' }} />
  <h6 className="text-left" style={{ marginBottom: '0px' }}>Agrupar de a 4 meses y contar el número de depósitos por cada trimestre</h6>
  <div className="form-group mt-3">
    <label htmlFor="numDepositsFirst4Months">
      <i className="fas fa-calendar-alt" style={{ marginRight: '8px' }}></i>
      1er trimestre
    </label>
    <input
      type="number"
      className="form-control"
      id="numDepositsFirst4Months"
      name="numDepositsFirst4Months"
      placeholder="Cantidad de depósitos en los primeros 4 meses del año"
      value={formData.numDepositsFirst4Months}
      onChange={(e) => {
        const value = e.target.value;
        if (value.length <= 3) {
          setFormData((prev) => ({
            ...prev,
            numDepositsFirst4Months: value,
          }));
        }
      }}
      max={999}
      required
    />
  </div>
  <div className="form-group mt-3">
    <label htmlFor="numDepositsSecond4Months">
      <i className="fas fa-calendar-alt" style={{ marginRight: '8px' }}></i>
      2do trimestre
    </label>
    <input
      type="number"
      className="form-control"
      id="numDepositsSecond4Months"
      name="numDepositsSecond4Months"
      placeholder="Cantidad de depósitos en los segundos 4 meses del año"
      value={formData.numDepositsSecond4Months}
      onChange={(e) => {
        const value = e.target.value;
        if (value.length <= 3) {
          setFormData((prev) => ({
            ...prev,
            numDepositsSecond4Months: value,
          }));
        }
      }}
      max={999}
      required
    />
  </div>
  <div className="form-group mt-3">
    <label htmlFor="numDepositsLast4Months">
      <i className="fas fa-calendar-alt" style={{ marginRight: '8px' }}></i>
      3er trimestre
    </label>
    <input
      type="number"
      className="form-control"
      id="numDepositsLast4Months"
      name="numDepositsLast4Months"
      placeholder="Cantidad de depósitos en los últimos 4 meses del año"
      value={formData.numDepositsLast4Months}
      onChange={(e) => {
        const value = e.target.value;
        if (value.length <= 3) {
          setFormData((prev) => ({
            ...prev,
            numDepositsLast4Months: value,
          }));
        }
      }}
      max={999}
      required
    />
  </div>
  {error && <div className="alert alert-danger mt-3">{error}</div>}
  <button type="submit" className="btn btn-primary mt-4">
    <i className="fas fa-paper-plane" style={{ marginRight: '8px' }}></i>
    Crear Evaluación
  </button>
</form>
      </div>
      <div className="pdf-preview">
        <iframe
          src={pdfUrl + "#toolbar=1"}
          title="Documento PDF"
          style={{ width: '75%', height: '85%' }}
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
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Evaluación Creada</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¡La evaluación ha sido creada exitosamente!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => {
            setShowSuccessModal(false);
            navigate(`/evaluation/${id}`);
          }}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showInvalidDateModal} onHide={() => setShowInvalidDateModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Fecha Inválida</Modal.Title>
      </Modal.Header>
      <Modal.Body>{invalidDateMessage}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowInvalidDateModal(false)}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
    </div>
  );
};

export default EvaluateRequest;