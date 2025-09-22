import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Part, InventoryItem } from '../../types';

const InventoryManagement: React.FC = () => {
  const { inventory, addInventoryItem, updateInventoryItem } = useStore();
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({});

  const handleAdd = () => {
    if (newItem.name && newItem.quantity !== undefined) {
      addInventoryItem({
        id: Date.now().toString(),
        name: newItem.name,
        quantity: newItem.quantity,
        location: newItem.location || '',
        partId: newItem.partId || '',
      });
      setNewItem({});
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Inventory Management</h2>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.name || ''}
          onChange={e => setNewItem({ ...newItem, name: e.target.value })}
          className="border px-2 py-1 rounded"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity || ''}
          onChange={e => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
          className="border px-2 py-1 rounded"
        />
        <input
          type="text"
          placeholder="Location"
          value={newItem.location || ''}
          onChange={e => setNewItem({ ...newItem, location: e.target.value })}
          className="border px-2 py-1 rounded"
        />
        <button onClick={handleAdd} className="bg-blue-500 text-white px-3 py-1 rounded">Add</button>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Location</th>
            <th className="p-2">Part ID</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.id}>
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.quantity}</td>
              <td className="p-2">{item.location}</td>
              <td className="p-2">{item.partId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryManagement;
