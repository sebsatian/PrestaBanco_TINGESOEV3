import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styles/Layout.css';

const Layout = ({ content }) => {
  return (
    <div>
      <div className="fixed-button-container">
        <Link to="/">
          <button className="fixed-button">Inicio</button>
        </Link>
      </div>
      <div className="content-container">
        {content}
      </div>
    </div>
  );
};

Layout.propTypes = {
  content: PropTypes.node.isRequired,
};

export default Layout;



