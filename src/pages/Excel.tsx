import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExcelToolbar } from '@/components/excel/ExcelToolbar';
import { evaluateFormula } from '@/utils/excelFormulas';

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

const Excel = () => {
  const { toast } = useToast();
  const [gridData, setGridData] = useState<GridData>({});
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const rows = 100;
  const cols = 26;

  useEffect(() => {
    const savedData = localStorage.getItem('excelData');
    if (savedData) {
      setGridData(JSON.parse(savedData));
    }
  }, []);

  const getCellId = (row: number, col: number) => {
    const colLetter = String.fromCharCode(65 + col);
    return `${colLetter}${row + 1}`;
  };

  const handleCellChange = (row: number, col: number, value: string) => {
    const cellId = getCellId(row, col);
    const newGridData = {
      ...gridData,
      [cellId]: {
        ...gridData[cellId],
        value,
        id: cellId,
        formula: value.startsWith('=') ? value : undefined
      }
    };
    
    if (value.startsWith('=')) {
      const result = evaluateFormula(value);
      newGridData[cellId].value = result.toString();
    }
    
    setGridData(newGridData);
    localStorage.setItem('excelData', JSON.stringify(newGridData));
    
    toast({
      title: "Cell Updated",
      description: `${cellId}: ${value}`,
      duration: 1000
    });
  };

  const getCellValue = (row: number, col: number) => {
    const cellId = getCellId(row, col);
    return gridData[cellId]?.value || '';
  };

  const getCellStyle = (row: number, col: number) => {
    const cellId = getCellId(row, col);
    const cell = gridData[cellId];
    return {
      fontWeight: cell?.style?.bold ? 'bold' : 'normal',
      fontStyle: cell?.style?.italic ? 'italic' : 'normal',
      textDecoration: cell?.style?.underline ? 'underline' : 'none',
      color: cell?.style?.color || 'inherit',
      backgroundColor: cell?.style?.backgroundColor || 'transparent',
      textAlign: cell?.style?.align || 'left'
    };
  };

  const handleStyleChange = (styleType: keyof CellData['style'], value: any) => {
    if (!selectedCell) return;
    
    const newGridData = {
      ...gridData,
      [selectedCell]: {
        ...gridData[selectedCell],
        style: {
          ...gridData[selectedCell]?.style,
          [styleType]: value
        }
      }
    };
    
    setGridData(newGridData);
    localStorage.setItem('excelData', JSON.stringify(newGridData));
  };

  return (
    <div className="container mx-auto py-6">
      <div className="bg-cream rounded-xl border border-moss/10 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-moss/20 via-earth/10 to-transparent p-6">
          <h1 className="text-2xl font-semibold text-forest">Excel Sheet</h1>
          <p className="text-moss/70 text-sm mt-1">Enhanced with formatting and formulas</p>
        </div>

        <ExcelToolbar onStyleChange={handleStyleChange} selectedCell={selectedCell} />
          
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
                        onFocus={() => setSelectedCell(getCellId(row, col))}
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
      </div>
    </div>
  );
};

export default Excel;