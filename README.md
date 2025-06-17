# Neighborly

Neighborly is a platform connecting users within local areas to post and accept offers for various tasks, fostering a community of mutual help and service exchange with rewards and a rating system.

## Overview

In today's busy world, finding help for everyday tasks or offering your skills to neighbors can be challenging. Neighborly aims to bridge this gap by providing a user-friendly application where individuals can:

*   Post tasks they need help with, specifying details like description, location, reward, and difficulty.
*   Browse and accept tasks posted by others in their community.
*   Build reputation through a rating and review system.
*   Compete on leaderboards for being top task posters or top helpers.

## Key Features

*   **User Authentication:** Secure registration and login for all users.
*   **Offer Management:**
    *   Create detailed offers including description, service area, reward, difficulty level, and status (e.g., Open, Accepted, In Progress, Completed, Removed).
    *   Browse, search, and filter offers.
*   **Task Interaction:**
    *   Users can accept offers they are willing to complete.
    *   Task completion confirmation by the offer poster.
*   **Reputation System:**
    *   Rate and review services provided/received after task completion.
*   **Leaderboards:**
    *   Ranking for users who have posted the most offers.
    *   Ranking for users who have successfully completed the most tasks.
*   **User Profiles:** Viewable profiles showcasing activity and ratings.
*   **Moderation:** Moderators can handle reports concerning users or reviews to ensure a safe community.

## Task Categories (Examples)

To help organize offers, Neighborly might include categories such as:

*   **Household Chores:** (e.g., cleaning, laundry, organizing)
*   **Outdoor & Garden:** (e.g., lawn mowing, gardening, snow removal)
*   **Pet Care:** (e.g., dog walking, pet sitting)
*   **Errands:** (e.g., grocery shopping, package pickup)
*   **Tech & Digital Help:** (e.g., basic computer setup, social media assistance)
*   **Handyman & Repairs:** (e.g., minor fixes, assembling furniture)
*   **Moving & Labor:** (e.g., help with moving boxes, heavy lifting)
*   **Tutoring & Skills:** (e.g., academic help, music lessons)

## Offer Filtering Options (Examples)

Users can find relevant tasks using filters like:

*   **Location/Area:** (e.g., specific neighborhood, distance radius)
*   **Category:** (as listed above)
*   **Reward Range:** (e.g., minimum/maximum reward)
*   **Difficulty Level:** (e.g., Easy, Medium, Hard)
*   **Status:** (e.g., Open, In Progress)
*   **Date Posted:** (e.g., newest, oldest)

## Tech Stack

Neighborly is built using a microservice architecture:

*   **Frontend:** Next.js, Tailwind CSS
*   **Backend APIs:**
    *   TypeScript, Express.js, MongoDB (Mongoose)
    *   ASP.NET C#, PostgreSQL (with an ORM like Entity Framework Core)

## Microservice Architecture

The backend is decomposed into several focused microservices that communicate via REST APIs. Potential services include:

*   **UserService:** Manages user accounts and profiles.
*   **TaskService (OfferService):** Handles creation, management, searching, and status updates of tasks/offers.
*   **ReviewService:** Manages ratings and reviews for completed tasks.
*   **RankingService (LeaderboardService):** Calculates and provides data for leaderboards.
*   **NotificationService:** (Potential) Manages and sends notifications to users.
*   **ModerationService:** (Potential) Handles reports and moderation actions.
*   **(API Gateway):** A single entry point for all client requests, routing them to the appropriate microservice.
