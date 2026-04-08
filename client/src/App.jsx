import useStore from './store/useStore';
import Login from './pages/Login';

export default function App() {
  const isAuthenticated = useStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Login />;
  }

  // Phase 3~6에서 Home, WorkDetail 등 추가 예정
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <p className="text-gray-400">로그인 완료 — Phase 3 (작품 관리) 준비 중</p>
    </div>
  );
}
