import React, { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ExcelRow from './ExcelRow';

interface ExcelGridProps {
  gridData: any;
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
  const rows = 1000;
  const cols = 26;
  const gridRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 });

  useEffect(() => {
    const handleScroll = () => {
      if (gridRef.current) {
        const scrollTop = gridRef.current.scrollTop;
        const rowHeight = 32; // 8 * 4 (h-8 class)
        const visibleRows = Math.ceil(gridRef.current.clientHeight / rowHeight);
        const startRow = Math.floor(scrollTop / rowHeight);
        const endRow = Math.min(startRow + visibleRows + 10, rows); // +10 for buffer

        setVisibleRange({ start: Math.max(0, startRow - 10), end: endRow });

        const header = gridRef.current.querySelector('.header-row');
        const firstCol = gridRef.current.querySelector('.first-col');
        if (header && firstCol) {
          header.scrollLeft = gridRef.current.scrollLeft;
          firstCol.scrollTop = scrollTop;
        }
      }
    };

    const gridElement = gridRef.current;
    if (gridElement) {
      gridElement.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial calculation
    }

    return () => {
      if (gridElement) {
        gridElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [rows]);

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

          <div 
            className="relative" 
            style={{ height: `${rows * 32}px` }}
          >
            <div style={{ position: 'absolute', top: `${visibleRange.start * 32}px` }}>
              {Array.from({ length: visibleRange.end - visibleRange.start }).map((_, index) => {
                const rowIndex = visibleRange.start + index;
                return (
                  <ExcelRow
                    key={`row-${rowIndex}`}
                    rowIndex={rowIndex}
                    cols={cols}
                    selectedCell={selectedCell}
                    getCellValue={getCellValue}
                    getCellStyle={getCellStyle}
                    handleCellChange={handleCellChange}
                    setSelectedCell={setSelectedCell}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default ExcelGrid;