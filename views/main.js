
//=============== FUNCTION TO OPERATION DESIGN ================

function showMenu(menuNode){

    menuNode.style.display = "block";
    menuNode.previousElementSibling.setAttribute("onclick", 'hideMenu(this.nextElementSibling);');
  
    // add click-outside listener
    menuNode._clickOutsideToCloseMenu = listeners.clickOutsideToCloseMenu.bind(menuNode);
    menuNode._pressEscToCloseMenu     = listeners.pressEscToCloseMenu.bind(menuNode);
  
    // add escape listener
    document.addEventListener("keydown", menuNode._pressEscToCloseMenu);
  
    // add click-outside listener
    setTimeout(function(){
      document.body.addEventListener("mousedown", menuNode._clickOutsideToCloseMenu);
    }, 0);
}
  
function hideMenu(menuNode){
  
    menuNode.style.display = "none";
  
    document.body.removeEventListener("mousedown", menuNode._clickOutsideToCloseMenu);
    document.removeEventListener("keydown", menuNode._pressEscToCloseMenu);
  
    menuNode.previousElementSibling.setAttribute("onclick", 'showMenu(this.nextElementSibling);');
}
  
function openDialog(type){
    var dialogNode = document.getElementById("dialog");
    var overlayNode = document.getElementById("overlay");
  
    // hide all menus
    var menus = document.getElementsByClassName('extra-options');
    for(var i = 0; i < menus.length; i++){
       hideMenu(menus[i]);
    }
  
    // show overlay
    overlayNode.style.display = "block";
    dialogNode.style.display = "block";
  
    // hide all children except...
    var currentDialog;
    var children = dialogNode.children;
  
    for(var i = 0; i < children.length; i++){
  
      if(children[i].id == "dialog-" + type){
        currentDialog = children[i];
        children[i].style.display = "block";
      } else {
        children[i].style.display = "none";
      }
  
    }
  
    if(type == "url"){
      currentDialog.getElementsByTagName("input")[0].focus();
    } else if (type == "string") {}
  
    // click outside to close dialog
    dialogNode._clickOutsideToCloseDialog = listeners.clickOutsideToCloseDialog.bind(dialogNode);
    document.body.addEventListener('mousedown', dialogNode._clickOutsideToCloseDialog);
  
    // add esc to close listener
    document.addEventListener("keydown", listeners.pressEscToCloseDialog);
  
}
  
function closeDialog(){
  
    var dialogNode = document.getElementById("dialog");
    var overlayNode = document.getElementById("overlay");
  
    dialogNode.style.display = "none";
    overlayNode.style.display = "none";
  
    // remove click-outside listener
    document.body.removeEventListener('mousedown', dialogNode._clickOutsideToCloseDialog);
  
    // remove esc to close listener
    document.removeEventListener("keydown", listeners.pressEscToCloseDialog);
  
}
  
var listeners = {
  
    // button sub menu
    clickOutsideToCloseMenu: function(e){
  
      if (!this.contains(e.target) && !this.previousElementSibling.contains(e.target)){
        hideMenu(this);
      }
      
    },
  
    pressEscToCloseMenu: function(e){
      e = e || window.event;
      if (e.keyCode == 27) {
          hideMenu(this);
      }
    },
  
    // dialog
    clickOutsideToCloseDialog: function(e){
      if (!this.contains(e.target)){
        closeDialog();
      }
    },
  
    pressEscToCloseDialog: function(e){
      e = e || window.event;
      if (e.keyCode == 27) {
          closeDialog();
      }
    },
  
    // filename editor
    pressEnterToSaveFilename: function(e){
      e = e || window.event;
      if (e.keyCode == 13) {
          closeFilenameEditor();
      }
    },
  
    clickOutsideToSaveFilename: function(e){
      if (!this.contains(e.target)){
        closeFilenameEditor();
      }
    },
  
    pressEscToDiscardFilename: function(e){
      e = e || window.event;
      if (e.keyCode == 27) {
          closeFilenameEditor(false);
      }
    }
  
};
  
  
function openFilenameEditor(){
    var filenameNode = document.getElementById("app-file-name");

    document_title = filenameNode.textContent;
  
    filenameNode.classList.add('editing');
    filenameNode.innerHTML = '<input type="text" value="'+document_title+'" style="font-size:1em;">';
    filenameNode.firstChild.value = document_title;
    filenameNode.firstChild.select();
  
    filenameNode.removeAttribute('onclick');
  
    // add enter listener (to SAVE)
    document.addEventListener("keydown", listeners.pressEnterToSaveFilename);
  
    // add click outside listener (to SAVE)
    filenameNode._clickOutsideToSaveFilename = listeners.clickOutsideToSaveFilename.bind(filenameNode.firstChild);
    setTimeout(function() {
      document.body.addEventListener("mousedown", filenameNode._clickOutsideToSaveFilename);
    }, 0);
  
    // add esc listener (to CANCEL)
    document.addEventListener("keydown", listeners.pressEscToDiscardFilename);
  
}
  
function closeFilenameEditor(saveFilename){
    if (typeof saveFilename === 'undefined') {
      saveFilename = true;
    }
  
    var filenameNode = document.getElementById("app-file-name");
    
    filenameNode.classList.remove('editing');
    filenameNode.firstChild.blur();
  
    if (saveFilename) {
      document_title = filenameNode.firstChild.value.trim() || 'untitled';
    }
    
    filenameNode.innerHTML = document_title;
  
    // re-add onclick listener
    filenameNode.setAttribute('onclick', 'openFilenameEditor();');
  
    // remove enter listener
    document.removeEventListener("keydown", listeners.pressEnterToSaveFilename);
  
    // remove click-outside listener
    document.body.removeEventListener("mousedown", filenameNode._clickOutsideToSaveFilename);
  
    // remove esc listener (to CANCEL)
    document.removeEventListener("keydown", listeners.pressEscToDiscardFilename);
}