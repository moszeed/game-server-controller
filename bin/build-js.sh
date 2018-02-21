#! bin/bash
TRANSFORM="-t [ brfs ] -t [ yo-yoify ] -t [ babelify --global ]"
CLEANCSSPARAMS='--level 2 -d'



# prepare
mkdir ./dist/js/

echo "--> compile 'app'"

lessc ./client/styles/app.less --autoprefix='last 7 versions' > ./client/styles/app.css
cleancss ${CLEANCSSPARAMS} -o ./client/styles/app.min.css ./client/styles/app.css

watchify ./client/scripts/app.js ${EXTERNALS} \
    -r ./client/scripts/app.js:app \
    -o ./dist/js/app.js ${TRANSFORM} && \
uglifyjs ./dist/js/app.js -c -v -o ./dist/js/app.min.js

echo "--> compile 'widget'"

lessc ./client/styles/widget.less --autoprefix='last 7 versions' > ./client/styles/widget.css
cleancss ${CLEANCSSPARAMS} -o ./client/styles/widget.min.css ./client/styles/widget.css

watchify ./client/scripts/widget.js ${EXTERNALS} \
    -r ./client/scripts/widget.js:widget \
    -o ./dist/js/widget.js ${TRANSFORM} && \
uglifyjs ./dist/js/widget.js -c -v -o ./dist/js/widget.min.js
