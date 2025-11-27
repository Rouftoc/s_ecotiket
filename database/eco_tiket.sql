-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 27, 2025 at 02:56 AM
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
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `type` enum('info','warning','success') DEFAULT 'info',
  `is_active` tinyint(1) DEFAULT '1',
  `created_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `title`, `content`, `type`, `is_active`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Selamat Datang di Eco-Tiket!', 'Sistem tiket ramah lingkungan untuk transportasi publik Banjarmasin. Tukar botol bekas dengan tiket bus!', 'success', 1, 1, '2025-09-22 01:31:14', '2025-09-22 01:31:14'),
(2, 'Cara Menukar Botol', 'Kumpulkan botol plastik bekas dan tukarkan dengan tiket bus. 10 botol kecil = 1 tiket, 5 botol sedang = 1 tiket, 3 botol besar = 1 tiket.', 'info', 1, 1, '2025-09-22 01:31:14', '2025-09-22 01:31:14'),
(3, 'Lokasi Penukaran', 'Stand penukaran tersedia di Terminal Antasari, Terminal KM 0, dan Terminal Pal 6. Buka setiap hari 06:00-18:00.', 'info', 1, 1, '2025-09-22 01:31:14', '2025-09-22 01:31:14');

-- --------------------------------------------------------

--
-- Table structure for table `bottle_rates`
--

CREATE TABLE `bottle_rates` (
  `id` int NOT NULL,
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

INSERT INTO `bottle_rates` (`id`, `bottle_type`, `bottles_required`, `tickets_earned`, `points_earned`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'kecil', 15, 1, 0, 1, '2025-09-22 01:31:14', '2025-10-09 02:33:01'),
(2, 'sedang', 8, 1, 0, 1, '2025-09-22 01:31:14', '2025-10-09 02:33:11'),
(3, 'jumbo', 1, 2, 0, 1, '2025-09-22 01:31:14', '2025-10-09 02:24:40'),
(4, 'besar', 5, 1, 0, 1, '2025-09-23 02:17:54', '2025-10-09 03:09:31'),
(5, 'cup', 20, 1, 0, 1, '2025-09-23 02:17:54', '2025-10-09 02:33:54');

-- --------------------------------------------------------

--
-- Table structure for table `gallery`
--

CREATE TABLE `gallery` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `image_url` varchar(500) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `gallery`
--

INSERT INTO `gallery` (`id`, `title`, `description`, `image_url`, `is_active`, `created_by`, `created_at`) VALUES
(1, 'Terminal Antasari', 'Stand penukaran botol di Terminal Antasari', '/assets/gallery/terminal-antasari.jpg', 1, 1, '2025-09-22 01:31:14'),
(2, 'Proses Penukaran', 'Penumpang sedang menukar botol dengan tiket', '/assets/gallery/bottle-exchange.jpg', 1, 1, '2025-09-22 01:31:14'),
(3, 'Bus Trans Banjarmasin', 'Armada bus Trans Banjarmasin yang ramah lingkungan', '/assets/gallery/bus-trans.jpg', 1, 1, '2025-09-22 01:31:14');

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('terminal','koridor','stand') NOT NULL,
  `address` text NOT NULL,
  `coordinates` varchar(255) DEFAULT NULL,
  `description` text,
  `capacity` int DEFAULT NULL,
  `status` enum('active','inactive','maintenance') DEFAULT 'active',
  `operating_hours` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `name`, `type`, `address`, `coordinates`, `description`, `capacity`, `status`, `operating_hours`, `created_at`, `updated_at`) VALUES
(1, 'Terminal Antasari', 'terminal', 'Jl. Pangeran Antasari', NULL, NULL, 100, 'active', '08:00-18:00', '2025-11-26 12:21:32', '2025-11-26 12:21:32'),
(2, 'Terminal KM 0', 'terminal', 'Pusat Kota', NULL, NULL, 100, 'active', '08:00-18:00', '2025-11-26 12:21:32', '2025-11-26 12:21:32'),
(3, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'koridor', 'Jalur Koridor 1', NULL, NULL, 18, 'active', '06:00-18:00', '2025-11-26 12:21:32', '2025-11-26 12:21:32'),
(4, 'Koridor 2 (Terminal Antasari - RS Ansari Saleh)', 'koridor', 'Jalur Koridor 2', NULL, NULL, 18, 'active', '06:00-18:00', '2025-11-26 12:21:32', '2025-11-26 12:21:32'),
(5, 'Koridor 3 (Terminal Antasari - Jembatan Bromo)', 'koridor', 'Jalur Koridor 3', NULL, NULL, 18, 'active', '06:00-18:00', '2025-11-26 12:21:32', '2025-11-26 12:21:32'),
(6, 'Koridor 4 (Sungai Andai - Teluk Tiram)', 'koridor', 'Jalur Koridor 4', NULL, NULL, 12, 'active', '06:00-18:00', '2025-11-26 12:21:32', '2025-11-26 12:21:32'),
(7, 'Koridor 5 (Terminal Antasari - Pemangkih Laut)', 'koridor', 'Jalur Koridor 5', NULL, NULL, 18, 'active', '06:00-18:00', '2025-11-26 12:21:32', '2025-11-26 12:21:32'),
(8, 'Koridor 6 (Sungai Lulut - 0 Km)', 'koridor', 'Jalur Koridor 6', NULL, NULL, 18, 'active', '06:00-18:00', '2025-11-26 12:21:32', '2025-11-26 12:21:32'),
(9, 'Koridor 7 (0 Km - Dermaga Alalak)', 'koridor', 'Jalur Koridor 7', NULL, NULL, 12, 'active', '06:00-18:00', '2025-11-26 12:21:32', '2025-11-26 12:21:32'),
(10, 'Koridor 8 (Terminal Antasari - Pelabuhan Trisakti)', 'koridor', 'Jalur Koridor 8', NULL, NULL, 18, 'active', '06:00-18:00', '2025-11-26 12:21:32', '2025-11-26 12:21:32'),
(11, 'Koridor 9 (Terminal Antasari - Belitung)', 'koridor', 'Jalur Koridor 9', NULL, NULL, 18, 'active', '06:00-18:00', '2025-11-26 12:21:32', '2025-11-26 12:21:32'),
(12, 'Koridor 10 (RS Ansari Saleh - Trisakti (Via Kuin))', 'koridor', 'Jalur Koridor 10', NULL, NULL, 12, 'active', '06:00-18:00', '2025-11-26 12:21:32', '2025-11-26 12:21:32'),
(13, 'Koridor 11 (Terminal Antasari - Beruntung Jaya)', 'koridor', 'Jalur Koridor 11', NULL, NULL, 12, 'active', '06:00-18:00', '2025-11-26 12:21:32', '2025-11-26 12:21:32'),
(14, 'Koridor 12 (Banjar Raya - Terminal Antasari)', 'koridor', 'Jalur Koridor 12', NULL, NULL, 18, 'active', '06:00-18:00', '2025-11-26 12:21:32', '2025-11-26 12:21:32'),
(15, 'Koridor 13 (Trisakti - Sudimampir (Via Lingkar Selatan))', 'koridor', 'Jalur Koridor 13', NULL, NULL, 18, 'active', '06:00-18:00', '2025-11-26 12:21:32', '2025-11-26 12:21:32');

-- --------------------------------------------------------

--
-- Table structure for table `petugas_assignments`
--

CREATE TABLE `petugas_assignments` (
  `id` int NOT NULL,
  `petugas_id` int NOT NULL,
  `location_id` int NOT NULL,
  `shift_start` time NOT NULL,
  `shift_end` time NOT NULL,
  `days_of_week` varchar(20) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `assigned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `id` int NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text NOT NULL,
  `setting_type` varchar(50) NOT NULL DEFAULT 'string',
  `description` text,
  `is_editable` tinyint(1) NOT NULL DEFAULT '1',
  `updated_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `petugas_id` int NOT NULL,
  `type` varchar(25) NOT NULL,
  `description` text,
  `bottles_count` int DEFAULT NULL,
  `bottle_type` varchar(255) DEFAULT NULL,
  `tickets_change` int NOT NULL,
  `points_earned` int DEFAULT '0',
  `location` varchar(255) DEFAULT NULL,
  `status` enum('pending','completed','cancelled') DEFAULT 'completed',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `petugas_id`, `type`, `description`, `bottles_count`, `bottle_type`, `tickets_change`, `points_earned`, `location`, `status`, `created_at`) VALUES
(5, 9, 8, 'bottle_exchange', 'Tukar 4 botol jumbo', 4, 'jumbo', 1, 20, '-', 'completed', '2025-09-23 02:48:39'),
(6, 9, 8, 'bottle_exchange', 'Tukar 20 botol jumbo', 20, 'jumbo', 6, 120, '-', 'completed', '2025-09-23 02:59:41'),
(7, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 2', 'completed', '2025-09-23 03:52:35'),
(8, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 2', 'completed', '2025-09-23 03:52:38'),
(9, 10, 8, 'bottle_exchange', 'Tukar 24 botol jumbo', 24, 'jumbo', 8, 160, '-', 'completed', '2025-09-23 05:41:46'),
(10, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-09-23 13:39:59'),
(11, 10, 8, 'bottle_exchange', 'Tukar 8 botol jumbo', 8, 'jumbo', 2, 40, '-', 'completed', '2025-09-24 00:02:25'),
(12, 10, 8, 'bottle_exchange', 'Tukar 6 botol jumbo', 6, 'jumbo', 2, 40, '-', 'completed', '2025-09-24 00:45:33'),
(13, 10, 8, 'bottle_exchange', 'Tukar 10 botol jumbo', 10, 'jumbo', 3, 60, '-', 'completed', '2025-09-24 00:45:40'),
(14, 10, 8, 'bottle_exchange', 'Tukar 9 botol jumbo', 9, 'jumbo', 3, 60, '-', 'completed', '2025-09-24 01:09:02'),
(15, 10, 8, 'bottle_exchange', 'Tukar 17 botol jumbo', 17, 'jumbo', 5, 100, '-', 'completed', '2025-09-24 06:23:14'),
(16, 10, 8, 'bottle_exchange', 'Tukar 11 botol sedang', 11, 'sedang', 2, 30, '-', 'completed', '2025-09-24 06:23:14'),
(17, 10, 8, 'bottle_exchange', 'Tukar 10 botol kecil', 10, 'kecil', 1, 10, '-', 'completed', '2025-09-24 06:23:14'),
(18, 10, 8, 'bottle_exchange', 'Tukar 10 botol jumbo', 10, 'jumbo', 3, 60, '-', 'completed', '2025-09-24 07:49:03'),
(19, 10, 8, 'bottle_exchange', 'Tukar 5 botol jumbo', 5, 'jumbo', 1, 20, '-', 'completed', '2025-09-25 04:02:57'),
(20, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 2', 'completed', '2025-09-25 04:26:32'),
(21, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 2', 'completed', '2025-09-25 04:26:34'),
(22, 10, 8, 'bottle_exchange', 'Tukar 4 botol jumbo', 4, 'jumbo', 1, 20, '-', 'completed', '2025-09-25 04:31:46'),
(23, 10, 8, 'bottle_exchange', 'Tukar 10 botol kecil', 10, 'kecil', 1, 10, '-', 'completed', '2025-09-25 04:31:46'),
(24, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 2', 'completed', '2025-09-25 04:33:17'),
(25, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 2', 'completed', '2025-09-25 04:33:17'),
(26, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 2', 'completed', '2025-09-25 04:33:17'),
(27, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 2', 'completed', '2025-09-25 04:33:18'),
(28, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 2', 'completed', '2025-09-25 04:33:18'),
(29, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 2', 'completed', '2025-09-25 04:33:20'),
(30, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-09-27 08:33:44'),
(31, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-09-27 08:33:44'),
(32, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-09-27 08:33:45'),
(33, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-09-27 08:33:45'),
(34, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-09-27 08:33:45'),
(35, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-09-27 08:33:45'),
(36, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-09-27 08:33:46'),
(37, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-09-27 08:33:46'),
(38, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-09-27 08:33:46'),
(39, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-09-27 08:33:47'),
(40, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-09-27 08:33:47'),
(41, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-09-27 08:33:47'),
(42, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-09-27 08:33:48'),
(43, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-09-27 08:33:48'),
(44, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-09-27 08:33:48'),
(45, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-09-27 08:33:48'),
(46, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-09-27 08:33:48'),
(47, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-09-27 08:33:49'),
(48, 10, 8, 'bottle_exchange', 'Tukar 4 botol jumbo', 4, 'jumbo', 1, 20, '-', 'completed', '2025-10-03 09:27:37'),
(49, 10, 8, 'bottle_exchange', 'Tukar 21 botol jumbo', 21, 'jumbo', 7, 140, '-', 'completed', '2025-10-07 00:59:52'),
(50, 10, 8, 'bottle_exchange', 'Tukar 10 botol jumbo', 10, 'jumbo', 10, 0, '-', 'completed', '2025-10-09 03:06:28'),
(51, 10, 8, 'bottle_exchange', 'Tukar 10 botol jumbo', 10, 'jumbo', 10, 0, '-', 'completed', '2025-10-09 03:10:31'),
(52, 10, 8, 'bottle_exchange', 'Tukar 10 botol jumbo', 10, 'jumbo', 10, 0, '-', 'completed', '2025-10-09 03:15:21'),
(53, 10, 8, 'bottle_exchange', 'Tukar 10 botol jumbo', 10, 'jumbo', 10, 0, '-', 'completed', '2025-10-09 03:15:23'),
(54, 10, 8, 'bottle_exchange', 'Tukar 81 botol sedang', 81, 'sedang', 10, 0, '-', 'completed', '2025-10-09 03:15:43'),
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
(74, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-10-15 02:10:34'),
(75, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-10-15 02:10:35'),
(76, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-10-15 02:10:35'),
(77, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-10-15 02:10:35'),
(78, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-10-15 02:10:36'),
(79, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-10-15 02:10:36'),
(80, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-10-15 02:10:36'),
(81, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-10-15 02:10:37'),
(82, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-10-15 02:10:37'),
(83, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-10-15 02:10:38'),
(84, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-10-15 02:10:38'),
(85, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-10-15 02:10:38'),
(86, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1', 'completed', '2025-10-15 02:10:39'),
(87, 10, 8, 'bottle_exchange', 'Tukar 10 botol jumbo', 10, 'jumbo', 10, 1, NULL, 'completed', '2025-10-15 02:12:10'),
(88, 10, 8, 'bottle_exchange', 'Tukar 10 botol jumbo', 10, 'jumbo', 10, 1, NULL, 'completed', '2025-10-15 04:25:14'),
(89, 10, 8, 'bottle_exchange', 'Tukar 8 botol jumbo', 8, 'jumbo', 8, 1, NULL, 'completed', '2025-10-15 04:29:22'),
(90, 10, 8, 'bottle_exchange', 'Tukar 4 botol jumbo', 4, 'jumbo', 4, 0, NULL, 'completed', '2025-10-15 04:34:12'),
(91, 10, 8, 'bottle_exchange', 'Tukar 1 botol jumbo', 1, 'jumbo', 1, 0, NULL, 'completed', '2025-10-15 04:36:26'),
(92, 10, 8, 'bottle_exchange', 'Tukar 4 botol jumbo', 4, 'jumbo', 4, 1, NULL, 'completed', '2025-10-15 04:40:06'),
(93, 9, 8, 'bottle_exchange', 'Tukar 9 botol jumbo', 9, 'jumbo', 9, 1, NULL, 'completed', '2025-10-15 04:41:09'),
(94, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 2', 'completed', '2025-10-15 04:42:35'),
(95, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 2', 'completed', '2025-10-15 04:42:36'),
(96, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 2', 'completed', '2025-10-15 04:42:37'),
(97, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 2', 'completed', '2025-10-15 04:42:37'),
(98, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 2', 'completed', '2025-10-15 04:42:37'),
(99, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 2', 'completed', '2025-10-15 04:42:38'),
(100, 9, 8, 'bottle_exchange', 'Tukar 20 botol cup', 20, 'cup', 1, 0, NULL, 'completed', '2025-10-15 04:43:49'),
(101, 9, 8, 'bottle_exchange', 'Tukar 14 botol jumbo', 14, 'jumbo', 14, 2, NULL, 'completed', '2025-10-15 04:46:27'),
(102, 9, 8, 'bottle_exchange', 'Tukar 7 botol jumbo', 7, 'jumbo', 7, 0, NULL, 'completed', '2025-10-15 04:47:25'),
(103, 9, 8, 'bottle_exchange', 'Tukar 2 botol jumbo', 2, 'jumbo', 2, 1, 'Terminal Antasari', 'completed', '2025-10-15 04:58:24'),
(104, 9, 8, 'bottle_exchange', 'Tukar 2 botol jumbo', 2, 'jumbo', 2, 0, 'Terminal Antasari', 'completed', '2025-10-15 05:00:02'),
(105, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 3 (Terminal Antasari - Jembatan Bromo)', 'completed', '2025-10-15 05:36:53'),
(106, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 3 (Terminal Antasari - Jembatan Bromo)', 'completed', '2025-10-15 05:36:53'),
(107, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 3 (Terminal Antasari - Jembatan Bromo)', 'completed', '2025-10-15 05:36:53'),
(108, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 3 (Terminal Antasari - Jembatan Bromo)', 'completed', '2025-10-15 05:36:54'),
(109, 10, 8, 'bottle_exchange', 'Tukar 18 botol jumbo', 18, 'jumbo', 18, 2, 'Terminal Antasari', 'completed', '2025-10-15 06:44:55'),
(110, 10, 8, 'bottle_exchange', 'Tukar 3 botol jumbo', 3, 'jumbo', 3, 1, 'Terminal KM 0', 'completed', '2025-10-17 23:47:02'),
(111, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-10-17 23:47:26'),
(112, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-10-17 23:47:27'),
(113, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-10-17 23:47:27'),
(114, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-10-17 23:47:27'),
(115, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-10-17 23:47:29'),
(116, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-10-17 23:47:29'),
(117, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-10-17 23:47:30'),
(118, 10, 8, 'bottle_exchange', 'Tukar 8 botol sedang', 8, 'sedang', 1, 0, 'Terminal KM 0', 'completed', '2025-10-18 01:15:51'),
(119, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-10-18 01:16:08'),
(120, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-10-18 01:16:08'),
(121, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-10-18 01:16:08'),
(122, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-10-18 01:16:08'),
(123, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-10-18 01:16:08'),
(124, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-10-18 01:16:09'),
(125, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-10-18 01:16:09'),
(126, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-10-18 01:16:09'),
(127, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-10-18 01:16:09'),
(128, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-10-18 01:16:10'),
(129, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-10-18 01:16:10'),
(130, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-10-18 01:16:10'),
(131, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-10-18 01:16:10'),
(132, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-10-18 01:16:11'),
(133, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-10-18 01:16:11'),
(134, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-10-18 01:16:12'),
(135, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-10-18 01:16:17'),
(136, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 10 (RS Ansari Saleh - Trisakti (Via Kuin))', 'completed', '2025-10-20 12:57:59'),
(137, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 10 (RS Ansari Saleh - Trisakti (Via Kuin))', 'completed', '2025-10-20 12:58:00'),
(138, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 10 (RS Ansari Saleh - Trisakti (Via Kuin))', 'completed', '2025-10-20 12:58:00'),
(139, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 10 (RS Ansari Saleh - Trisakti (Via Kuin))', 'completed', '2025-10-20 12:58:01'),
(140, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 10 (RS Ansari Saleh - Trisakti (Via Kuin))', 'completed', '2025-10-20 12:58:01'),
(141, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 10 (RS Ansari Saleh - Trisakti (Via Kuin))', 'completed', '2025-10-20 12:58:02'),
(142, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 10 (RS Ansari Saleh - Trisakti (Via Kuin))', 'completed', '2025-10-20 12:58:02'),
(143, 10, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 10 (RS Ansari Saleh - Trisakti (Via Kuin))', 'completed', '2025-10-20 12:58:02'),
(144, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Terminal KM 0', 'completed', '2025-11-27 01:50:18'),
(145, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Terminal KM 0', 'completed', '2025-11-27 01:50:18'),
(146, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Terminal KM 0', 'completed', '2025-11-27 01:50:19'),
(147, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Terminal KM 0', 'completed', '2025-11-27 01:50:19'),
(148, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Terminal KM 0', 'completed', '2025-11-27 01:50:20'),
(149, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Terminal KM 0', 'completed', '2025-11-27 01:50:20'),
(150, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Terminal KM 0', 'completed', '2025-11-27 01:50:20'),
(151, 9, 8, 'bottle_exchange', 'Tukar 1 botol jumbo', 1, 'jumbo', 1, 0, 'Terminal Antasari', 'completed', '2025-11-27 02:45:59'),
(152, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-11-27 02:46:42'),
(153, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-11-27 02:46:44'),
(154, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-11-27 02:46:44'),
(155, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-11-27 02:46:45'),
(156, 9, 8, 'ticket_usage', 'Menggunakan 1 tiket untuk transportasi', NULL, NULL, -1, 0, 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', 'completed', '2025-11-27 02:53:56');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
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
) ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `nik`, `password`, `name`, `role`, `phone`, `address`, `qr_code`, `tickets_balance`, `points`, `status`, `created_at`, `updated_at`) VALUES
(1, 'admin@ecotiket.com', NULL, 'admin123', 'Admin Eco-Tiket', 'admin', '0811-1111-1111', 'Jl. Admin No. 1, Banjarmasin', 'ECO-ADMIN-1758585577-10D005', 0, 0, 'active', '2025-09-22 01:31:14', '2025-09-22 23:59:37'),
(7, 'admin@sistemecotiket.com', NULL, '$2b$10$t1KxngBXG9WO/aZ3Ef7UkOHp7CSmGdL83CepLMDwzOv2JcLOKwfHu', 'Admin Tbekula', 'admin', '085754513889', '-', 'ECO-ADMIN-002', 0, 0, 'active', '2025-09-22 05:51:48', '2025-10-19 06:41:42'),
(8, 'husin@ecotiket.com', NULL, '$2b$10$R.LC/kedECb9iU70fXZ0keV5MqhE8T7fFgyxs/6CII0VZeGs.lPp.', 'Husin', 'petugas', '08123456789', '-', 'ECO-OFFICER-1758585577-4CF8EB', 0, 0, 'active', '2025-09-22 06:30:00', '2025-09-22 23:59:37'),
(9, NULL, '6305050678934256', '$2b$10$Ew1w05dZdSM/UZ6ovb6jRurWhiSayFh38C2U5rAM.6.Yfr.g9smPq', 'Amat Plastik', 'penumpang', '087659812300', 'Sambang Lehong', 'ECO-USER-001', 22, 145, 'active', '2025-09-23 00:01:41', '2025-11-27 02:53:56'),
(10, NULL, '1234567890123454', '$2b$10$J00Y67Lg2voAoWVrE7afZO5nxSKDfJ7FN/5c7d4qoT3XfYHhtuI2e', 'Toha', 'penumpang', '081234567891', 'Tamban', 'ECO-USER-002', 29, 785, 'active', '2025-09-23 05:01:00', '2025-10-20 12:58:02'),
(11, NULL, '6300000000000000', '$2b$10$7PazndGCGMXIXB1hmrB8kumKFDpo4n/iA7vqDXVP7p9yCBg0cU8e6', 'Riska Maulida', 'penumpang', '085353535353', 'Hulu Sungai', 'ECO-USER-003', 0, 0, 'active', '2025-09-24 05:14:26', '2025-09-24 05:15:21'),
(12, NULL, '6300000000000012', '$2b$10$0QjsO29P3T.sD3paZ60ieOIlE33n5bL73XJGXkH9zCu0sDwof0f0C', 'User Er', 'penumpang', '08123456743', '-', 'ECO-USER-004', 0, 0, 'inactive', '2025-09-25 04:42:55', '2025-09-25 04:51:25'),
(13, NULL, '1234567890123431', '$2b$10$3HLFG0hodqRYUJKPlOul5ulDCgigiatZ3d0gCUofz1nL5IG3vkSNS', 'Adit', 'penumpang', '08123456700', '-', 'ECO-USER-005', 0, 0, 'active', '2025-09-27 08:31:29', '2025-09-27 08:31:29'),
(14, NULL, '6300000000000885', '$2b$10$YDKbg3lFsHX/dFr1gGv4u.66ncs/AW0v1DAP6FexrExo6hIVo4ACe', 'Hendra', 'penumpang', '081234567871', '-', 'ECO-USER-006', 0, 0, 'active', '2025-10-03 09:25:38', '2025-10-03 09:25:38'),
(15, NULL, '1234567890123333', '$2b$10$J7WsqJFsuYv5dVS58GhCNek4WiTNnBXa0R2bv8mcgiiHApJrPVQFa', 'Rubblee', 'penumpang', '081234567822', '-', 'ECO-USER-007', 0, 0, 'active', '2025-10-17 23:43:38', '2025-10-17 23:43:38'),
(16, 'wahyu@gmail.com', NULL, '$2b$10$cOo3ZUmUcGYZOrm0BSJ0DO85P3V/kwOPGmJP0QLdYJgfx5FOJpWkm', 'Wahyu', 'petugas', '081234567823', '-', 'ECO-OFFICER-001', 0, 0, 'active', '2025-10-18 00:41:37', '2025-10-18 00:41:37'),
(18, NULL, '1234567890123459', '$2b$10$soOnVxRUO.PiCEfyqGErEukDZ6U2hdq0keZ94ksHM02NOD08cAnbW', 'Bahris', 'penumpang', '08123456789', '-', 'ECO-USER-008', 0, 0, 'active', '2025-10-20 01:12:58', '2025-10-20 01:12:58'),
(19, NULL, '1111111111111222', '$2b$10$ieOXLsUMNZry6i/gUMrtpOP61uiThY.ORRnV/zDzVMs5n0jVNFYG6', 'Asep', 'penumpang', '085757575758', '-', 'ECO-USER-009', 0, 0, 'active', '2025-10-20 02:23:17', '2025-10-20 02:23:17'),
(20, NULL, '1111111111111233', '$2b$10$SYq79Wxt1ytkFNM/PlFTSuAcSs8yXRWqjRQQ6sEoIx/bcgGXcA17y', 'Nunky', 'penumpang', '085757575753', '-', 'ECO-USER-010', 0, 0, 'active', '2025-10-20 05:37:20', '2025-10-20 05:37:20'),
(21, NULL, '1234567890123452', '$2b$10$YFjDg6SfCjOTT25GFQV4FuhARSxNYmmAv5qyFEse3BtbJTKlSTKG2', 'Rahmat', 'penumpang', '081234567899', 'Margasari', 'ECO-USER-011', 0, 0, 'active', '2025-11-15 00:53:23', '2025-11-15 00:53:23');

-- --------------------------------------------------------

--
-- Table structure for table `users_backup`
--

CREATE TABLE `users_backup` (
  `id` int NOT NULL DEFAULT '0',
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
-- Dumping data for table `users_backup`
--

INSERT INTO `users_backup` (`id`, `email`, `nik`, `password`, `name`, `role`, `phone`, `address`, `qr_code`, `tickets_balance`, `points`, `status`, `created_at`, `updated_at`) VALUES
(1, 'admin@ecotiket.com', NULL, 'admin123', 'Admin Eco-Tiket', 'admin', '0811-1111-1111', 'Jl. Admin No. 1, Banjarmasin', 'ECO-ADMIN-001', 0, 0, 'active', '2025-09-22 01:31:14', '2025-09-22 05:50:45'),
(2, 'petugas1@ecotiket.com', NULL, '$2b$10$rQZ1vKzQ8mXVf4sY2hN8xuOYl9pK3mN7qR5tU8wA6bC9dE0fG1hI2', 'Petugas Terminal Antasari', 'petugas', '0812-2222-2222', 'Terminal Antasari, Banjarmasin', 'ECO-OFFICER-001', 0, 0, 'active', '2025-09-22 01:31:14', '2025-09-22 01:31:14'),
(3, 'petugas2@ecotiket.com', NULL, '$2b$10$rQZ1vKzQ8mXVf4sY2hN8xuOYl9pK3mN7qR5tU8wA6bC9dE0fG1hI2', 'Petugas Terminal KM 0', 'petugas', '0813-3333-3333', 'Terminal KM 0, Banjarmasin', 'ECO-OFFICER-002', 0, 0, 'active', '2025-09-22 01:31:14', '2025-09-22 01:31:14'),
(4, NULL, '6371012345678901', '$2b$10$rQZ1vKzQ8mXVf4sY2hN8xuOYl9pK3mN7qR5tU8wA6bC9dE0fG1hI2', 'Ahmad Rizki', 'penumpang', '0814-4444-4444', 'Jl. Lambung Mangkurat No. 15, Banjarmasin', 'ECO-USER-001', 5, 150, 'active', '2025-09-22 01:31:14', '2025-09-22 01:31:14'),
(5, NULL, '6371012345678902', '$2b$10$rQZ1vKzQ8mXVf4sY2hN8xuOYl9pK3mN7qR5tU8wA6bC9dE0fG1hI2', 'Siti Nurhaliza', 'penumpang', '0815-5555-5555', 'Jl. Ahmad Yani No. 25, Banjarmasin', 'ECO-USER-002', 3, 200, 'active', '2025-09-22 01:31:14', '2025-09-22 01:31:14'),
(6, NULL, '6371012345678903', '$2b$10$rQZ1vKzQ8mXVf4sY2hN8xuOYl9pK3mN7qR5tU8wA6bC9dE0fG1hI2', 'Budi Santoso', 'penumpang', '0816-6666-6666', 'Jl. Pangeran Antasari No. 35, Banjarmasin', 'ECO-USER-003', 8, 100, 'active', '2025-09-22 01:31:14', '2025-09-22 01:31:14'),
(7, 'admin@sistemecotiket.com', NULL, '$2b$10$t1KxngBXG9WO/aZ3Ef7UkOHp7CSmGdL83CepLMDwzOv2JcLOKwfHu', 'Admin-Tbekula', 'admin', '085754513889', '-', 'ECO-ADMIN-002', 0, 0, 'active', '2025-09-22 05:51:48', '2025-09-22 05:51:48'),
(8, 'husin@ecotiket.com', NULL, '$2b$10$R.LC/kedECb9iU70fXZ0keV5MqhE8T7fFgyxs/6CII0VZeGs.lPp.', 'Husin', 'petugas', '08123456789', '-', 'ECO-OFFICER-003', 0, 0, 'active', '2025-09-22 06:30:00', '2025-09-22 06:30:00'),
(9, NULL, '1234567890123456', '$2b$10$CYn5oINOlwkJ287U69Zm.u48fr2TKWSWMCJnOjYGOrRcjEfjsIwr6', 'Fajar', 'penumpang', '08123456789', '-', 'ECO-USER-004', 0, 0, 'active', '2025-09-22 06:35:02', '2025-09-22 06:35:02'),
(10, NULL, '2435475859425795', '$2b$10$UuBuYaqFkaNksEWbgmBwjOle1QF8M9QWO2Mx3CSSw0Wkak8wzefD.', 'Rubblee', 'penumpang', '081234567890', 'asdfghjk', 'ECO-USER-005', 0, 0, 'active', '2025-09-22 06:37:04', '2025-09-22 06:37:04'),
(11, NULL, '1234567890123457', '$2b$10$DxOgZtiD7AJQH.yoqre1i.WoPDqrOXS/tqw9Yn4x17Qijp3Z.2GEq', 'Aruf', 'penumpang', '081243658709', 'Anjir', 'ECO-USER-006', 0, 0, 'active', '2025-09-22 07:40:37', '2025-09-22 07:40:37');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_announcements_is_active` (`is_active`);

