/*
  Warnings:

  - The values [Pending,Confirmed,Cancelled] on the enum `Booking_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `booking` MODIFY `status` ENUM('PENDING', 'CONFIRMED', 'CANCELLED') NOT NULL;
