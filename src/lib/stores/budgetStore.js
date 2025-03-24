// src/lib/stores/budgetStore.js
import { writable } from 'svelte/store';

// Create stores for each scenario
export const createBudgetStore = (totalBudget, categories) => {
  // Initialize allocations with even distribution
  const createEvenAllocations = () => {
    const allocations = {};
    const percentages = {};
    const evenPercentage = 100 / categories.length;
    
    categories.forEach(category => {
      percentages[category.id] = evenPercentage;
      allocations[category.id] = Math.round((evenPercentage / 100) * totalBudget);
    });
    
    // Adjust for rounding errors to ensure exact total
    const allocated = Object.values(allocations).reduce((sum, val) => sum + val, 0);
    if (allocated !== totalBudget) {
      const diff = totalBudget - allocated;
      allocations[categories[0].id] += diff;
    }
    
    return { allocations, percentages };
  };
  
  const initial = createEvenAllocations();
  
  // Create the store
  const { subscribe, update, set } = writable({
    totalBudget,
    categories,
    allocations: initial.allocations,
    percentages: initial.percentages,
    result: null,
  });
  
  return {
    subscribe,
    
    // Update allocation for a specific category
    allocate: (categoryId, newValue, newPercentage) => {
      update(state => {
        // Calculate how much this category's percentage is changing
        const oldPercentage = state.percentages[categoryId];
        const percentageDiff = newPercentage - oldPercentage;
        
        if (percentageDiff === 0) return state;
        
        // Calculate new percentages for all categories
        const newPercentages = { ...state.percentages };
        newPercentages[categoryId] = newPercentage;
        
        // Adjust other categories proportionally
        const otherCategories = state.categories.filter(c => c.id !== categoryId);
        const totalOtherPercentage = otherCategories.reduce((sum, c) => sum + state.percentages[c.id], 0);
        
        if (totalOtherPercentage > 0) {
          // Distribute the percentage difference proportionally among other categories
          otherCategories.forEach(c => {
            const currentPct = state.percentages[c.id];
            const proportion = currentPct / totalOtherPercentage;
            // Subtract proportionally from this category
            newPercentages[c.id] = Math.max(0, currentPct - (percentageDiff * proportion));
          });
        }
        
        // Ensure percentages add up to 100%
        const totalPct = Object.values(newPercentages).reduce((sum, val) => sum + val, 0);
        if (Math.abs(totalPct - 100) > 0.01) {
          // Normalize to ensure exactly 100%
          const factor = 100 / totalPct;
          Object.keys(newPercentages).forEach(id => {
            newPercentages[id] *= factor;
          });
        }
        
        // Convert percentages to actual allocations
        const newAllocations = {};
        Object.keys(newPercentages).forEach(id => {
          newAllocations[id] = Math.round((newPercentages[id] / 100) * state.totalBudget);
        });
        
        // Adjust for rounding errors
        const allocated = Object.values(newAllocations).reduce((sum, val) => sum + val, 0);
        if (allocated !== state.totalBudget) {
          const diff = state.totalBudget - allocated;
          // Add the difference to the category with the highest allocation
          const highestCategoryId = Object.keys(newAllocations).reduce(
            (a, b) => newAllocations[a] > newAllocations[b] ? a : b
          );
          newAllocations[highestCategoryId] += diff;
        }
        
        return {
          ...state,
          allocations: newAllocations,
          percentages: newPercentages
        };
      });
    },
    
    // Reset allocations to initial state (even distribution)
    reset: () => {
      update(state => {
        const { allocations, percentages } = createEvenAllocations();
        return {
          ...state,
          allocations,
          percentages,
          result: null
        };
      });
    },
    
    // Set the result from Mistral AI
    setResult: (result) => {
      update(state => ({ ...state, result }));
    },
    
    // Change the total budget
    setTotalBudget: (newTotal) => {
      update(state => {
        // Keep the same percentages, but recalculate allocations
        const newAllocations = {};
        Object.keys(state.percentages).forEach(id => {
          newAllocations[id] = Math.round((state.percentages[id] / 100) * newTotal);
        });
        
        // Adjust for rounding errors
        const allocated = Object.values(newAllocations).reduce((sum, val) => sum + val, 0);
        if (allocated !== newTotal) {
          const diff = newTotal - allocated;
          // Add the difference to the category with the highest allocation
          const highestCategoryId = Object.keys(newAllocations).reduce(
            (a, b) => newAllocations[a] > newAllocations[b] ? a : b
          );
          newAllocations[highestCategoryId] += diff;
        }
        
        return {
          ...state,
          totalBudget: newTotal,
          allocations: newAllocations
        };
      });
    }
  };
};

// Predefined stores for each scenario
export const movieBudgetStore = createBudgetStore(
  100000000, // $100 million default budget
  [
    { id: 'actors', name: 'Actors & Cast', icon: '🎭' },
    { id: 'visualEffects', name: 'Visual Effects', icon: '✨' },
    { id: 'production', name: 'Production & Sets', icon: '🏗️' },
    { id: 'marketing', name: 'Marketing', icon: '📢' },
    { id: 'writing', name: 'Script & Writing', icon: '📝' },
    { id: 'music', name: 'Music & Sound', icon: '🎵' }
  ]
);

export const weddingBudgetStore = createBudgetStore(
  30000000, // ₦30 million default budget
  [
    { id: 'venue', name: 'Venue & Rentals', icon: '🏰' },
    { id: 'catering', name: 'Catering & Drinks', icon: '🍽️' },
    { id: 'attire', name: 'Attire & Rings', icon: '👰' },
    { id: 'photography', name: 'Photography & Video', icon: '📸' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎵' },
    { id: 'decorations', name: 'Decorations & Flowers', icon: '💐' }
  ]
);

export const startupBudgetStore = createBudgetStore(
  1000000, // $1 million default budget
  [
    { id: 'development', name: 'Product Development', icon: '💻' },
    { id: 'marketing', name: 'Marketing & Sales', icon: '📢' },
    { id: 'hiring', name: 'Hiring & Team', icon: '👥' },
    { id: 'office', name: 'Office & Equipment', icon: '🏢' },
    { id: 'legal', name: 'Legal & Administration', icon: '⚖️' },
    { id: 'operations', name: 'Operations', icon: '⚙️' }
  ]
);