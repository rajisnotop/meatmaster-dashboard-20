import React, { memo } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ExcelCellProps {
  value: string;
  style: React.CSSProperties;
  isSelected: boolean;
  onChange: (value: string) => void;
  onFocus: () => void;
}

const ExcelCell = memo(({ value, style, isSelected, onChange, onFocus }: ExcelCellProps) => {
  return (
    <div
      className={cn(
        "w-32 h-8 border border-moss/10 relative",
        isSelected && "ring-2 ring-forest ring-offset-0"
      )}
    >
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        className="w-full h-full border-0 focus:ring-0 bg-transparent text-forest"
        style={style}
      />
    </div>
  );
});

ExcelCell.displayName = 'ExcelCell';

export default ExcelCell;