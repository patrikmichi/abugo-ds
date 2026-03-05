import { useCallback } from 'react';
import type { SelectOption } from './types';

export interface UseSelectKeyboardOptions {
  open: boolean;
  activeIndex: number;
  filteredOptions: SelectOption[];
  disabled: boolean;
  loading: boolean;
  showSearch: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  dropdownRef: React.RefObject<{ scrollTo: (index: number) => void } | null>;
  setOpen: (open: boolean) => void;
  setActiveIndex: (index: number) => void;
  setSearchValue: (value: string) => void;
  handleSelect: (value: string) => void;
}

export function useSelectKeyboard({
  open,
  activeIndex,
  filteredOptions,
  disabled,
  loading,
  showSearch,
  inputRef,
  dropdownRef,
  setOpen,
  setActiveIndex,
  setSearchValue,
  handleSelect,
}: UseSelectKeyboardOptions) {
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled || loading) return;

    // If search input is focused and user types, don't handle navigation
    if (showSearch && inputRef.current === document.activeElement) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        inputRef.current?.blur();
        return;
      }
      return;
    }

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!open) {
          setOpen(true);
        } else if (activeIndex >= 0 && filteredOptions[activeIndex]) {
          const option = filteredOptions[activeIndex];
          if (!option.disabled) {
            handleSelect(option.value);
          }
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!open) {
          setOpen(true);
        } else {
          const nextIndex = activeIndex < filteredOptions.length - 1
            ? activeIndex + 1
            : 0;
          let foundIndex = nextIndex;
          let attempts = 0;
          while (attempts < filteredOptions.length && filteredOptions[foundIndex]?.disabled) {
            foundIndex = foundIndex < filteredOptions.length - 1 ? foundIndex + 1 : 0;
            attempts++;
          }
          if (!filteredOptions[foundIndex]?.disabled) {
            setActiveIndex(foundIndex);
            dropdownRef.current?.scrollTo(foundIndex);
          }
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (open) {
          const prevIndex = activeIndex > 0
            ? activeIndex - 1
            : filteredOptions.length - 1;
          let foundIndex = prevIndex;
          let attempts = 0;
          while (attempts < filteredOptions.length && filteredOptions[foundIndex]?.disabled) {
            foundIndex = foundIndex > 0 ? foundIndex - 1 : filteredOptions.length - 1;
            attempts++;
          }
          if (!filteredOptions[foundIndex]?.disabled) {
            setActiveIndex(foundIndex);
            dropdownRef.current?.scrollTo(foundIndex);
          }
        }
        break;
      case 'Escape':
        e.preventDefault();
        if (open) {
          setOpen(false);
          setSearchValue('');
        }
        break;
      case 'Tab':
        if (open) {
          setOpen(false);
          setSearchValue('');
        }
        break;
      case 'Home':
        if (open) {
          e.preventDefault();
          const firstEnabled = filteredOptions.findIndex(opt => !opt.disabled);
          if (firstEnabled >= 0) {
            setActiveIndex(firstEnabled);
            dropdownRef.current?.scrollTo(firstEnabled);
          }
        }
        break;
      case 'End':
        if (open) {
          e.preventDefault();
          let lastEnabled = filteredOptions.length - 1;
          while (lastEnabled >= 0 && filteredOptions[lastEnabled]?.disabled) {
            lastEnabled--;
          }
          if (lastEnabled >= 0) {
            setActiveIndex(lastEnabled);
            dropdownRef.current?.scrollTo(lastEnabled);
          }
        }
        break;
    }
  }, [open, activeIndex, filteredOptions, disabled, loading, showSearch, inputRef, dropdownRef, setOpen, setActiveIndex, setSearchValue, handleSelect]);

  return { handleKeyDown };
}
