import UserLogin from '../../models/User.js';
import hashPassword from '../../utils/passwordHashing.js';
import { sequelize } from '../../config/db.js';
import { Sequelize } from 'sequelize';

import fs from 'fs';
import { parse } from 'csv-parse/sync';

async function rehashFromCSVSkippingDuplicates() {
  const csvData = fs.readFileSync('./data_raw/members.csv', 'utf-8');

  // Parse CSV into objects
  const records = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
  });

  const seenUsernames = new Set();
  const uniqueRecords = [];

  for (const row of records) {
    const username = row.username?.trim();
    const password = row.password?.trim();

    if (!username || !password || seenUsernames.has(username)) {
      continue;
    }

    seenUsernames.add(username);
    uniqueRecords.push({ username, password });
  }

  const total = uniqueRecords.length;
  let updatedCount = 0;
  let skippedCount = 0;

  const transaction = await sequelize.transaction();
  try {
    for (let i = 0; i < total; i++) {
      const { username, password } = uniqueRecords[i];

      const user = await UserLogin.findOne({ where: { username }, transaction });
      if (!user) {
        skippedCount++;
        console.log(`⚠️  Skipped (user not found): ${username} (${i + 1}/${total})`);
        continue;
      }

      const newHash = await hashPassword(password);
      await user.update({ password_hash: newHash }, { transaction });
      updatedCount++;

      if ((i + 1) % 10 === 0 || i === total - 1) {
        const percent = ((i + 1) / total * 100).toFixed(1);
        console.log(`🔄 Progress: ${i + 1}/${total} (${percent}%) - Updated: ${updatedCount} - Skipped: ${skippedCount}`);
      }
    }

    await transaction.commit();
    console.log(`✅ Done. Total updated: ${updatedCount}, Skipped: ${skippedCount}`);
  } catch (error) {
    await transaction.rollback();
    console.error('❌ Failed to update passwords:', error);
  }
}


rehashFromCSVSkippingDuplicates();
