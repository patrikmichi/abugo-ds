/**
 * Token Registry - Static imports of all component token files
 * This avoids dynamic import issues in Vite/Storybook
 * 
 * All component tokens are imported statically at build time for reliability
 */

// Import all component token files
import accordionTokens from '../tokens/system/componentTokens/components/accordion.json';
import alertTokens from '../tokens/system/componentTokens/components/alert.json';
import anchorTokens from '../tokens/system/componentTokens/components/anchor.json';
import autocompleteTokens from '../tokens/system/componentTokens/components/autocomplete.json';
import avatarTokens from '../tokens/system/componentTokens/components/avatar.json';
import badgeTokens from '../tokens/system/componentTokens/components/badge.json';
import breadcrumbsTokens from '../tokens/system/componentTokens/components/breadcrumbs.json';
import buttonTokens from '../tokens/system/componentTokens/components/button.json';
import calendarTokens from '../tokens/system/componentTokens/components/calendar.json';
import cardTokens from '../tokens/system/componentTokens/components/card.json';
import checkboxTokens from '../tokens/system/componentTokens/components/checkbox.json';
import chipTokens from '../tokens/system/componentTokens/components/chip.json';
import colorpickerTokens from '../tokens/system/componentTokens/components/colorpicker.json';
import comboboxTokens from '../tokens/system/componentTokens/components/combobox.json';
import datepickerTokens from '../tokens/system/componentTokens/components/datepicker.json';
import dividerTokens from '../tokens/system/componentTokens/components/divider.json';
import drawerTokens from '../tokens/system/componentTokens/components/drawer.json';
import dropdownTokens from '../tokens/system/componentTokens/components/dropdown.json';
import durationpickerTokens from '../tokens/system/componentTokens/components/durationpicker.json';
import fieldTokens from '../tokens/system/componentTokens/components/field.json';
import fileTokens from '../tokens/system/componentTokens/components/file.json';
import flexTokens from '../tokens/system/componentTokens/components/flex.json';
import gridTokens from '../tokens/system/componentTokens/components/grid.json';
import imageTokens from '../tokens/system/componentTokens/components/image.json';
import inputTokens from '../tokens/system/componentTokens/components/input.json';
import inputnumberTokens from '../tokens/system/componentTokens/components/inputnumber.json';
import linkTokens from '../tokens/system/componentTokens/components/link.json';
import loadingTokens from '../tokens/system/componentTokens/components/loading.json';
import menuTokens from '../tokens/system/componentTokens/components/menu.json';
import modalTokens from '../tokens/system/componentTokens/components/modal.json';
import notificationTokens from '../tokens/system/componentTokens/components/notification.json';
import paginationTokens from '../tokens/system/componentTokens/components/pagination.json';
import phonenumberfieldTokens from '../tokens/system/componentTokens/components/phonenumberfield.json';
import popoverTokens from '../tokens/system/componentTokens/components/popover.json';
import progressTokens from '../tokens/system/componentTokens/components/progress.json';
import radioTokens from '../tokens/system/componentTokens/components/radio.json';
import ratingTokens from '../tokens/system/componentTokens/components/rating.json';
import segmentedTokens from '../tokens/system/componentTokens/components/segmented.json';
import selectTokens from '../tokens/system/componentTokens/components/select.json';
import skeletonTokens from '../tokens/system/componentTokens/components/skeleton.json';
import sliderTokens from '../tokens/system/componentTokens/components/slider.json';
import spinnerTokens from '../tokens/system/componentTokens/components/spinner.json';
import stepperTokens from '../tokens/system/componentTokens/components/stepper.json';
import tabsTokens from '../tokens/system/componentTokens/components/tabs.json';
import textareaTokens from '../tokens/system/componentTokens/components/textarea.json';
import timepickerTokens from '../tokens/system/componentTokens/components/timepicker.json';
import toastTokens from '../tokens/system/componentTokens/components/toast.json';
import toggleTokens from '../tokens/system/componentTokens/components/toggle.json';
import tooltipTokens from '../tokens/system/componentTokens/components/tooltip.json';
import uploadTokens from '../tokens/system/componentTokens/components/upload.json';

// Map component names to their token files
const tokenRegistry: Record<string, any> = {
  accordion: accordionTokens,
  alert: alertTokens,
  anchor: anchorTokens,
  autocomplete: autocompleteTokens,
  avatar: avatarTokens,
  badge: badgeTokens,
  breadcrumbs: breadcrumbsTokens,
  button: buttonTokens,
  calendar: calendarTokens,
  card: cardTokens,
  checkbox: checkboxTokens,
  chip: chipTokens,
  colorpicker: colorpickerTokens,
  combobox: comboboxTokens,
  datepicker: datepickerTokens,
  divider: dividerTokens,
  drawer: drawerTokens,
  dropdown: dropdownTokens,
  durationpicker: durationpickerTokens,
  field: fieldTokens,
  file: fileTokens,
  flex: flexTokens,
  grid: gridTokens,
  image: imageTokens,
  input: inputTokens,
  inputnumber: inputnumberTokens,
  link: linkTokens,
  loading: loadingTokens,
  menu: menuTokens,
  modal: modalTokens,
  notification: notificationTokens,
  pagination: paginationTokens,
  phonenumberfield: phonenumberfieldTokens,
  popover: popoverTokens,
  progress: progressTokens,
  radio: radioTokens,
  rating: ratingTokens,
  segmented: segmentedTokens,
  select: selectTokens,
  skeleton: skeletonTokens,
  slider: sliderTokens,
  spinner: spinnerTokens,
  stepper: stepperTokens,
  tabs: tabsTokens,
  textarea: textareaTokens,
  timepicker: timepickerTokens,
  toast: toastTokens,
  toggle: toggleTokens,
  tooltip: tooltipTokens,
  upload: uploadTokens,
};

/**
 * Get tokens for a component by name
 */
export function getComponentTokens(componentName: string): any {
  const fileName = componentName.toLowerCase();
  return tokenRegistry[fileName] || null;
}

/**
 * Check if tokens exist for a component
 */
export function hasComponentTokens(componentName: string): boolean {
  const fileName = componentName.toLowerCase();
  return fileName in tokenRegistry;
}

export default tokenRegistry;
