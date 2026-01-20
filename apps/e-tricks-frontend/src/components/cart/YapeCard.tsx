import { Box, Typography, Paper } from "@mui/material";
import Image from "next/image";

interface YapeCardProps {
  selected: boolean;
  onSelect: () => void;
}

const YapeCard = ({ selected, onSelect }: YapeCardProps) => {
  return (
    <Paper
      elevation={selected ? 4 : 1}
      onClick={onSelect}
      sx={{
        borderRadius: 2,
        p: 2,
        border: selected ? '2px solid #7950f2' : '1px solid #e0e0e0',
        backgroundColor: '#ffffff',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        '&:hover': {
          boxShadow: 3,
        },
      }}
    >
      <Image
        src="https://imgs.search.brave.com/cIm__eRvkfQK61DHoU-3aq9ad9EArvbEjpIjw1z1_k4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tYXJr/ZXRpbmctcGVydS5i/ZWdsb2JhbC5iaXov/d3AtY29udGVudC91/cGxvYWRzL2VsZW1l/bnRvci90aHVtYnMv/eWFwZS1sb2dvLWZv/bmRvLXRyYW5zcGFy/ZW50ZS1yMHl3aW9r/MXV6N2N3bXh6bWpp/bDdjbDdydWRpNHpp/Y2d1eHlwcWpubHcu/cG5n"
        alt="Yape Logo"
        width={40}
        height={40}
      />
      <Typography variant="leftside">Yape</Typography>
    </Paper>
  );
};

export default YapeCard;
