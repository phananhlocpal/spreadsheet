import * as fileController from '../controllers/file_controller.js';
import * as dataController from '../controllers/data_controller.js';

// Declare global variable
var document_title = "untitled";
document.getElementById("app-file-name").textContent = document_title;

// Create DGXL sheet by adding grid to window
window.grid = new DataGridXL("grid", {
  data: [["","",""],["","",""],["","",""]],
  instantActivate: true
});

// ====================================== FILE FUNCTION =====================================================

function displayFileContent(fileName, fileData) {
  // document_data= fileData;
  document_title= fileName;
  grid.setData(fileData);
  grid.selectCells({x: 0, y: 0});
  let grid_component = document.getElementById('grid');
  grid_component.setAttribute("style", "height:100%");
  
}

// If user uploads file => read File 
document.getElementById("file").onchange = function(e) {
  fileController.readSingleFile(e)
    .then(result => {
        console.log(result);
        document_title = result.fileName;
        displayFileContent(result.fileName, result.fileData);
    })
}

window.app = {
  downloadDataAsCSV: function() {
    let document_title = document.getElementById("app-file-name").textContent;
    console.log(document_title);
    fileController.downloadDataAsCSV(grid, document_title);
  },

  downloadDataAsJSON: function() {
    let document_title = document.getElementById("app-file-name").textContent;
    fileController.downloadDataAsJSON(grid, document_title);
  },

  createNew: function() {
    window.grid = new DataGridXL("grid", {
      data: [["","",""],["","",""],["","",""]],
      instantActivate: true
    });
  },

  cleanData: function(document_title) {
    dataController.cleanData(document_title, grid)
      .then(result => {
        displayFileContent(result.fileName, result.fileData)
      })
  }
}

// ========================================== SUB FUNCTION ================================================

window.submodule = {
  undo: function() {
    grid.undo();
  },

  redo: function() {
    grid.redo();
  },

  isValidUrl: function(string) {
    try {
      new URL(string);
    } catch (_) {
      return false;  
    }
    return true;
  },

  // Load WEB data function
  loadRemoteFile: function(url) {
    if (!submodule.isValidUrl(url)) {
      document.getElementById('url-input').classList.add('input-error');
    } else {
      Papa.parse(url, {
        download: true,
        header: true, 
        dynamicTyping: true,
        skipEmptyLines: true, 
        complete: function(results) {
          console.log(results.data); 
          displayFileContent("Data from URL", results.data);
          closeDialog();
        },
        error: function(error) {
          console.error(error.message);
          document.getElementById('url-input').classList.add('input-error');
        }
      });
    }
  },

  // Load CSV String
  parseCSVString: function(str) {
    var parsed_object = Papa.parse(str);

    if(parsed_object.errors.length || parsed_object.aborted){
      document.getElementById('csv-textarea').classList.add('textarea-error');
      // ERROR!
    } else {
      grid.setData(parsed_object.data);
      closeDialog();
      grid.selectCells({x:0,y:0});
    }
  },

  handleKeyDown: function(event) {
    if (event.key === "Enter") {
      let cellInput = document.getElementById("calculateInput");
      let formula = cellInput.value;
      let result = dataController.evaluateFormula(formula, grid);
      cellInput.value = result;
    }
  }
}
