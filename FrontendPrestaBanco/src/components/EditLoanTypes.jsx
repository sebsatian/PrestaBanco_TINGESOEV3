import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loanTypeService from '../services/loantype.service';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';

const EditLoanTypes = () => {
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

        // Ordenar los loanTypes por id
        sanitizedData.sort((a, b) => a.id - b.id);

        setLoanTypes(sanitizedData);
      } catch (err) {
        console.error(err);
        setError('No se pudo obtener los tipos de préstamo. Por favor, inténtelo de nuevo más tarde.');
        setShowModal(true);
      }
    };

    fetchLoanTypes();
  }, []);

  const handleSliderChange = (e, index) => {
    const { name, value } = e.target;
    setLoanTypes((prev) => {
      const updatedLoanTypes = [...prev];
      updatedLoanTypes[index] = { ...updatedLoanTypes[index], [name]: parseFloat(value) };
      return updatedLoanTypes;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      for (const loanType of loanTypes) {
        const requestPayload = {
          type: loanType.type,
          maximumTerm: loanType.maximumTerm,
          maxFinance: parseFloat(loanType.maxFinance).toFixed(2), 
          minInterestRate: parseFloat(loanType.minInterestRate).toFixed(2),
          maxInterestRate: parseFloat(loanType.maxInterestRate).toFixed(2),
          annualInterestRate: parseFloat(loanType.annualInterestRate).toFixed(2),
        };
        await loanTypeService.updateLoanType(loanType.id, requestPayload);
      }
      navigate('/loan-types/view'); 
    } catch (err) {
      console.error('Error updating loan types:', err);
      setError('No se pudo actualizar los tipos de préstamo. Por favor, inténtelo de nuevo más tarde.');
      setShowModal(true);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="view-loan-types-container container mt-3" style={{ paddingTop: '1rem', maxHeight: '90vh', overflowY: 'hidden' }}>
      <h2>Editar Tipos de Préstamo</h2>
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="row mb-3">
          <div className="col">
            <strong>Nombre del Tipo de Préstamo</strong>
          </div>
          <div className="col">
            <strong>Tasa de Interés Anual (%)</strong>
          </div>
        </div>
        {loanTypes.map((loanType, index) => (
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
                onChange={(e) => handleSliderChange(e, index)}
                required
              />
              <div className="ms-2">{loanType.annualInterestRate}%</div>
              <div className="invalid-feedback">
                Por favor ingrese una tasa de interés válida.
              </div>
            </div>
          </div>
        ))}
        <div className="mt-4">
          <button type="submit" className="btn btn-primary">Guardar Cambios</button>
        </div>
      </form>

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

export default EditLoanTypes;