import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import evaluationService from '../services/evaluation.service.js';
import requestService from '../services/request.service.js';
import '../styles/EvaluationDetails.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const EvaluationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState('');
  const [modalDetail, setModalDetail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectDetails, setRejectDetails] = useState('');
  const details = {
    costToIncomeRatio: 'La relación es mayor al 35%',
    creditHistory: 'Alta cantidad de deudas o morosidades graves',
    jobStatus: 'No tiene la antigüedad necesaria o no presenta estabilidad financiera',
    debtToIncomeRatio: 'La suma de todas las deudas supera el 50% de los ingresos mensuales',
    inAge: 'Va a hacer perro muerto'
  };

  useEffect(() => {
    if (id) {
      const fetchEvaluation = async () => {
        try {
          const response = await evaluationService.getEvaluationById(id);
          setEvaluation(response.data);
        } catch (error) {
          console.error('Error al obtener la evaluación:', error);
          setError('No se pudo obtener la evaluación. Por favor, vuelva a intentarlo.');
        }
      };

      fetchEvaluation();
    }
  }, [id]);

  const handleShowModal = (detail) => {
    setModalDetail(detail);
    setShowModal(true);
  };

  const handleRejectDetails = async () => {
    try {
      await requestService.updateRequestDetails(id, rejectDetails);
      await requestService.updateRequestStatus(id, 'Rechazada');
      setShowRejectModal(false);
      alert('El estado se actualizó correctamente.');
      navigate('/'); 
    } catch (error) {
      console.error('Error al actualizar los detalles de la solicitud:', error);
      alert('Error al actualizar los detalles de la solicitud.');
    }
  };

  const handleCalculateTotalCosts = async () => {
    try {
      await requestService.postTotalCosts(id);
      navigate(`/total-costs/${id}`, { state: 'costos' });
    } catch (error) {
      console.error('Error al calcular los costos totales:', error);
      setError('No se pudo calcular los costos totales. Por favor, vuelva a intentarlo.');
    }
  };

  if (error) {
    return <div className="alert alert-danger mt-4">{error}</div>;
  }

  if (!evaluation) {
    return <div className="container mt-4">Cargando evaluación...</div>;
  }

  const renderEvaluationItem = (label, value, detailKey) => {
    const isTrue = value;
    console.log("Detalle: ", details[detailKey]);
    return (
      <li
        className={`list-group-item ${isTrue ? 'bg-success text-dark' : 'bg-danger text-dark'}`}
      >
        <span className="label-text">{label}</span>
        {!isTrue && (
          <Button
            variant="primary"
            size="sm"
            className="btn-right"
            onClick={() => handleShowModal(details[detailKey])}
          >
            Ver detalle
          </Button>
        )}
      </li>
    );
  };

  return (
    <div className="container mt-4 position-relative">
      <h2>Detalles de la Evaluación</h2>
      <h4>Parámetros</h4>

      <ul className="list-group">
        {renderEvaluationItem('Relación cuota ingreso', evaluation.costToIncomeRatio, 'costToIncomeRatio')}
        {renderEvaluationItem('Historial crediticio', evaluation.creditHistory, 'creditHistory')}
        {renderEvaluationItem('Antigüedad laboral y estabilidad financiera', evaluation.jobStatus, 'jobStatus')}
        {renderEvaluationItem('Relación Deuda/Ingreso', evaluation.debtToIncomeRatio, 'debtToIncomeRatio')}
        {renderEvaluationItem('Edad del solicitante', evaluation.inAge, 'inAge')}
        {console.log("Evaluación: ", evaluation)}
      </ul>

      <div className="d-flex justify-content-between mt-3">
        <Button
          variant="danger"
          style={{ marginRight: '10px' }}
          onClick={() => setShowRejectModal(true)}
        >
          Rechazar solicitud
        </Button>
        <Button
          variant="primary"
          onClick={() => navigate(`/saving-capacity/${id}`)}
        >
          Capacidad de ahorro
        </Button>
        <Button
          variant="success"
          onClick={handleCalculateTotalCosts}
          style={{ marginLeft: '10px' }}
        >
          Calcular Costos Totales
        </Button>
      </div>
      <h6 style={{ borderTop: '2px  #dee2e6', paddingTop: '20px' }}>
        Los parámetros que se encuentren en rojo demuestran no haber superado la evaluación
      </h6>
      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalle de Evaluación</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalDetail}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal para Rechazo */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Escribir detalles de rechazo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formRejectDetails">
              <Form.Label>Escribir detalles:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={rejectDetails}
                onChange={(e) => setRejectDetails(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleRejectDetails}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EvaluationDetails;