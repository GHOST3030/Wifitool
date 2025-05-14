# Count lines in tested_usernames.txt
with open('tested_usernames.txt', 'r', encoding='utf-8') as file:
    line_count = sum(1 for _ in file)

print(f"Total lines in tested_usernames.txt: {line_count}")

