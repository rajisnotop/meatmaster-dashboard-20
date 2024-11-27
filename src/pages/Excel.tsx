import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CellData {
  value: string;
  id: string;
}

interface GridData {
  [key: string]: CellData;
}

const Excel = () => {
  const { toast } = useToast();
  const [gridData, setGridData] = useState<GridData>({});
  const rows = 100;
  const cols = 26;

  useEffect(() => {
    // Load saved data from localStorage
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
      [cellId]: { value, id: cellId }
    };
    
    setGridData(newGridData);
    localStorage.setItem('excelData', JSON.stringify(newGridData));
    
    console.log(`Cell ${cellId} updated with value: ${value}`);
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

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <main className="container py-6">
        <div className="bg-cream rounded-xl border border-moss/10 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-moss/20 via-earth/10 to-transparent p-6">
            <h1 className="text-2xl font-semibold text-forest">Excel Sheet</h1>
            <p className="text-moss/70 text-sm mt-1">Edit cells just like in Excel</p>
          </div>
          
          <ScrollArea className="h-[800px] w-full">
            <div className="p-6">
              <div className="grid">
                {/* Header Row */}
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

                {/* Data Rows */}
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
                          className="w-full h-full border-0 focus:ring-0 bg-transparent text-forest"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      </main>
    </div>
  );
};

export default Excel;