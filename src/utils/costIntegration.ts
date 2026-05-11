import { supabase } from '../lib/supabase';
import { Student } from '../types';

export interface StudentCosts {
  uangPangkal: number;
  spp: number;
  total: number;
}

/**
 * Get relevant costs for a student based on their institution and dormitory status
 */
export const getStudentCosts = async (student: Student): Promise<StudentCosts> => {
  try {
    // Fetch all costs from database
    const { data: costs, error } = await supabase
      .from('costs')
      .select('*')
      .order('sequence', { ascending: true });

    if (error) {
      console.error('Error fetching costs:', error);
      // Fallback to default hardcoded values if database fails
      return getFallbackCosts(student);
    }

    if (!costs || costs.length === 0) {
      return getFallbackCosts(student);
    }

    // Determine student characteristics
    const isAsrama = student.data.asrama === 'ASRAMA';
    const isAlumni = student.data.alumni === 'YA';
    const lembaga = student.lembaga;

    // Map lembaga codes to cost categories
    const lembagaMapping: { [key: string]: string } = {
      'TK': 'TK',
      'SDITA': 'SD/SMP/SMA/MTA',
      'SMPITA': 'SD/SMP/SMA/MTA',
      'SMAITA': 'SD/SMP/SMA/MTA',
      'MTA': 'MTA'
    };

    const costLembaga = lembagaMapping[lembaga] || 'SD/SMP/SMA/MTA';

    let uangPangkal = 0;
    let spp = 0;

    // Find Uang Pangkal costs
    const uangPangkalCosts = costs.filter(cost =>
      cost.category?.toLowerCase().includes('uang pangkal') &&
      cost.lembaga?.includes(costLembaga)
    );

    // Find SPP costs
    const sppCosts = costs.filter(cost =>
      cost.category?.toLowerCase().includes('spp') &&
      cost.lembaga?.includes(costLembaga)
    );

    // Determine Uang Pangkal based on institution and alumni status
    if (lembaga === 'MTA') {
      if (isAlumni) {
        // Gunakan status asrama dari data siswa secara langsung
        if (isAsrama) {
          // Alumni Asrama ke Asrama
          uangPangkal = uangPangkalCosts.find(cost =>
            cost.name?.toLowerCase().includes('alumni') &&
            cost.name?.toLowerCase().includes('asrama') &&
            !cost.name?.toLowerCase().includes('non asrama') &&
            !cost.name?.toLowerCase().includes('ke mta')
          )?.amount || 3950000;
        } else {
          // Alumni Non Asrama ke Asrama
          uangPangkal = uangPangkalCosts.find(cost =>
            cost.name?.toLowerCase().includes('alumni') &&
            cost.name?.toLowerCase().includes('non asrama') &&
            cost.name?.toLowerCase().includes('asrama') &&
            !cost.name?.toLowerCase().includes('ke mta')
          )?.amount || 6950000;
        }
      } else {
        // New student MTA
        if (isAsrama) {
          // MTA Non Alumni Asrama
          uangPangkal = uangPangkalCosts.find(cost =>
            !cost.name?.toLowerCase().includes('alumni') &&
            cost.name?.toLowerCase().includes('asrama') &&
            !cost.name?.toLowerCase().includes('non asrama')
          )?.amount || 9700000;
        } else {
          // MTA Non Alumni Non Asrama
          uangPangkal = uangPangkalCosts.find(cost =>
            !cost.name?.toLowerCase().includes('alumni') &&
            cost.name?.toLowerCase().includes('non asrama')
          )?.amount || 6700000;
        }
      }
    } else if (lembaga === 'SMAITA') {
      if (isAlumni) {
        // Alumni from SMP to SMA
        if (isAsrama) {
          // Alumni going to SMA Asrama
          const previousAsrama = (student.catatanPenguji || '').toUpperCase().includes('ASRAMA');
          if (previousAsrama) {
            // Alumni SMP Asrama ke SMA Asrama
            uangPangkal = uangPangkalCosts.find(cost =>
              cost.name?.toLowerCase().includes('alumni') &&
              cost.name?.toLowerCase().includes('smp') &&
              cost.name?.toLowerCase().includes('asrama') &&
              cost.name?.toLowerCase().includes('sma') &&
              !cost.name?.toLowerCase().includes('non asrama')
            )?.amount || 5200000;
          } else {
            // Alumni SMP Non Asrama ke SMA Asrama
            uangPangkal = uangPangkalCosts.find(cost =>
              cost.name?.toLowerCase().includes('alumni') &&
              cost.name?.toLowerCase().includes('smp') &&
              cost.name?.toLowerCase().includes('non asrama') &&
              cost.name?.toLowerCase().includes('sma') &&
              cost.name?.toLowerCase().includes('asrama')
            )?.amount || 8200000;
          }
        } else {
          // Alumni to SMA Non Asrama
          uangPangkal = uangPangkalCosts.find(cost =>
            cost.name?.toLowerCase().includes('alumni') &&
            cost.name?.toLowerCase().includes('smp') &&
            cost.name?.toLowerCase().includes('sma') &&
            cost.name?.toLowerCase().includes('non asrama')
          )?.amount || 5200000;
        }
      } else {
        // New student SMA
        if (isAsrama) {
          uangPangkal = uangPangkalCosts.find(cost =>
            cost.name?.toLowerCase().includes('asrama') &&
            !cost.name?.toLowerCase().includes('alumni') &&
            cost.lembaga === 'SMA'
          )?.amount || 12800000;
        } else {
          uangPangkal = uangPangkalCosts.find(cost =>
            cost.name?.toLowerCase().includes('non asrama') &&
            !cost.name?.toLowerCase().includes('alumni') &&
            cost.lembaga === 'SMA'
          )?.amount || 9800000;
        }
      }
    } else if (lembaga === 'SDITA') {
      uangPangkal = uangPangkalCosts.find(cost =>
        !cost.name?.toLowerCase().includes('alumni')
      )?.amount || 9100000;
    } else {
      // SMPITA and other cases
      if (isAsrama) {
        uangPangkal = uangPangkalCosts.find(cost =>
          cost.name?.toLowerCase().includes('asrama') &&
          !cost.name?.toLowerCase().includes('alumni')
        )?.amount || 12800000;
      } else {
        uangPangkal = uangPangkalCosts.find(cost =>
          cost.name?.toLowerCase().includes('non asrama') &&
          !cost.name?.toLowerCase().includes('alumni')
        )?.amount || 9800000;
      }
    }

    // Determine SPP based on institution and asrama status
    if (lembaga === 'SDITA') {
      // SDITA memiliki SPP khusus per bulan
      spp = sppCosts.find(cost =>
        cost.name?.toLowerCase().includes('sdita') ||
        cost.lembaga?.includes('SDITA')
      )?.amount || 350000;
    } else {
      // Untuk lembaga lain (SMPITA, SMAITA, MTA) - SPP per bulan
      if (isAsrama) {
        spp = sppCosts.find(cost =>
          cost.name?.toLowerCase().includes('asrama') &&
          cost.name?.toLowerCase().includes('angsuran') &&
          !cost.name?.toLowerCase().includes('non asrama')
        )?.amount || 1300000;
      } else {
        spp = sppCosts.find(cost =>
          cost.name?.toLowerCase().includes('angsuran') &&
          cost.name?.toLowerCase().includes('non asrama')
        )?.amount || 450000;
      }
    }

    const total = uangPangkal + spp;

    return {
      uangPangkal,
      spp,
      total
    };

  } catch (error) {
    console.error('Error in getStudentCosts:', error);
    return getFallbackCosts(student);
  }
};

