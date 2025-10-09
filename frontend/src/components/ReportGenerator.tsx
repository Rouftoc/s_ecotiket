import { useState, useMemo, useEffect } from 'react'; 
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Filter, BarChart2, Award, Recycle, User, ChevronLeft, ChevronRight } from 'lucide-react'; // Tambahkan icon panah
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface UserRecord {
  id: number;
  email?: string;
  nik?: string;
  name: string;
  role: string;
  phone?: string;
  address?: string;
  qr_code: string;
  tickets_balance: number;
  points: number;
  status: string;
  created_at: string;
}

interface Transaction {
  id: number;
  user_id: number;
  petugas_id: number;
  type: 'bottle_exchange' | 'ticket_usage';
  description?: string;
  bottles_count?: number;
  bottle_type?: string;
  tickets_change: number;
  points_earned?: number;
  location?: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
}

interface ReportGeneratorProps {
  users: UserRecord[];
  transactions: Transaction[];
}

type ReportType = 'user_list' | 'bottle_transactions' | 'user_ranking' | 'daily_summary';
type UserRankingType = 'points' | 'bottles';

export default function ReportGenerator({ users, transactions }: ReportGeneratorProps) {
  const [reportType, setReportType] = useState<ReportType>('user_list');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userRankingType, setUserRankingType] = useState<UserRankingType>('points');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);

  const userMap = useMemo(() => new Map(users.map(user => [user.id, user])), [users]);

  const processedData = useMemo(() => {
    let data: any[] = [];
    const startDate = dateRange.start ? new Date(dateRange.start) : null;
    const endDate = dateRange.end ? new Date(dateRange.end) : null;
    if (endDate) endDate.setHours(23, 59, 59, 999); 

    const isInDateRange = (dateStr: string) => {
      if (!startDate || !endDate) return true;
      const itemDate = new Date(dateStr);
      return itemDate >= startDate && itemDate <= endDate;
    };

    switch (reportType) {
        case 'user_list':
          data = users.filter(user => 
            (userRoleFilter === 'all' || user.role === userRoleFilter) && 
            isInDateRange(user.created_at)
          );
          break;
  
        case 'bottle_transactions':
          data = transactions
            .filter(tx => tx.type === 'bottle_exchange' && tx.status === 'completed' && isInDateRange(tx.created_at))
            .map(tx => ({
              ...tx,
              userName: userMap.get(tx.user_id)?.name || 'N/A',
              petugasName: userMap.get(tx.petugas_id)?.name || 'N/A',
            }));
          break;
          
        case 'user_ranking':
          const userStats = new Map<number, { name: string; nik: string; points: number; bottles: number }>();
          users.forEach(u => {
            userStats.set(u.id, { name: u.name, nik: u.nik || '-', points: u.points, bottles: 0 });
          });
  
          transactions.forEach(tx => {
            if (tx.type === 'bottle_exchange' && tx.status === 'completed' && isInDateRange(tx.created_at)) {
              const stat = userStats.get(tx.user_id);
              if (stat) {
                stat.bottles += tx.bottles_count || 0;
              }
            }
          });
          
          data = Array.from(userStats.values())
            .sort((a, b) => (userRankingType === 'points' ? b.points - a.points : b.bottles - a.bottles))
            .slice(0, 5) 
            .map((stat, index) => ({ rank: index + 1, ...stat }));
          break;
  
        case 'daily_summary':
          const dailyTotals: { [key: string]: { date: string; jumbo: number; besar: number; sedang: number; kecil: number; cup: number; total: number } } = {};
          transactions
            .filter(tx => tx.type === 'bottle_exchange' && tx.status === 'completed' && isInDateRange(tx.created_at))
            .forEach(tx => {
              const date = new Date(tx.created_at).toISOString().split('T')[0];
              if (!dailyTotals[date]) {
                dailyTotals[date] = { date, jumbo: 0, besar: 0, sedang: 0, kecil: 0, cup: 0, total: 0 };
              }
              
              const count = tx.bottles_count || 0;
              const type = tx.bottle_type?.toLowerCase();
  
              if (type === 'jumbo' ||  type === 'besar' || type === 'sedang' || type === 'kecil' || type === 'cup') {
                dailyTotals[date][type] += count;
              }
              
              dailyTotals[date].total += count;
            });
          data = Object.values(dailyTotals).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          break;
    }
    return data;
  }, [reportType, users, transactions, dateRange, userRoleFilter, userRankingType, userMap]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [processedData]);

  const getExportConfig = () => {
    switch (reportType) {
      case 'user_list':
        return {
          headers: [['ID', 'Nama', 'Role', 'Status', 'Bergabung', 'Tiket', 'Poin', 'Email/NIK']],
          data: processedData.map((u: UserRecord) => [u.id, u.name, u.role, u.status, new Date(u.created_at).toLocaleDateString('id-ID'), u.tickets_balance, u.points, u.email || u.nik]),
          filename: 'laporan_pengguna'
        };
      case 'bottle_transactions':
        return {
          headers: [['ID Transaksi', 'Tanggal', 'Nama Penumpang', 'Nama Petugas', 'Tipe Botol', 'Jumlah', 'Poin Didapat']],
          data: processedData.map((tx: any) => [tx.id, new Date(tx.created_at).toLocaleString('id-ID'), tx.userName, tx.petugasName, tx.bottle_type, tx.bottles_count, tx.points_earned]),
          filename: 'laporan_transaksi_botol'
        };
      case 'user_ranking':
        return {
          headers: [['Peringkat', 'Nama', 'NIK', 'Total Poin', 'Total Botol']],
          data: processedData.map((u: any) => [u.rank, u.name, u.nik, u.points, u.bottles]),
          filename: `peringkat_pengguna_${userRankingType}`
        };
      case 'daily_summary':
        return {
          headers: [['Tanggal', 'Jumbo', 'Besar', 'Sedang', 'Kecil', 'Cup', 'Total']],
          data: processedData.map((d: any) => [new Date(d.date).toLocaleDateString('id-ID'), d.jumbo, d.besar, d.sedang, d.kecil, d.cup, d.total]),
          filename: 'ringkasan_botol_harian'
        };
      default:
        return { headers: [[]], data: [], filename: 'laporan' };
    }
  };
  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    setLoading(true);
    try {
      const { headers, data, filename } = getExportConfig();
      const timestamp = new Date().toISOString().split('T')[0];
      const fullFilename = `eco-tiket-${filename}-${timestamp}`;

      if (data.length === 0) {
        toast.warning('Tidak ada data untuk diexport.');
        return;
      }

      if (format === 'csv' || format === 'excel') {
        const ws = XLSX.utils.aoa_to_sheet([...headers, ...data]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Laporan');
        XLSX.writeFile(wb, `${fullFilename}.${format === 'csv' ? 'csv' : 'xlsx'}`);
      } else if (format === 'pdf') {
        const doc = new jsPDF();
        doc.text(`Laporan Eco-Tiket: ${filename.replace(/_/g, ' ')}`, 14, 20);
        doc.setFontSize(10);
        doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 26);

        autoTable(doc, {
          head: headers,
          body: data,
          startY: 35,
          headStyles: { fillColor: [34, 197, 94] },
        });
        doc.save(`${fullFilename}.pdf`);
      }
      toast.success(`Laporan berhasil diexport ke ${format.toUpperCase()}`);
    } catch (error) {
      console.error(`Export ${format} error:`, error);
      toast.error(`Gagal export ke ${format.toUpperCase()}`);
    } finally {
      setLoading(false);
    }
  };

  const renderPreviewTable = () => {
    // --- AWAL MODIFIKASI PAGINASI ---
    const itemsPerPage = 10;
    const totalPages = Math.ceil(processedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = processedData.slice(startIndex, endIndex);
    // --- AKHIR MODIFIKASI PAGINASI ---

    if (processedData.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Tidak ada data yang sesuai dengan filter yang dipilih.</p>
        </div>
      );
    }

    const config = getExportConfig();
    const headers = config.headers[0];
    
    // Ambil data yang sesuai untuk halaman ini untuk dirender
    const paginatedRenderData = config.data.slice(startIndex, endIndex);

    return (
      <div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {headers.map((header, i) => <th key={i} className="text-left p-2 font-bold">{header}</th>)}
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((item, rowIndex) => (
                <tr key={rowIndex} className="border-b hover:bg-gray-100">
                  {paginatedRenderData[rowIndex] && Object.values(paginatedRenderData[rowIndex]).map((cell: any, cellIndex) => (
                    <td key={cellIndex} className="p-2">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Halaman {currentPage} dari {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />Generator Laporan
          </CardTitle>
          <CardDescription>Pilih tipe laporan, atur filter, dan export data dalam format CSV, Excel, atau PDF.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters (Tidak ada perubahan) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg bg-slate-50">
            <div className="space-y-2 lg:col-span-2">
              <Label>Tipe Laporan</Label>
              <Select value={reportType} onValueChange={(v) => setReportType(v as ReportType)}>
                <SelectTrigger><SelectValue placeholder="Pilih tipe laporan" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="user_list">Laporan Daftar Pengguna</SelectItem>
                  <SelectItem value="bottle_transactions">Laporan Transaksi Botol</SelectItem>
                  <SelectItem value="user_ranking">Laporan Peringkat Pengguna</SelectItem>
                  <SelectItem value="daily_summary">Ringkasan Botol Harian</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Tanggal Mulai</Label>
              <Input type="date" value={dateRange.start} onChange={(e) => setDateRange(p => ({ ...p, start: e.target.value }))} />
            </div>
            
            <div className="space-y-2">
              <Label>Tanggal Akhir</Label>
              <Input type="date" value={dateRange.end} onChange={(e) => setDateRange(p => ({ ...p, end: e.target.value }))} />
            </div>

            {reportType === 'user_list' && (
              <div className="space-y-2">
                <Label>Filter Peran Pengguna</Label>
                <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Peran</SelectItem>
                    <SelectItem value="penumpang">Penumpang</SelectItem>
                    <SelectItem value="petugas">Petugas</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {reportType === 'user_ranking' && (
              <div className="space-y-2">
                <Label>Peringkat Berdasarkan</Label>
                <Select value={userRankingType} onValueChange={(v) => setUserRankingType(v as UserRankingType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="points">Poin Terbanyak</SelectItem>
                    <SelectItem value="bottles">Botol Terbanyak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Preview Laporan ({processedData.length} data ditemukan)
              </h3>
            </div>
            {renderPreviewTable()}
          </div>

          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
            <Button onClick={() => handleExport('csv')} disabled={loading || processedData.length === 0} variant="outline">
              <Download className="h-4 w-4 mr-2" /> {loading ? 'Memproses...' : 'Export CSV'}
            </Button>
            <Button onClick={() => handleExport('excel')} disabled={loading || processedData.length === 0} variant="outline">
              <Download className="h-4 w-4 mr-2" /> {loading ? 'Memproses...' : 'Export Excel'}
            </Button>
            <Button onClick={() => handleExport('pdf')} disabled={loading || processedData.length === 0} variant="outline">
              <Download className="h-4 w-4 mr-2" /> {loading ? 'Memproses...' : 'Export PDF'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}