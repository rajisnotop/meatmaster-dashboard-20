interface GridData {
  [key: string]: {
    value: string;
    id: string;
    formula?: string;
  };
}

const memoizedValues = new Map<string, string | number>();

export const evaluateFormula = (formula: string, gridData: GridData): string | number => {
  if (!formula.startsWith('=')) {
    return formula;
  }

  const cacheKey = `${formula}-${JSON.stringify(gridData)}`;
  if (memoizedValues.has(cacheKey)) {
    return memoizedValues.get(cacheKey)!;
  }

  try {
    const expression = formula.substring(1);
    const evaluatedExpression = expression.replace(/[A-Z]+[0-9]+/g, (match) => {
      const cellValue = gridData[match]?.value || '0';
      return isNaN(Number(cellValue)) ? '0' : cellValue;
    });

    const result = Function(`"use strict"; return (${evaluatedExpression})`)();
    memoizedValues.set(cacheKey, result);
    
    // Prevent memory leaks by limiting cache size
    if (memoizedValues.size > 1000) {
      const firstKey = memoizedValues.keys().next().value;
      memoizedValues.delete(firstKey);
    }

    return result;
  } catch (error) {
    console.error('Formula evaluation error:', error);
    return 'ERROR';
  }
};