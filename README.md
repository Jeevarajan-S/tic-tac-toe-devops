# Tic Tac Toe

A simple, modern, responsive Tic Tac Toe game built with vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies. Includes Player vs Player and Player vs Computer modes with a working AI, score tracking, and win/draw detection.

## Features

- **Two game modes**
  - Player vs Player (local, same device)
  - Player vs Computer with selectable difficulty:
    - **Easy** – computer moves randomly
    - **Medium** – mix of random and optimal moves
    - **Unbeatable** – minimax algorithm, cannot be beaten
- **Score tracking** for Player X, Player O / Computer, and Draws
- **Win/draw detection** with highlighted winning line
- **Restart Round** button (keeps scores) and **Reset Scores** button
- **Responsive UI** that works on mobile and desktop
- Clean, dependency-free code — pure HTML/CSS/JS

## Project Structure

```
tic-tac-toe/
├── index.html      # Page structure and markup
├── style.css        # Styling, layout, animations, responsiveness
├── script.js         # Game logic, AI (minimax), state management
└── Dockerfile         # Nginx-based container for deployment
```

## Running Locally

Since it's a static site, you can just open it directly in a browser:

```bash
unzip tic-tac-toe.zip -d tic-tac-toe
cd tic-tac-toe
open index.html      # macOS
# or double-click index.html in your file explorer
```

Or serve it with any static file server, e.g.:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Running with Docker

The included `Dockerfile` uses `nginx:stable-alpine` to serve the static files.

```bash
docker build -t tic-tac-toe .
docker run -p 8080:80 tic-tac-toe
```

Then visit **http://localhost:8080**.

## Deploying to AWS

The Docker image is ready to deploy on any AWS container service:

**Amazon ECR + ECS/Fargate**
```bash
# Authenticate Docker to your ECR registry
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com

# Build and tag
docker build -t tic-tac-toe .
docker tag tic-tac-toe:latest <account-id>.dkr.ecr.<region>.amazonaws.com/tic-tac-toe:latest

# Push
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/tic-tac-toe:latest
```

Then create an ECS Fargate service (or EC2 instance running Docker) pointing at that image, exposing container port 80 behind an Application Load Balancer.

**Alternative:** deploy the same image to **AWS App Runner** or **Elastic Beanstalk (Docker platform)** for an even simpler setup — both can pull directly from ECR.

## How the AI Works

On **Unbeatable** difficulty, the computer uses the **minimax algorithm** to search all possible future move sequences and always picks the optimal move, meaning a perfect player can only ever force a draw. **Medium** difficulty randomly chooses between an optimal move and a random move each turn, and **Easy** always moves randomly.

## License

Free to use and modify for personal or educational purposes.
