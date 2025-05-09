#!/data/data/com.termux/files/usr/bin/bash


pkg install nodejs -y


npm install axios chalk


cd Wifitool


if [ ! -f package.json ]; then
  npm init -y
fi


node main.js

