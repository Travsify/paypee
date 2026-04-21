
import os

file_path = r'c:\Users\USER\Desktop\Paypee\src\CardsDashboard.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    # Only the issue card route has "data" defined
    if 'if (res.ok) { if (data && data.id) setCards(prev => [data, ...prev]);' in line:
        # We need to distinguish between the one that SHOULD have it and the ones that SHOULDN'T.
        # Line 159 (0-indexed 158) is the good one.
        pass
    new_lines.append(line)

# Let's just fix the bad ones specifically
# Line 191 (0-indexed 190)
if 'if (res.ok) { if (data && data.id) setCards(prev => [data, ...prev]);' in new_lines[190]:
    new_lines[190] = new_lines[190].replace('if (res.ok) { if (data && data.id) setCards(prev => [data, ...prev]);', 'if (res.ok) {')

# Line 223 (0-indexed 222)
if 'if (res.ok) { if (data && data.id) setCards(prev => [data, ...prev]);' in new_lines[222]:
    new_lines[222] = new_lines[222].replace('if (res.ok) { if (data && data.id) setCards(prev => [data, ...prev]);', 'if (res.ok) {')

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
