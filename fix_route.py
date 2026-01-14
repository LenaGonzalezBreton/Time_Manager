with open('backend/src/routes/horaires.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Remplacer la ligne malformée
content = content.replace('router.get(" /incomplete\\, getIncompleteDays);', 'router.get("/incomplete", getIncompleteDays);')

with open('backend/src/routes/horaires.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed!")
