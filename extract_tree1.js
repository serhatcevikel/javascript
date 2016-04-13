/* Based on codes found in:
https://ctrlq.org/code/19923-google-drive-files-list
http://www.acrosswalls.org/ortext-datalinks/list-google-drive-folder-file-names-urls/
https://ctrlq.org/code/19854-list-files-in-google-drive-folder
https://ctrlq.org/code/19946-get-folder-path-of-files

Serhat Çevikel
*/

function FolderTree() {  // extract the folder tree into a speradsheet. with names, links, paths and descriptions. including folder and files.
// the script has to address the execution time limits defined by google (around 5 minutes)
  
  var parentrootname = "_accreditation"; // starting folder name
  var parent = DriveApp.getFoldersByName(parentrootname).next(); // starting folder saved into "parent"
  var parentroot = parent; // the parentroot is saved in a variable to keep it outside the recursion
  var folderlisting = 'folder_tree_' + parent; // output file name to be created under root
  
  var ss = SpreadsheetApp.create(folderlisting); // create a new spreadsheet as "folder_tree_accreditation", save it as "ss"
  var sheet = ss.getActiveSheet(); // active sheet name into "sheet"
  sheet.appendRow( ['filename', 'foldername', 'link', 'path', 'description'] ); // append the columns names as the first row
  
  listFolderContents(parent, sheet, parentroot); // run the recursive function on parent folder
  
} // close function


function listFolderContents(parent, sheet, parentroot) { // recursive function "list folder contents" on parent folder.
  // "sheet" and "parentroot" is carried for recursion

  var folders = parent.getFolders(); // get the folders under the parent
  
  // variable names to be used. declared here in order to see to whole list
  var folder; // current folder
  var contents; // file listing under folder
  var file; // current file
  var name; // name of file
  var link; // url of file
  var path; // complete path of file
  var descript; // description of file
  var fileID; // ID of file
  var foldername; // name of folder
  var folderlink; // url of folder
  var folderpath; // complete path of folder
  var folderID; // ID of folder
  var folderdescript; // description of folder
                      
  while (folders.hasNext()) { // while1, as long as parent folder has children

    folder = folders.next(); // get the next folder
    foldername = folder.getName(); // get the name of folder
    folderlink = folder.getUrl(); // get the url of folder
    folderID = folder.getId(); // get the ID of folder
    folderdescript = folder.getDescription(); // get the description of folder         
    folderpath = getpath('isfolder', folderID, parentroot); // get the complete of folder by running "getpath" function
    sheet.appendRow( ['', foldername, folderlink, folderpath, folderdescript] ); // append the folder credentials into the spreadsheet
    
    contents = folder.getFiles(); // get the file names under folder

    while(contents.hasNext()) { // while2, as long as folder has files
      
      file = contents.next(); // get the next file in contents
      name = file.getName(); // get the name of the file
      link = file.getUrl(); // get the url of the file
      fileID = file.getId(); // get the ID of the file
      descript = file.getDescription(); // get the description of the file
      path = getpath('isfile', fileID, parentroot); // get the complete path of the file
      sheet.appendRow( [name, '', link, path, descript] ); // append the file credentials into the sheet
      
    }  // close while2
    
    listFolderContents(folder, sheet, parentroot); // recurse the function to get the tree
    
  }  // close while1

}; // close function


function getpath(types, ID, parentroot) { // get the full path to the folder or file.
// This function can be replaced with a superassigned object to hold and append the folder names from each recursion

  if (types = 'isfile') { // if1, the object is a file
    var file = DriveApp.getFileById(ID); // initiate the DriveApp and get the file object from file ID. Otherwise, "hasNext" and other methods do not run!
  } else { // close if1, else1, the object is a folder
    var file = DriveApp.getFolderById(ID); // initiate the DriveApp and get the file object from folder ID
  } // close else1
    
  var folders = []; // initiate an empty holder vector for the path
  var parent = file.getParents(); // get the parent folder
  
  while (parent.hasNext() & parent != parentroot) { // while1, iterate to the parent golder until the root.
  // Unfortunately, the loop does not stop at the parent folder defined and continues upto "My Drive"

    parent = parent.next(); // get the parent folder object
    folders.push(parent.getName()); // append the name of the parent folder into the holder vector 
    parent = parent.getParents(); // iterate the parent procedure 
 
  } // close while1
 
  var fullpath = folders.reverse().join("/"); // concatenate the fullpath in reverse order and using "/" as separator
  return fullpath; // return the full path name
  
} // close function
