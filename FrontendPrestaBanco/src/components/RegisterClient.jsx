import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clientService from '../services/client.service';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
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
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar u ocultar la contraseña

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
    const cleanRUT = rut.replace(/[^0-9Kk]/g, ''); // Eliminar caracteres no válidos

    if (cleanRUT.length <= 1) return cleanRUT;

    const body = cleanRUT.slice(0, -1);
    const dv = cleanRUT.slice(-1).toUpperCase();
    const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Agregar puntos

    return `${formattedBody}-${dv}`;
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
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Error registering client:', error);
      setModalMessage(
        error.response?.status === 400 && error.response?.data === 'El RUT ya está registrado'
          ? 'El RUT ya está registrado. Por favor, intenta con un RUT diferente.'
          : 'Error al registrar usuario. Inténtalo nuevamente.'
      );
      setShowModal(true);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="container mt-5">
      <div className="background-white-container">
        <h2>Registro de usuario</h2>
        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          <div className="form-group mt-3">
            <label htmlFor="rut">
              <i className="fas fa-id-card" style={{ marginRight: '8px' }}></i>RUT
            </label>
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
              maxLength="12"
              required
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="name">
              <i className="fas fa-user" style={{ marginRight: '8px' }}></i>Nombre
            </label>
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
            <label htmlFor="birthDate">
              <i className="fas fa-calendar-alt" style={{ marginRight: '8px' }}></i>Fecha de Nacimiento
            </label>
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
            <label htmlFor="password">
              <i className="fas fa-lock" style={{ marginRight: '8px' }}></i>Contraseña
            </label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                id="password"
                name="password"
                value={client.password}
                onChange={handleChange}
                placeholder="Contraseña"
                required
              />
              <span
                className="input-group-text"
                onClick={togglePasswordVisibility}
                style={{ cursor: 'pointer' }}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </span>
            </div>
          </div>
          <div className="mt-4">
            <button type="submit" className="btn btn-primary">
              <i className="fas fa-user-plus" style={{ marginRight: '8px' }}></i>Registrarse
            </button>
          </div>
        </form>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Mensaje</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RegisterClient;
