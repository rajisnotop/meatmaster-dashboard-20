import React, { useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

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
    fontSize?: string;
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
  const rows = 1000; // Increased number of rows
  const cols = 26;
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (gridRef.current) {
        const header = gridRef.current.querySelector('.header-row');
        const firstCol = gridRef.current.querySelector('.first-col');
        if (header && firstCol) {
          const scrollTop = gridRef.current.scrollTop;
          const scrollLeft = gridRef.current.scrollLeft;
          header.scrollLeft = scrollLeft;
          firstCol.scrollTop = scrollTop;
        }
      }
    };

    gridRef.current?.addEventListener('scroll', handleScroll);
    return () => gridRef.current?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ScrollArea className="h-[calc(100vh-200px)] relative border rounded-lg">
      <div className="p-2" ref={gridRef}>
        <div className="grid">
          <div className="flex sticky top-0 z-10 bg-white header-row">
            <div className="w-12 h-8 bg-moss/5 border border-moss/10 flex items-center justify-center text-forest font-semibold sticky left-0">
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

          <div className="relative">
            {Array.from({ length: rows }).map((_, row) => (
              <div key={`row-${row}`} className="flex">
                <div className="w-12 h-8 bg-moss/5 border border-moss/10 flex items-center justify-center text-forest font-semibold sticky left-0 first-col">
                  {row + 1}
                </div>
                {Array.from({ length: cols }).map((_, col) => (
                  <div
                    key={`cell-${row}-${col}`}
                    className={cn(
                      "w-32 h-8 border border-moss/10 relative",
                      selectedCell === `${String.fromCharCode(65 + col)}${row + 1}` && "ring-2 ring-forest ring-offset-0"
                    )}
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
      </div>
    </ScrollArea>
  );
};

export default ExcelGrid;