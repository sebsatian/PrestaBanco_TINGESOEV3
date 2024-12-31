import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clientService from '../services/client.service';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import '../styles/RegisterClient.css';

const RegisterClient = () => {
  const [client, setClient] = useState({
    rut: '',
    name: '',
    birthDate: '',
    password: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'rut') {
      const formattedRUT = formatRUT(value);
      setClient({
        ...client,
        [name]: formattedRUT,
      });
    } else {
      setClient({
        ...client,
        [name]: value,
      });
    }
  };

  const formatRUT = (rut) => {
    const cleanRUT = rut.replace(/[^0-9Kk]/g, '');

    if (cleanRUT.length > 9) {
      return client.rut;
    }

    if (cleanRUT.length > 1) {
      const body = cleanRUT.slice(0, -1);
      const dv = cleanRUT.slice(-1).toUpperCase();

      const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

      return `${formattedBody}-${dv}`;
    }

    return cleanRUT;
  };

  const handleDateChange = (e) => {
    const { value } = e.target;
    setClient({
      ...client,
      birthDate: value,
    });
  };

  const isAdult = (birthDate) => {
    if (!birthDate) return false;

    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!client.rut || !client.name || !client.birthDate || !client.password) {
      setModalMessage('Todos los campos son obligatorios. Por favor, completa el formulario.');
      setShowModal(true);
      return;
    }

    if (!isAdult(client.birthDate)) {
      setModalMessage('Debes ser mayor de 18 años para registrarte.');
      setShowModal(true);
      return;
    }

    try {
      const clientData = {
        ...client,
        birthDate: client.birthDate ? new Date(client.birthDate).toISOString() : null,
      };

      const response = await clientService.registerClient(clientData);
      console.log('Client registered:', response.data);
      setModalMessage('¡Ya estás registrado! Redirigiendo a la página principal...');
      setShowModal(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      console.error('Error registering client:', error);
      if (error.response?.status === 400 && error.response?.data === 'El RUT ya está registrado') {
        setModalMessage('El RUT ya está registrado. Por favor, intenta con un RUT diferente.');
      } else {
        setModalMessage('Error al registrar usuario. Inténtalo nuevamente.');
      }
      setShowModal(true);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="container mt-5">
      <h2>Registro de usuario</h2>
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="form-group">
          <label htmlFor="rut">RUT</label>
          <input
            type="text"
            className="form-control"
            id="rut"
            name="rut"
            value={client.rut}
            onChange={handleChange}
            placeholder="Sin puntos y con guión"
            pattern="^\d{1,2}\.?\d{3}\.?\d{3}-[0-9Kk]$"
            title="RUT inválido"
            maxLength="13"
            required
            onInvalid={(e) => {
              e.preventDefault();
              e.target.setCustomValidity('RUT inválido');
            }}
            onInput={(e) => e.target.setCustomValidity('')}
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={client.name}
            onChange={handleChange}
            placeholder="Ingrese su nombre completo"
            required
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="birthDate">Fecha de Nacimiento</label>
          <input
            type="date"
            className="form-control"
            id="birthDate"
            name="birthDate"
            value={client.birthDate}
            onChange={handleDateChange}
            required
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={client.password}
            onChange={handleChange}
            placeholder="Contraseña"
            required
          />
        </div>
        <div className="mt-4">
          <button type="submit" className="btn btn-primary">Registrarse</button>
        </div>
      </form>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Mensaje</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMessage}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RegisterClient;
