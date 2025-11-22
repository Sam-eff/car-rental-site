import React, { createContext, useState, useEffect } from 'react';

export const ComparisonContext = createContext();

export const ComparisonProvider = ({ children }) => {
    const [comparisonList, setComparisonList] = useState([]);
    const MAX_COMPARISON = 3; // Maximum 3 cars to compare

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('comparison_list');
        if (saved) {
            try {
                setComparisonList(JSON.parse(saved));
            } catch (error) {
                console.error('Error loading comparison list:', error);
            }
        }
    }, []);

    // Save to localStorage whenever list changes
    useEffect(() => {
        localStorage.setItem('comparison_list', JSON.stringify(comparisonList));
    }, [comparisonList]);

    const addToComparison = (car) => {
        if (comparisonList.length >= MAX_COMPARISON) {
            return { success: false, message: `You can only compare up to ${MAX_COMPARISON} cars` };
        }

        if (comparisonList.some(c => c.id === car.id)) {
            return { success: false, message: 'Car already in comparison' };
        }

        setComparisonList([...comparisonList, car]);
        return { success: true, message: 'Car added to comparison' };
    };

    const removeFromComparison = (carId) => {
        setComparisonList(comparisonList.filter(c => c.id !== carId));
    };

    const clearComparison = () => {
        setComparisonList([]);
    };

    const isInComparison = (carId) => {
        return comparisonList.some(c => c.id === carId);
    };

    return (
        <ComparisonContext.Provider value={{
            comparisonList,
            addToComparison,
            removeFromComparison,
            clearComparison,
            isInComparison,
            MAX_COMPARISON
        }}>
            {children}
        </ComparisonContext.Provider>
    );
};