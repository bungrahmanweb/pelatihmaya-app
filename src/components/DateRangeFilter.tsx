import React from 'react';

export default function DateRangeFilter({ start, end, onChange }: any) {
  return (
    <div className="date-range-filter">
      <input type="date" value={start} onChange={(e) => onChange(e.target.value, end)} />
      <input type="date" value={end} onChange={(e) => onChange(start, e.target.value)} />
    </div>
  );
}
