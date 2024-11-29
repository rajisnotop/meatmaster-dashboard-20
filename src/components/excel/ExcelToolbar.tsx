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
  Calculator,
  Type,
  Minus,
  Plus,
  Copy,
  Scissors,
  Clipboard
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
  onCopy?: () => void;
  onCut?: () => void;
  onPaste?: () => void;
}

export const ExcelToolbar: React.FC<ExcelToolbarProps> = ({ 
  onStyleChange, 
  selectedCell,
  onCopy,
  onCut,
  onPaste
}) => {
  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px'];

  return (
    <div className="p-4 border-b border-moss/10 flex flex-wrap gap-2">
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onStyleChange('bold', true)}
          disabled={!selectedCell}
          className="hover:bg-moss/10"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onStyleChange('italic', true)}
          disabled={!selectedCell}
          className="hover:bg-moss/10"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onStyleChange('underline', true)}
          disabled={!selectedCell}
          className="hover:bg-moss/10"
        >
          <Underline className="h-4 w-4" />
        </Button>
      </div>
        
      <Separator orientation="vertical" className="h-6" />
      
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onStyleChange('align', 'left')}
          disabled={!selectedCell}
          className="hover:bg-moss/10"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onStyleChange('align', 'center')}
          disabled={!selectedCell}
          className="hover:bg-moss/10"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onStyleChange('align', 'right')}
          disabled={!selectedCell}
          className="hover:bg-moss/10"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
        
      <Separator orientation="vertical" className="h-6" />
      
      <div className="flex items-center space-x-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={!selectedCell} className="hover:bg-moss/10">
              <Type className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {fontSizes.map((size) => (
              <DropdownMenuItem key={size} onClick={() => onStyleChange('fontSize', size)}>
                {size}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={!selectedCell} className="hover:bg-moss/10">
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
            <DropdownMenuItem onClick={() => onStyleChange('backgroundColor', 'transparent')}>
              Clear Highlight
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onCopy}
          disabled={!selectedCell}
          className="hover:bg-moss/10"
          title="Copy"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCut}
          disabled={!selectedCell}
          className="hover:bg-moss/10"
          title="Cut"
        >
          <Scissors className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onPaste}
          disabled={!selectedCell}
          className="hover:bg-moss/10"
          title="Paste"
        >
          <Clipboard className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />
      
      <Button
        variant="ghost"
        size="icon"
        title="Formula Help"
        disabled={!selectedCell}
        className="hover:bg-moss/10"
      >
        <Calculator className="h-4 w-4" />
      </Button>
    </div>
  );
};