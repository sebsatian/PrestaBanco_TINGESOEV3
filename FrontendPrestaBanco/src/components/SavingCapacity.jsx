import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import evaluationService from '../services/evaluation.service.js';
import requestService from '../services/request.service.js';
import '../styles/EvaluationDetails.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const SavingCapacityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [savingCapacity, setSavingCapacity] = useState(null);
  const [error, setError] = useState('');
  const [modalDetail, setModalDetail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectDetails, setRejectDetails] = useState('');
  const details = {
    minAmount: 'El saldo es inferior al 10% del préstamo solicitado',
    consistentHistory: 'Se hizo un retiro de más del 50% del saldo y/o no se ha mantenido un saldo positivo',
    periodicDeposits: 'No existe regularidad mensual ni trimestal en los depósitos y/o los depósitos no suman el 5% de ingresos mensuales',
    relationAmountYears: 'La cuenta tiene menos de 2 años y no cumple con el saldo mínimo del 20% del monto del préstamo solicitado, o tiene 2 años o más y no cumple con el 10%',
    recentWithdrawals: 'Se ha realizado un retiro superior al 30% del saldo en los últimos 6 meses'
  };
  console.log('SavingCapacityDetails id:', id);

  useEffect(() => {
    if (id) {
      const fetchSavingCapacity = async () => {
        try {
          const response = await evaluationService.getSavingCapacity(id);
          setSavingCapacity(response.data);
        } catch (error) {
          console.error('Error al obtener la capacidad de ahorro:', error);
          setError('No se pudo obtener la capacidad de ahorro. Por favor, vuelva a intentarlo.');
        }
      };

      fetchSavingCapacity();
    }
  }, [id]);

  console.log('SavingCapacityDetails savingCapacity:', savingCapacity);
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
      navigate('/'); // Redirige a la página principal
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

  if (!savingCapacity) {
    return <div className="container mt-4">Cargando capacidad de ahorro...</div>;
  }

  const renderSavingCapacityItem = (label, value, detailKey) => {
    const isTrue = value;
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
      <h2>Detalles de la Capacidad de Ahorro</h2>
      <h4>Parámetros</h4>

      <ul className="list-group">
        {renderSavingCapacityItem('Monto mínimo', savingCapacity.minAmount, 'minAmount')}
        {renderSavingCapacityItem('Historial consistente', savingCapacity.consistentHistory, 'consistentHistory')}
        {renderSavingCapacityItem('Depósitos periódicos', savingCapacity.periodicDeposits, 'periodicDeposits')}
        {renderSavingCapacityItem('Relación monto/años', savingCapacity.relationAmountYears, 'relationAmountYears')}
        {renderSavingCapacityItem('Retiros recientes', savingCapacity.recentWithdrawals, 'recentWithdrawals')}
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
          onClick={() => navigate(`/evaluation/${id}`)}
        >
          Resultados de evaluación
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
        Teniendo en cuenta la cantidad de puntos que cumplen con los requisitos, la capacidad de ahorro se considera ‎ 
        <span style={{fontWeight: 'bold', textDecoration: 'underline'}}>
          {savingCapacity.capacityResult}
        </span>
      </h6>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalle de Capacidad de Ahorro</Modal.Title>
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

export default SavingCapacityDetails;