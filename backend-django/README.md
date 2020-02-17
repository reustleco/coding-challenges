# Django coding challenge

We ask you to build an app that allows authenticated user to select a list of crypto coins whose value gets stored periodically.

You can use any available API, we recommend https://www.coingecko.com/api/documentations/v3#/, which is free and doesn't require a token.

Using Django, create an app that:

- Allows users registration and authentication
- An authenticated user can:
  - See a list of available crypto coins
  - From that list, the user can select 1 or more coins to "watch"
  - For each watched coin, the coin value against 'USD' is stored in DB every `n` minutes, where `n` is user configurable
- Write 2 unit and 2 integration tests

## Guidelines

Create a new repo under your account and use git to log your work.

When you are finished, please share the repo with us.
If there's something we should clarify or help with, please don't hesitate to ask.

Please use inline comments wherever you see fit to explain why you made certain coding decisions.