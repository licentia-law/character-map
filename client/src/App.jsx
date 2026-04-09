import useStore from './store/useStore';
import Login from './pages/Login';
import Home from './pages/Home';

export default function App() {
  const isAuthenticated = useStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Home />;
}
