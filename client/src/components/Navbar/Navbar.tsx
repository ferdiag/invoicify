import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';

const Navbar = () => {
  const { user } = useUserStore(); // Zugriff auf den eingeloggten User
  const navigate = useNavigate();

  const pages = [
    { name: 'Home', path: '/' },
    { name: 'Auth', path: '/auth', hiddenIfLoggedIn: true },
    { name: 'Dashboard', path: '/dashboard', hiddenIfLoggedOut: true },
  ];

  const visiblePages = pages.filter((page) => {
    if (page.hiddenIfLoggedIn && user) return false;
    if (page.hiddenIfLoggedOut && !user) return false;
    return true;
  });

  return (
    <nav className="flex gap-4">
      {visiblePages.map((page) => (
        <a
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            e.preventDefault();
            void navigate(page.path);
          }}
          key={page.name}
          href={page.path}
          className="text-gray-300 hover:text-white"
        >
          {page.name}
        </a>
      ))}
    </nav>
  );
};

export default Navbar;
