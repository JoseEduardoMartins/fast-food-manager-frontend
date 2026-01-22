/**
 * PlanCards Component
 * Displays available subscription plans for owner users
 */

import React from 'react';
import { Card, Title, Label, Badge } from '@components';
import { PLANS, type PlanName } from '@common/constants';

interface PlanCardsProps {
  selectedPlan?: PlanName;
  onSelectPlan?: (plan: PlanName) => void;
  disabled?: boolean;
}

export const PlanCards: React.FC<PlanCardsProps> = ({ 
  selectedPlan, 
  onSelectPlan,
  disabled = false 
}) => {
  return (
    <div className="mt-6">
      <Title variant="h3" className="mb-4 font-semibold">
        Planos Disponíveis
      </Title>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.name;
          return (
            <Card
              key={plan.name}
              className={`p-4 cursor-pointer transition-all ${
                isSelected 
                  ? 'border-primary border-2 bg-primary/5' 
                  : 'hover:border-primary/50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !disabled && onSelectPlan?.(plan.name)}
            >
              <div className="flex justify-between items-center mb-3">
                <Title variant="h4" className="font-semibold">
                  {plan.label}
                </Title>
                {isSelected && <Badge variant="info">Selecionado</Badge>}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <Label className="text-gray-600 dark:text-gray-400">Empresas:</Label>
                  <span className="font-medium">{plan.limits.company}</span>
                </div>
                <div className="flex justify-between">
                  <Label className="text-gray-600 dark:text-gray-400">Filiais:</Label>
                  <span className="font-medium">{plan.limits.branch}</span>
                </div>
                <div className="flex justify-between">
                  <Label className="text-gray-600 dark:text-gray-400">Gerentes:</Label>
                  <span className="font-medium">{plan.limits.manager}</span>
                </div>
                <div className="flex justify-between">
                  <Label className="text-gray-600 dark:text-gray-400">Cozinheiros:</Label>
                  <span className="font-medium">{plan.limits.cook}</span>
                </div>
                <div className="flex justify-between">
                  <Label className="text-gray-600 dark:text-gray-400">Atendentes:</Label>
                  <span className="font-medium">{plan.limits.attendant}</span>
                </div>
                <div className="flex justify-between">
                  <Label className="text-gray-600 dark:text-gray-400">Menus:</Label>
                  <span className="font-medium">{plan.limits.menu}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
