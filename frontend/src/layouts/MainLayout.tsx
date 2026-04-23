import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Wrench } from 'lucide-react';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Wrench className="h-6 w-6" />
            <span>Srachko</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Начало
            </Link>
            <Link to="/request" className="text-sm font-medium hover:text-primary transition-colors">
              Заявка за сервиз
            </Link>
            <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Контакти
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link 
              to="/request" 
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Нова заявка
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 font-bold text-lg text-slate-400">
              <Wrench className="h-5 w-5" />
              <span>Srachko Service</span>
            </div>
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} Срачко ЕООД. Всички права запазени.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
