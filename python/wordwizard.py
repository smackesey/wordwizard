from functools import cached_property
import string
import tkinter as tk
from tkinter import messagebox

# import pygame
import sys

# Check for command line arguments
if len(sys.argv) != 2:
    print("Usage: python game.py <path_to_word_file>")
    sys.exit(1)

# Load words from file
with open(sys.argv[1], "r") as file:
    words = [line.strip() for line in file.readlines()]

# Initialize pygame for sound
# pygame.init()
# pygame.mixer.init()
# ding_sound = pygame.mixer.Sound("data/ding.mp3")  # Replace with the path to a ding sound file

string.ascii_lowercase

LETTER_TILE_GAP = 10

class WordGame(tk.Tk):
    def __init__(self, words):
        super().__init__()
        self.words = words
        self.current_word_index = 0
        self.score = 0
        self.letter_sounding_state = True
        self.word_frame = None
        self.initialize_ui()
        self.show_word()
        self._letters = None

    def initialize_ui(self):
        self.title("Word Wizard")
        self.geometry("800x600")
        self.configure(bg="white")
        self.bind("<Key>", self.on_key_press)

        self.word_label = tk.Label(self, font=("Arial", 40))
        self.word_label.pack(pady=100)

        self.word_list_label = tk.Label(
            self, text="\n".join(self.words), justify=tk.LEFT, font=("Arial", 20)
        )
        self.word_list_label.pack(side=tk.LEFT, fill=tk.Y)

        self.score_label = tk.Label(
            self, text=f"Score: {self.score}", font=("Arial", 20)
        )
        self.score_label.pack(side=tk.TOP, anchor=tk.NE)
        print("initialized ui")

    def show_word(self):
        if self.current_word_index >= len(self.words):
            messagebox.showinfo("Congratulations!", "Congratulations! Press Q to quit.")
            return

        if self.word_frame is not None:
            self.word_frame.destroy()

        self.word_frame = tk.Frame()
        self.word_frame.pack(pady=100)
        word = self.words[self.current_word_index]
        make_letters(word, self.word_frame)
        # for x in word:
        #     label = self.letters[x]
        #     label.pack(side=tk.LEFT, padx=LETTER_TILE_GAP)
        # self.word_label.config(text=word)
        self.update_cursor()

    def update_cursor(self):
        if self.letter_sounding_state:
            self.word_label.config(underline=0)
        else:
            self.word_label.config(underline=-1)

    def on_key_press(self, event):
        if event.char == "q":
            self.quit()
        elif event.char == "s":
            if self.letter_sounding_state:
                self.letter_sounding_state = False
            else:
                self.score += 1
                self.score_label.config(text=f"Score: {self.score}")
                # ding_sound.play()
                self.current_word_index += 1
                self.letter_sounding_state = True
            self.show_word()

def make_letters(word, frame):
    for letter in word:
        tile = tk.Label(frame, text=letter, font=("Arial", 40))
        tile.pack(side=tk.LEFT, padx=LETTER_TILE_GAP)


if __name__ == "__main__":
    game = WordGame(words)
    game.mainloop()
