import { Autocomplete, Button, TextField } from '@mui/material';

const crops = ["Wheat", "Corn", "Rice", "Barley", "Soybean"];
interface SearchBarProps {
  selectedCrop: string | null;
  setSelectedCrop: (crop: string | null) => void;
  userLocation: Object | null;
  handleSave: () => void;
}

export default function SearchBar({ selectedCrop, setSelectedCrop, userLocation, handleSave }: SearchBarProps) {

  return (
    <div style={{ position: "relative", width: "400px", margin: "auto" }}>
      <div
        style={{
          padding: "4px 16px",
          marginTop: "3px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          position: "absolute",
          zIndex: 100,
          top: "0",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "white",
          borderRadius: "25px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid #dfe1e5",
          overflow: "hidden",
          width: "auto",
          maxWidth: "600px",
        }}
      >
        <Autocomplete
          options={crops}
          sx={{ width: 300 }}
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
