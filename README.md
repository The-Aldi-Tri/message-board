# Anonymous Message Board

[![Run on Repl.it](https://replit.com/badge/github/The-Aldi-Tri/message-board)](https://replit.com/new/github/The-Aldi-Tri/message-board)

*You need an account on Replit


## FreeCodeCamp - Information Security Certification Projects

Instructions for building the project can be found at https://www.freecodecamp.org/learn/information-security/information-security-projects/anonymous-message-board.


## Assignment

Build a full stack JavaScript app that is functionally similar to this: [https://anonymous-message-board.freecodecamp.rocks/](https://anonymous-message-board.freecodecamp.rocks/).

Working on this project will involve you writing your code using one of the following methods:

*   Clone [this GitHub repo](https://github.com/freeCodeCamp/boilerplate-project-messageboard/) and complete your project locally.
*   Use [our Replit starter project](https://replit.com/github/freeCodeCamp/boilerplate-project-messageboard) to complete your project.
*   Use a site builder of your choice to complete the project. Be sure to incorporate all the files from our GitHub repo.

If you use Replit, follow these steps to set up the project:

*   Start by importing the project on Replit.
*   Next, you will see a `.replit` window.
*   Select `Use run command` and click the `Done` button.

When you are done, make sure a working demo of your project is hosted somewhere public. Then submit the URL to it in the Solution Link field. Optionally, also submit a link to your project's source code in the GitHub Link field.

---

1.  Set `NODE_ENV` to test without quotes when ready to write tests and DB to your databases connection string (in `.env`)
2.  Recommended to create controllers/handlers and handle routing in `routes/api.js`
3.  You will add any security features to `server.js`

Write the following tests in `tests/2_functional-tests.js`:

*   Creating a new thread: POST request to `/api/threads/{board}`
*   Viewing the 10 most recent threads with 3 replies each: GET request to `/api/threads/{board}`
*   Deleting a thread with the incorrect password: DELETE request to `/api/threads/{board}` with an invalid `delete_password`
*   Deleting a thread with the correct password: DELETE request to `/api/threads/{board}` with a valid `delete_password`
*   Reporting a thread: PUT request to `/api/threads/{board}`
*   Creating a new reply: POST request to `/api/replies/{board}`
*   Viewing a single thread with all replies: GET request to `/api/replies/{board}`
*   Deleting a reply with the incorrect password: DELETE request to `/api/replies/{board}` with an invalid `delete_password`
*   Deleting a reply with the correct password: DELETE request to `/api/replies/{board}` with a valid `delete_password`
*   Reporting a reply: PUT request to `/api/replies/{board}`
