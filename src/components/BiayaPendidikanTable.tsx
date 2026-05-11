import React, { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { Edit2, Trash2 } from 'lucide-react';

const supabaseUrl = 'https://eknvmtigbjzjwclfcwlh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbnZtdGlnYmp6andjbGZjd2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NzU1NzgsImV4cCI6MjA4MzE1MTU3OH0.kj3sAMIHa8IC3LCGIKIe9l2rQzC224Zef11DmstQzFc';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const biayaData = {
  tahunAjaran: "2026 – 2027",
  kategoris: [
    {
      id: "pendaftaran",
      label: "Pendaftaran Calon Siswa Baru",
      items: [
        { no: 1, rincian: "Pendaftaran calon siswa/i TK", biaya: 100_000, satuan: "" },
        { no: 2, rincian: "Pendaftaran calon siswa/i SD, SMP, SMA & MTA", biaya: 300_000, satuan: "" },
      ],
    },
    {
      id: "spp",
      label: "Sumbangan Pembinaan Pendidikan (SPP)",
      items: [
        { no: 3, rincian: "SPP siswa/i TK", biaya: 350_000, satuan: "/bln" },
        { no: 4, rincian: "SPP siswa/i SD, SMP, SMA & MTA Non Asrama", biaya: 2_700_000, satuan: "/smt" },
        { no: "↳", rincian: "Angsuran SPP Non Asrama / bulan", biaya: 450_000, satuan: "", highlight: true },
        { no: 5, rincian: "SPP siswa/i Asrama SMP, SMA & MTA", biaya: 7_800_000, satuan: "/smt" },
        { no: "↳", rincian: "Angsuran SPP Asrama / bulan", biaya: 1_300_000, satuan: "", highlight: true },
      ],
    },
    {
      id: "pangkal-non-asrama",
      label: "Uang Pangkal Siswa Non Asrama",
      items: [
        { no: 6, rincian: "Uang Pangkal Siswa/i TK", biaya: 4_200_000, satuan: "" },
        { no: "", rincian: "Daftar ulang TK-A ke TK-B", biaya: 1_900_000, satuan: "", subItem: true },
        { no: 7, rincian: "Uang Pangkal Siswa/i SD", biaya: 9_100_000, satuan: "" },
        { no: 8, rincian: "Uang Pangkal Siswa/i Non Asrama SMP", biaya: 9_800_000, satuan: "" },
        { no: 9, rincian: "Uang Pangkal Siswa/i Non Asrama SMA", biaya: 9_800_000, satuan: "" },
        { no: 10, rincian: "Uang Pangkal Siswa Non Asrama MTA", biaya: 6_700_000, satuan: "" },
      ],
    },
    {
      id: "pangkal-asrama",
      label: "Uang Pangkal Siswa Asrama",
      items: [
        { no: 11, rincian: "Uang Pangkal Siswa Asrama SMP", biaya: 12_800_000, satuan: "" },
        { no: 12, rincian: "Uang Pangkal Siswa Asrama SMA", biaya: 12_800_000, satuan: "" },
        { no: 13, rincian: "Uang Pangkal Siswa Asrama MTA", biaya: 9_700_000, satuan: "" },
      ],
    },
    {
      id: "alumni-sma",
      label: "Alumni SMP At-Tauhid → SMA At-Tauhid",
      items: [
        { no: 14, rincian: "Non Asrama → SMA Asrama", biaya: 8_200_000, satuan: "" },
        { no: 15, rincian: "Asrama → SMA Asrama", biaya: 5_200_000, satuan: "" },
        { no: 16, rincian: "Non Asrama / Asrama → SMA Non Asrama", biaya: 5_200_000, satuan: "" },
      ],
    },
    {
      id: "alumni-mta",
      label: "Alumni MTA SMP → MTA SMA",
      items: [
        { no: 17, rincian: "Non Asrama → MTA SMA Asrama", biaya: 6_950_000, satuan: "" },
        { no: 18, rincian: "Asrama → MTA SMA Asrama", biaya: 3_950_000, satuan: "" },
        { no: 19, rincian: "Asrama / Non Asrama → MTA SMA Non Asrama", biaya: 3_950_000, satuan: "" },
      ],
    },
  ],
  kontak: [
    { nama: "Ustadz Ali Agustian, Lc.", jabatan: "Mudir Umum", telp: "0813-6752-9398" },
    { nama: "Ustadz Meditoma, S.Pd.", jabatan: "Kepala SMPITA", telp: "0853-2516-1121" },
    { nama: "Ustadzah Iis Sartika", jabatan: "Kepala TK", telp: "0896-2716-7912" },
    { nama: "Ustadz Delly Arhadath, S.Pd.", jabatan: "Kepala SMAITA", telp: "0812-9758-5207" },
    { nama: "Ustadz Subrian Muji P., S.Pd.", jabatan: "Kepala SDITA", telp: "0823-7738-7783" },
    { nama: "Ustadz Azali", jabatan: "Kepala MTA", telp: "0852-6868-0049" },
  ],
};

function formatRupiah(angka: number): string {
  return "Rp " + angka.toLocaleString("id-ID") + ",-";
}

// Geometric SVG ornament
function GeometricOrnament({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" fill="none" stroke="#b8860b" strokeWidth="1.2" />
      <polygon points="20,7 33,14 33,26 20,33 7,26 7,14" fill="none" stroke="#b8860b" strokeWidth="0.6" opacity="0.5" />
      <circle cx="20" cy="20" r="5" fill="none" stroke="#d4a843" strokeWidth="1" />
      <line x1="20" y1="2" x2="20" y2="38" stroke="#b8860b" strokeWidth="0.4" opacity="0.4" />
      <line x1="2" y1="11" x2="38" y2="29" stroke="#b8860b" strokeWidth="0.4" opacity="0.4" />
      <line x1="2" y1="29" x2="38" y2="11" stroke="#b8860b" strokeWidth="0.4" opacity="0.4" />
    </svg>
  );
}

interface RowItem {
  no: number | string;
  rincian: string;
  biaya: number;
  satuan: string;
  highlight?: boolean;
  subItem?: boolean;
}

function TableRow({ item, index, onEdit, onDelete, viewOnly }: { item: RowItem; index: number; onEdit: () => void; onDelete: () => void; viewOnly: boolean }) {
  const isEven = index % 2 === 0;

  const rowBg = item.highlight
    ? "rgba(184,134,11,0.10)"
    : isEven
    ? "rgba(255,255,255,0.02)"
    : "rgba(255,255,255,0.04)";

  return (
    <tr style={{ background: rowBg }}>
      <td
        style={{
          padding: "10px 12px",
          color: "#a89060",
          fontSize: 11,
          textAlign: "center",
          borderBottom: "0.5px solid rgba(184,134,11,0.10)",
          verticalAlign: "top",
          paddingTop: 12,
          width: 60,
        }}
      >
        {item.no}
      </td>
      <td
        style={{
          padding: "10px 16px 10px 12px",
          color: item.highlight ? "#d4a843" : item.subItem ? "#a89060" : "#d6c9a8",
          fontSize: item.subItem ? 12 : 13,
          fontStyle: item.subItem ? "italic" : "normal",
          fontWeight: item.highlight ? 600 : 400,
          paddingLeft: item.subItem ? 28 : 12,
          borderBottom: "0.5px solid rgba(184,134,11,0.10)",
          lineHeight: 1.5,
        }}
      >
        {item.subItem && <span style={{ marginRight: 6, opacity: 0.6 }}>↳</span>}
        {item.rincian}
      </td>
      <td
        style={{
          padding: "10px 16px",
          textAlign: "right",
          color: item.highlight ? "#f0d87a" : item.subItem ? "#a89060" : "#e8c97a",
          fontWeight: item.highlight ? 700 : item.subItem ? 400 : 600,
          fontSize: 12,
          whiteSpace: "nowrap",
          borderBottom: "0.5px solid rgba(184,134,11,0.10)",
          verticalAlign: "top",
          paddingTop: 12,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {formatRupiah(item.biaya)}
        {item.satuan && (
          <span style={{ fontSize: 10, color: "#a89060", fontWeight: 400 }}>{item.satuan}</span>
        )}
      </td>
      {!viewOnly && (
        <td
          style={{
            padding: "10px 12px",
            textAlign: "center",
            borderBottom: "0.5px solid rgba(184,134,11,0.10)",
            verticalAlign: "top",
            paddingTop: 12,
            width: 100,
          }}
        >
          <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
            <button
              onClick={(e) => { e.preventDefault(); onEdit(); }}
              style={{
                padding: "4px 8px",
                background: "rgba(212, 168, 67, 0.2)",
                border: "1px solid rgba(212, 168, 67, 0.4)",
                borderRadius: 4,
                color: "#d4a843",
                cursor: "pointer",
                fontSize: 10,
                transition: "all 0.2s"
              }}
              title="Edit"
            >
              <Edit2 size={12} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); onDelete(); }}
              style={{
                padding: "4px 8px",
                background: "rgba(220, 38, 38, 0.2)",
                border: "1px solid rgba(220, 38, 38, 0.4)",
                borderRadius: 4,
                color: "#dc2626",
                cursor: "pointer",
                fontSize: 10,
                transition: "all 0.2s"
              }}
              title="Hapus"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </td>
      )}
    </tr>
  );
}

