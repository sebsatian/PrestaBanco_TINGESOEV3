import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loanTypeService from '../services/loantype.service';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';

const ViewLoanTypes = () => {
  const [loanTypes, setLoanTypes] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoanTypes = async () => {
      try {
        const response = await loanTypeService.getAllLoanTypes();
        const data = response.data;

        if (!data) {
          throw new Error('No data received');
        }

        // Ensure no value is null
        const sanitizedData = data.map(loanType => ({
          ...loanType,
          type: loanType.type || '',
          annualInterestRate: loanType.annualInterestRate ?? '',
          minInterestRate: loanType.minInterestRate ?? '',
          maxInterestRate: loanType.maxInterestRate ?? '',
          maximumTerm: loanType.maximumTerm ?? 0,
          maxFinance: loanType.maxFinance ?? 0
        }));

        setLoanTypes(sanitizedData);
      } catch (err) {
        console.error(err);
        setError('No se pudo obtener los tipos de préstamo. Por favor, inténtelo de nuevo más tarde.');
        setShowModal(true);
      }
    };

    fetchLoanTypes();
  }, []);

  const handleCloseModal = () => setShowModal(false);

  const handleEdit = () => {
    navigate('/loan-types/edit');
  };

  return (
    <div className="container mt-3" style={{ paddingTop: '1rem', maxHeight: '90vh', overflowY: 'hidden' }}>  
      <h2>Ver Tipos de Préstamo</h2>
      <div className="row mb-3">
        <div className="col">
          <strong>Nombre del Tipo de Préstamo</strong>
        </div>
        <div className="col">
          <strong>Tasa de Interés Anual (%)</strong>
        </div>
      </div>
      {loanTypes.map((loanType) => (
        <div key={loanType.id} className="row mb-4 align-items-center">
          <div className="col">
            <input
              type="text"
              className="form-control"
              id={`type-${loanType.id}`}
              name="type"
              value={loanType.type}
              disabled
            />
          </div>
          <div className="col d-flex align-items-center">
            <input
              type="range"
              className="form-range"
              id={`annualInterestRate-${loanType.id}`}
              name="annualInterestRate"
              min={loanType.minInterestRate}
              max={loanType.maxInterestRate}
              step="0.01"
              value={loanType.annualInterestRate}
              disabled
            />
            <div className="ms-2">{loanType.annualInterestRate}%</div>
          </div>
        </div>
      ))}
      <div className="mt-4">
        <button type="button" className="btn btn-primary" onClick={handleEdit}>Editar</button>
      </div>

      {error && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ViewLoanTypes;