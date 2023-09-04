const path = require("path");
const fs = require("fs");
import { DateTime } from "luxon";
import { periodToSeconds } from "./utils";

export default class BackupRemover {
    private fileNameTemplate: string;
    // private dailyBackupsDate: DateTime;

    constructor(private readonly backupPath: string) {
        this.backupPath = process.env.BACKUP_PATH || path.join(__dirname, "..", "backups");
        this.fileNameTemplate = process.env.FILE_NAME_TEMPLATE || "backup-*.tar.gz";
        
        if(!process.env.DAILY_BACKUPS_PERIOD){
            throw new Error("DAILY_BACKUPS_DATE is not set");
        }
        console.log(periodToSeconds(process.env.DAILY_BACKUPS_PERIOD))
        // this.dailyBackupsDate = DateTime.fromJSDate(new Date()).minus({
        //     days: parseInt(process.env.DAILY_BACKUPS_DATE)
        // })
    }

    public remove(): void {
        console.log(`Removing backup from ${this.backupPath}`);
        const files = this.getFilesList().map((file: string) => {
            return {
                filename: file,
                date: this.getDateFromFileName(file),
            }
        }).sort((a, b) => {
            return a.date.toMillis() - b.date.toMillis();
        });

        console.log(files)
    }

    public getDateFromFileName(fileName: string): DateTime {
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
