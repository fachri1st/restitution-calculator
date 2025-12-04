import React, { useState, useEffect } from 'react';
import { Calculator, Clock, DollarSign } from 'lucide-react';
import './App.css';

export default function App() {
  const [serviceType, setServiceType] = useState('internet');
  const [downtimeLA, setDowntimeLA] = useState({ hours: '', minutes: '', seconds: '' });
  const [downtimePelanggan, setDowntimePelanggan] = useState({ hours: '', minutes: '', seconds: '' });
  const [jumlahHari, setJumlahHari] = useState('');
  const [stopclock, setStopclock] = useState({ hours: '', minutes: '', seconds: '' });
  const [invoice, setInvoice] = useState('');
  
  const [results, setResults] = useState({
    slaLA: 0,
    availableJaringan: 0,
    restitusi: 0
  });

  const SLA_GUARANTED = serviceType === 'internet' ? 99 : 99.95;

  const parseTimeToHours = (hours, minutes, seconds) => {
    const h = parseFloat(hours) || 0;
    const m = parseFloat(minutes) || 0;
    const s = parseFloat(seconds) || 0;
    return h + (m / 60) + (s / 3600);
  };

  const formatRupiah = (value) => {
    const number = value.replace(/[^0-9]/g, '');
    return new Intl.NumberFormat('id-ID').format(number);
  };

  const parseRupiah = (value) => {
    return parseFloat(value.replace(/[^0-9]/g, '')) || 0;
  };

  useEffect(() => {
    const downtimeLAHours = parseTimeToHours(downtimeLA.hours, downtimeLA.minutes, downtimeLA.seconds);
    const downtimePelangganHours = parseTimeToHours(downtimePelanggan.hours, downtimePelanggan.minutes, downtimePelanggan.seconds);
    const stopclockHours = parseTimeToHours(stopclock.hours, stopclock.minutes, stopclock.seconds);
    
    const days = parseFloat(jumlahHari) || 0;
    const totalHours = days * 24;
    
    if (totalHours > 0) {
      const slaLA = ((totalHours - downtimeLAHours) / totalHours) * 100;
      const availableJaringan = ((totalHours - downtimeLAHours - downtimePelangganHours - stopclockHours) / totalHours) * 100;
      
      const invoiceValue = parseRupiah(invoice);
      const restitusi = slaLA < SLA_GUARANTED ? ((SLA_GUARANTED - slaLA) / 100) * invoiceValue : 0;
      
      setResults({
        slaLA: slaLA,
        availableJaringan: availableJaringan,
        restitusi: restitusi
      });
    }
  }, [downtimeLA, downtimePelanggan, jumlahHari, stopclock, invoice, serviceType]);

  return (
    <div className="min-h-screen bg-gradient-to-br p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-8">
            <Calculator className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Restitution Calculator</h1>
          </div>

          <div className="space-y-6">
            {/* Service Type Selection */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-5 rounded-xl text-white">
              <label className="text-sm font-semibold mb-3 block">
                Pilih Jenis Layanan <span className="text-yellow-300">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setServiceType('internet')}
                  className={`p-4 rounded-lg font-semibold transition-all ${
                    serviceType === 'internet'
                      ? 'bg-white text-indigo-600 shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <div className="text-lg">🌐 Internet</div>
                  <div className="text-sm mt-1">SLA 99%</div>
                </button>
                <button
                  type="button"
                  onClick={() => setServiceType('cloud')}
                  className={`p-4 rounded-lg font-semibold transition-all ${
                    serviceType === 'cloud'
                      ? 'bg-white text-purple-600 shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <div className="text-lg">☁️ Cloud</div>
                  <div className="text-sm mt-1">SLA 99.95%</div>
                </button>
              </div>
            </div>
            {/* Downtime LA */}
            <div className="bg-indigo-50 p-5 rounded-xl">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Clock className="w-4 h-4" />
                Downtime LA <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Jam</label>
                  <input
                    type="number"
                    value={downtimeLA.hours}
                    onChange={(e) => setDowntimeLA({ ...downtimeLA, hours: e.target.value })}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Menit</label>
                  <input
                    type="number"
                    value={downtimeLA.minutes}
                    onChange={(e) => setDowntimeLA({ ...downtimeLA, minutes: e.target.value })}
                    placeholder="0"
                    min="0"
                    max="59"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Detik</label>
                  <input
                    type="number"
                    value={downtimeLA.seconds}
                    onChange={(e) => setDowntimeLA({ ...downtimeLA, seconds: e.target.value })}
                    placeholder="0"
                    min="0"
                    max="59"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Downtime Pelanggan */}
            <div className="bg-blue-50 p-5 rounded-xl">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Clock className="w-4 h-4" />
                Downtime Pelanggan
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Jam</label>
                  <input
                    type="number"
                    value={downtimePelanggan.hours}
                    onChange={(e) => setDowntimePelanggan({ ...downtimePelanggan, hours: e.target.value })}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Menit</label>
                  <input
                    type="number"
                    value={downtimePelanggan.minutes}
                    onChange={(e) => setDowntimePelanggan({ ...downtimePelanggan, minutes: e.target.value })}
                    placeholder="0"
                    min="0"
                    max="59"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Detik</label>
                  <input
                    type="number"
                    value={downtimePelanggan.seconds}
                    onChange={(e) => setDowntimePelanggan({ ...downtimePelanggan, seconds: e.target.value })}
                    placeholder="0"
                    min="0"
                    max="59"
                  />
                </div>
              </div>
            </div>

            {/* Jumlah Hari */}
            <div className="bg-green-50 p-5 rounded-xl">
              <label className="text-sm font-semibold text-gray-700 mb-3 block">
                Jumlah Hari dalam 1 Bulan <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={jumlahHari}
                onChange={(e) => setJumlahHari(e.target.value)}
                placeholder="Contoh: 30"
                required
                min="1"
                max="31"
              />
            </div>

            {/* Stopclock */}
            <div className="bg-yellow-50 p-5 rounded-xl">
              <label className="text-sm font-semibold text-gray-700 mb-3 block">
                Stopclock
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Jam</label>
                  <input
                    type="number"
                    value={stopclock.hours}
                    onChange={(e) => setStopclock({ ...stopclock, hours: e.target.value })}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Menit</label>
                  <input
                    type="number"
                    value={stopclock.minutes}
                    onChange={(e) => setStopclock({ ...stopclock, minutes: e.target.value })}
                    placeholder="0"
                    min="0"
                    max="59"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Detik</label>
                  <input
                    type="number"
                    value={stopclock.seconds}
                    onChange={(e) => setStopclock({ ...stopclock, seconds: e.target.value })}
                    placeholder="0"
                    min="0"
                    max="59"
                  />
                </div>
              </div>
            </div>

            {/* Invoice */}
            <div className="bg-purple-50 p-5 rounded-xl">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <DollarSign className="w-4 h-4" />
                Invoice <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-gray-600">Rp</span>
                <input
                  type="text"
                  value={invoice}
                  onChange={(e) => setInvoice(formatRupiah(e.target.value))}
                  placeholder="0"
                  className="pl-12 pr-4"
                  required
                />
              </div>
            </div>

            {/* Results */}
            <div className="mt-8 space-y-4">
              <div className="result-card result-card-gray">
                <div className="text-sm font-medium mb-1">
                  SLA Guaranted - {serviceType === 'internet' ? 'Internet' : 'Cloud'}
                </div>
                <div className="text-3xl font-bold">{SLA_GUARANTED}%</div>
              </div>

              <div className="result-card result-card-indigo">
                <div className="text-sm font-medium mb-1">SLA LA</div>
                <div className="text-3xl font-bold">{results.slaLA.toFixed(2)}%</div>
              </div>

              <div className="result-card result-card-blue">
                <div className="text-sm font-medium mb-1">Available Jaringan</div>
                <div className="text-3xl font-bold">{results.availableJaringan.toFixed(2)}%</div>
              </div>

              <div className="result-card result-card-green shadow-lg">
                <div className="text-sm font-medium mb-1">Restitusi</div>
                <div className="text-3xl font-bold">
                  Rp {new Intl.NumberFormat('id-ID').format(Math.round(results.restitusi))}
                </div>
                {results.slaLA >= SLA_GUARANTED && (
                  <div className="note-box">
                    <p>ℹ️ Tidak mendapatkan restitusi</p>
                    <p>SLA LA berada di atas atau sama dengan SLA Guaranted ({SLA_GUARANTED}%)</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}