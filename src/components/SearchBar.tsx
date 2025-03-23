import { Autocomplete, Button, TextField } from '@mui/material';
import './SearchBar.css'

const crops = ["Wheat", "Corn", "Rice", "Barley", "Soybean"];
interface SearchBarProps {
  selectedCrop: string | null;
  setSelectedCrop: (crop: string | null) => void;
  userLocation: Object | null;
  handleSave: () => void;
}

export default function SearchBar({ selectedCrop, setSelectedCrop, userLocation, handleSave }: SearchBarProps) {

  return (
    <div className='searchBarMain'>
      <div
        className='searchBar'>
        <Autocomplete
          options={crops}
          sx={{ width: 280 }}
          onChange={(_, newValue) => setSelectedCrop(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="O'simlikni kiriting"
              variant="standard"
              size="small"
              style={{
                outline: "none",
                border: "none !important",
                backgroundColor: "transparent",
                display: "flex",
                alignItems: "center",
              }}
            />
          )}
        />
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!userLocation || !selectedCrop}
          style={{
            borderRadius: "24px",
            textTransform: "none",
            boxShadow: "none",
            backgroundColor: "#1a73e8",
            color: "white",
            padding: "8px 16px",
          }}
        >
          Kiritish
        </Button>
      </div>
    </div>
  );
}
