import { CostItem } from '../types';

export const defaultCostItems: Omit<CostItem, 'createdAt' | 'updatedAt' | 'createdBy'>[] = [
  {
    id: 'cost-001',
    rowNumber: '1',
    sequence: 1,
    category: 'Pendaftaran Calon Siswa Baru',
    name: 'Pendaftaran Calon Siswa/i TK',
    amount: 100000,
    lembaga: 'TK'
  },
  {
    id: 'cost-002',
    rowNumber: '2',
    sequence: 2,
    category: 'Pendaftaran Calon Siswa Baru',
    name: 'Pendaftaran Calon Siswa/i SD, SMP, SMA & MTA',
    amount: 300000,
    lembaga: 'SD/SMP/SMA/MTA'
  },
  {
    id: 'cost-003',
    rowNumber: '3',
    sequence: 3,
    category: 'SPP',
    name: 'SPP siswa/i TK',
    amount: 350000,
    lembaga: 'TK'
  },
  {
    id: 'cost-004',
    rowNumber: '4',
    sequence: 4,
    category: 'SPP',
    name: 'SPP siswa/i SD dan siswa/i SMP, SMA & MTA Non Asrama per semester',
    amount: 2700000,
    lembaga: 'SD/SMP/SMA/MTA'
  },
  {
    id: 'cost-004a',
    rowNumber: '4a',
    sequence: 4.1,
    category: 'SPP',
    name: 'Angsuran SPP siswa/i non asrama perbulan',
    amount: 450000,
    lembaga: 'SD/SMP/SMA/MTA'
  },
  {
    id: 'cost-005',
    rowNumber: '5',
    sequence: 5,
    category: 'SPP',
    name: 'SPP Siswa Asrama SMP, SMA & MTA per semester',
    amount: 7800000,
    lembaga: 'SMP/SMA/MTA'
  },
  {
    id: 'cost-005a',
    rowNumber: '5a',
    sequence: 5.1,
    category: 'SPP',
    name: 'Angsuran SPP siswa/i asrama perbulan',
    amount: 1300000,
    lembaga: 'SMP/SMA/MTA'
  },
  {
    id: 'cost-006',
    rowNumber: '6',
    sequence: 6,
    category: 'Uang Pangkal Siswa Non Asrama',
    name: 'Uang Pangkal Siswa/i TK',
    amount: 4200000,
    lembaga: 'TK'
  },
  {
    id: 'cost-006a',
    rowNumber: '6a',
    sequence: 6.1,
    category: 'Uang Pangkal Siswa Non Asrama',
    name: 'Daftar ulang bagi siswa TK jenjang TK-A ke jenjang TK-B',
    amount: 1900000,
    lembaga: 'TK'
  },
  {
    id: 'cost-007',
    rowNumber: '7',
    sequence: 7,
    category: 'Uang Pangkal Siswa Non Asrama',
    name: 'Uang Pangkal Siswa/i SD',
    amount: 9100000,
    lembaga: 'SD'
  },
  {
    id: 'cost-008',
    rowNumber: '8',
    sequence: 8,
    category: 'Uang Pangkal Siswa Non Asrama',
    name: 'Uang Pangkal Siswa/i Non Asrama SMP',
    amount: 9800000,
    lembaga: 'SMP'
  },
  {
    id: 'cost-009',
    rowNumber: '9',
    sequence: 9,
    category: 'Uang Pangkal Siswa Non Asrama',
    name: 'Uang Pangkal Siswa/i Non Asrama SMA',
    amount: 9800000,
    lembaga: 'SMA'
  },
  {
    id: 'cost-010',
    rowNumber: '10',
    sequence: 10,
    category: 'Uang Pangkal Siswa Non Asrama',
    name: 'Uang Pangkal Siswa/i Non Asrama MTA',
    amount: 9700000,
    lembaga: 'MTA'
  },
  {
    id: 'cost-011',
    rowNumber: '11',
    sequence: 11,
    category: 'Uang Pangkal Siswa Asrama',
    name: 'Uang Pangkal Siswa Asrama SMP',
    amount: 12800000,
    lembaga: 'SMP'
  },
  {
    id: 'cost-012',
    rowNumber: '12',
    sequence: 12,
    category: 'Uang Pangkal Siswa Asrama',
    name: 'Uang Pangkal Siswa Asrama SMA',
    amount: 12800000,
    lembaga: 'SMA'
  },
  {
    id: 'cost-013',
    rowNumber: '13',
    sequence: 13,
    category: 'Uang Pangkal Siswa Asrama',
    name: 'Uang Pangkal Siswa Asrama MTA',
    amount: 9700000,
    lembaga: 'MTA'
  },
  {
    id: 'cost-014',
    rowNumber: '14',
    sequence: 14,
    category: 'Uang Pangkal Alumni SMP At-Tauhid ke SMA At-Tauhid',
    name: 'Uang Pangkal Alumni Siswa SMP Non Asrama ke SMA Asrama',
    amount: 8200000,
    lembaga: 'SMP/SMA'
  },
  {
    id: 'cost-015',
    rowNumber: '15',
    sequence: 15,
    category: 'Uang Pangkal Alumni SMP At-Tauhid ke SMA At-Tauhid',
    name: 'Uang Pangkal Alumni Siswa SMP Asrama ke SMA Asrama',
    amount: 5200000,
    lembaga: 'SMP/SMA'
  },
  {
    id: 'cost-016',
    rowNumber: '16',
    sequence: 16,
    category: 'Uang Pangkal Alumni SMP At-Tauhid ke SMA At-Tauhid',
    name: 'Uang Pangkal Alumni Siswa Non Asrama/Asrama ke SMA Non Asrama',
    amount: 5200000,
    lembaga: 'SMP/SMA'
  },
  {
    id: 'cost-017',
    rowNumber: '17',
    sequence: 17,
    category: 'Uang Pangkal Alumni MTA tingkat SMP ke MTA tingkat SMA',
    name: 'Uang Pangkal Alumni Siswa MTA Jenjang SMP Non Asrama ke MTA Asrama',
    amount: 6950000,
    lembaga: 'MTA'
  },
  {
    id: 'cost-018',
    rowNumber: '18',
    sequence: 18,
    category: 'Uang Pangkal Alumni MTA tingkat SMP ke MTA tingkat SMA',
    name: 'Uang Pangkal Alumni Siswa MTA Jenjang SMP Asrama ke MTA Asrama',
    amount: 3950000,
    lembaga: 'MTA'
  },
  {
    id: 'cost-019',
    rowNumber: '19',
    sequence: 19,
    category: 'Uang Pangkal Alumni MTA tingkat SMP ke MTA tingkat SMA',
    name: 'Uang Pangkal Alumni Siswa MTA Jenjang SMP Asrama/Non Asrama ke MTA Jenjang SMA Asrama',
    amount: 3950000,
    lembaga: 'MTA'
  }
];