/**
 * Fallback hardcoded costs when database is unavailable
 */
const getFallbackCosts = (student: Student): StudentCosts => {
  const isAsrama = student.data.asrama === 'ASRAMA';
  const isAlumni = student.data.alumni === 'YA';
  const lembaga = student.lembaga;

  let uangPangkal = 0;
  let spp = 0;

  if (lembaga === 'MTA') {
    if (isAlumni) {
      // Gunakan status asrama dari data siswa secara langsung
      if (isAsrama) {
        // Alumni Asrama ke Asrama
        uangPangkal = 3950000;
      } else {
        // Alumni Non Asrama ke Asrama
        uangPangkal = 6950000;
      }
    } else {
      // New student MTA
      if (isAsrama) {
        uangPangkal = 9700000;
      } else {
        uangPangkal = 6700000;
      }
    }
    spp = isAsrama ? 1300000 : 450000;
  } else if (lembaga === 'SMAITA') {
    if (isAlumni) {
      // Alumni from SMP to SMA
      if (isAsrama) {
        const previousAsrama = (student.catatanPenguji || '').toUpperCase().includes('ASRAMA');
        if (previousAsrama) {
          uangPangkal = 5200000; // Alumni SMP Asrama ke SMA Asrama
        } else {
          uangPangkal = 8200000; // Alumni SMP Non Asrama ke SMA Asrama
        }
      } else {
        uangPangkal = 5200000; // Alumni to SMA Non Asrama
      }
    } else {
      // New student SMA
      uangPangkal = isAsrama ? 12800000 : 9800000;
    }
    spp = isAsrama ? 1300000 : 450000;
  } else if (lembaga === 'SDITA') {
    uangPangkal = 9100000;
    spp = 350000;
  } else {
    // SMPITA and other cases
    uangPangkal = isAsrama ? 12800000 : 9800000;
    spp = isAsrama ? 1300000 : 450000;
  }

  return {
    uangPangkal,
    spp,
    total: uangPangkal + spp
  };
};

/**
 * Format currency in Indonesian Rupiah format
 */
export const formatCurrency = (amount: number): string => {
  return `Rp. ${amount.toLocaleString('id-ID')},-`.replace(/,/g, '.');
};