import React, { memo } from 'react';
import ExcelCell from './ExcelCell';

interface ExcelRowProps {
  rowIndex: number;
  cols: number;
  selectedCell: string | null;
  getCellValue: (row: number, col: number) => string;
  getCellStyle: (row: number, col: number) => React.CSSProperties;
  handleCellChange: (row: number, col: number, value: string) => void;
  setSelectedCell: (cell: string | null) => void;
}

const ExcelRow = memo(({ 
  rowIndex, 
  cols, 
  selectedCell, 
  getCellValue, 
  getCellStyle, 
  handleCellChange, 
  setSelectedCell 
}: ExcelRowProps) => {
  return (
    <div className="flex">
      <div className="w-12 h-8 bg-moss/5 border border-moss/10 flex items-center justify-center text-forest font-semibold sticky left-0 first-col">
        {rowIndex + 1}
      </div>
      {Array.from({ length: cols }).map((_, col) => {
        const cellId = `${String.fromCharCode(65 + col)}${rowIndex + 1}`;
        return (
          <ExcelCell
            key={`cell-${rowIndex}-${col}`}
            value={getCellValue(rowIndex, col)}
            style={getCellStyle(rowIndex, col)}
            isSelected={selectedCell === cellId}
            onChange={(value) => handleCellChange(rowIndex, col, value)}
            onFocus={() => setSelectedCell(cellId)}
          />
        );
      })}
    </div>
  );
});

ExcelRow.displayName = 'ExcelRow';

export default ExcelRow;