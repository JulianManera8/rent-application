/* eslint-disable react/prop-types */
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export const FormInput = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  hint,
  disabled
}) => (
  <div className="min-w-56">
    <Label htmlFor={name} className={`font-bold flex justify-between items-center pr-1 ${disabled ? 'text-zinc-400' : 'text-black'}`}>
      <p>{label}</p>
      {hint && <span className="text-gray-400 text-xs">{hint}</span>}
    </Label>
    <Input
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`mt-2 text-md p-2 ${error ? 'border-red-500' : 'border-zinc-500'} ${disabled ? 'border-zinc-300' : ''}`}
      disabled={disabled}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

