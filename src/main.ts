const dotenv = require('dotenv');
dotenv.config();
import BackupRemover from "./BackupRemover";

const backupRemover = new BackupRemover(process.env.BACKUP_PATH || '');
const date = backupRemover.getDateFromFileName('backup-2021-09-01.tar.gz')
console.log(date.toLocaleString());