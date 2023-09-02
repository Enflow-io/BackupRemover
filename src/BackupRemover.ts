const path = require("path");
const fs = require("fs");
const { DateTime } = require("luxon");

export default class BackupRemover {
    private fileNameTemplate: string;

    constructor(private readonly backupPath: string) {
        this.backupPath = process.env.BACKUP_PATH || path.join(__dirname, "..", "backups");
        this.fileNameTemplate = process.env.FILE_NAME_TEMPLATE || "backup-*.tar.gz";
    }

    public removeBackup(): void {
        console.log(`Removing backup from ${this.backupPath}`);
        const files = this.getFilesList();
        console.log(files);
    }

    public getDateFromFileName(fileName: string): any {
        const template = this.fileNameTemplate.replace("*", "(.*)");
        const extracted = fileName.match(new RegExp(template));
        if (extracted && extracted[1]) {
            const date = DateTime.fromFormat(extracted[1], "yyyy-MM-dd");
            return date;
        } else {
            console.log(fileName)
            throw new Error("Error parsing file name");
        }
    }

    private getFilesList(): string[] {
        fs.readdir(this.backupPath, (err: any, files: string[]) => {
            if (err) {
                console.log(err);
                console.log(err.message);
                throw new Error("Error reading backup directory" + err);
                return [];
            } else {
                console.log(files);
                return files;
            }
        });
        return [];
    }
}
