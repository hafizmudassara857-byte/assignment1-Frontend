import Input from './Input';

function SearchBar({ value, onChange }) {
  return (
    <Input
      label="Search the gallery"
      placeholder="Try “library”, “rain”, or a caption keyword"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export default SearchBar;
