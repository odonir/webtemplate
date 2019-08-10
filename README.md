# WebTemplate
That's my template for front-end web develop. It includes gulp (for compiling sass, making builds, concat js libs) and bower (for installing libraries like jquery, bootstrap etc.)

# Get Started
For get started with my temlate you only need to clone my git repository locally to your PC.
You can do it with related console command (you only need installed Git on your system)
```
git clone https://github.com/odonir/webtemplate "[directory]"
```
As [directory] you can use any directory you want to clone into

# Gulp tasks
- Gulp default task is 'watch'.
  Task 'watch' starts file watchers and enables browser-sync for live reload in browser
- 'build' task builds your project to 'dist' directory

# Adding JS files to js/scripts.js
List of files that are going builded to scripts.js is contained in src/js/fileList.json.
You just add file to JSON array and it automatically adds to the scripts.js\n
## NOTES: 
- the path to the file should be relative to the folder src as root
- common.js must be always at the end of file