--
-- Indexes for table `bottle_rates`
--
ALTER TABLE `bottle_rates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gallery`
--
ALTER TABLE `gallery`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_gallery_is_active` (`is_active`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `petugas_assignments`
--
ALTER TABLE `petugas_assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `petugas_id` (`petugas_id`),
  ADD KEY `location_id` (`location_id`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`),
  ADD KEY `updated_by` (`updated_by`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_transactions_user_id` (`user_id`),
  ADD KEY `idx_transactions_petugas_id` (`petugas_id`),
  ADD KEY `idx_transactions_created_at` (`created_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
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
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `bottle_rates`
--
ALTER TABLE `bottle_rates`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `gallery`
--
ALTER TABLE `gallery`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `petugas_assignments`
--
ALTER TABLE `petugas_assignments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `system_settings`
--
ALTER TABLE `system_settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=157;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `announcements_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `gallery`
--
ALTER TABLE `gallery`
  ADD CONSTRAINT `gallery_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `petugas_assignments`
--
ALTER TABLE `petugas_assignments`
  ADD CONSTRAINT `petugas_assignments_ibfk_1` FOREIGN KEY (`petugas_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `petugas_assignments_ibfk_2` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`);

--
-- Constraints for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD CONSTRAINT `system_settings_ibfk_1` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`petugas_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
