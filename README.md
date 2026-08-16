# Wanderlust Property Listings Demo

An Express and MongoDB learning project for property listings and reviews. It demonstrates server-rendered CRUD flows, authentication, ownership checks, image uploads and responsive EJS templates.

> Portfolio code sample, not a booking service. The hosted version is read-only, listings are demonstration data, payments and reservations are not implemented, and the environment may sleep when inactive.

## Implemented

- register, log in and log out with Passport.js;
- create, view, edit and delete owned listings;
- add and delete owned reviews;
- search by listing title, location or country;
- upload listing images through Cloudinary;
- validate listing and review payloads with Joi;
- store sessions in MongoDB;
- apply secure cookie settings and common HTTP security headers.

## Security boundaries

- create, update and delete routes require authentication;
- listing changes require server-side owner checks;
- review deletion requires a server-side author check;
- edit and delete controls are hidden from other users in the rendered UI;
- production cookies use `HttpOnly`, `SameSite=Lax` and `Secure`;
- the session secret must contain at least 32 characters.

This learning project has not had an independent security audit and does not process payments or sensitive booking data.

The production deployment disables account registration, login and all write routes by default. To exercise authenticated CRUD flows in a local development environment, keep `NODE_ENV=development`. A private test deployment can explicitly set `PUBLIC_WRITE_ACCESS=true`.

## Local setup

```bash
cp .env.example .env
npm ci
npm start
```

Required environment values are documented in `.env.example`. Use a development MongoDB database and a separate Cloudinary folder/account.

## Verify

```bash
npm run check
```

The test suite covers session-cookie policy, request validation and the review-delete visibility rule.

## Main routes

| Method | Route | Purpose | Access |
|---|---|---|---|
| GET | `/listings` | Browse and search | Public |
| POST | `/listings` | Create listing | Signed in |
| PUT/DELETE | `/listings/:id` | Change owned listing | Owner |
| POST | `/listings/:id/reviews` | Add review | Signed in |
| DELETE | `/listings/:id/reviews/:reviewId` | Delete review | Author |

## Stack

Node.js, Express, MongoDB, Mongoose, EJS, Passport.js, Joi, Cloudinary and Bootstrap.

## Licence

[ISC](LICENSE)
