# Read the content of file2
with open('tested_usernames.txt', 'r', encoding='utf-8') as f2:
    lines2 = set(line.strip() for line in f2)

# Read the content of file1 and filter out duplicates
with open('/data/data/com.termux/files/home/Tools/Wifitool/DarkSide/tested_usernames.txt', 'r', encoding='utf-8') as f1:
    new_lines = [line.strip() for line in f1 if line.strip() not in lines2]

# Append unique lines to file2
with open('tested_usernames.txt', 'a', encoding='utf-8') as f2:
    for line in new_lines:
        f2.write(line + '\n')

# Print result
print(f"{len(new_lines)} lines were appended from file1.txt to file2.txt without duplicates.")
