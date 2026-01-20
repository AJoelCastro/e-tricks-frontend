import { Box, Stepper, Step, StepLabel, Typography } from '@mui/material';

const steps = ['Productos', 'Datos y dirección', 'Comprar'];

type Props = {
  activeStep: number;
};

const CartProgress: React.FC<Props> = ({ activeStep }) => {
  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>
              <Typography
                variant="body2"
                sx={{
                  color: activeStep === index ? '#6f42c1' : 'gray',
                }}
              >
                {label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default CartProgress;
