#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/runner.ts
var fs = __toESM(require("fs"));
var process = __toESM(require("process"));
var args = process.argv.length > 2 ? process.argv.splice(0) : ["../test/topPlayersScrape.js"];
var fileToRunName = args[0];
var basePath = process.cwd();
var script = fs.readFileSync(fileToRunName).toString();
var scriptWrapper = `

    const Axios = require('axios');

    const cheerio = require('cheerio');

    function runThis() {
        (async () => {

            ${script}

        })();

    }

    module.exports = {

        runThis
    }
    
`;
(async () => {
  let tempFileName = "temp.js";
  try {
    fs.writeFileSync(tempFileName, scriptWrapper);
  } catch (err) {
    console.log(err);
  }
  console.log(basePath);
  let { runThis } = await import(basePath + "/" + tempFileName);
  runThis();
})();
