export const GA_MEASUREMENT_ID = 'G-ZL27TVC5E2'; // reemplaza con tu ID real

// Track pageviews
export const pageview = (url: string) => {
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// Track eventos personalizados (opcional)
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value: number;
}) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
};
