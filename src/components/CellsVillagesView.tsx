/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Building2, Users, Search } from 'lucide-react';
import { CivilCell } from '../types';

interface CellsVillagesViewProps {
  cells: CivilCell[];
}

export const CellsVillagesView: React.FC<CellsVillagesViewProps> = ({ cells }) => {
  const [selectedCellId, setSelectedCellId] = useState<string>(cells[0]?.id || '');
  const [villageSearch, setVillageSearch] = useState('');

  const activeCell = cells.find(c => c.id === selectedCellId) || cells[0];

  const cellVillages = activeCell ? activeCell.villages : [];

  const filteredVillages = cellVillages.filter(v => 
    v.name.toLowerCase().includes(villageSearch.toLowerCase()) ||
    v.leader.toLowerCase().includes(villageSearch.toLowerCase())
  );

  const totalCellPopulation = cellVillages.reduce((sum, v) => sum + v.population, 0);

  return (
    <div className="space-y-6">
      
      {/* 1. Statistics Summary Header Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Cell Name Indicator */}
        <div className="bg-[#1a4231] text-white p-4 rounded-sm border border-[#1a42310d] flex flex-col justify-between shadow-xs">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-emerald-300 font-bold">Selected Cell Unit</span>
            <p className="text-xl font-extrabold tracking-tight mt-0.5">{activeCell?.name || 'All Cells'}</p>
          </div>
          <p className="text-[10px] text-emerald-200/80 mt-2 font-medium">Assigned under Gasabo Sector Registry</p>
        </div>

        {/* Aggregated Population */}
        <div className="bg-white p-4 rounded-sm border border-[#1a42310d] flex flex-col justify-between shadow-xs">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Aggregated Population</span>
            <p className="text-xl font-extrabold text-slate-800 tracking-tight mt-0.5">
              {totalCellPopulation.toLocaleString()} Citizens
            </p>
          </div>
          <p className="text-[10px] text-emerald-700 font-semibold mt-2">100% active registration</p>
        </div>

        {/* Sub-Villages Count */}
        <div className="bg-white p-4 rounded-sm border border-[#1a42310d] flex flex-col justify-between shadow-xs">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Registered Villages list</span>
            <p className="text-xl font-extrabold text-slate-800 tracking-tight mt-0.5">
              {cellVillages.length} Villages
            </p>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">Local assemblies represented</p>
        </div>

        {/* Audit Compliance status */}
        <div className="bg-white p-4 rounded-sm border border-[#1a42310d] flex flex-col justify-between shadow-xs">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Administrative Level</span>
            <p className="text-xl font-extrabold text-slate-800 tracking-tight mt-0.5">Level-4 Bureau</p>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span> Local leader audit complete
          </p>
        </div>

      </div>

      {/* 2. Interactive Selection Splitting Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Interactive Cells Selector list */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-sm border border-[#1a42310d] space-y-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Administrative Cells</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Filter the system directory by regional cell boundaries</p>
            </div>

            <div className="space-y-2 pt-1">
              {cells.map((cell) => {
                const isActive = cell.id === selectedCellId;
                const cellPop = cell.villages.reduce((sum, v) => sum + v.population, 0);

                return (
                  <button
                    key={cell.id}
                    onClick={() => {
                      setSelectedCellId(cell.id);
                      setVillageSearch('');
                    }}
                    className={`w-full text-left p-2.5 rounded-sm border transition-all cursor-pointer flex items-center justify-between ${
                      isActive 
                        ? 'bg-[#1a423107] border-[#1a423133] text-[#1a4231]' 
                        : 'bg-white border-slate-100 hover:border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Building2 className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#1a4231]' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold truncate leading-snug">{cell.name}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] bg-slate-100 text-slate-500 px-1 rounded-sm uppercase font-mono font-bold">{cell.id}</span>
                        <span className="text-[9px] text-slate-400 font-semibold">{cell.villages.length} sub-villages</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold font-mono text-slate-600 block">{cellPop.toLocaleString()}</span>
                      <span className="text-[8px] text-slate-400 block tracking-tight">Pop density</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Villages inside Selected Cell */}
        <div className="col-span-12 lg:col-span-8 bg-white p-5 rounded-sm border border-[#1a42310d] space-y-4">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#1a42310d]">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Villages under {activeCell?.name || 'Cell'} unit
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Primary community cluster files representing local citizen lists
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-48">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  placeholder="Filter village file..."
                  value={villageSearch}
                  onChange={(e) => setVillageSearch(e.target.value)}
                  className="w-full pl-8 pr-2 py-1 text-[11px] border border-slate-200 rounded-sm focus:outline-none focus:border-[#1a4231]"
                />
              </div>
            </div>
          </div>

          {/* Grid output */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredVillages.length === 0 ? (
              <div className="col-span-2 py-12 text-center text-xs text-slate-400 font-medium">
                No local community boundaries matched your specified parameters.
              </div>
            ) : (
              filteredVillages.map((v) => (
                <div 
                  key={v.id}
                  className="p-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 hover:border-[#1a42311a] rounded-sm transition-all flex justify-between items-start"
                >
                  <div className="space-y-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-xs bg-[#1a4231]"></span>
                        <h4 className="text-xs font-bold text-slate-800 tracking-tight">{v.name}</h4>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 bg-white px-1 border border-slate-100 rounded-xs font-semibold uppercase">{v.id}</span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Community Elder / Leader</p>
                      <div className="flex items-center gap-2">
                        <img 
                          src={v.leaderAvatar} 
                          alt={v.leader} 
                          referrerPolicy="no-referrer"
                          className="w-6 h-6 rounded-full border border-slate-200 object-cover" 
                        />
                        <span className="text-xs font-bold text-slate-700 truncate">{v.leader}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-1 shrink-0">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-sm flex items-center gap-1">
                      <Users className="w-3 h-3 text-emerald-600" /> {v.population.toLocaleString()}
                    </span>
                    <span className="text-[8px] text-slate-400 block tracking-tight uppercase">Population File</span>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
