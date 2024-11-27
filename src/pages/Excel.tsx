import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ExcelToolbar } from '@/components/excel/ExcelToolbar';
import ExcelGrid from '@/components/excel/ExcelGrid';
import { evaluateFormula } from '@/utils/excelFormulas';
import { exportExcelData } from '@/utils/excelDataTransfer';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  PaintBucket,
  Calculator,
  FileDown
} from 'lucide-react';

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
  const location = useLocation();
  const [gridData, setGridData] = useState<GridData>({});
  const [selectedCell, setSelectedCell] = useState<string | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('excelData');
    if (savedData) {
      setGridData(JSON.parse(savedData));
    } else if (location.state?.gridData) {
      setGridData(location.state.gridData);
    }
  }, [location.state]);

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

  const handleExport = () => {
    exportExcelData(gridData);
    toast({
      title: "Export Successful",
      description: "The Excel file has been downloaded",
      duration: 2000
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="bg-cream rounded-xl border border-moss/10 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-moss/20 via-earth/10 to-transparent p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-forest">Excel Sheet</h1>
              <p className="text-moss/70 text-sm mt-1">Enhanced with formatting and formulas</p>
            </div>
            <Button
              onClick={handleExport}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Export to Excel
            </Button>
          </div>
        </div>

        <div className="p-4 border-b flex items-center gap-2">
          <button
            onClick={() => handleStyleChange('bold', !gridData[selectedCell!]?.style?.bold)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleStyleChange('italic', !gridData[selectedCell!]?.style?.italic)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleStyleChange('underline', !gridData[selectedCell!]?.style?.underline)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Underline className="h-4 w-4" />
          </button>
          <div className="h-6 w-px bg-gray-300 mx-2" />
          <button
            onClick={() => handleStyleChange('align', 'left')}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleStyleChange('align', 'center')}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleStyleChange('align', 'right')}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <AlignRight className="h-4 w-4" />
          </button>
          <div className="h-6 w-px bg-gray-300 mx-2" />
          <input
            type="color"
            onChange={(e) => handleStyleChange('color', e.target.value)}
            className="w-8 h-8 p-1"
          />
          <button
            onClick={() => handleStyleChange('backgroundColor', '#f0f0f0')}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <PaintBucket className="h-4 w-4" />
          </button>
          <div className="h-6 w-px bg-gray-300 mx-2" />
          <Calculator className="h-4 w-4" />
          <span className="text-sm text-gray-500">
            Use =A1+B1 for formulas
          </span>
        </div>
          
        <ExcelGrid
          gridData={gridData}
          selectedCell={selectedCell}
          setSelectedCell={setSelectedCell}
          handleCellChange={handleCellChange}
          getCellValue={getCellValue}
          getCellStyle={getCellStyle}
        />
      </div>
    </div>
  );
};

export default Excel;