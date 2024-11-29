import React from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CellData {
  value: string;
  id: string;
  style?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    color?: string;
    backgroundColor?: string;
    align?: 'left' | 'center' | 'right';
  };
  formula?: string;
}

interface GridData {
  [key: string]: CellData;
}

interface ExcelGridProps {
  gridData: GridData;
  selectedCell: string | null;
  setSelectedCell: (cell: string | null) => void;
  handleCellChange: (row: number, col: number, value: string) => void;
  getCellValue: (row: number, col: number) => string;
  getCellStyle: (row: number, col: number) => React.CSSProperties;
}

const ExcelGrid: React.FC<ExcelGridProps> = ({
  gridData,
  selectedCell,
  setSelectedCell,
  handleCellChange,
  getCellValue,
  getCellStyle,
}) => {
  const rows = 100;
  const cols = 26;

  return (
    <ScrollArea className="h-[800px]">
      <div className="p-6">
        <div className="grid">
          <div className="flex">
            <div className="w-12 h-8 bg-moss/5 border border-moss/10 flex items-center justify-center text-forest font-semibold">
              #
            </div>
            {Array.from({ length: cols }).map((_, col) => (
              <div
                key={`header-${col}`}
                className="w-32 h-8 bg-moss/5 border border-moss/10 flex items-center justify-center text-forest font-semibold"
              >
                {String.fromCharCode(65 + col)}
              </div>
            ))}
          </div>

          {Array.from({ length: rows }).map((_, row) => (
            <div key={`row-${row}`} className="flex">
              <div className="w-12 h-8 bg-moss/5 border border-moss/10 flex items-center justify-center text-forest font-semibold">
                {row + 1}
              </div>
              {Array.from({ length: cols }).map((_, col) => (
                <div
                  key={`cell-${row}-${col}`}
                  className="w-32 h-8 border border-moss/10"
                >
                  <Input
                    value={getCellValue(row, col)}
                    onChange={(e) => handleCellChange(row, col, e.target.value)}
                    onFocus={() => setSelectedCell(`${String.fromCharCode(65 + col)}${row + 1}`)}
                    className="w-full h-full border-0 focus:ring-0 bg-transparent text-forest"
                    style={getCellStyle(row, col)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default ExcelGrid;