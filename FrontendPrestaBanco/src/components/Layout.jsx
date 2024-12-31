import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import "../styles/Layout.css";

const Layout = ({ content }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  window.startLoading = () => setLoading(true);
  window.endLoading = () => setLoading(false);

  useEffect(() => {
    let timer;
    if (loading) {
      setProgress(0);
      timer = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 200);
    } else {
      setProgress(100);
      const resetTimer = setTimeout(() => {
        setProgress(0);
      }, 500);
      return () => clearTimeout(resetTimer);
    }
    return () => clearInterval(timer);
  }, [loading]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <header className="header-container">
        {/* Contenedor para los botones */}
        <div className="header-buttons-left">
          <button className="header-button back-button" onClick={handleBack}>
            Atrás
          </button>
          <Link to="/">
            <button className="header-button">Inicio</button>
          </Link>
        </div>

        {/* Barra de progreso */}
        <div
          className="progress-bar"
          style={{
            width: `${progress}%`,
            height: "4px",
            backgroundColor: "#ffffff",
            position: "absolute",
            bottom: 0,
            left: 0,
            zIndex: 1050,
            transition: "width 0.2s ease",
          }}
        />
      </header>
      <div className="content-container">{content}</div>
    </div>
  );
};

Layout.propTypes = {
  content: PropTypes.node.isRequired,
};

export default Layout;
