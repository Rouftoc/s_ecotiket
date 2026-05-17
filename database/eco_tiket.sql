-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 01, 2026 at 10:34 AM
-- Server version: 8.0.30
-- PHP Version: 8.3.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `eco_tiket`
--

-- --------------------------------------------------------

--
-- Table structure for table `bottle_rates`
--

CREATE TABLE `bottle_rates` (
  `id_bottle_rate` int NOT NULL,
  `bottle_type` varchar(20) DEFAULT NULL,
  `bottles_required` int NOT NULL,
  `tickets_earned` int NOT NULL,
  `points_earned` int NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `bottle_rates`
--

INSERT INTO `bottle_rates` (`id_bottle_rate`, `bottle_type`, `bottles_required`, `tickets_earned`, `points_earned`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'kecil', 15, 1, 0, 1, '2025-09-22 01:31:14', '2026-01-28 07:54:34'),
(2, 'sedang', 8, 1, 0, 1, '2025-09-22 01:31:14', '2025-10-09 02:33:11'),
(3, 'jumbo', 1, 2, 0, 1, '2025-09-22 01:31:14', '2025-10-09 02:24:40'),
(4, 'besar', 5, 1, 0, 1, '2025-09-23 02:17:54', '2025-10-09 03:09:31'),
(5, 'cup', 20, 1, 0, 1, '2025-09-23 02:17:54', '2025-10-09 02:33:54');

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id_message` int NOT NULL,
  `session_id` int NOT NULL,
  `sender_type` enum('user','admin','bot') NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `chat_messages`
--

INSERT INTO `chat_messages` (`id_message`, `session_id`, `sender_type`, `message`, `is_read`, `created_at`) VALUES
(1, 1, 'user', 'Lokasi penukaran', 1, '2026-02-09 07:23:31'),
(2, 1, 'bot', 'Lokasi penukaran aktif:\n- Siring Menara Pandang\n- Taman Kamboja\n- Kantor Dishub Banjarmasin (Kuin Cerucuk)\n\nCek menu Lokasi untuk detailnya.', 0, '2026-02-09 07:23:31'),
(3, 1, 'user', 'Bus yang mana aja ya yang bisa di tukarkan ecotiket', 1, '2026-02-09 07:23:49'),
(4, 1, 'admin', 'Semua bus transbanjarmasin pak', 0, '2026-02-09 07:24:19'),
(5, 1, 'user', 'baik terima kasih pak', 1, '2026-02-09 07:24:59'),
(6, 1, 'admin', 'sama sama pak, terima kasih sudah mempercayakan layanan bus trans banjarmasin', 0, '2026-02-09 07:31:01'),
(7, 1, 'user', 'siap pak', 1, '2026-02-09 07:31:39'),
(8, 1, 'admin', 'nggeh', 0, '2026-02-09 07:34:38'),
(9, 1, 'user', 'ya', 1, '2026-02-09 07:35:30'),
(10, 1, 'user', 'Lokasi', 1, '2026-02-09 07:41:26'),
(11, 1, 'bot', 'Lokasi penukaran aktif:\n- Siring Menara Pandang\n- Taman Kamboja\n- Kantor Dishub Banjarmasin (Kuin Cerucuk)\n\nCek menu Lokasi untuk detailnya.', 0, '2026-02-09 07:41:26'),
(12, 1, 'user', 'Anjay', 1, '2026-02-09 07:41:28'),
(13, 2, 'user', 'hai', 1, '2026-02-09 07:50:19'),
(14, 2, 'bot', 'Halo! Saya EcoBot. Ada yang bisa dibantu? (Cek Saldo, Lokasi, Cara Tukar)', 0, '2026-02-09 07:50:19'),
(15, 2, 'user', 'gaada', 1, '2026-02-09 07:50:23'),
(16, 1, 'user', 'hai', 1, '2026-02-09 07:51:03'),
(17, 1, 'bot', 'Halo! Saya EcoBot. Ada yang bisa dibantu? (Cek Saldo, Lokasi, Cara Tukar)', 0, '2026-02-09 07:51:03'),
(18, 1, 'user', 'sayang kamu', 1, '2026-02-09 07:51:15'),
(19, 1, 'admin', 'aku juga', 0, '2026-02-09 07:54:54'),
(20, 1, 'user', 'hehehehhehhe', 1, '2026-02-09 07:55:28'),
(21, 1, 'user', 'hai maniez', 1, '2026-02-09 08:00:10'),
(22, 1, 'bot', 'Halo! Saya EcoBot. Ada yang bisa dibantu? (Cek Saldo, Lokasi, Cara Tukar)', 0, '2026-02-09 08:00:10'),
(23, 1, 'user', 'kadapapa ae', 1, '2026-02-09 08:00:18'),
(24, 1, 'admin', 'inggih kak', 0, '2026-02-09 08:00:41'),
(25, 1, 'admin', 'inggih ding', 0, '2026-02-09 08:04:58'),
(26, 1, 'user', 'mm', 1, '2026-02-09 08:06:13'),
(27, 1, 'admin', 'hai', 0, '2026-02-09 08:20:53'),
(28, 1, 'admin', 'aku admin', 0, '2026-02-09 08:20:56'),
(29, 1, 'admin', 'kamu anggota', 0, '2026-02-09 08:21:01'),
(30, 1, 'user', 'siap admin', 1, '2026-02-09 08:22:06'),
(31, 1, 'user', 'admin datang', 1, '2026-02-09 08:22:09'),
(32, 1, 'user', 'anjayayayaya', 1, '2026-02-09 08:25:36'),
(33, 1, 'admin', 'jndsjkhdwjkhjkw', 0, '2026-02-09 08:26:37'),
(34, 1, 'user', 'jsbjksjkasjha', 1, '2026-02-09 08:27:12'),
(35, 1, 'user', 'fesfdgrry', 1, '2026-02-09 08:32:20'),
(36, 2, 'user', 'SWWEEREW', 0, '2026-02-09 08:32:47'),
(37, 1, 'user', 'propaganda', 1, '2026-02-09 08:33:49'),
(38, 1, 'admin', 'assalamualaikum', 0, '2026-02-09 08:38:18'),
(39, 1, 'user', 'waalaikum salam', 1, '2026-02-09 08:38:55'),
(40, 1, 'admin', 'ppppp', 0, '2026-02-09 08:44:52'),
(41, 1, 'user', 'selebew', 1, '2026-02-09 16:08:05'),
(42, 3, 'user', 'hai', 1, '2026-02-10 01:43:00'),
(43, 3, 'bot', 'Halo! Saya EcoBot. Ada yang bisa dibantu? (Cek Saldo, Lokasi, Cara Tukar)', 0, '2026-02-10 01:43:00'),
(44, 3, 'user', 'cara', 1, '2026-02-10 01:43:08'),
(45, 3, 'bot', 'Cara Penukaran:\n1. Bawa botol ke lokasi.\n2. Tunjukkan QR Code di HP kamu.\n3. Petugas scan & tiket masuk otomatis!', 0, '2026-02-10 01:43:08'),
(46, 1, 'user', 'halo admin', 1, '2026-02-10 06:32:53'),
(47, 1, 'bot', 'Halo! Saya EcoBot. Ada yang bisa dibantu? (Cek Saldo, Lokasi, Cara Tukar)', 0, '2026-02-10 06:32:53'),
(48, 1, 'user', 'aku handak naik kayapa', 1, '2026-02-10 06:32:59'),
(49, 1, 'admin', 'nah kaytu pang', 0, '2026-02-10 06:33:30'),
(50, 3, 'admin', 'kjkjll', 0, '2026-02-10 13:55:47'),
(51, 3, 'user', 'KAMU YANG KIJIL', 1, '2026-02-10 13:57:07'),
(52, 3, 'admin', 'KOK AKU', 0, '2026-02-10 13:57:20'),
(53, 3, 'user', 'YAIYALAH KAMU', 1, '2026-02-10 13:57:49'),
(54, 3, 'user', 'JAHAT', 1, '2026-02-10 13:58:07'),
(55, 3, 'admin', 'KAMU YANG JAHAT', 0, '2026-02-10 13:58:29'),
(56, 4, 'user', 'Halo', 1, '2026-02-11 00:30:29'),
(57, 4, 'bot', 'Halo! Saya EcoBot. Ada yang bisa dibantu? (Cek Saldo, Lokasi, Cara Tukar)', 0, '2026-02-11 00:30:29'),
(58, 4, 'user', 'Hari ini keberangkatan bus start dari jam berapa ya', 1, '2026-02-11 00:30:53'),
(59, 4, 'bot', 'Jadwal Operasional:\nSenin - Jumat: 08.00 - 15.00 WITA\nSabtu - Minggu: Car Free Day (Siring) 06.00 - 10.00 WITA', 0, '2026-02-11 00:30:53'),
(60, 4, 'user', 'wih', 1, '2026-02-11 00:31:05'),
(61, 3, 'admin', 'kiw', 0, '2026-02-12 06:25:53'),
(62, 3, 'user', 'TOHA SAYANG DEDE', 1, '2026-02-12 06:26:32'),
(63, 3, 'user', 'hai min', 1, '2026-02-15 13:01:30'),
(64, 3, 'bot', 'Halo! Saya EcoBot. Ada yang bisa dibantu? (Cek Saldo, Lokasi, Cara Tukar)', 0, '2026-02-15 13:01:30'),
(65, 3, 'user', 'gaada min', 1, '2026-02-15 13:01:35'),
(66, 3, 'admin', 'Kamu ini ya', 0, '2026-02-15 13:01:50');

-- --------------------------------------------------------

--
-- Table structure for table `chat_sessions`
--

CREATE TABLE `chat_sessions` (
  `id_session` int NOT NULL,
  `user_id` int NOT NULL,
  `status` enum('open','closed') DEFAULT 'open',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `chat_sessions`
--

INSERT INTO `chat_sessions` (`id_session`, `user_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 9, 'open', '2026-02-09 07:23:22', '2026-02-09 07:23:22'),
(2, 7, 'open', '2026-02-09 07:24:04', '2026-02-09 07:24:04'),
(3, 10, 'open', '2026-02-10 01:42:51', '2026-02-10 01:42:51'),
(4, 33, 'open', '2026-02-11 00:30:24', '2026-02-11 00:30:24'),
(5, 24, 'closed', '2026-04-14 09:43:33', '2026-05-01 09:44:49');

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id_location` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('terminal','koridor','stand') NOT NULL,
  `address` text NOT NULL,
  `capacity` int DEFAULT NULL,
  `status` enum('active','inactive','maintenance') DEFAULT 'active',
  `operating_hours` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id_location`, `name`, `type`, `address`, `capacity`, `status`, `operating_hours`, `created_at`, `updated_at`) VALUES
