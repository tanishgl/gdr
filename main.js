/* Get all the HTML elements */
(function(){

  let addFolderBtn = document.querySelector("#myfirstbutton");
  let addTextFileBtn = document.querySelector("#addTextFile");
  let divBreadCrumb = document.querySelector("#divbreadcrumb");
  let rootPath = document.querySelector(".root");
  let container = document.querySelector("#container");
  let app = document.querySelector("#app");
  let appTitleBar = document.querySelector("#app-title-bar");
  let appTitle = document.querySelector("#app-title");
  let appMenuBar = document.querySelector("#app-menu-bar");
  let appBody = document.querySelector("#app-body");
  let myTemplates = document.querySelector("#myTemplates");
  let folders = [];
  let fid = 0;
  let cfid = -1;
  
  //Add click event on add Folder Button.
  addFolderBtn.addEventListener("click", addFolder);

  //Add click event on add Text File Button.
  addTextFileBtn.addEventListener("click", addTextFile);

  //Set navigate explicitly on root.
  rootPath.addEventListener("click", navigateBreadCrumb);

  function addTextFile(){
      //Ask user to enter the name of the folder.
      let fname = prompt("Enter the name of the folder");
      //If fname is valid, proceed.
      console.log(fname);
      if(!!fname){
  
        let found = folders.some(f => f.name == fname && f.pid == cfid);
        if(found==false){
          //trim the file name for further validation.
          fname.trim();
          //Increase the folder id.
          fid++;
          //Add the folder HTML in the container.
          addTextFileHTML(fname, fid, cfid);
          
          //Update the folders array.
          folders.push({
            id : fid,
            name : fname,
            pid : cfid,
            ftype : "file-type"
          });
          
          persistStorage();
        } else {
          alert(fname + " already exists.");
        }
      } else {
        alert("please enter something");
      }
  }

  function addTextFileHTML(fname, fid, pid){
    // Obtain the text file template.
    let textfiletemplate = myTemplates.content.querySelector(".text-file");
    // Clone the template into an actual folder.
    let textFile = document.importNode(textfiletemplate, true);
    //Obtain it's filename placeholder.
    fn_placeholder = textFile.querySelector("[purpose='filename']");
    //Also, obtain it's span and delete, view button.
    let editbtn = textFile.querySelector("span[action='edit']");
    let deletebtn = textFile.querySelector("span[action='delete']");
    let viewbtn = textFile.querySelector("span[action='view']");
    //Now set fid attribute in textFile.
    textFile.setAttribute("fid", fid);
    //Now set parent id (pid) attribute in textFile.
    textFile.setAttribute("pid", pid);
    //Now set it's fname.
    fn_placeholder.innerHTML = fname;
    // Bind edit and delete buttons to their functions.
    editbtn.addEventListener("click", editTextFile);
    deletebtn.addEventListener("click", deleteTextFile);
    //Also, bind the view btn to it's function.
    viewbtn.addEventListener("click", viewTextFile);
    //Finally add the folder inside the container element.
    container.appendChild(textFile);
  }

  function editTextFile(){
    //When the edit button was linked, it (i.e. edit button) was passed to this function as "this".
    let textFile = this.parentNode;
    //Obtain it's filename placeholder.
    let fn_placeholder = textFile.querySelector("[purpose='filename']");
    // Get the old file name -> ofname
    let ofname = fn_placeholder.innerHTML;
    
    let fname = prompt("Enter new filename for " , fn_placeholder.innerHTML);
    
    if(!!fname){

      if(fname!=fn_placeholder.innerHTML){
          
        //verify if the fname doesn't exist already.
        let found = folders.filter(f => f.pid == cfid).some(f => f.name == fname);

        if(found==false){
          fn_placeholder.innerHTML = fname;
          //Make changes in the folders array.
          //First find the respective folder on basis of fid attribute.
          //let fid = parseInt(textFile.getAttribute("fid"));
          let folder = folders.filter(f => f.pid == cfid).find(f => f.name == ofname);
          folder.name = fname;
          
          //Make changes to the local storage.
          persistStorage();
        } else {
          alert(fname + " already exists.");
        }
      } else {
        alert ("This is the old name");
      }
    } else {
      alert("please enter something");
    }
  }

  function deleteTextFile(){
    let textFile = this.parentNode;
    let fn_placeholder = textFile.querySelector("[purpose='filename']");
    let fileName = fn_placeholder.innerHTML;
    //Get the folder id of the folder to be deleted (tbd).
    let fidtbd = parseInt(textFile.getAttribute("fid"));
    
    let flag = confirm("Are you sure you want to delete " , fileName);
    if(flag){

      //first clear it from the container.
      container.removeChild(textFile);

      //Remove it from the storage.
      let fileIdx = folders.findIndex(f=> f.id == fidtbd);
      folders.splice(fileIdx, 1);

      //Make changes to the local storage.
      persistStorage();

    }
  }

  function viewTextFile(){
    //Get the textfile via "this".
    let textfile = this.parentNode;
    //Get it's filename placeholder.
    let fn_placeholder = textfile.querySelector("[purpose='filename']");
    //Get the filename.
    let fname = fn_placeholder.innerHTML;
    //Get it's fid attribute.
    let fid = parseInt(textfile.getAttribute("fid"));

    //Get the notepad menubar template.
    let divNotepadMenuTemplate = myTemplates.content.querySelector("[purpose='notepad-menu']");
    //Clone the template to build a menubar.
    let NotepadMenu = document.importNode(divNotepadMenuTemplate, true);
    //Clear the menubar first.
    appMenuBar.innerHTML = "" ;
    //Add the cloned menubar to actual app menu bar.
    appMenuBar.appendChild(NotepadMenu);

    //Similarly, get the notepad body template.
    let divNotepadBodyTemplate = myTemplates.content.querySelector("[purpose='notepad-body']");
    //clone the template to build the notepad's body.
    let NotepadBody = document.importNode(divNotepadBodyTemplate, true);
    //First clear the body.
    appBody.innerHTML = "";
    //Then, append the cloned body to app's body.
    appBody.appendChild(NotepadBody);

    //Set title in title bar.
    appTitle.innerHTML = fname;
  }

  function addFolder(){
    //Ask user to enter the name of the folder.
    let fname = prompt("Enter the name of the folder");
    //If fname is valid, proceed.
    console.log(fname);
    if(!!fname){

      let found = folders.some(f => f.name == fname && f.pid == cfid);
      if(found==false){
        //trim the file name for further validation.
        fname.trim();
        //Increase the folder id.
        fid++;
        //Add the folder HTML in the container.
        addFolderHTMLToPage(fname, fid, cfid);
        
        //Update the folders array.
        folders.push({
          id : fid,
          name : fname,
          pid : cfid,
          ftype : "folder"
        });
        
        persistStorage();
      } else {
        alert(fname + " already exists.");
      }
    } else {
      alert("please enter something");
    }
  }

  function addFolderHTMLToPage(fname, fid, pid){
    // Obtain the folder template.
    let folderTemplate = myTemplates.content.querySelector(".folder");
    // Clone the template into an actual folder.
    let divFolder = document.importNode(folderTemplate, true);
    //Obtain it's filename placeholder.
    fn_placeholder = divFolder.querySelector("[purpose='filename']");
    //Also, obtain it's span and delete, view button.
    let editbtn = divFolder.querySelector("span[action='edit']");
    let deletebtn = divFolder.querySelector("span[action='delete']");
    let viewbtn = divFolder.querySelector("span[action='view']");
    //Now set fid attribute in divFolder.
    divFolder.setAttribute("fid", fid);
    //Now set parent id (pid) attribute in divFolder.
    divFolder.setAttribute("pid", pid);
    //Now set it's fname.
    fn_placeholder.innerHTML = fname;
    // Bind edit and delete buttons to their functions.
    editbtn.addEventListener("click", editFolder);
    deletebtn.addEventListener("click", deleteFolder);
    //Also, bind the view btn to it's function.
    viewbtn.addEventListener("click", viewFolder);
    //Finally add the folder inside the container element.
    container.appendChild(divFolder);
  }

  function navigateBreadCrumb(){
    cfid = this.getAttribute("fid");
    
    //clear the container panel.
    container.innerHTML = "";

    //Print only those folders whose parent id is cfid.
    folders.filter(f => f.pid == cfid).forEach(f => {
      if(f.ftype=="folder"){
        addFolderHTMLToPage(f.name, f.id, cfid);
      } else if (f.ftype=="file-type"){
        addTextFileHTML(f.name, f.id, cfid);
      }
    });

    //Also, clear the breadcrumb from the right side.
    while(this.nextSibling){
      this.parentNode.removeChild(this.nextSibling);
    }
  }

  function viewFolder(){
    let divFolder = this.parentNode;
    let fn_placeholder = divFolder.querySelector("[purpose='filename']");
    let folderName = fn_placeholder.innerHTML;

    //Change the current folder id. cfid now points to divFolder's folder id.
    cfid = parseInt(divFolder.getAttribute("fid"));

    /* Changes in the breadcrumb HTML */
    let linkTemplate = myTemplates.content.querySelector(".path");
    //Make the copy of the link template.
    let crumb = document.importNode(linkTemplate, true);
    //Set crumb's inner HTML.
    crumb.innerHTML = folderName;
    //Set crumb's fid attribute to store the cfid.
    crumb.setAttribute("fid", cfid);
    //Add event listener to crumb.
    crumb.addEventListener("click", navigateBreadCrumb);
    //Add crumb into your divbreadcrumb.
    divBreadCrumb.appendChild(crumb);    

    //Clear the main container.
    container.innerHTML = "";

    //Now load divFolder's child folders.
    folders.filter(f => f.pid == cfid).forEach(f =>{
      if(f.ftype=="folder"){
        addFolderHTMLToPage(f.name, f.id, cfid);
      } else if (f.ftype=="file-type"){
        addTextFileHTML(f.name, f.id, cfid);
      }
    });
  }

  function editFolder(){
    //When the edit button was linked, it (i.e. edit button) was passed to this function as "this".
    let divFolder = this.parentNode;
    //Obtain it's filename placeholder.
    let fn_placeholder = divFolder.querySelector("[purpose='filename']");
    // Get the old folder name -> ofname
    let ofname = fn_placeholder.innerHTML;
    
    let fname = prompt("Enter new filename for " , fn_placeholder.innerHTML);
    
    if(!!fname){

      if(fname!=fn_placeholder.innerHTML){
          
        //verify if the fname doesn't exist already.
        let found = folders.filter(f => f.pid == cfid).some(f => f.name == fname);

        if(found==false){
          fn_placeholder.innerHTML = fname;
          //Make changes in the folders array.
          //First find the respective folder on basis of fid attribute.
          //let fid = parseInt(divFolder.getAttribute("fid"));
          let folder = folders.filter(f => f.pid == cfid).find(f => f.name == ofname);
          folder.name = fname;
          
          //Make changes to the local storage.
          persistStorage();
        } else {
          alert(fname + " already exists.");
        }
      } else {
        alert ("This is the old name");
      }
    } else {
      alert("please enter something");
    }
  }

  function deleteFolderRec(fidtbd){
    //fidtbd refers to the folder id of the folder to be deleted.
    let children = folders.filter(f => f.pid == fidtbd);
    for(let i=0;i<children.length;i++){
      deleteFolderRec(children[i].id);
    }

    console.log(folders);
    let idx = folders.findIndex(f => f.id == fidtbd);
    folders.splice(idx, 1);
  }

  function deleteFolder(){
    let divFolder = this.parentNode;
    let fn_placeholder = divFolder.querySelector("[purpose='filename']");
    let folder_name = fn_placeholder.innerHTML;
    //Get the folder id of the folder to be deleted (tbd).
    let fidtbd = parseInt(divFolder.getAttribute("fid"));
    
    let flag = confirm("Are you sure you want to delete " , fn_placeholder.innerHTML);
    if(flag){

      //first clear it from the container.
      container.removeChild(divFolder);

      //Remove it recursively from the storage.
      deleteFolderRec(fidtbd);

      //Make changes to the local storage.
      persistStorage();

    }
  }

  function persistStorage(){
    //convert your storage array to json first.
    let fjson = JSON.stringify(folders);
    //Then store it in local storage.
    localStorage.setItem("data", fjson);
  }

  function loadDataFromStorage(){
    //first get the json from the local storage.
    let fjson = localStorage.getItem("data");
    if(!!fjson){
      //Then parse the json to convert it to an array.
      folders = JSON.parse(fjson);
      //Keep track of the highest folder id available.
      let maxId = -1;
      folders.forEach(f => {
        //Update the maxId to the highest folder id available.
        if(f.id>maxId){
          maxId = f.id;
        }

        /* Only if the folder's parent id == current folder id 
        i.e. -1 , which is of root. */

        if(f.pid == cfid){
          //Sorting if the folder is actually a "folder", 
          if(f.ftype=="folder"){
            console.log("In folder type");
            addFolderHTMLToPage(f.name, f.id, cfid);
          } else if (f.ftype=="file-type"){
            //Or a "file".
            console.log("In file type");
            addTextFileHTML(f.name, f.id, cfid);
          }
        }
      });
      //Finally update folder id.
      fid = maxId;
    }
  }

  loadDataFromStorage();

})();
