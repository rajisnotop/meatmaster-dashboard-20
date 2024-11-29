import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ExcelToolbar } from '@/components/excel/ExcelToolbar';
import ExcelGrid from '@/components/excel/ExcelGrid';
import { evaluateFormula } from '@/utils/excelFormulas';
import { exportExcelData } from '@/utils/excelDataTransfer';
import { FileDown } from 'lucide-react';

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

const Excel = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [gridData, setGridData] = useState<GridData>({});
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [clipboard, setClipboard] = useState<{ value: string; style?: any } | null>(null);

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
      try {
        const result = evaluateFormula(value, gridData);
        newGridData[cellId].value = result.toString();
      } catch (error) {
        console.error('Formula evaluation error:', error);
        toast({
          title: "Formula Error",
          description: error instanceof Error ? error.message : "Invalid formula",
          variant: "destructive"
        });
      }
    }
    
    setGridData(newGridData);
    localStorage.setItem('excelData', JSON.stringify(newGridData));
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
      textAlign: cell?.style?.align || 'left',
      fontSize: cell?.style?.fontSize || 'inherit'
    };
  };

  const handleStyleChange = (styleType: string, value: any) => {
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

  const handleCopy = () => {
    if (!selectedCell || !gridData[selectedCell]) return;
    setClipboard({
      value: gridData[selectedCell].value,
      style: gridData[selectedCell].style
    });
    toast({
      title: "Copied",
      description: "Cell content copied to clipboard",
      duration: 2000
    });
  };

  const handleCut = () => {
    if (!selectedCell || !gridData[selectedCell]) return;
    handleCopy();
    const newGridData = { ...gridData };
    newGridData[selectedCell] = {
      ...newGridData[selectedCell],
      value: '',
      style: {}
    };
    setGridData(newGridData);
    localStorage.setItem('excelData', JSON.stringify(newGridData));
  };

  const handlePaste = () => {
    if (!selectedCell || !clipboard) return;
    const newGridData = {
      ...gridData,
      [selectedCell]: {
        ...gridData[selectedCell],
        value: clipboard.value,
        style: clipboard.style
      }
    };
    setGridData(newGridData);
    localStorage.setItem('excelData', JSON.stringify(newGridData));
    toast({
      title: "Pasted",
      description: "Content pasted successfully",
      duration: 2000
    });
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

        <ExcelToolbar
          onStyleChange={handleStyleChange}
          selectedCell={selectedCell}
          onCopy={handleCopy}
          onCut={handleCut}
          onPaste={handlePaste}
        />
          
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