import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import PenumpangDashboard from './pages/PenumpangDashboard';
import PetugasDashboard from './pages/PetugasDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import NewsDetail from './pages/NewsDetail';
import News from './pages/News';
import NotificationsPage from './pages/NotificationsPage';
import NilaiTukar from './pages/information/NilaiTukar';
import CaraKerja from './pages/information/CaraKerja';
import Keuntungan from './pages/information/Keuntungan';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/penumpang" element={<PenumpangDashboard />} />
          <Route path="/petugas" element={<PetugasDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/berita" element={<News />} />
          <Route path="/informasi/cara-kerja" element={<CaraKerja />} />
          <Route path="/informasi/nilai-tukar" element={<NilaiTukar />} />
          <Route path="/informasi/keuntungan" element={<Keuntungan />} />
          <Route path="/notifikasi" element={<NotificationsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;