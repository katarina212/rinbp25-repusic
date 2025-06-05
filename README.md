

---

#  School Notes Management App

## Overview

This project is a full-stack web application designed to manage educational notes (disciplinary or commendatory) for students. Built using the **MERN stack (MongoDB, Express, React, Node.js)**, the app allows teachers to create, retrieve, update, and delete notes assigned to students across various subjects.

The goal is to provide schools with a simple yet effective interface for managing academic behavioral records.

---

## Features

### 1. Add & Manage Notes

* Teachers can add new notes with details like subject, text, date, and IDs of both student and teacher.
* Notes are saved in a MongoDB database with validation checks.

### 2. Student & Teacher Search

* Search for notes by **student ID** or **teacher ID**.
* Lists all related notes clearly grouped by subject and date.

### 3. View Statistics

* Aggregated data on the number of notes per subject.
* Helps identify subjects with the most recorded behavior.

### 4. Delete Notes

* Select and delete specific notes via the interface.
* Real-time update in both UI and database.

---

## Technology Stack

| Layer       | Technology         |
| ----------- | ------------------ |
| Frontend    | React (CSS) |
| Backend     | Express.js         |
| Database    | MongoDB (local)    |
| Server Tool | Node.js            |

---

## Dataset Structure

### **Students**

```json
{
  "ime": "Marko",
  "prezime": "Marić",
  "razred": "2A",
  "datum_rodjenja": "2007-04-22"
}
```

### **Notes**

```json
{
  "_id": "uuid-string",
  "ucenik_id": "student-uuid",
  "nastavnik_id": "teacher-uuid",
  "predmet": "Matematika",
  "tekst": "Učenik nije predao domaću zadaću.",
  "datum": "2024-11-10"
}
```

---
## Usage

*  Add notes using the "Add Note" form.
*  Search for notes using student or teacher ID.
*  View statistics per subject.
*  Delete any note with one click.

---

## Expected Outcomes

* Fully functioning CRUD application for educational notes.
* Clean and intuitive React interface.
* Backend API ready for integration with future mobile apps or admin dashboards.

---






