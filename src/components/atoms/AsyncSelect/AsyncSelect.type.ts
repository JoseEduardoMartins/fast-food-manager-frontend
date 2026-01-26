import type { SelectHTMLAttributes, ReactNode } from 'react';

/**
 * Function to extract the display label from an item
 */
export type GetLabel<T> = (item: T) => string;

/**
 * Function to extract the value from an item
 */
export type GetValue<T> = (item: T) => string | number;

/**
 * Async function to load data
 */
export type LoadFunction<TData, TParams = void> = (
  params?: TParams
) => Promise<TData[]>;

export interface AsyncSelectProps<TData, TParams = void>
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  /**
   * Label for the select field
   */
  label?: string;

  /**
   * Error state
   */
  error?: boolean;

  /**
   * Helper text to display below the select
   */
  helperText?: string;

  /**
   * Async function to load the options
   */
  loadOptions: LoadFunction<TData, TParams>;

  /**
   * Parameters to pass to the load function
   */
  loadParams?: TParams;

  /**
   * Function to get the display label from an item
   */
  getLabel: GetLabel<TData>;

  /**
   * Function to get the value from an item
   */
  getValue: GetValue<TData>;

  /**
   * Placeholder text when no option is selected
   */
  placeholder?: string;

  /**
   * Text to display when loading
   */
  loadingText?: string;

  /**
   * Text to display when no options are available
   */
  noOptionsText?: string;

  /**
   * Text to display when an error occurs
   */
  errorText?: string;

  /**
   * Whether to show the loading state
   */
  showLoading?: boolean;

  /**
   * Whether to reload options when loadParams change
   */
  reloadOnParamsChange?: boolean;

  /**
   * Custom option renderer (optional)
   */
  renderOption?: (item: TData) => ReactNode;
}