(1, 'Terminal Antasari', 'terminal', 'Jl. Pangeran Antasari', 100, 'active', '08:00-18:00', '2025-11-26 12:21:32', '2025-11-26 12:21:32'),
(2, 'Terminal KM 0', 'terminal', 'Pusat Kota', 99, 'active', '08:00-18:00', '2025-11-26 12:21:32', '2026-01-28 08:21:49'),
(3, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'terminal', 'Jalur Koridor 1', 18, 'active', '06:00-18:00', '2025-11-26 12:21:32', '2026-01-28 08:22:05'),
(4, 'Koridor 2 (Terminal Antasari - RS Ansari Saleh)', 'koridor', 'Jalur Koridor 2', 18, 'active', '06:00-18:00', '2025-11-26 12:21:32', '2025-11-26 12:21:32'),
(5, 'Koridor 3 (Terminal Antasari - Jembatan Bromo)', 'koridor', 'Jalur Koridor 3', 18, 'active', '06:00-18:00', '2025-11-26 12:21:32', '2025-11-26 12:21:32'),
(6, 'Koridor 4 (Sungai Andai - Teluk Tiram)', 'koridor', 'Jalur Koridor 4', 12, 'active', '06:00-18:00', '2025-11-26 12:21:32', '2025-11-26 12:21:32'),
(7, 'Koridor 5 (Terminal Antasari - Pemangkih Laut)', 'koridor', 'Jalur Koridor 5', 18, 'active', '06:00-18:00', '2025-11-26 12:21:32', '2025-11-26 12:21:32'),
(8, 'Koridor 6 (Sungai Lulut - 0 Km)', 'koridor', 'Jalur Koridor 6', 18, 'active', '06:00-18:00', '2025-11-26 12:21:32', '2025-11-26 12:21:32'),
(9, 'Koridor 7 (0 Km - Dermaga Alalak)', 'koridor', 'Jalur Koridor 7', 12, 'active', '06:00-18:00', '2025-11-26 12:21:32', '2025-11-26 12:21:32'),
(10, 'Koridor 8 (Terminal Antasari - Pelabuhan Trisakti)', 'koridor', 'Jalur Koridor 8', 18, 'active', '06:00-18:00', '2025-11-26 12:21:32', '2025-11-26 12:21:32'),
(11, 'Koridor 9 (Terminal Antasari - Belitung)', 'koridor', 'Jalur Koridor 9', 18, 'active', '06:00-18:00', '2025-11-26 12:21:32', '2025-11-26 12:21:32'),
(12, 'Koridor 10 (RS Ansari Saleh - Trisakti (Via Kuin))', 'koridor', 'Jalur Koridor 10', 12, 'active', '06:00-18:00', '2025-11-26 12:21:32', '2025-11-26 12:21:32'),
(13, 'Koridor 11 (Terminal Antasari - Beruntung Jaya)', 'koridor', 'Jalur Koridor 11', 12, 'active', '06:00-18:00', '2025-11-26 12:21:32', '2025-11-26 12:21:32'),
(14, 'Koridor 12 (Banjar Raya - Terminal Antasari)', 'koridor', 'Jalur Koridor 12', 18, 'active', '06:00-18:00', '2025-11-26 12:21:32', '2025-11-26 12:21:32'),
(15, 'Koridor 13 (Trisakti - Sudimampir (Via Lingkar Selatan))', 'koridor', 'Jalur Koridor 13', 18, 'active', '06:00-18:00', '2025-11-26 12:21:32', '2025-11-26 12:21:32');

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id_news` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`id_news`, `title`, `slug`, `content`, `image`, `is_featured`, `created_by`, `created_at`, `updated_at`) VALUES
(3, 'Anjay', 'anjay-1769774613011', 'knkwdkefw', 'news-1769774612998-164373138.png', 0, NULL, '2026-01-30 12:03:33', '2026-01-30 12:03:33'),
(4, 'Asekk', 'asekk-1769774636364', 'jkfvdf', 'news-1769774636360-121489452.jpeg', 0, NULL, '2026-01-30 12:03:56', '2026-01-30 12:03:56');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id_notification` int NOT NULL,
  `id_user` int NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `petugas_assignments`
