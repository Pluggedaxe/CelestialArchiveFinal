// theme.js
import { createTheme } from '@rneui/themed';

export const theme = createTheme({
  // Global default font for all text-based components
  components: {
    Text: {
      style: {
        fontFamily: 'Outfit_400Regular', // Apply "Outfit Regular" as the global default font
      },
    },
    // Additional components that use text and need specific styles can be added here
    Button: {
      titleStyle: {
        fontFamily: 'Outfit_400Regular', // Apply "Outfit Regular" as the global default font for Button titles
      },
    },
  },
  // General theme settings (if needed)
  fontFamily: 'Outfit_400Regular', // This will apply as a default to all components supporting fontFamily
});
