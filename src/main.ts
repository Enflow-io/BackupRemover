const dotenv = require('dotenv');
dotenv.config();
import { create } from "domain";
import BackupRemover from "./BackupRemover";
import { createTestFiles } from "./utils";

// const backupRemover = new BackupRemover(process.env.BACKUP_PATH || '');
// const date = backupRemover.getDateFromFileName('backup-2021-09-01.tar.gz')
// console.log(date.toLocaleString());


createTestFiles();