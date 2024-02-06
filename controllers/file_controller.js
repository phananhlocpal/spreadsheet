import * as fileModel from '../models/file_model.js';
import * as dataModel from '../models/data_model.js';
import * as notiFrame from '../views/noti.js';

function handleFileResult(result) {
    return {
        fileName: result.fileName,
        fileData: result.fileData
    }
}

// Function to read File 
export function readSingleFile(e) {
    return new Promise((resolve, reject) => {
        var file = e.target.files[0];
        if (!file) {
            notiFrame.noti('Error', 'This is not a File!');
            reject('No file selected');
            return;
        }

        let fileClass = new fileModel.File();

        if (file.name.endsWith(".csv")) {
            fileClass.readCSVFile(file, function (result) {
                let processedResult = handleFileResult(result);
                resolve(processedResult);
            });
        } else if (file.name.endsWith(".json")) {
            fileClass.readJSONFile(file, function (result) {
                let processedResult = handleFileResult(result);
                resolve(processedResult);
            });
        } else {
            notiFrame.error('Error', 'Unsupported file format.');
            reject('Unsupported file format');
        }
    });
}

export function downloadDataAsCSV(grid, document_title) {
    var dataClass = new dataModel.Data(grid);
    let fileClass = new fileModel.File();
    fileClass.downloadDataAsCSV(dataClass.getCSVData(), document_title);

}

export function downloadDataAsJSON(grid, document_title) {
    var dataClass = new dataModel.Data(grid);
    let fileClass = new fileModel.File();
    fileClass.downloadDataAsJSON(dataClass.getJSONData(), document_title);

}