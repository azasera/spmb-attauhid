import React, { useState } from "react";

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

function TableRow({ item, index }: { item: RowItem; index: number }) {
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
          padding: "7px 6px",
          color: "#a89060",
          fontSize: 10,
          textAlign: "center",
          borderBottom: "0.5px solid rgba(184,134,11,0.10)",
          verticalAlign: "top",
          paddingTop: 8,
          width: 28,
        }}
      >
        {item.no}
      </td>
      <td
        style={{
          padding: "7px 8px 7px 6px",
          color: item.highlight ? "#d4a843" : item.subItem ? "#a89060" : "#d6c9a8",
          fontSize: item.subItem ? 11 : 12,
          fontStyle: item.subItem ? "italic" : "normal",
          fontWeight: item.highlight ? 600 : 400,
          paddingLeft: item.subItem ? 20 : 6,
          borderBottom: "0.5px solid rgba(184,134,11,0.10)",
          lineHeight: 1.4,
        }}
      >
        {item.subItem && <span style={{ marginRight: 4, opacity: 0.6 }}>↳</span>}
        {item.rincian}
      </td>
      <td
        style={{
          padding: "7px 6px",
          textAlign: "right",
          color: item.highlight ? "#f0d87a" : item.subItem ? "#a89060" : "#e8c97a",
          fontWeight: item.highlight ? 700 : item.subItem ? 400 : 600,
          fontSize: 11,
          whiteSpace: "nowrap",
          borderBottom: "0.5px solid rgba(184,134,11,0.10)",
          verticalAlign: "top",
          paddingTop: 8,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {formatRupiah(item.biaya)}
        {item.satuan && (
          <span style={{ fontSize: 9, color: "#a89060", fontWeight: 400 }}>{item.satuan}</span>
        )}
      </td>
    </tr>
  );
}

export default function BiayaPendidikanTable() {
  const [showKontak, setShowKontak] = useState(false);

  return (
    <div
      style={{
        background: "#0c1a10",
        borderRadius: 16,
        padding: "20px 16px",
        fontFamily: "'Segoe UI', sans-serif",
        color: "#e8dfc8",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 6 }}>
        <GeometricOrnament size={40} />
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 12,
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
          marginBottom: 14,
        }}
      >
        Tahun Ajaran {biayaData.tahunAjaran}
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, #b8860b, transparent)",
          marginBottom: 16,
        }}
      />

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: 28 }} />
          <col />
          <col style={{ width: 110 }} />
        </colgroup>
        <thead>
          <tr>
            <th
              style={{
                background: "#1a3020",
                color: "#d4a843",
                fontSize: 10,
                fontWeight: 600,
                padding: "8px 6px",
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
                fontSize: 10,
                fontWeight: 600,
                padding: "8px 6px",
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
                fontSize: 10,
                fontWeight: 600,
                padding: "8px 6px",
                textAlign: "right",
                letterSpacing: 0.5,
                borderBottom: "1.5px solid #b8860b",
              }}
            >
              Biaya (Rp)
            </th>
          </tr>
        </thead>
        <tbody>
          {biayaData.kategoris.map((kat) => (
            <React.Fragment key={kat.id}>
              {/* Category Header Row */}
              <tr>
                <td
                  colSpan={3}
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
                  {kat.label}
                </td>
              </tr>
              {/* Data Rows */}
              {kat.items.map((item, i) => (
                <TableRow key={`${kat.id}-${i}`} item={item as RowItem} index={i} />
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>

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
  );
}
