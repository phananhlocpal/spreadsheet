import * as dataModel from '../models/data_model.js';
import * as notiFrame from '../views/noti.js';

function handleFileResult(result) {
    return {
        fileName: result.fileName,
        fileData: result.fileData
    }
}

export function evaluateFormula(formula, grid) {
    let dataClass = new dataModel.Data();
    return dataClass.evaluateFormula(formula, grid);
}

export function cleanData(fileName, grid) {
    return new Promise((resolve, reject) => {
        let dataClass = new dataModel.Data(grid);
        dataClass.cleanData(dataClass.getJSONData(), fileName, function (result) {
            let processedResult = handleFileResult(result);
            resolve(processedResult);
        });
    })
}