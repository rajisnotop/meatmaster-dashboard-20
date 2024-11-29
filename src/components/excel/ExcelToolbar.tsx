import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  PaintBucket,
  Calculator
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExcelToolbarProps {
  onStyleChange: (styleType: string, value: any) => void;
  selectedCell: string | null;
}

export const ExcelToolbar: React.FC<ExcelToolbarProps> = ({ onStyleChange, selectedCell }) => {
  return (
    <div className="p-4 border-b border-moss/10">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onStyleChange('bold', true)}
          disabled={!selectedCell}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onStyleChange('italic', true)}
          disabled={!selectedCell}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onStyleChange('underline', true)}
          disabled={!selectedCell}
        >
          <Underline className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onStyleChange('align', 'left')}
          disabled={!selectedCell}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onStyleChange('align', 'center')}
          disabled={!selectedCell}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onStyleChange('align', 'right')}
          disabled={!selectedCell}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={!selectedCell}>
              <PaintBucket className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onStyleChange('backgroundColor', '#ffeb3b')}>
              Yellow Highlight
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStyleChange('backgroundColor', '#a5d6a7')}>
              Green Highlight
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStyleChange('backgroundColor', '#ef9a9a')}>
              Red Highlight
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button
          variant="ghost"
          size="icon"
          title="Formula Help"
          disabled={!selectedCell}
        >
          <Calculator className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};