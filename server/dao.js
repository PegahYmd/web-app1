"use strict";

const { header } = require("express-validator");
/* Data Access Object (DAO) module for accessing films data */

const db = require("./db");
const dayjs = require("dayjs");

// This function retrieves the whole list of films from the database.
exports.listPages = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Pages";
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
};

exports.getPageFilterUser = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Pages WHERE user=?";
    db.all(sql, [userId], (err, row) => {
      if (err) {
        reject(err);
      }
      if (row == undefined) {
        resolve({ error: "pages not found with this userId." });
      } else {
        resolve(row);
      }
    });
  });
};

// This function retrieves a film given its id and the associated user id.
exports.getPage = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Pages WHERE id=?";
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      }
      if (row == undefined) {
        resolve({ error: "page not found." });
      } else {
        resolve(row);
      }
    });
  });
};

/**
 * This function adds a new film in the database.
 * The film id is added automatically by the DB, and it is returned as this.lastID.
 */
exports.createPage = (page) => {
  // our database is configured to have a NULL value for films without rating

  return new Promise((resolve, reject) => {
    // let headerCounter = 1;
    // let headString = '';
    // for(let i=0; i<headerCounter; i++){}
    // headString = page.header + '*' + page.header2 ;
    // console.log("headStringggggg" + headString);

    const sql =
      "INSERT INTO Pages (title, user, author, creation_date, publication_date, blocks) VALUES(?, ?, ?, ?, ?, ?)";
    // db.run("DELETE from Pages");
    db.run(
      sql,
      [
        page.title,
        page.user,
        page.author,
        new Date().toISOString().split("T")[0],
        page.publicationDate,
        page.blocks,
      ],
      function (err) {
        if (err) {
          reject(err);
        }
        // Returning the newly created object with the DB additional properties to the client.
        resolve(exports.getPage(this.lastID));
      }
    );
  });
};

// This function updates an existing film given its id and the new properties.
exports.updatePage = (id, page) => {
  // our database is configured to have a NULL value for films without rating

  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE Pages SET user = ?, title = ?, author = ?, publication_date = ?, blocks = ? WHERE id = ?";

    db.run(
      sql,
      [
        page.user,
        page.title,
        page.author,
        page.publicationDate,
        page.blocks,
        id,
      ],
      function (err) {
        console.log("err", err);
        if (err) {
          reject(err);
        } else if (this.changes !== 1) {
          resolve({ error: "page not found." });
        } else {
          resolve(exports.getPage(id));
        }
      }
    );
  });
};

// This function deletes an existing film given its id.
exports.deletePage = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM Pages WHERE id = ?";
    db.run(sql, [id], (err) => {
      if (err) {
        reject(err);
      } else resolve(null);
    });
  });
};
