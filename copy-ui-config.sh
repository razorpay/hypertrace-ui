FILENAME="/usr/share/nginx/html/ui-config.js"
touch $FILENAME

CONFIG_PATH="/usr/share/nginx/html/assets/json/config.json"
CONFIG=`cat $CONFIG_PATH`
echo "window.___CONFIG = $CONFIG" >> $FILENAME
