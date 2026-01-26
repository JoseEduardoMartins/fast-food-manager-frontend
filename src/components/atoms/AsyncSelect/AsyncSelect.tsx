import React, { useEffect, useState, useCallback, useRef } from 'react';
import { cn } from '@common/helpers';
import Label from '../Label';
import type { AsyncSelectProps } from './AsyncSelect.type';

const AsyncSelect = <TData, TParams = void>(
  {
    className,
    label,
    error = false,
    helperText,
    id,
    loadOptions,
    loadParams,
    getLabel,
    getValue,
    placeholder = 'Selecione uma opção',
    loadingText = 'Carregando...',
    noOptionsText = 'Nenhuma opção disponível',
    errorText = 'Erro ao carregar opções',
    showLoading = true,
    reloadOnParamsChange = true,
    renderOption,
    value,
    onChange,
    disabled,
    ...props
  }: AsyncSelectProps<TData, TParams>,
  ref?: React.Ref<HTMLSelectElement>
) => {
  const [options, setOptions] = useState<TData[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  const selectId = id || `async-select-${Math.random().toString(36).substr(2, 9)}`;

  const loadParamsRef = useRef<TParams | undefined>(loadParams);
  const loadData = useCallback(async () => {
    if (disabled) return;

    setLoading(true);
    setLoadError(null);

    try {
      // Only pass params if they are defined (not void)
      const data = await loadOptions(
        loadParams !== undefined ? loadParams : undefined
      );
      setOptions(data || []);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro desconhecido');
      setLoadError(error);
      setOptions([]);
      console.error('Erro ao carregar opções:', error);
    } finally {
      setLoading(false);
    }
  }, [loadOptions, disabled]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reload when params change (if reloadOnParamsChange is true)
  useEffect(() => {
    if (reloadOnParamsChange) {
      // Simple comparison: if params reference changed, reload
      if (loadParamsRef.current !== loadParams) {
        loadParamsRef.current = loadParams;
        loadData();
      }
    }
  }, [loadParams, reloadOnParamsChange, loadData]);

  // Determine what to show in the select
  const selectContent = () => {
    if (loading && showLoading) {
      return (
        <option value="" disabled>
          {loadingText}
        </option>
      );
    }

    if (loadError) {
      return (
        <option value="" disabled>
          {errorText}
        </option>
      );
    }

    if (options.length === 0) {
      return (
        <option value="" disabled>
          {noOptionsText}
        </option>
      );
    }

    return (
      <>
        {!value && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((item, index) => {
          const itemValue = getValue(item);
          const itemLabel = getLabel(item);

          return (
            <option key={`${itemValue}-${index}`} value={itemValue}>
              {renderOption ? renderOption(item) : itemLabel}
            </option>
          );
        })}
      </>
    );
  };

  const isDisabled = disabled || loading;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <Label htmlFor={selectId} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={cn(
          'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-error focus-visible:ring-error',
          className
        )}
        value={value}
        onChange={onChange}
        disabled={isDisabled}
        {...props}
      >
        {selectContent()}
      </select>
      {helperText && (
        <p
          className={cn(
            'text-sm',
            error ? 'text-error' : 'text-gray-600 dark:text-gray-400'
          )}
        >
          {helperText}
        </p>
      )}
      {loadError && !helperText && (
        <p className="text-sm text-error">{errorText}</p>
      )}
    </div>
  );
};

// Forward ref with generic type support
const AsyncSelectWithRef = React.forwardRef(AsyncSelect) as <TData, TParams = void>(
  props: AsyncSelectProps<TData, TParams> & { ref?: React.Ref<HTMLSelectElement> }
) => React.ReactElement;

// Set displayName using Object.assign to work with generic types
Object.assign(AsyncSelectWithRef, { displayName: 'AsyncSelect' });

export default AsyncSelectWithRef;
