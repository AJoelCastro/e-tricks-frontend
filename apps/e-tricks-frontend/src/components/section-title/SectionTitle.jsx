import Box from '@mui/material/Box';
// STYLED COMPONENT
import { Shape, Text } from './styles';

// ==============================================================

// ==============================================================

export default function SectionTitle({
  title,
  fontSize = 36,
  centered = false,
  ...props
}) {
  return <Box mb={4} {...props}>
      <Text centered={centered} fontSize={fontSize}>
        {title}
      </Text>

      <Shape centered={centered} />
    </Box>;
}