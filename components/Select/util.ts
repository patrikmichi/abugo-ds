import type { SelectOption } from './Select';

export function filterOptions(
  options: SelectOption[],
  searchValue: string,
  filterOption: boolean | ((input: string, option: SelectOption) => boolean) = true,
  field: 'label' | 'value' = 'label'
): SelectOption[] {
  if (!searchValue || !filterOption) {
    return options;
  }

  if (typeof filterOption === 'function') {
    return options.filter((option) => filterOption(searchValue, option));
  }

  // Default filter: case-insensitive match on the specified field
  const lowerSearch = searchValue.toLowerCase();
  return options.filter((option) => {
    const fieldValue = option[field];
    if (typeof fieldValue === 'string') {
      return fieldValue.toLowerCase().includes(lowerSearch);
    }
    return false;
  });
}
