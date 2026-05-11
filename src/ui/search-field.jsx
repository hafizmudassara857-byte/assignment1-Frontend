import TextField from "./text-field";

export default function SearchField({ value, onChange }) {
  return (
    <TextField
      label="Search the gallery"
      placeholder='Try "library", "rain", or a caption keyword'
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
