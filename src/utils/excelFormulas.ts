export const evaluateFormula = (formula: string): number => {
  try {
    // Remove the = sign
    const expression = formula.substring(1);
    
    // Split the expression into parts
    const parts = expression.split(/([+\-*/])/);
    
    // Convert parts to numbers and operators
    const numbers = parts.map(part => {
      const trimmed = part.trim();
      if (['+', '-', '*', '/'].includes(trimmed)) {
        return trimmed;
      }
      return isNaN(Number(trimmed)) ? 0 : Number(trimmed);
    });
    
    // Calculate result
    let result = numbers[0] as number;
    for (let i = 1; i < numbers.length; i += 2) {
      const operator = numbers[i] as string;
      const nextNumber = numbers[i + 1] as number;
      
      switch (operator) {
        case '+':
          result += nextNumber;
          break;
        case '-':
          result -= nextNumber;
          break;
        case '*':
          result *= nextNumber;
          break;
        case '/':
          if (nextNumber === 0) {
            throw new Error('Division by zero');
          }
          result /= nextNumber;
          break;
      }
    }
    
    return result;
  } catch (error) {
    console.error('Formula evaluation error:', error);
    return 0;
  }
};