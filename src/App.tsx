import { Dashboard } from './components/Dashboard';
import { NotificationCenter } from './components/NotificationCenter';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Alessandro Admin Dashboard</h1>
        <p>Real-time Business Intelligence</p>
      </header>
      <NotificationCenter />
      <Dashboard />
    </div>
  );
}

export default App;
