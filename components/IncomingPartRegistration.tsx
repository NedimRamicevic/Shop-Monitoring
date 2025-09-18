'use client';

import { useState } from 'react';
import QRCode from 'react-qr-code';

interface IncomingPartRegistrationProps {
  onHome: () => void;
}

export default function IncomingPartRegistration({ onHome }: IncomingPartRegistrationProps) {
  const [form, setForm] = useState({
    partId: '',
    type: '',
    description: '',
    notes: '',
    rfid: '',
    photo: '',
  });
  const [qrValue, setQrValue] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQrValue(`https://yourapp.com/parts/${form.partId}`);
    // You can add logic here to save the part to your store/localStorage
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Register Incoming Part</h1>
        <button className="btn-primary" onClick={onHome}>Home</button>
      </div>
      <form className="max-w-lg mx-auto bg-gray-50 p-6 rounded-lg shadow" onSubmit={handleSubmit}>
        <input type="text" name="partId" value={form.partId} onChange={handleChange} required placeholder="Part ID" className="w-full p-2 border rounded mb-2" />
        <input type="text" name="type" value={form.type} onChange={handleChange} required placeholder="Type" className="w-full p-2 border rounded mb-2" />
        <textarea name="description" value={form.description} onChange={handleChange} required placeholder="Description" className="w-full p-2 border rounded mb-2" />
        <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className="w-full p-2 border rounded mb-2" />
        <input type="text" name="rfid" value={form.rfid} onChange={handleChange} placeholder="RFID UID (optional)" className="w-full p-2 border rounded mb-2" />
        <input type="text" name="photo" value={form.photo} onChange={handleChange} placeholder="Photo URL (optional)" className="w-full p-2 border rounded mb-2" />
        <button type="submit" className="btn-primary w-full py-2 mt-2">Register & Generate QR</button>
      </form>
      {qrValue && (
        <div className="mt-8 text-center">
          <h2 className="text-lg font-semibold mb-2">QR Code for Part</h2>
          <QRCode value={qrValue} size={180} />
          <div className="mt-2 text-xs text-gray-500">{qrValue}</div>
        </div>
      )}
    </div>
  );
}