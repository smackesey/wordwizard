// ########################
// ##### LOCAL STORAGE
// ########################

const SETTINGS_PREFIX = 'wordwizard-settings-';

function getSettingsKey(setting: string): string {
  return `${SETTINGS_PREFIX}${setting}`;
}

export function localStorageSet<T>(settingsKey: string, value: T): void {
  localStorage.setItem(getSettingsKey(settingsKey), JSON.stringify(value));
}

export function localStorageGet<T>(setting: string, defaultValue: T): T {
  const key = getSettingsKey(setting);
  const value = localStorage.getItem(key);
  return value === null ? defaultValue : JSON.parse(value);
}

// ########################
// ##### COMPONENTS
// ########################

export function SettingsSelect<T extends string>({
  settingsKey,
  label,
  value,
  setValue,
  options,
}: {
  settingsKey: string;
  label: string;
  value: T;
  setValue: (x: T) => void;
  options: T[];
}) {
  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value as T;
    localStorageSet(settingsKey, newValue);
    setValue(newValue);
  };

  return (
    <div className="flex justify-between">
      <div>{label}</div>
      <select className="rounded-sm border-black border" value={value} onChange={onChange}>
        {options.map((option, i) => (
          <option value={option} key={i}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SettingsToggle({
  settingsKey,
  label,
  value,
  setValue,
}: {
  settingsKey: string;
  label: string;
  value: boolean;
  setValue: (x: boolean) => void;
}) {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    localStorageSet(settingsKey, newValue);
    setValue(newValue);
  };

  return (
    <div className="flex justify-between">
      <div>{label}</div>
      <input type="checkbox" checked={value} onChange={onChange} />
    </div>
  );
}

export function SettingsSlider({
  settingsKey,
  label,
  value,
  setValue,
  min = 2,
  max = 10,
  step = 1,
}: {
  settingsKey: string;
  label: string;
  value: number;
  setValue: (x: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value);
    localStorageSet(settingsKey, newValue);
    setValue(newValue);
  };

  return (
    <div className="flex justify-between">
      <div>{label}</div>
      <div className="flex space-x-2 > *">
        <input
          type="range"
          min={min} // Minimum value
          max={max} // Maximum value
          step={step} // Increment/decrement by this value
          value={value}
          onChange={onChange}
        />
        <div className="min-w-[1em] text-right">{value}</div>
      </div>
    </div>
  );
}
