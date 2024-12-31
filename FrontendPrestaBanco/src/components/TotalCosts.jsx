import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import requestService from '../services/request.service';
import loanTypeService from '../services/loantype.service';
import { Modal, Button, Form } from 'react-bootstrap';

const TotalCosts = () => {
  const { id } = useParams();
  const location = useLocation();
  const [totalCosts, setTotalCosts] = useState(null);
  const [request, setRequest] = useState(null);
  const [loanType, setLoanType] = useState(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [clientRut, setClientRut] = useState('');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveDetails, setApproveDetails] = useState('');

  useEffect(() => {
    if (id) {
      const fetchTotalCosts = async () => {
        try {
          const response = await requestService.getTotalCosts(id);
          setTotalCosts(response.data);
          const requestResponse = await requestService.getRequestById(response.data.requestId);
          setRequest(requestResponse.data);
          setClientRut(requestResponse.data.clientRut); // Set the client RUT
          const loanTypeResponse = await loanTypeService.getLoanTypeById(requestResponse.data.loanType);
          setLoanType(loanTypeResponse.data);
        } catch (error) {
          console.error('Error al obtener los costos totales:', error);
          setError('No se pudo obtener los costos totales. Por favor, vuelva a intentarlo.');
        }
      };

      fetchTotalCosts();
    }
  }, [id]);

  const formatAmount = (amount) => {
    return `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '.').replace(/(\d+)\.(\d{2})$/, '$1,$2')}`;
  };

  const handleShowModal = (content) => {
    setModalContent(content);
    setShowModal(true);
  };

  const handleApprove = async () => {
    try {
      await requestService.updateRequestDetails(id, approveDetails);
      await requestService.updateRequestStatus(id, 'Pre-Aprobada');
      setShowApproveModal(false);
      alert('Estado de la solicitud actualizado a Pre-Aprobada');
    } catch (error) {
      console.error('Error al actualizar el estado de la solicitud:', error);
      setError('No se pudo actualizar el estado de la solicitud. Por favor, vuelva a intentarlo.');
    }
  };
  
  const handleUpdateStatus = async (newStatus) => {
    try {
      await requestService.updateRequestStatus(id, newStatus);
      alert(`Estado de la solicitud actualizado a ${newStatus}`);
    } catch (error) {
      console.error('Error al actualizar el estado de la solicitud:', error);
      setError('No se pudo actualizar el estado de la solicitud. Por favor, vuelva a intentarlo.');
    }
  };

  const handleButtonClick = () => {
    if (location.state === 'costos') {
      setShowApproveModal(true);
    } else {
      handleUpdateStatus('En Aprobación Final');
    }
  };

  if (error) {
    return <div className="alert alert-danger mt-4">{error}</div>;
  }

  if (!totalCosts || !request || !loanType) {
    return <div className="container mt-4">Cargando costos totales...</div>;
  }

  return (
    <div className="container mt-4 position-relative">
      <h2>Detalles del Precio Final de la Solicitud</h2>
      <ul className="list-group">
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <div><strong>RUT del Cliente:</strong> {clientRut}</div>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <div><strong>Tipo de Préstamo:</strong> {loanType.type}</div>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <div><strong>Monto del Préstamo: </strong> {formatAmount(request.loanAmount)}</div>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <div><strong>Tasa de Interés Mensual:</strong> {loanType.annualInterestRate}%</div>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <div><strong>Seguro de Desgravamen:</strong> {formatAmount(totalCosts.creditLifeInsurance)} mensual</div>
          <Button variant="primary" size="sm" style={{ marginLeft: '60px' }} onClick={() => handleShowModal('Mensualmente se suma el 0,03% del monto mensual previo a comisiones')}>
            Ver Detalles
          </Button>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <div><strong>Seguro contra Incendios:</strong> {formatAmount(totalCosts.fireInsurance)}</div>
          <Button variant="primary" size="sm" onClick={() => handleShowModal('20.000 mensual')}>
            Ver Detalles
          </Button>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <div><strong>Cuota de Administración:</strong> {formatAmount(totalCosts.administrationFee)}</div>
          <Button variant="primary" size="sm" onClick={() => handleShowModal('1% del monto del préstamo')}>
            Ver Detalles
          </Button>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <div><strong>Costo Mensual:</strong> {formatAmount(totalCosts.monthlyCost)}</div>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <div><strong>Costo Total Final:</strong> {formatAmount(totalCosts.totalCost)}</div>
        </li>
      </ul>

      <div className="text-center mt-4">
        <Button variant="success" onClick={handleButtonClick}>
          {location.state === 'costos' ? 'Aprobar solicitud' : 'Aceptar condiciones'}
        </Button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showApproveModal} onHide={() => setShowApproveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles Adicionales</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formApproveDetails">
              <Form.Label>Escribir detalles adicionales:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={approveDetails}
                onChange={(e) => setApproveDetails(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowApproveModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleApprove}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TotalCosts;