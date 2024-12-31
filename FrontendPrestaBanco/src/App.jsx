import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterClient from './components/RegisterClient';
import SimulationDetails from './components/SimulationDetails';
import CreateRequest from './components/CreateRequest';
import SimulateLoan from './components/SimulateLoan';
import SimulationEdit from './components/SimulationEdit';
import EditLoanTypes from './components/EditLoanTypes';
import ViewLoanTypes from './components/ViewLoanTypes';
import ViewRequests from './components/ViewRequests';
import RequestDetails from './components/RequestDetails';
import MainPage from './components/MainPage';
import CheckRequestStatus from './components/CheckRequestStatus';
import EvaluateRequest from './components/EvaluateRequest';
import EvaluationDetails from './components/EvaluationDetails';
import SavingCapacity from './components/SavingCapacity';
import Layout from './components/Layout'; 
import TotalCosts from './components/TotalCosts'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout content={<MainPage />} />} />
        <Route path="/register" element={<Layout content={<RegisterClient />} />} />
        <Route path="/simulate" element={<Layout content={<SimulateLoan />} />} />
        <Route path="/simulation/simulate/:simulationId" element={<Layout content={<SimulationDetails />} />} />
        <Route path="/simulation/change/:simulationId" element={<Layout content={<SimulationEdit />} />} />
        <Route path="/loan-types/edit" element={<Layout content={<EditLoanTypes />} />} />
        <Route path="/loan-types/view" element={<Layout content={<ViewLoanTypes />} />} />
        <Route path="/create-request" element={<Layout content={<CreateRequest />} />} />
        <Route path="/view-requests" element={<Layout content={<ViewRequests />} />} />
        <Route path="/request-details/:id" element={<Layout content={<RequestDetails />} />} />
        <Route path="/check-request-status" element={<Layout content={<CheckRequestStatus />} />} />
        <Route path="/evaluate-request/:id" element={<Layout content={<EvaluateRequest />} />} />
        <Route path="/evaluation/:id" element={<Layout content={<EvaluationDetails />} />} />
        <Route path="/saving-capacity/:id" element={<Layout content={<SavingCapacity/>} />} />
        <Route path="/total-costs/:id" element={<Layout content={<TotalCosts />} />} /> 
        
      </Routes>
    </Router>
  );
}

export default App;
