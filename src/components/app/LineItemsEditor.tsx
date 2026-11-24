import React from 'react';
import { Plus, Trash2, GripVertical, Copy, ChevronUp, ChevronDown } from 'lucide-react';
import type { LineItem } from '../../types/quote';
import { calculateLineAmount, formatMoney } from '../../utils/calculations';

interface LineItemsEditorProps {
  items: LineItem[];
  currency: string;
  onChange: (updated: LineItem[]) => void;
}

export const LineItemsEditor: React.FC<LineItemsEditorProps> = ({ items, currency, onChange }) => {
  const handleItemChange = (index: number, field: keyof LineItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };

    if (field === 'quantity' || field === 'rate') {
      const q = field === 'quantity' ? Number(value) || 0 : item.quantity;
      const r = field === 'rate' ? Number(value) || 0 : item.rate;
      item.amount = calculateLineAmount(q, r);
    }

    updated[index] = item;
    onChange(updated);
  };

  const addItem = () => {
    const newItem: LineItem = {
      id: 'item-' + Date.now(),
      description: '',
      details: '',
      quantity: 1,
      unit: '',
      rate: 0,
      amount: 0,
      isTaxable: true
    };
    onChange([...items, newItem]);
  };

  const duplicateItem = (index: number) => {
    const itemToClone = items[index];
    const cloned: LineItem = {
      ...itemToClone,
      id: 'item-' + Date.now(),
      description: `${itemToClone.description} (Copy)`
    };
    const updated = [...items];
    updated.splice(index + 1, 0, cloned);
    onChange(updated);
  };

  const deleteItem = (index: number) => {
    if (items.length <= 1) {
      // Keep at least one blank row
      onChange([
        {
          id: 'item-' + Date.now(),
          description: '',
          quantity: 1,
          rate: 0,
          amount: 0,
          isTaxable: true
        }
      ]);
      return;
    }
    onChange(items.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-medium">
          Line Items ({items.length})
        </label>
        <button
          type="button"
          onClick={addItem}
          className="text-xs font-medium text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Item
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block border border-neutral-200 rounded-md overflow-hidden bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-mono text-[11px]">
            <tr>
              <th className="py-2 pl-3 pr-1 w-8">#</th>
              <th className="py-2 px-2">Description & Details</th>
              <th className="py-2 px-2 w-20">Qty</th>
              <th className="py-2 px-2 w-20">Unit</th>
              <th className="py-2 px-2 w-28">Rate</th>
              <th className="py-2 px-2 w-28 text-right">Amount</th>
              <th className="py-2 px-2 w-16 text-center">Tax</th>
              <th className="py-2 pr-3 pl-1 w-20 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {items.map((item, idx) => (
              <tr key={item.id} className="hover:bg-neutral-50/50 group">
                <td className="py-2 pl-3 pr-1 text-neutral-400 font-mono text-[11px]">
                  {idx + 1}
                </td>
                <td className="py-2 px-2">
                  <input
                    type="text"
                    placeholder="Item or service name..."
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    className="w-full font-medium text-neutral-900 border-0 focus:ring-0 p-0 text-xs placeholder:text-neutral-300"
                  />
                  <input
                    type="text"
                    placeholder="Additional details (optional)..."
                    value={item.details || ''}
                    onChange={(e) => handleItemChange(idx, 'details', e.target.value)}
                    className="w-full text-[11px] text-neutral-500 border-0 focus:ring-0 p-0 mt-0.5 placeholder:text-neutral-300"
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={item.quantity === 0 ? '' : item.quantity}
                    onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                    className="w-full text-xs font-mono border border-neutral-200 rounded px-1.5 py-1 text-right focus:border-neutral-900"
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="text"
                    placeholder="hrs/pcs"
                    value={item.unit || ''}
                    onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                    className="w-full text-xs border border-neutral-200 rounded px-1.5 py-1 focus:border-neutral-900"
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={item.rate === 0 ? '' : item.rate}
                    onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                    className="w-full text-xs font-mono border border-neutral-200 rounded px-1.5 py-1 text-right focus:border-neutral-900"
                  />
                </td>
                <td className="py-2 px-2 text-right font-mono font-medium text-neutral-900">
                  {formatMoney(item.amount, currency)}
                </td>
                <td className="py-2 px-2 text-center">
                  <input
                    type="checkbox"
                    title="Include in tax calculation"
                    checked={item.isTaxable !== false}
                    onChange={(e) => handleItemChange(idx, 'isTaxable', e.target.checked)}
                    className="rounded border-neutral-300 text-neutral-900 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                  />
                </td>
                <td className="py-2 pr-3 pl-1 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => moveItem(idx, 'up')}
                      disabled={idx === 0}
                      title="Move up"
                      className="p-1 hover:text-neutral-900 disabled:opacity-20"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(idx, 'down')}
                      disabled={idx === items.length - 1}
                      title="Move down"
                      className="p-1 hover:text-neutral-900 disabled:opacity-20"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicateItem(idx)}
                      title="Duplicate row"
                      className="p-1 hover:text-neutral-900"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteItem(idx)}
                      title="Delete row"
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="sm:hidden space-y-2">
        {items.map((item, idx) => (
          <div key={item.id} className="border border-neutral-200 rounded-md p-3 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-400">#{idx + 1}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => duplicateItem(idx)}
                  className="p-1 text-neutral-500"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteItem(idx)}
                  className="p-1 text-red-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <input
              type="text"
              placeholder="Item name..."
              value={item.description}
              onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
              className="w-full text-xs font-medium border border-neutral-200 rounded p-1.5"
            />
            <input
              type="text"
              placeholder="Description details (optional)..."
              value={item.details || ''}
              onChange={(e) => handleItemChange(idx, 'details', e.target.value)}
              className="w-full text-[11px] text-neutral-500 border border-neutral-200 rounded p-1.5"
            />

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="text-[10px] font-mono text-neutral-400 block mb-0.5">Qty</label>
                <input
                  type="number"
                  value={item.quantity === 0 ? '' : item.quantity}
                  onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                  className="w-full text-xs font-mono border border-neutral-200 rounded p-1 text-right"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-neutral-400 block mb-0.5">Rate</label>
                <input
                  type="number"
                  value={item.rate === 0 ? '' : item.rate}
                  onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                  className="w-full text-xs font-mono border border-neutral-200 rounded p-1 text-right"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-neutral-400 block mb-0.5">Amount</label>
                <div className="text-xs font-mono font-medium py-1 text-right text-neutral-900">
                  {formatMoney(item.amount, currency)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="w-full py-2 border border-dashed border-neutral-300 hover:border-neutral-400 rounded-md text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center justify-center gap-1.5 transition-colors bg-neutral-50/50"
      >
        <Plus className="w-3.5 h-3.5" /> Add Another Line Item
      </button>
    </div>
  );
};
