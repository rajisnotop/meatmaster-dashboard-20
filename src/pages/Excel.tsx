import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  PaintBucket,
  Functions
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from '@/components/ui/separator';

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

  const evaluateFormula = (formula: string, cellId: string): number => {
    try {
      // Remove the = sign and evaluate the expression
      const expression = formula.substring(1);
      // Basic implementation - you can expand this
      return eval(expression);
    } catch (error) {
      console.error('Formula evaluation error:', error);
      return 0;
    }
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
      const result = evaluateFormula(value, cellId);
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

  const applyStyle = (styleType: keyof CellData['style'], value: any) => {
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

        <div className="p-4 border-b border-moss/10">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => applyStyle('bold', !gridData[selectedCell]?.style?.bold)}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => applyStyle('italic', !gridData[selectedCell]?.style?.italic)}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => applyStyle('underline', !gridData[selectedCell]?.style?.underline)}
            >
              <Underline className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => applyStyle('align', 'left')}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => applyStyle('align', 'center')}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => applyStyle('align', 'right')}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <PaintBucket className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => applyStyle('backgroundColor', '#ffeb3b')}>
                  Yellow Highlight
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => applyStyle('backgroundColor', '#a5d6a7')}>
                  Green Highlight
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => applyStyle('backgroundColor', '#ef9a9a')}>
                  Red Highlight
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant="ghost"
              size="icon"
              title="Formula Help"
            >
              <Functions className="h-4 w-4" />
            </Button>
          </div>
        </div>
          
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