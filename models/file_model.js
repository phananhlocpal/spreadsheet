import {Data} from './data_model.js';

export class File extends Data {
    constructor() {
        super();
    }
    
  // Function to read and display CSV file content
    readCSVFile(file, callback) {
        let reader = new FileReader();
        
        reader.onload = function(e) {
            let contents = e.target.result;
            let fileName = file.name.split('.')[0];
            let fileData = Papa.parse(contents).data;
        
            console.log(fileData);
            document.getElementById("app-file-name").textContent = fileName;
            let result = {
                fileName: fileName,
                fileData: fileData
            }
            callback(result);
        };
        reader.readAsText(file);
    }
  
  // Function to read and display JSON file content
    readJSONFile(file, callback) {
        let reader = new FileReader();
        let self = this; 

        reader.onload = function(e) {
            let contents = e.target.result;
            let jsonData = JSON.parse(contents);
            let fileData = self.transformJsontoCSV(jsonData);
        
            document.getElementById("app-file-name").textContent = file.name;
            let result = {
                fileName: file.name,
                fileData: fileData
            }
            callback(result);
        };
        reader.readAsText(file);
    }
  
    downloadDataAsCSV(csvStr, document_title) {
        // Create a blob of the data
        var fileToSave = new Blob([csvStr], {
            type: 'text/csv',
            name: document_title + ".csv"
        });
    
        if(this.isIE()){
          navigator.msSaveBlob(fileToSave, document_title + ".csv");
        } else {
          var link = document.createElement('a');
          link.className = 'downloadLink';
          link.href = URL.createObjectURL(fileToSave);
          link.setAttribute('download', document_title + ".csv");
    
          // required for FF (todo: test)
          link.textContent = 'Click here to download';
          document.body.appendChild(link);
          
          // auto-download
          link.click();
    
          // remove link
          document.body.removeChild(link);
        }
    }

    downloadDataAsJSON(jsonData, document_title) {
        var jsonStr = JSON.stringify(jsonData, null, 2);
        var fileToSave = new Blob([jsonStr], {
          type: 'application/json',
          name: document_title + ".json"
        });
      
        if (this.isIE()) {
          navigator.msSaveBlob(fileToSave, document_title + ".json");
        } else {
          var link = document.createElement('a');
          link.className = 'downloadLink';
          link.href = URL.createObjectURL(fileToSave);
          link.setAttribute('download', document_title + ".json");
          link.textContent = 'Click here to download JSON';
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
    }

    
    isIE(){

        /**
         * detect IE
         * returns version of IE
         * or false; if browser is not Internet Explorer
        
        * returns false for Edge Chromium
        */
    
        var ua = window.navigator.userAgent;
        
        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }
        
        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }
        
        // other browser
        return false;
    
    }
}