import useStore from './store/useStore';
import Login from './pages/Login';
import Home from './pages/Home';
import WorkDetail from './pages/WorkDetail';

export default function App() {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const selectedWorkId = useStore((s) => s.selectedWorkId);

  if (!isAuthenticated) {
    return <Login />;
  }

  if (selectedWorkId) {
    return <WorkDetail />;
  }

  return <Home />;
}
