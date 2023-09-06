const path = require("path");
const fs = require("fs");
import { DateTime } from "luxon";
import { periodToSeconds } from "./utils";

export default class BackupRemover {
    private fileNameTemplate: string;

    private freshBackupsDate: DateTime;
    // private dailyBackupsDate: DateTime;

    constructor(private readonly backupPath: string) {
        this.backupPath = process.env.BACKUP_PATH || path.join(__dirname, "..", "backups");
        this.fileNameTemplate = process.env.FILE_NAME_REGEXP || "-[^-]+-(*+).tar.gz";

        if (!process.env.DAILY_BACKUPS_PERIOD) {
            throw new Error("DAILY_BACKUPS_DATE is not set");
        }

        this.freshBackupsDate = DateTime.fromJSDate(new Date()).minus({
            seconds: periodToSeconds(process.env.DAILY_BACKUPS_PERIOD),
        });
        

        // this.dailyBackupsDate = DateTime.fromJSDate(new Date()).minus({
        //     days: parseInt(process.env.DAILY_BACKUPS_DATE)
        // })
    }

    public remove(): void {
        console.log(`Removing backup from ${this.backupPath}`);
        const files = this.getFilesList()
            .map((file: string) => {
                return {
                    filename: file,
                    date: this.getDateFromFileName(file),
                };
            })
            .sort((a, b) => {
                return a.date.toMillis() - b.date.toMillis();
            });

        for (let file of files) {
            console.log(this.freshBackupsDate.toString());
            // console.log(file.date)
            console.log('===================')
            if (file.date < this.freshBackupsDate) {
                console.log(`Removing ${file.filename}`);
                // fs.unlink(path.join(this.backupPath, file.filename), (err: any) => {
                //     if (err) {
                //         console.log(err);
                //         throw new Error("Error removing file" + err);
                //     }
                // });
            } else {
                console.log(`Keeping ${file.filename}`);
            }
        }
    }

    public getDateFromFileName(fileName: string): DateTime {
        const template = this.fileNameTemplate//.replace("*", "(.*)");
        const dateFormat = process.env.DATE_FORMAT || "dd.MM.yyyy";
        const extracted = fileName.match(new RegExp(template));
        const regexpResultIndex = parseInt(process.env.REGEXP_RESULT_INDEX || "1")
        if (extracted && extracted[regexpResultIndex]) {
            const date = DateTime.fromFormat(extracted[regexpResultIndex], dateFormat);
            console.log(date.toLocaleString())
            return date;
        } else {
            console.log(fileName);
            throw new Error("Error parsing file name");
        }
    }

    private getFilesList(): string[] {
        return fs.readdirSync(this.backupPath, (err: any, filesLocal: string[]) => {
            if (err) {
                console.log(err);
                console.log(err.message);
                throw new Error("Error reading backup directory" + err);
            } else {
                console.log(filesLocal);
                return filesLocal;
            }
        });
    }
}
