/**
 * AddressFormFields - Componente unificado de campos de endereço
 */

export interface AddressFormFieldsValue {
  street: string;
  number?: string;
  complement?: string;
  zipcode?: string;
  countryId: string;
  stateId: string;
  cityId: string;
  label?: string;
  isDefault?: boolean;
}

export interface AddressFormFieldsProps {
  /** Valor atual do endereço */
  value: AddressFormFieldsValue;
  /** Callback quando qualquer campo muda */
  onChange: (value: AddressFormFieldsValue) => void;
  /** Se true, campos são somente leitura */
  disabled?: boolean;
  /** Se true, exibe campos label e isDefault (para endereços de usuário) */
  showLabelAndDefault?: boolean;
  /** Se true, exibe asterisco de obrigatório nos campos principais */
  required?: boolean;
  /** Erros de validação por campo */
  errors?: Partial<Record<keyof AddressFormFieldsValue, string>>;
}
