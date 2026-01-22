import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@common/helpers';
import { Button, Icon } from '../../atoms';
import { ROUTES } from '@common/constants';
import type { HeaderProps } from './Header.type';

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, onNavigate, user, isAuthenticated = false, onSignOut, ...props }, ref) => {
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleSignOut = () => {
      onSignOut?.();
      setShowUserMenu(false);
    };

    return (
      <header
        ref={ref}
        className={cn(
          'sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
          className
        )}
        {...props}
      >
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <a
              className="mr-6 flex items-center space-x-2 cursor-pointer"
              onClick={() => onNavigate?.(isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME)}
            >
              <span className="font-bold text-xl">Fast Food Manager</span>
            </a>
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium ml-auto">
            {isAuthenticated ? (
              <>
                <div className="relative">
                  <button
                    className="flex items-center space-x-2 transition-colors hover:text-primary cursor-pointer"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <span>{user?.name || 'Usuário'}</span>
                    <Icon icon={ChevronDown} size={16} />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{user?.email}</p>
                      </div>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-error"
                        onClick={handleSignOut}
                      >
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <a
                  className="transition-colors hover:text-primary cursor-pointer"
                  onClick={() => onNavigate?.(ROUTES.PLATFORM)}
                >
                  Plataforma
                </a>
                <a
                  className="transition-colors hover:text-primary cursor-pointer"
                  onClick={() => onNavigate?.(ROUTES.CAREERS)}
                >
                  Carreiras
                </a>
                <a
                  className="transition-colors hover:text-primary cursor-pointer"
                  onClick={() => onNavigate?.(ROUTES.CONTACT)}
                >
                  Contato
                </a>
                <Button variant="outline" size="sm" onClick={() => onNavigate?.(ROUTES.LOGIN)}>
                  Entrar
                </Button>
                <Button size="sm" onClick={() => onNavigate?.(ROUTES.REGISTER)}>
                  Cadastrar
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>
    );
  }
);

Header.displayName = 'Header';

export default Header;
