import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

type ThemeMode = 'auto' | 'light' | 'dark';
type ColorScheme = 'light' | 'dark';

interface ThemeContextType {
    mode: ThemeMode;
    toggleMode: () => void;
    colorScheme: ColorScheme;
    colors: typeof Colors.dark; // Type definition based on structure
}

const ThemeContext = createContext<ThemeContextType>({
    mode: 'auto',
    toggleMode: () => { },
    colorScheme: 'dark',
    colors: Colors.dark,
});

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemScheme = useSystemColorScheme();
    const [mode, setMode] = useState<ThemeMode>('auto');
    const [timeBasedScheme, setTimeBasedScheme] = useState<ColorScheme>('light');

    // Logic: Auto Time Detection (06:00 - 18:00 is Light)
    useEffect(() => {
        const checkTime = () => {
            const hour = new Date().getHours();
            // From 6 AM to 6 PM (18:00) -> Light Mode
            if (hour >= 6 && hour < 18) {
                setTimeBasedScheme('light');
            } else {
                setTimeBasedScheme('dark');
            }
        };

        checkTime(); // Initial check
        const interval = setInterval(checkTime, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    // Compute final scheme
    const colorScheme = useMemo(() => {
        if (mode === 'auto') return timeBasedScheme;
        return mode;
    }, [mode, timeBasedScheme]);

    const toggleMode = () => {
        setMode(prev => {
            if (prev === 'auto') return 'light';
            if (prev === 'light') return 'dark';
            return 'auto';
        });
    };

    const value = {
        mode,
        toggleMode,
        colorScheme,
        colors: Colors[colorScheme],
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useAppTheme = () => useContext(ThemeContext);