interface BiayaPendidikanTableProps {
  viewOnly?: boolean;
}

export default function BiayaPendidikanTable({ viewOnly = false }: BiayaPendidikanTableProps) {
  const [showKontak, setShowKontak] = useState(false);
  const [costs, setCosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', amount: 0, category: '', lembaga: '' });

  // Load data from Supabase
  useEffect(() => {
    loadCosts();
  }, []);

  const loadCosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('costs')
        .select('*')
        .order('sequence', { ascending: true });

      if (error) throw error;
      setCosts(data || []);
    } catch (error) {
      console.error('Error loading costs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      amount: item.amount,
      category: item.category,
      lembaga: item.lembaga || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus biaya ini?')) return;
    
    try {
      const { error } = await supabase.from('costs').delete().eq('id', id);
      if (error) throw error;
      loadCosts();
    } catch (error) {
      console.error('Error deleting cost:', error);
      alert('Gagal menghapus biaya');
    }
  };

  const handleSave = async () => {
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('costs')
          .update({
            name: formData.name,
            amount: formData.amount,
            category: formData.category,
            lembaga: formData.lembaga,
            updatedAt: new Date().toISOString()
          })
          .eq('id', editingItem.id);
        
        if (error) throw error;
      }
      
      setShowModal(false);
      setEditingItem(null);
      loadCosts();
    } catch (error) {
      console.error('Error saving cost:', error);
      alert('Gagal menyimpan biaya');
    }
  };

  // Group costs by category
  const groupedCosts = costs.reduce((acc, cost) => {
    if (!acc[cost.category]) {
      acc[cost.category] = [];
    }
    acc[cost.category].push(cost);
    return acc;
  }, {} as Record<string, any[]>);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#a89060' }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          background: "#0c1a10",
          borderRadius: 16,
          padding: "24px 32px",
          fontFamily: "'Segoe UI', sans-serif",
          color: "#e8dfc8",
          maxWidth: "100%",
          margin: "0 auto",
        }}
      >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
        <GeometricOrnament size={40} />
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#d4a843",
              letterSpacing: 0.5,
              lineHeight: 1.35,
              textTransform: "uppercase",
            }}
          >
            Biaya Pendidikan TK, SD, SMP, SMA & MTA
            <br />
            At-Tauhid Pangkalpinang
          </div>
        </div>
        <GeometricOrnament size={40} />
      </div>

      <div
        style={{
          fontSize: 11,
          color: "#a89060",
          textAlign: "center",
          letterSpacing: 1,
          marginBottom: 16,
        }}
      >
        Tahun Ajaran {biayaData.tahunAjaran}
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, #b8860b, transparent)",
          marginBottom: 24,
        }}
      />

      {/* Table */}
      <div style={{ overflowX: "auto", margin: "0 -8px", padding: "0 8px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, tableLayout: "auto", minWidth: 600 }}>
          <colgroup>
            <col style={{ width: 60 }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: 150 }} />
            {!viewOnly && <col style={{ width: 100 }} />}
          </colgroup>
          <thead>
            <tr>
              <th
                style={{
                  background: "#1a3020",
                  color: "#d4a843",
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "12px 14px",
                  textAlign: "left",
                  letterSpacing: 0.5,
                  borderBottom: "1.5px solid #b8860b",
                }}
              >
                No
              </th>
              <th
                style={{
                  background: "#1a3020",
                  color: "#d4a843",
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "12px 14px",
                  textAlign: "left",
                  letterSpacing: 0.5,
                  borderBottom: "1.5px solid #b8860b",
                }}
              >
                Rincian Biaya
              </th>
              <th
                style={{
                  background: "#1a3020",
                  color: "#d4a843",
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "12px 14px",
                  textAlign: "right",
                  letterSpacing: 0.5,
                  borderBottom: "1.5px solid #b8860b",
                }}
              >
                Biaya (Rp)
              </th>
              {!viewOnly && (
                <th
                  style={{
                    background: "#1a3020",
                    color: "#d4a843",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "12px 14px",
                    textAlign: "center",
                    letterSpacing: 0.5,
                    borderBottom: "1.5px solid #b8860b",
                  }}
                >
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedCosts).map(([category, items]: [string, any]) => (
              <React.Fragment key={category}>
                {/* Category Header Row */}
                <tr>
                  <td
                    colSpan={viewOnly ? 3 : 4}
                    style={{
                      background: "#1a3020",
                      color: "#d4a843",
                      fontWeight: 700,
                      fontSize: 11,
                      padding: "7px 6px",
                      letterSpacing: 0.3,
                      borderTop: "1px solid rgba(184,134,11,0.3)",
                      borderBottom: "1px solid rgba(184,134,11,0.3)",
                    }}
                  >
                    {category}
                  </td>
                </tr>
                {/* Data Rows */}
                {(items as any[]).map((item: any, i: number) => (
                  <TableRow
                    key={item.id}
                    item={{
                      no: item.sequence || i + 1,
                      rincian: item.name,
                      biaya: item.amount,
                      satuan: "",
                      highlight: false,
                      subItem: false
                    } as RowItem}
                    index={i}
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item.id)}
                    viewOnly={viewOnly}
                  />
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Contact Toggle */}
      <button
        onClick={() => setShowKontak(!showKontak)}
        style={{
          width: "100%",
          marginTop: 16,
          padding: "10px 12px",
          background: "rgba(184,134,11,0.08)",
          border: "1px solid rgba(184,134,11,0.3)",
          borderRadius: 10,
          color: "#d4a843",
          fontSize: 11,
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          letterSpacing: 0.5,
          textTransform: "uppercase",
        }}
      >
        📞 Informasi Lebih Lanjut {showKontak ? "▲" : "▼"}
      </button>

      {showKontak && (
        <div
          style={{
            marginTop: 10,
            border: "1px solid rgba(184,134,11,0.25)",
            borderRadius: 10,
            padding: 12,
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {biayaData.kontak.map((k, i) => (
              <div key={i} style={{ fontSize: 10.5, lineHeight: 1.5 }}>
                <div style={{ color: "#c8b87a", fontWeight: 600 }}>{k.nama}</div>
                <div style={{ color: "#8a7a5a", fontSize: 9.5 }}>{k.jabatan}</div>
                <div style={{ color: "#a0d0b0", fontSize: 10 }}>{k.telp}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Edit Modal */}
    {showModal && (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}
        onClick={() => setShowModal(false)}
      >
        <div
          style={{
            background: "#0c1a10",
            borderRadius: 16,
            padding: "32px",
            maxWidth: "500px",
            width: "100%",
            border: "1px solid rgba(184,134,11,0.3)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 style={{ color: "#d4a843", fontSize: 18, fontWeight: 700, marginBottom: 24, textAlign: "center" }}>
            Edit Biaya
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ color: "#a89060", fontSize: 12, marginBottom: 8, display: "block" }}>
                Nama Biaya
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(184,134,11,0.3)",
                  borderRadius: 8,
                  color: "#e8dfc8",
                  fontSize: 14
                }}
              />
            </div>
            
            <div>
              <label style={{ color: "#a89060", fontSize: 12, marginBottom: 8, display: "block" }}>
                Jumlah (Rp)
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value) || 0})}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(184,134,11,0.3)",
                  borderRadius: 8,
                  color: "#e8dfc8",
                  fontSize: 14
                }}
              />
            </div>
            
            <div>
              <label style={{ color: "#a89060", fontSize: 12, marginBottom: 8, display: "block" }}>
                Kategori
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(184,134,11,0.3)",
                  borderRadius: 8,
                  color: "#e8dfc8",
                  fontSize: 14
                }}
              />
            </div>
            
            <div>
              <label style={{ color: "#a89060", fontSize: 12, marginBottom: 8, display: "block" }}>
                Lembaga
              </label>
              <input
                type="text"
                value={formData.lembaga}
                onChange={(e) => setFormData({...formData, lembaga: e.target.value})}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(184,134,11,0.3)",
                  borderRadius: 8,
                  color: "#e8dfc8",
                  fontSize: 14
                }}
              />
            </div>
            
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button
                onClick={handleSave}
                style={{
                  flex: 1,
                  padding: "14px",
                  background: "linear-gradient(135deg, #d4a843, #b8860b)",
                  border: "none",
                  borderRadius: 8,
                  color: "#0c1a10",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                Simpan
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "14px",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(184,134,11,0.3)",
                  borderRadius: 8,
                  color: "#d4a843",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