--

CREATE TABLE `petugas_assignments` (
  `id_assignment` int NOT NULL,
  `id_petugas` int NOT NULL,
  `id_location` int NOT NULL,
  `mode` enum('stand','karnet') NOT NULL,
  `started_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ended_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `assigned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `petugas_assignments`
--

INSERT INTO `petugas_assignments` (`id_assignment`, `id_petugas`, `id_location`, `mode`, `started_at`, `ended_at`, `is_active`, `assigned_at`) VALUES
(1, 8, 3, 'karnet', '2026-04-30 11:52:49', '2026-04-30 11:52:53', 0, '2026-04-30 11:52:49'),
(2, 8, 12, 'karnet', '2026-04-30 11:57:03', '2026-04-30 11:57:12', 0, '2026-04-30 11:57:03'),
(3, 8, 3, 'karnet', '2026-04-30 12:08:34', '2026-04-30 12:08:47', 0, '2026-04-30 12:08:34'),
(4, 8, 2, 'stand', '2026-04-30 12:10:01', '2026-04-30 12:15:19', 0, '2026-04-30 12:10:01'),
(5, 8, 2, 'stand', '2026-05-01 00:42:34', NULL, 1, '2026-05-01 00:42:34');

-- --------------------------------------------------------

--
-- Table structure for table `ticket_expirations`
--

CREATE TABLE `ticket_expirations` (
  `id_ticket_expiration` int NOT NULL,
  `id_user` int NOT NULL,
  `tickets_earned` int NOT NULL,
  `expiry_date` datetime NOT NULL,
  `is_expired` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `ticket_expirations`
--

INSERT INTO `ticket_expirations` (`id_ticket_expiration`, `id_user`, `tickets_earned`, `expiry_date`, `is_expired`, `created_at`) VALUES
(1, 24, 4, '2026-01-17 10:03:31', 0, '2025-12-18 03:03:31'),
(2, 30, 1, '2026-01-17 16:20:32', 1, '2025-12-18 09:20:31'),
(3, 30, 1, '2026-01-17 16:20:32', 0, '2025-12-18 09:20:32'),
(4, 30, 1, '2026-01-17 16:20:32', 0, '2025-12-18 09:20:32'),
(5, 30, 1, '2026-01-17 16:20:32', 0, '2025-12-18 09:20:32'),
(6, 30, 1, '2026-01-17 16:20:32', 0, '2025-12-18 09:20:32'),
(7, 20, 8, '2026-01-17 16:20:58', 0, '2025-12-18 09:20:57'),
(8, 20, 2, '2026-01-23 09:48:02', 0, '2025-12-24 02:48:01'),
(9, 20, 1, '2026-01-23 09:48:02', 0, '2025-12-24 02:48:02'),
(11, 9, 14, '2026-05-31 07:55:11', 0, '2026-05-01 00:55:11');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id_transaction` int NOT NULL,
  `id_user` int NOT NULL,
  `id_petugas` int NOT NULL,
  `type` varchar(25) NOT NULL,
  `description` text,
  `bottles_count` int DEFAULT NULL,
  `bottle_type` varchar(255) DEFAULT NULL,
  `tickets_change` int NOT NULL,
  `points_earned` int DEFAULT '0',
  `id_location` int DEFAULT NULL,
  `status` enum('pending','completed','cancelled') DEFAULT 'completed',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id_transaction`, `id_user`, `id_petugas`, `type`, `description`, `bottles_count`, `bottle_type`, `tickets_change`, `points_earned`, `id_location`, `status`, `created_at`) VALUES
(5, 9, 8, 'bottle_exchange', 'Tukar 4 botol jumbo', 4, 'jumbo', 1, 20, NULL, 'completed', '2025-09-23 02:48:39'),
(6, 9, 8, 'bottle_exchange', 'Tukar 20 botol jumbo', 20, 'jumbo', 6, 120, NULL, 'completed', '2025-09-23 02:59:41'),
(7, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-23 03:52:35'),
(8, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-23 03:52:38'),
(9, 10, 8, 'bottle_exchange', 'Tukar 24 botol jumbo', 24, 'jumbo', 8, 160, NULL, 'completed', '2025-09-23 05:41:46'),
(10, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-23 13:39:59'),
(11, 10, 8, 'bottle_exchange', 'Tukar 8 botol jumbo', 8, 'jumbo', 2, 40, NULL, 'completed', '2025-09-24 00:02:25'),
(12, 10, 8, 'bottle_exchange', 'Tukar 6 botol jumbo', 6, 'jumbo', 2, 40, NULL, 'completed', '2025-09-24 00:45:33'),
(13, 10, 8, 'bottle_exchange', 'Tukar 10 botol jumbo', 10, 'jumbo', 3, 60, NULL, 'completed', '2025-09-24 00:45:40'),
(14, 10, 8, 'bottle_exchange', 'Tukar 9 botol jumbo', 9, 'jumbo', 3, 60, NULL, 'completed', '2025-09-24 01:09:02'),
(15, 10, 8, 'bottle_exchange', 'Tukar 17 botol jumbo', 17, 'jumbo', 5, 100, NULL, 'completed', '2025-09-24 06:23:14'),
(16, 10, 8, 'bottle_exchange', 'Tukar 11 botol sedang', 11, 'sedang', 2, 30, NULL, 'completed', '2025-09-24 06:23:14'),
(17, 10, 8, 'bottle_exchange', 'Tukar 10 botol kecil', 10, 'kecil', 1, 10, NULL, 'completed', '2025-09-24 06:23:14'),
(18, 10, 8, 'bottle_exchange', 'Tukar 10 botol jumbo', 10, 'jumbo', 3, 60, NULL, 'completed', '2025-09-24 07:49:03'),
(19, 10, 8, 'bottle_exchange', 'Tukar 5 botol jumbo', 5, 'jumbo', 1, 20, NULL, 'completed', '2025-09-25 04:02:57'),
(20, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-25 04:26:32'),
(21, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-25 04:26:34'),
(22, 10, 8, 'bottle_exchange', 'Tukar 4 botol jumbo', 4, 'jumbo', 1, 20, NULL, 'completed', '2025-09-25 04:31:46'),
(23, 10, 8, 'bottle_exchange', 'Tukar 10 botol kecil', 10, 'kecil', 1, 10, NULL, 'completed', '2025-09-25 04:31:46'),
(24, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-25 04:33:17'),
(25, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-25 04:33:17'),
(26, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-25 04:33:17'),
(27, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-25 04:33:18'),
(28, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-25 04:33:18'),
(29, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-25 04:33:20'),
(30, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-27 08:33:44'),
(31, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-27 08:33:44'),
(32, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-27 08:33:45'),
(33, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-27 08:33:45'),
(34, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-27 08:33:45'),
(35, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-27 08:33:45'),
(36, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-27 08:33:46'),
(37, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-27 08:33:46'),
(38, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-27 08:33:46'),
(39, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-27 08:33:47'),
(40, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-27 08:33:47'),
(41, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-27 08:33:47'),
(42, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-27 08:33:48'),
(43, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-27 08:33:48'),
(44, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-27 08:33:48'),
(45, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-27 08:33:48'),
(46, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-27 08:33:48'),
(47, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-09-27 08:33:49'),
(48, 10, 8, 'bottle_exchange', 'Tukar 4 botol jumbo', 4, 'jumbo', 1, 20, NULL, 'completed', '2025-10-03 09:27:37'),
(49, 10, 8, 'bottle_exchange', 'Tukar 21 botol jumbo', 21, 'jumbo', 7, 140, NULL, 'completed', '2025-10-07 00:59:52'),
(50, 10, 8, 'bottle_exchange', 'Tukar 10 botol jumbo', 10, 'jumbo', 10, 0, NULL, 'completed', '2025-10-09 03:06:28'),
(51, 10, 8, 'bottle_exchange', 'Tukar 10 botol jumbo', 10, 'jumbo', 10, 0, NULL, 'completed', '2025-10-09 03:10:31'),
(52, 10, 8, 'bottle_exchange', 'Tukar 10 botol jumbo', 10, 'jumbo', 10, 0, NULL, 'completed', '2025-10-09 03:15:21'),
(53, 10, 8, 'bottle_exchange', 'Tukar 10 botol jumbo', 10, 'jumbo', 10, 0, NULL, 'completed', '2025-10-09 03:15:23'),
(54, 10, 8, 'bottle_exchange', 'Tukar 81 botol sedang', 81, 'sedang', 10, 0, NULL, 'completed', '2025-10-09 03:15:43'),
(64, 9, 8, 'bottle_exchange', 'Tukar 10 botol jumbo', 10, 'jumbo', 10, 0, NULL, 'completed', '2025-10-09 03:21:33'),
(65, 9, 8, 'point_conversion', 'Konversi otomatis 10 tiket menjadi 1 poin', NULL, NULL, -10, 1, NULL, 'completed', '2025-10-09 03:21:33'),
(66, 10, 8, 'bottle_exchange', 'Tukar 10 botol jumbo', 10, 'jumbo', 10, 0, NULL, 'completed', '2025-10-09 03:21:47'),
(67, 10, 8, 'point_conversion', 'Konversi otomatis 70 tiket menjadi 7 poin', NULL, NULL, -70, 7, NULL, 'completed', '2025-10-09 03:21:47'),
(68, 10, 8, 'bottle_exchange', 'Tukar 10 botol jumbo', 10, 'jumbo', 10, 1, NULL, 'completed', '2025-10-09 03:26:45'),
(69, 10, 8, 'bottle_exchange', 'Tukar 1 botol jumbo', 1, 'jumbo', 1, 0, NULL, 'completed', '2025-10-09 04:01:07'),
(70, 10, 8, 'bottle_exchange', 'Tukar 8 botol sedang', 8, 'sedang', 1, 0, NULL, 'completed', '2025-10-09 04:01:12'),
(71, 10, 8, 'bottle_exchange', 'Tukar 15 botol kecil', 15, 'kecil', 1, 0, NULL, 'completed', '2025-10-09 04:01:19'),
(72, 10, 8, 'bottle_exchange', 'Tukar 20 botol cup', 20, 'cup', 1, 0, NULL, 'completed', '2025-10-09 04:01:28'),
(73, 10, 8, 'bottle_exchange', 'Tukar 5 botol besar', 5, 'besar', 1, 0, NULL, 'completed', '2025-10-09 04:01:32'),
(74, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-10-15 02:10:34'),
(75, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-10-15 02:10:35'),
(76, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-10-15 02:10:35'),
(77, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-10-15 02:10:35'),
(78, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-10-15 02:10:36'),
(79, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-10-15 02:10:36'),
(80, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-10-15 02:10:36'),
(81, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-10-15 02:10:37'),
(82, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-10-15 02:10:37'),
(83, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-10-15 02:10:38'),
(84, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-10-15 02:10:38'),
(85, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-10-15 02:10:38'),
(86, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-10-15 02:10:39'),
(87, 10, 8, 'bottle_exchange', 'Tukar 10 botol jumbo', 10, 'jumbo', 10, 1, NULL, 'completed', '2025-10-15 02:12:10'),
(88, 10, 8, 'bottle_exchange', 'Tukar 10 botol jumbo', 10, 'jumbo', 10, 1, NULL, 'completed', '2025-10-15 04:25:14'),
(89, 10, 8, 'bottle_exchange', 'Tukar 8 botol jumbo', 8, 'jumbo', 8, 1, NULL, 'completed', '2025-10-15 04:29:22'),
(90, 10, 8, 'bottle_exchange', 'Tukar 4 botol jumbo', 4, 'jumbo', 4, 0, NULL, 'completed', '2025-10-15 04:34:12'),
(91, 10, 8, 'bottle_exchange', 'Tukar 1 botol jumbo', 1, 'jumbo', 1, 0, NULL, 'completed', '2025-10-15 04:36:26'),
(92, 10, 8, 'bottle_exchange', 'Tukar 4 botol jumbo', 4, 'jumbo', 4, 1, NULL, 'completed', '2025-10-15 04:40:06'),
(93, 9, 8, 'bottle_exchange', 'Tukar 9 botol jumbo', 9, 'jumbo', 9, 1, NULL, 'completed', '2025-10-15 04:41:09'),
(94, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-10-15 04:42:35'),
(95, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-10-15 04:42:36'),
(96, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-10-15 04:42:37'),
(97, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-10-15 04:42:37'),
(98, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-10-15 04:42:37'),
(99, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, NULL, 'completed', '2025-10-15 04:42:38'),
(100, 9, 8, 'bottle_exchange', 'Tukar 20 botol cup', 20, 'cup', 1, 0, NULL, 'completed', '2025-10-15 04:43:49'),
(101, 9, 8, 'bottle_exchange', 'Tukar 14 botol jumbo', 14, 'jumbo', 14, 2, NULL, 'completed', '2025-10-15 04:46:27'),
(102, 9, 8, 'bottle_exchange', 'Tukar 7 botol jumbo', 7, 'jumbo', 7, 0, NULL, 'completed', '2025-10-15 04:47:25'),
(103, 9, 8, 'bottle_exchange', 'Tukar 2 botol jumbo', 2, 'jumbo', 2, 1, 1, 'completed', '2025-10-15 04:58:24'),
(104, 9, 8, 'bottle_exchange', 'Tukar 2 botol jumbo', 2, 'jumbo', 2, 0, 1, 'completed', '2025-10-15 05:00:02'),
(105, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 5, 'completed', '2025-10-15 05:36:53'),
(106, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 5, 'completed', '2025-10-15 05:36:53'),
(107, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 5, 'completed', '2025-10-15 05:36:53'),
(108, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 5, 'completed', '2025-10-15 05:36:54'),
(109, 10, 8, 'bottle_exchange', 'Tukar 18 botol jumbo', 18, 'jumbo', 18, 2, 1, 'completed', '2025-10-15 06:44:55'),
(110, 10, 8, 'bottle_exchange', 'Tukar 3 botol jumbo', 3, 'jumbo', 3, 1, 2, 'completed', '2025-10-17 23:47:02'),
(111, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-10-17 23:47:26'),
(112, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-10-17 23:47:27'),
(113, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-10-17 23:47:27'),
(114, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-10-17 23:47:27'),
(115, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-10-17 23:47:29'),
(116, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-10-17 23:47:29'),
(117, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-10-17 23:47:30'),
(118, 10, 8, 'bottle_exchange', 'Tukar 8 botol sedang', 8, 'sedang', 1, 0, 2, 'completed', '2025-10-18 01:15:51'),
(119, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-10-18 01:16:08'),
(120, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-10-18 01:16:08'),
(121, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-10-18 01:16:08'),
(122, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-10-18 01:16:08'),
(123, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-10-18 01:16:08'),
(124, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-10-18 01:16:09'),
(125, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-10-18 01:16:09'),
(126, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-10-18 01:16:09'),
(127, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-10-18 01:16:09'),
(128, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-10-18 01:16:10'),
(129, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-10-18 01:16:10'),
(130, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-10-18 01:16:10'),
(131, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-10-18 01:16:10'),
(132, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-10-18 01:16:11'),
(133, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-10-18 01:16:11'),
(134, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-10-18 01:16:12'),
(135, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-10-18 01:16:17'),
(136, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 12, 'completed', '2025-10-20 12:57:59'),
(137, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 12, 'completed', '2025-10-20 12:58:00'),
(138, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 12, 'completed', '2025-10-20 12:58:00'),
(139, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 12, 'completed', '2025-10-20 12:58:01'),
(140, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 12, 'completed', '2025-10-20 12:58:01'),
(141, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 12, 'completed', '2025-10-20 12:58:02'),
(142, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 12, 'completed', '2025-10-20 12:58:02'),
(143, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 12, 'completed', '2025-10-20 12:58:02'),
(144, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 2, 'completed', '2025-11-27 01:50:18'),
(145, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 2, 'completed', '2025-11-27 01:50:18'),
(146, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 2, 'completed', '2025-11-27 01:50:19'),
(147, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 2, 'completed', '2025-11-27 01:50:19'),
(148, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 2, 'completed', '2025-11-27 01:50:20'),
(149, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 2, 'completed', '2025-11-27 01:50:20'),
(150, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 2, 'completed', '2025-11-27 01:50:20'),
(151, 9, 8, 'bottle_exchange', 'Tukar 1 botol jumbo', 1, 'jumbo', 1, 0, 1, 'completed', '2025-11-27 02:45:59'),
(152, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-11-27 02:46:42'),
(153, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-11-27 02:46:44'),
(154, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-11-27 02:46:44'),
(155, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-11-27 02:46:45'),
(156, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-11-27 02:53:56'),
(157, 20, 8, 'bottle_exchange', 'Tukar 5 botol jumbo', 5, 'jumbo', 5, 0, 1, 'completed', '2025-12-17 02:25:44'),
(159, 20, 8, 'bottle_exchange', 'Tukar 5 botol besar', 5, 'besar', 1, 0, 1, 'completed', '2025-12-17 03:14:07'),
(160, 20, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-17 03:15:10'),
(161, 20, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-17 03:15:14'),
(162, 20, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-17 03:15:15'),
(163, 20, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-17 03:15:15'),
(164, 20, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-17 03:15:15'),
(165, 20, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-17 03:15:16'),
(166, 24, 8, 'bottle_exchange', 'Tukar 2 botol jumbo', 2, 'jumbo', 2, 0, 1, 'completed', '2025-12-17 03:30:02'),
(167, 24, 8, 'bottle_exchange', 'Tukar 5 botol besar', 5, 'besar', 1, 0, 1, 'completed', '2025-12-17 03:30:02'),
(168, 24, 8, 'bottle_exchange', 'Tukar 16 botol sedang', 16, 'sedang', 2, 0, 1, 'completed', '2025-12-17 03:30:02'),
(169, 24, 8, 'bottle_exchange', 'Tukar 20 botol kecil', 20, 'kecil', 1, 0, 1, 'completed', '2025-12-17 03:30:02'),
(170, 24, 8, 'bottle_exchange', 'Tukar 20 botol cup', 20, 'cup', 1, 0, 1, 'completed', '2025-12-17 03:30:02'),
(171, 24, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-17 03:31:07'),
(172, 24, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-17 03:31:12'),
(173, 24, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-17 03:31:12'),
(174, 24, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-17 03:31:14'),
(175, 25, 8, 'bottle_exchange', 'Tukar 1 botol jumbo', 1, 'jumbo', 1, 0, 1, 'completed', '2025-12-17 03:38:33'),
(176, 25, 8, 'bottle_exchange', 'Tukar 8 botol sedang', 8, 'sedang', 1, 0, 1, 'completed', '2025-12-17 03:38:33'),
(177, 25, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-17 03:39:41'),
(178, 26, 8, 'bottle_exchange', 'Tukar 3 botol jumbo', 3, 'jumbo', 3, 0, 2, 'completed', '2025-12-17 03:44:50'),
(179, 26, 8, 'bottle_exchange', 'Tukar 5 botol besar', 5, 'besar', 1, 0, 2, 'completed', '2025-12-17 03:44:50'),
(180, 26, 8, 'bottle_exchange', 'Tukar 15 botol sedang', 15, 'sedang', 1, 0, 2, 'completed', '2025-12-17 03:44:50'),
(181, 26, 8, 'bottle_exchange', 'Tukar 3 botol jumbo', 3, 'jumbo', 3, 0, 2, 'completed', '2025-12-17 03:45:02'),
(182, 26, 8, 'bottle_exchange', 'Tukar 5 botol besar', 5, 'besar', 1, 0, 2, 'completed', '2025-12-17 03:45:02'),
(183, 26, 8, 'bottle_exchange', 'Tukar 15 botol sedang', 15, 'sedang', 1, 1, 2, 'completed', '2025-12-17 03:45:02'),
(184, 26, 8, 'bottle_exchange', 'Tukar 15 botol kecil', 15, 'kecil', 1, 0, 2, 'completed', '2025-12-17 03:45:02'),
(185, 26, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-17 03:46:08'),
(186, 26, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-17 03:46:16'),
(187, 26, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-17 03:46:17'),
(188, 26, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-17 03:46:18'),
(189, 26, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-17 03:46:28'),
(190, 26, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-17 03:46:29'),
(191, 26, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-17 03:46:37'),
(192, 26, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-17 03:46:38'),
(193, 26, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-17 03:46:38'),
(194, 26, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-17 03:46:38'),
(195, 26, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-17 03:46:38'),
(196, 27, 8, 'bottle_exchange', 'Tukar 1 botol jumbo', 1, 'jumbo', 1, 0, 1, 'completed', '2025-12-17 03:53:44'),
(197, 27, 8, 'bottle_exchange', 'Tukar 5 botol besar', 5, 'besar', 1, 0, 1, 'completed', '2025-12-17 03:53:44'),
(198, 27, 8, 'bottle_exchange', 'Tukar 8 botol sedang', 8, 'sedang', 1, 0, 1, 'completed', '2025-12-17 03:53:44'),
(199, 27, 8, 'bottle_exchange', 'Tukar 15 botol kecil', 15, 'kecil', 1, 0, 1, 'completed', '2025-12-17 03:53:44'),
(200, 27, 8, 'bottle_exchange', 'Tukar 20 botol cup', 20, 'cup', 1, 0, 1, 'completed', '2025-12-17 03:53:44'),
(201, 27, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 6, 'completed', '2025-12-17 03:54:31'),
(211, 24, 8, 'bottle_exchange', 'Tukar 2 botol jumbo (expire 17/1/2026)', 2, 'jumbo', 4, 0, 2, 'completed', '2025-12-18 03:03:31'),
(212, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:40'),
(213, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:40'),
(214, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:41'),
(215, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:41'),
(216, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:41'),
(217, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:42'),
(218, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:42'),
(219, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:42'),
(220, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:43'),
(221, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:43'),
(222, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:43'),
(223, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:44'),
(224, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:44'),
(225, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:45'),
(226, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:45'),
(227, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:45'),
(228, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:46'),
(229, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:46'),
(230, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:47'),
(231, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:47'),
(232, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:47'),
(233, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:48'),
(234, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:48'),
(235, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:49'),
(236, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:49'),
(237, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:49'),
(238, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:50'),
(239, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:50'),
(240, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 03:14:51'),
(241, 30, 8, 'bottle_exchange', 'Tukar 2 botol jumbo (expire 17/1/2026)', 2, 'jumbo', 4, 0, 1, 'completed', '2025-12-18 09:20:32'),
(242, 30, 8, 'bottle_exchange', 'Tukar 5 botol besar (expire 17/1/2026)', 5, 'besar', 1, 0, 1, 'completed', '2025-12-18 09:20:32'),
(243, 30, 8, 'bottle_exchange', 'Tukar 8 botol sedang (expire 17/1/2026)', 8, 'sedang', 1, 0, 1, 'completed', '2025-12-18 09:20:32'),
(244, 30, 8, 'bottle_exchange', 'Tukar 15 botol kecil (expire 17/1/2026)', 15, 'kecil', 1, 0, 1, 'completed', '2025-12-18 09:20:32'),
(245, 30, 8, 'bottle_exchange', 'Tukar 20 botol cup (expire 17/1/2026)', 20, 'cup', 1, 0, 1, 'completed', '2025-12-18 09:20:32'),
(246, 20, 8, 'bottle_exchange', 'Tukar 5 botol jumbo (expire 17/1/2026)', 5, 'jumbo', 10, 1, 1, 'completed', '2025-12-18 09:20:57'),
(247, 30, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 09:21:21'),
(248, 30, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 09:21:21'),
(249, 30, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 09:21:21'),
(250, 30, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 09:21:22'),
(251, 30, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 09:21:22'),
(252, 30, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 09:21:22'),
(253, 30, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 09:21:23'),
(254, 30, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-18 09:21:23'),
(255, 20, 8, 'bottle_exchange', 'Tukar 1 botol jumbo (expire 23/1/2026)', 1, 'jumbo', 2, 0, 1, 'completed', '2025-12-24 02:48:02'),
(256, 20, 8, 'bottle_exchange', 'Tukar 5 botol besar (expire 23/1/2026)', 5, 'besar', 1, 0, 1, 'completed', '2025-12-24 02:48:02'),
(257, 20, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-24 02:52:35'),
(258, 20, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2025-12-24 02:52:42'),
(259, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2026-01-29 04:58:55'),
(260, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2026-01-29 04:58:56'),
(261, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2026-01-29 04:58:57'),
(263, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2026-04-30 12:08:43'),
(264, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 3, 'completed', '2026-04-30 12:08:44'),
(265, 9, 8, 'bottle_exchange', 'Tukar 7 botol jumbo (expire 31/5/2026)', 7, 'jumbo', 14, 2, 2, 'completed', '2026-05-01 00:55:11');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` int NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `nik` varchar(16) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` enum('admin','petugas','penumpang') NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text,
  `qr_code` varchar(100) NOT NULL,
  `tickets_balance` int DEFAULT '0',
  `points` int DEFAULT '0',
  `status` enum('active','inactive','suspended') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `email`, `nik`, `password`, `name`, `role`, `phone`, `address`, `qr_code`, `tickets_balance`, `points`, `status`, `created_at`, `updated_at`) VALUES
(7, 'admin@sistemecotiket.com', NULL, '$2b$10$t1KxngBXG9WO/aZ3Ef7UkOHp7CSmGdL83CepLMDwzOv2JcLOKwfHu', 'Admin Tbekula', 'admin', '085754513889', '-', 'ECO-ADMIN-002', 0, 0, 'active', '2025-09-22 05:51:48', '2025-10-19 06:41:42'),
(8, 'husin@ecotiket.com', NULL, '$2b$10$R.LC/kedECb9iU70fXZ0keV5MqhE8T7fFgyxs/6CII0VZeGs.lPp.', 'Husin', 'petugas', '08123456789', '-', 'ECO-OFFICER-1758585577-4CF8EB', 0, 0, 'active', '2025-09-22 06:30:00', '2025-09-22 23:59:37'),
(9, NULL, '6305050678934256', '$2b$10$Ew1w05dZdSM/UZ6ovb6jRurWhiSayFh38C2U5rAM.6.Yfr.g9smPq', 'Amat Plastik', 'penumpang', '087659812300', 'Sambang Lehong', 'ECO-USER-001', 30, 147, 'active', '2025-09-23 00:01:41', '2026-05-01 00:55:11'),
(10, NULL, '1234567890123454', '$2b$10$J00Y67Lg2voAoWVrE7afZO5nxSKDfJ7FN/5c7d4qoT3XfYHhtuI2e', 'Toha', 'penumpang', '081234567891', 'Tamban', 'ECO-USER-002', 0, 785, 'active', '2025-09-23 05:01:00', '2025-12-18 03:14:51'),
(11, NULL, '6300000000000000', '$2b$10$7PazndGCGMXIXB1hmrB8kumKFDpo4n/iA7vqDXVP7p9yCBg0cU8e6', 'Riska Maulida', 'penumpang', '085353535353', 'Hulu Sungai', 'ECO-USER-003', 0, 0, 'active', '2025-09-24 05:14:26', '2025-09-24 05:15:21'),
(13, NULL, '1234567890123431', '$2b$10$3HLFG0hodqRYUJKPlOul5ulDCgigiatZ3d0gCUofz1nL5IG3vkSNS', 'Adit', 'penumpang', '08123456700', '-', 'ECO-USER-005', 0, 0, 'active', '2025-09-27 08:31:29', '2025-09-27 08:31:29'),
(14, NULL, '6300000000000885', '$2b$10$YDKbg3lFsHX/dFr1gGv4u.66ncs/AW0v1DAP6FexrExo6hIVo4ACe', 'Hendra', 'penumpang', '081234567871', '-', 'ECO-USER-006', 0, 0, 'active', '2025-10-03 09:25:38', '2025-10-03 09:25:38'),
(15, NULL, '1234567890123333', '$2b$10$J7WsqJFsuYv5dVS58GhCNek4WiTNnBXa0R2bv8mcgiiHApJrPVQFa', 'Rubblee', 'penumpang', '081234567822', '-', 'ECO-USER-007', 0, 0, 'active', '2025-10-17 23:43:38', '2025-10-17 23:43:38'),
(16, 'wahyu@gmail.com', NULL, '$2b$10$cOo3ZUmUcGYZOrm0BSJ0DO85P3V/kwOPGmJP0QLdYJgfx5FOJpWkm', 'Wahyu', 'petugas', '081234567823', '-', 'ECO-OFFICER-001', 0, 0, 'active', '2025-10-18 00:41:37', '2025-10-18 00:41:37'),
(18, NULL, '1234567890123459', '$2b$10$soOnVxRUO.PiCEfyqGErEukDZ6U2hdq0keZ94ksHM02NOD08cAnbW', 'Bahris', 'penumpang', '08123456789', '-', 'ECO-USER-008', 0, 0, 'active', '2025-10-20 01:12:58', '2025-10-20 01:12:58'),
(19, NULL, '1111111111111222', '$2b$10$ieOXLsUMNZry6i/gUMrtpOP61uiThY.ORRnV/zDzVMs5n0jVNFYG6', 'Asep', 'penumpang', '085757575758', '-', 'ECO-USER-009', 0, 0, 'active', '2025-10-20 02:23:17', '2025-10-20 02:23:17'),
(20, NULL, '1111111111111233', '$2b$10$SYq79Wxt1ytkFNM/PlFTSuAcSs8yXRWqjRQQ6sEoIx/bcgGXcA17y', 'Nunky', 'penumpang', '085757575753', 'Sambang Lehong\n', 'ECO-USER-010', 11, 1, 'active', '2025-10-20 05:37:20', '2025-12-24 02:52:42'),
(21, NULL, '1234567890123452', '$2b$10$YFjDg6SfCjOTT25GFQV4FuhARSxNYmmAv5qyFEse3BtbJTKlSTKG2', 'Rahmat', 'penumpang', '081234567899', 'Margasari', 'ECO-USER-011', 0, 0, 'active', '2025-11-15 00:53:23', '2025-11-15 00:53:23'),
(22, NULL, '1111111111111311', '$2b$10$sPk0/p4ANxBvk4w.c.6sze/ktZRYT4zb0UFFuy4Frw1IcRFPRWJoq', 'Zubay', 'penumpang', '085151515151', '-', 'ECO-USER-012', 0, 0, 'active', '2025-12-17 02:26:46', '2025-12-17 02:26:46'),
(23, NULL, '1111111111111236', '$2b$10$jiR3tw8dPSscR/sZjHAMN.g.cjkuU8q4bF34eAhdu0tKXkpRiGrbi', 'Fauzan', 'penumpang', '085757575750', '-', 'ECO-USER-013', 0, 0, 'active', '2025-12-17 03:12:32', '2025-12-17 03:12:32'),
(24, NULL, '1111111111111237', '$2b$10$7UQejD53UFV/XsEE6UeKNOBw6yMtpFwTszXDrVjyDAw6HQHG3Bo2G', 'irma ', 'penumpang', '089', '1', 'ECO-USER-014', 7, 0, 'active', '2025-12-17 03:27:37', '2025-12-18 03:03:31'),
(25, NULL, '1111111111111234', '$2b$10$Q.CILoQ7fUUqXzvYfaqeE.Veg0ZXxuXoKZyAQ35na09zFMuXIWJV.', 'amel', 'penumpang', '-', 'teluk dalam', 'ECO-USER-015', 1, 0, 'active', '2025-12-17 03:37:19', '2025-12-17 03:39:41'),
(26, NULL, '1111111111111245', '$2b$10$qEsnhht6Kw0wZJBfvgI8/OExj/ROFFbkAxiUID83IYsvESELALUFm', 'rahmadani', 'penumpang', '-', 'jl sutoyo s', 'ECO-USER-016', 0, 1, 'active', '2025-12-17 03:43:17', '2025-12-17 03:46:38'),
(27, NULL, '1111111111111227', '$2b$10$zvDzJP8aJps9rgsThPtWJutzCXsLnnEPNh0JkD1EuoqXBDC/wjOYS', 'edo', 'penumpang', '0852', 'teluk dalam lagi', 'ECO-USER-017', 3, 0, 'active', '2025-12-17 03:52:20', '2025-12-18 09:18:03'),
(29, 'sambang@ecotiket.com', NULL, '$2b$10$XtFOHZJI1gY5T5m4i.ddceQ1UtKzXcTIST19fV8AWtv5C3O9miB7e', 'Sambang', 'petugas', '-', '-', 'ECO-OFFICER-002', 0, 0, 'active', '2025-12-18 09:18:39', '2025-12-18 09:18:39'),
(30, NULL, '1111111111111200', '$2b$10$/7e9ENozlK5MdaCkdcL1fevU7oU6VbcuOJMHnUJ9m/w1hTt2JQMrW', 'Ajim', 'penumpang', '-', '-', 'ECO-USER-018', 0, 0, 'active', '2025-12-18 09:19:55', '2025-12-18 09:21:23'),
(31, '1234567890123000@ecotiket.id', '1234567890123000', '$2b$10$G6tn7q/HVailOjL3Gi7CZuuswsziOW2bt/GaFSPriNhXbDKKv384C', 'Dhot', 'penumpang', '087645980345', '-', 'ECO-USER-019', 0, 0, 'active', '2026-01-30 16:15:46', '2026-01-30 16:15:46'),
(32, '1223423384984334@ecotiket.id', '1223423384984334', '$2b$10$F4nv8bebiRRRLBOsAh5kIu2UxV4c1bJHOQXEBZIVX8CMfWTS.yBeq', 'Kona', 'penumpang', '081234567888', '-', 'ECO-USER-020', 0, 0, 'active', '2026-01-30 16:16:36', '2026-01-30 16:16:36'),
(33, '1234567893421334@ecotiket.id', '1234567893421334', '$2b$10$uIev4WPfW0e.eCUeo.F9zOWJlGyqD/henOpcENOpzxBF8IozzNfGy', 'Robi', 'penumpang', '08123456789', '-', 'ECO-USER-021', 0, 0, 'active', '2026-01-30 16:21:57', '2026-01-30 16:21:57'),
(34, '6309860431256782@ecotiket.id', '6309860431256782', '$2b$10$/9omQRqjuTOIzys/FJlurOM13XoFoXiTHUWAtTWQC0OVqlDyf.xyO', 'Fahmi Iqbal', 'penumpang', '089567490021', '-', 'ECO-USER-004', 0, 0, 'active', '2026-04-15 02:48:25', '2026-04-15 02:48:25');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bottle_rates`
--
ALTER TABLE `bottle_rates`
  ADD PRIMARY KEY (`id_bottle_rate`);

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id_message`),
  ADD KEY `session_id` (`session_id`);

--
-- Indexes for table `chat_sessions`
--
ALTER TABLE `chat_sessions`
  ADD PRIMARY KEY (`id_session`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id_location`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id_news`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id_notification`),
  ADD KEY `idx_user_read` (`id_user`,`is_read`);

--
-- Indexes for table `petugas_assignments`
--
ALTER TABLE `petugas_assignments`
  ADD PRIMARY KEY (`id_assignment`),
  ADD KEY `petugas_assignments_id_petugas_fk` (`id_petugas`),
  ADD KEY `petugas_assignments_id_location_fk` (`id_location`);

--
-- Indexes for table `ticket_expirations`
--
ALTER TABLE `ticket_expirations`
  ADD PRIMARY KEY (`id_ticket_expiration`),
  ADD KEY `ticket_expirations_id_user_fk` (`id_user`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id_transaction`),
  ADD KEY `idx_transactions_user_id` (`id_user`),
  ADD KEY `idx_transactions_petugas_id` (`id_petugas`),
  ADD KEY `idx_transactions_created_at` (`created_at`),
  ADD KEY `fk_transactions_location` (`id_location`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `qr_code` (`qr_code`),
  ADD UNIQUE KEY `unique_email` (`email`),
  ADD UNIQUE KEY `unique_nik` (`nik`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_nik` (`nik`),
  ADD KEY `idx_users_qr_code` (`qr_code`),
  ADD KEY `idx_users_role` (`role`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bottle_rates`
--
ALTER TABLE `bottle_rates`
  MODIFY `id_bottle_rate` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id_message` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `chat_sessions`
--
ALTER TABLE `chat_sessions`
  MODIFY `id_session` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id_location` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id_news` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id_notification` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `petugas_assignments`
--
ALTER TABLE `petugas_assignments`
  MODIFY `id_assignment` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `ticket_expirations`
--
ALTER TABLE `ticket_expirations`
  MODIFY `id_ticket_expiration` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id_transaction` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=266;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `chat_sessions` (`id_session`) ON DELETE CASCADE;

--
-- Constraints for table `chat_sessions`
--
ALTER TABLE `chat_sessions`
  ADD CONSTRAINT `chat_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;

--
-- Constraints for table `news`
--
ALTER TABLE `news`
  ADD CONSTRAINT `news_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id_user`) ON DELETE SET NULL;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notif_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;

--
-- Constraints for table `petugas_assignments`
--
ALTER TABLE `petugas_assignments`
  ADD CONSTRAINT `petugas_assignments_id_location_fk` FOREIGN KEY (`id_location`) REFERENCES `locations` (`id_location`),
  ADD CONSTRAINT `petugas_assignments_id_petugas_fk` FOREIGN KEY (`id_petugas`) REFERENCES `users` (`id_user`);

--
-- Constraints for table `ticket_expirations`
--
ALTER TABLE `ticket_expirations`
  ADD CONSTRAINT `ticket_expirations_id_user_fk` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `fk_transactions_location` FOREIGN KEY (`id_location`) REFERENCES `locations` (`id_location`) ON DELETE SET NULL,
  ADD CONSTRAINT `transactions_id_petugas_fk` FOREIGN KEY (`id_petugas`) REFERENCES `users` (`id_user`) ON DELETE CASCADE,
  ADD CONSTRAINT `transactions_id_user_fk` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
