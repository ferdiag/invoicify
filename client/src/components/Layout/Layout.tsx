import { Outlet } from 'react-router-dom';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import Navbar from '../Navbar/Navbar';
import CTAButton from '../Button/Button';
import { useUserStore } from '../../store/userStore';

export default function Layout() {
  const { logout, user } = useUserStore();
  return (
    <div className="w-screen min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="flex justify-between items-center p-4 bg-gray-800">
        <h1 className="text-lg font-bold">Invoicify</h1>
        <Navbar />
        <div>
          {user && <CTAButton onClick={() => logout()}>Logout</CTAButton>}
          <LanguageSelector />
        </div>
      </header>
      <main className="flex-1 p-8 md:p-1 flex flex-col">
        <Outlet />
      </main>
      <footer className="text-center text-sm text-gray-500 p-4 mt-auto">
        © {new Date().getFullYear()} Invoicify
      </footer>
    </div>
  );
}
