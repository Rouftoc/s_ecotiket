-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 23, 2025 at 11:08 AM
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
(1, 'kecil', 10, 1, 10, 1, '2025-09-22 01:31:14', '2025-09-23 02:17:54'),
(2, 'sedang', 5, 1, 15, 1, '2025-09-22 01:31:14', '2025-09-23 02:17:54'),
(3, 'jumbo', 3, 1, 20, 1, '2025-09-22 01:31:14', '2025-09-23 02:17:55'),
(4, 'jumbo', 3, 1, 10, 1, '2025-09-23 02:17:54', '2025-09-23 02:17:54'),
(5, 'cup', 15, 1, 3, 1, '2025-09-23 02:17:54', '2025-09-23 02:17:54');

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
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `petugas_id` int NOT NULL,
  `type` enum('bottle_exchange','ticket_usage') NOT NULL,
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
(9, 10, 8, 'bottle_exchange', 'Tukar 24 botol jumbo', 24, 'jumbo', 8, 160, '-', 'completed', '2025-09-23 05:41:46');

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
(2, 'petugas1@ecotiket.com', NULL, '$2b$10$rQZ1vKzQ8mXVf4sY2hN8xuOYl9pK3mN7qR5tU8wA6bC9dE0fG1hI2', 'Petugas Terminal Antasari', 'petugas', '0812-2222-2222', 'Terminal Antasari, Banjarmasin', 'ECO-OFFICER-1758585577-ACB5B6', 0, 0, 'active', '2025-09-22 01:31:14', '2025-09-22 23:59:37'),
(3, 'petugas2@ecotiket.com', NULL, '$2b$10$rQZ1vKzQ8mXVf4sY2hN8xuOYl9pK3mN7qR5tU8wA6bC9dE0fG1hI2', 'Petugas Terminal KM 0', 'petugas', '0813-3333-3333', 'Terminal KM 0, Banjarmasin', 'ECO-OFFICER-1758585577-A54AE4', 0, 0, 'active', '2025-09-22 01:31:14', '2025-09-22 23:59:37'),
(7, 'admin@sistemecotiket.com', NULL, '$2b$10$t1KxngBXG9WO/aZ3Ef7UkOHp7CSmGdL83CepLMDwzOv2JcLOKwfHu', 'Admin-Tbekula', 'admin', '085754513889', '-', 'ECO-ADMIN-002', 0, 0, 'active', '2025-09-22 05:51:48', '2025-09-22 05:51:48'),
(8, 'husin@ecotiket.com', NULL, '$2b$10$R.LC/kedECb9iU70fXZ0keV5MqhE8T7fFgyxs/6CII0VZeGs.lPp.', 'Husin', 'petugas', '08123456789', '-', 'ECO-OFFICER-1758585577-4CF8EB', 0, 0, 'active', '2025-09-22 06:30:00', '2025-09-22 23:59:37'),
(9, NULL, '6305050678934256', '$2b$10$Ew1w05dZdSM/UZ6ovb6jRurWhiSayFh38C2U5rAM.6.Yfr.g9smPq', 'Amat Plastik', 'penumpang', '087659812300', 'Sambang Lehong', 'ECO-USER-001', 5, 140, 'active', '2025-09-23 00:01:41', '2025-09-23 03:52:38'),
(10, NULL, '1234567890123454', '$2b$10$J00Y67Lg2voAoWVrE7afZO5nxSKDfJ7FN/5c7d4qoT3XfYHhtuI2e', 'Toha', 'penumpang', '081234567891', 'Tamban', 'ECO-USER-002', 8, 160, 'active', '2025-09-23 05:01:00', '2025-09-23 05:41:46');

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
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

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
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`petugas_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
