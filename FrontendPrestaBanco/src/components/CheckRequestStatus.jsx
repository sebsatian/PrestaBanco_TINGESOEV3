import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const CheckRequestStatus = () => {
  const [rut, setRut] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const formatRut = (value) => {
    const cleanValue = value.replace(/[^0-9kK]/g, '');
    if (cleanValue.length <= 1) return cleanValue;
    const rut = cleanValue.slice(0, -1);
    const dv = cleanValue.slice(-1);
    return `${rut.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${dv}`;
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setRut(formatRut(value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rut.length < 9) {
      setError('RUT inválido. Por favor, ingrese un RUT válido.');
      return;
    }
    console.log('Navigating to /view-requests with RUT:', rut);
    navigate('/view-requests', { state: { rut } });
  };

  return (
    <div className="container mt-5">
      <h2>Ver Estado de mi Solicitud</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mt-3">
          <label htmlFor="rut">Ingrese su RUT</label>
          <input
            type="text"
            className="form-control"
            id="rut"
            name="rut"
            value={rut}
            onChange={handleInputChange}
            maxLength={12}
            required
          />
        </div>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        <button type="submit" className="btn btn-primary mt-4">
          Ver Solicitudes
        </button>
      </form>
    </div>
  );
};

export default CheckRequestStatus;