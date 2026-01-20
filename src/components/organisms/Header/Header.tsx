import React from 'react';
import { cn } from '../../../utils';
import { Button } from '../../atoms';
import type { HeaderProps } from './Header.type';

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, onNavigate, ...props }, ref) => {
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
              onClick={() => onNavigate?.('/')}
            >
              <span className="font-bold text-xl">Fast Food Manager</span>
            </a>
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium ml-auto">
            <a
              className="transition-colors hover:text-primary cursor-pointer"
              onClick={() => onNavigate?.('/platform')}
            >
              Plataforma
            </a>
            <a
              className="transition-colors hover:text-primary cursor-pointer"
              onClick={() => onNavigate?.('/careers')}
            >
              Carreiras
            </a>
            <a
              className="transition-colors hover:text-primary cursor-pointer"
              onClick={() => onNavigate?.('/contact')}
            >
              Contato
            </a>
            <Button variant="outline" size="sm" onClick={() => onNavigate?.('/login')}>
              Entrar
            </Button>
            <Button size="sm" onClick={() => onNavigate?.('/register')}>
              Cadastrar
            </Button>
          </nav>
        </div>
      </header>
    );
  }
);

Header.displayName = 'Header';

export default Header;
