interface GridData {
  [key: string]: {
    value: string;
    id: string;
    formula?: string;
  };
}

export const evaluateFormula = (formula: string, gridData: GridData): string | number => {
  if (!formula.startsWith('=')) {
    return formula;
  }

  try {
    // Remove the '=' sign
    const expression = formula.substring(1);
    
    // Replace cell references with their values
    const evaluatedExpression = expression.replace(/[A-Z]+[0-9]+/g, (match) => {
      const cellValue = gridData[match]?.value || '0';
      return isNaN(Number(cellValue)) ? '0' : cellValue;
    });

    // Evaluate the expression
    const result = Function(`"use strict"; return (${evaluatedExpression})`)();
    return result;
  } catch (error) {
    console.error('Formula evaluation error:', error);
    return 'ERROR';
  }
}