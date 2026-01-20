import React from 'react';
import { cn } from '@common/helpers';
import { ROUTES } from '@common/constants';
import type { FooterProps } from './Footer.type';

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className, onNavigate, ...props }, ref) => {
    const currentYear = new Date().getFullYear();

    const handleNavigate = (route: string) => {
      onNavigate?.(route);
    };

    return (
      <footer
        ref={ref}
        className={cn(
          'border-t border-border bg-background',
          className
        )}
        {...props}
      >
        <div className="container">
          <div className="grid grid-cols-1 gap-8 py-10 md:grid-cols-4 md:py-12">
            {/* Brand Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl">Fast Food Manager</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sistema de gestão completo para restaurantes e fast-food.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                © {currentYear} Fast Food Manager. Todos os direitos reservados.
              </p>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-sm">Navegação</h3>
              <nav className="flex flex-col gap-3">
                <a
                  className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400 cursor-pointer"
                  onClick={() => handleNavigate(ROUTES.HOME)}
                >
                  Início
                </a>
                <a
                  className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400 cursor-pointer"
                  onClick={() => handleNavigate(ROUTES.PLATFORM)}
                >
                  Plataforma
                </a>
                <a
                  className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400 cursor-pointer"
                  onClick={() => handleNavigate(ROUTES.CONTACT)}
                >
                  Contato
                </a>
                <a
                  className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400 cursor-pointer"
                  onClick={() => handleNavigate(ROUTES.CAREERS)}
                >
                  Carreiras
                </a>
              </nav>
            </div>

            {/* Authentication Links */}
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-sm">Conta</h3>
              <nav className="flex flex-col gap-3">
                <a
                  className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400 cursor-pointer"
                  onClick={() => handleNavigate(ROUTES.LOGIN)}
                >
                  Entrar
                </a>
                <a
                  className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400 cursor-pointer"
                  onClick={() => handleNavigate(ROUTES.REGISTER)}
                >
                  Cadastrar
                </a>
                <a
                  className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400 cursor-pointer"
                  onClick={() => handleNavigate(ROUTES.FORGOT_PASSWORD)}
                >
                  Recuperar senha
                </a>
              </nav>
            </div>

            {/* Support Section */}
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-sm">Suporte</h3>
              <nav className="flex flex-col gap-3">
                <a
                  className="text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400 cursor-pointer"
                  href="mailto:suporte@fastfoodmanager.com"
                >
                  E-mail: suporte@fastfoodmanager.com
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Segunda a Sexta, 9h às 18h
                </p>
              </nav>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-border py-6 md:flex-row">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 md:text-left">
              © {currentYear} Fast Food Manager. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
              <a
                className="transition-colors hover:text-primary cursor-pointer"
                onClick={() => handleNavigate(ROUTES.CONTACT)}
              >
                Termos de Uso
              </a>
              <a
                className="transition-colors hover:text-primary cursor-pointer"
                onClick={() => handleNavigate(ROUTES.CONTACT)}
              >
                Política de Privacidade
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  }
);

Footer.displayName = 'Footer';

export default Footer;
