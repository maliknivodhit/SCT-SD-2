🔢 Number Guessing Game
This is a simple console-based number guessing game where the computer picks a random number, and you try to guess it!

🚀 Features
Random Number Generation: The computer selects a random secret number within a predefined range.

User Input: Players can input their guesses.

Hints: The game provides feedback (e.g., "Too high!", "Too low!") to guide the player.

Limited Attempts: Players typically have a limited number of attempts to guess the number.

Win/Loss Condition: Clearly indicates when the player has won or lost.

💡 How It Works
The game logic is straightforward:

The program generates a random integer within a specified range (e.g., 1 to 100).

The player is prompted to enter their guess.

The player's guess is compared to the secret number:

If the guess matches the secret number, the player wins.

If the guess is too high, a "Too high!" hint is given.

If the guess is too low, a "Too low!" hint is given.

The player continues guessing until they either guess the correct number or run out of attempts.

🛠️ How to Play
To play the game, you'll need a Python environment installed on your system.

Save the Code:
Save the game's Python code (e.g., game.py) to a file on your computer.

import random

def play_guessing_game():
    print("Welcome to the Number Guessing Game!")
    print("I'm thinking of a number between 1 and 100.")

    secret_number = random.randint(1, 100)
    attempts_limit = 7
    attempts_taken = 0

    while attempts_taken < attempts_limit:
        try:
            guess = int(input(f"Attempt {attempts_taken + 1}/{attempts_limit}: Enter your guess: "))
        except ValueError:
            print("Invalid input. Please enter a whole number.")
            continue

        attempts_taken += 1

        if guess < secret_number:
            print("Too low! Try again.")
        elif guess > secret_number:
            print("Too high! Try again.")
        else:
            print(f"Congratulations! You guessed the number {secret_number} in {attempts_taken} attempts!")
            return

    print(f"\nGame Over! You ran out of attempts. The secret number was {secret_number}.")

if __name__ == "__main__":
    play_guessing_game()

Run the Game:
Open your terminal or command prompt, navigate to the directory where you saved game.py, and run the script using Python:

python game.py

Follow the Prompts:
The game will guide you through the process, asking for your guesses and providing hints.
