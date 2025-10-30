import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';
import LoginDialog from '@/components/LoginDialog';
import RegisterDialog from '@/components/RegisterDialog';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const navigation = [
    { path: '/', label: 'Главная' },
    { path: '/services', label: 'Услуги' },
    { path: '/masters', label: 'Мастера' },
    { path: '/price', label: 'Прайс-лист' },
    { path: '/gallery', label: 'Галерея' },
    { path: '/reviews', label: 'Отзывы' },
    { path: '/booking', label: 'Онлайн-запись' },
    { path: '/contacts', label: 'Контакты' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => handleNavigation('/')} className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon name="Sparkles" size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Сакура
            </span>
          </button>

          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => handleNavigation(item.path)}
                className={location.pathname === item.path ? 'text-pink-600' : ''}
              >
                {item.label}
              </Button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate(user.role === 'admin' ? '/admin' : '/cabinet')}
                  className="hidden md:inline-flex"
                >
                  <Icon name="User" size={18} className="mr-2" />
                  {user.full_name}
                </Button>
                <Button variant="ghost" onClick={handleLogout} className="hidden md:inline-flex">
                  <Icon name="LogOut" size={18} className="mr-2" />
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setIsLoginOpen(true)} className="hidden md:inline-flex">
                  Войти
                </Button>
                <Button onClick={() => setIsRegisterOpen(true)} className="hidden md:inline-flex bg-gradient-to-r from-pink-500 to-purple-600">
                  Регистрация
                </Button>
              </>
            )}

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Icon name="Menu" size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Button
                      key={item.path}
                      variant="ghost"
                      onClick={() => handleNavigation(item.path)}
                      className={`justify-start ${location.pathname === item.path ? 'text-pink-600' : ''}`}
                    >
                      {item.label}
                    </Button>
                  ))}
                  <div className="border-t pt-4">
                    {user ? (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => {
                            navigate(user.role === 'admin' ? '/admin' : '/cabinet');
                            setIsMenuOpen(false);
                          }}
                          className="w-full mb-2"
                        >
                          <Icon name="User" size={18} className="mr-2" />
                          {user.full_name}
                        </Button>
                        <Button variant="ghost" onClick={handleLogout} className="w-full">
                          <Icon name="LogOut" size={18} className="mr-2" />
                          Выйти
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setIsLoginOpen(true);
                            setIsMenuOpen(false);
                          }}
                          className="w-full mb-2"
                        >
                          Войти
                        </Button>
                        <Button
                          onClick={() => {
                            setIsRegisterOpen(true);
                            setIsMenuOpen(false);
                          }}
                          className="w-full bg-gradient-to-r from-pink-500 to-purple-600"
                        >
                          Регистрация
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
      <RegisterDialog 
        open={isRegisterOpen} 
        onOpenChange={setIsRegisterOpen}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </header>
  );
}
