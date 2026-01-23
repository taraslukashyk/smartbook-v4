import os
import re
import shutil

source_dir = r"d:\project\smartbook v4\Данні\Методичка_split_by_sections"
target_dir = r"d:\project\smartbook v4\website\docs"

def slugify(text):
    text = text.lower()
    text = re.sub(r'^[\d\.]+\s*', '', text)
    text = text[:50]
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text).strip('-')
    return text

def process_file(filename):
    filepath = os.path.join(source_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    match = re.search(r'РОЗДІЛ_(\d+)\._(.+)\.md', filename)
    if not match:
        return
    
    section_num = match.group(1).zfill(2)
    section_name = match.group(2).replace('_', ' ')
    
    folder_name = f"{section_num}-{section_name}"
    section_path = os.path.join(target_dir, folder_name)
    
    if os.path.exists(section_path):
        shutil.rmtree(section_path)
    os.makedirs(section_path, exist_ok=True)

    parts = re.split(r'^(## .+)$', content, flags=re.MULTILINE)
    
    index_body = parts[0].strip()
    index_body = re.sub(r'^# .+', '', index_body).strip()
    
    # FIX: Replace all variations of <br> with <br /> for MDX compatibility
    index_body = re.sub(r'<br\s*\/?>', '<br />', index_body, flags=re.IGNORECASE)
    
    # FIX: Wrap title in double quotes to avoid YAML errors with colons
    with open(os.path.join(section_path, 'index.md'), 'w', encoding='utf-8') as f:
        f.write(f"---\ntitle: \"{section_name}\"\nsidebar_position: 1\n---\n\n")
        f.write(f"# {section_name}\n\n")
        f.write(index_body)

    for i in range(1, len(parts), 2):
        header = parts[i].strip()
        body = parts[i+1].strip() if i+1 < len(parts) else ""
        
        # FIX: Replace all variations of <br> with <br /> in body
        body = re.sub(r'<br\s*\/?>', '<br />', body, flags=re.IGNORECASE)
        
        clean_title = re.sub(r'^##\s*[\d\.]*\s*', '', header).strip()
        filename_sub = slugify(clean_title) + ".md"
        
        pos_match = re.search(r'##\s*(\d+)\.(\d+)', header)
        position = (int(pos_match.group(2)) + 1) if pos_match else (i // 2 + 2)

        # FIX: Wrap title in double quotes
        with open(os.path.join(section_path, filename_sub), 'w', encoding='utf-8') as f:
            f.write(f"---\ntitle: \"{clean_title}\"\nsidebar_position: {position}\n---\n\n")
            f.write(f"## {clean_title}\n\n")
            f.write(body)

if __name__ == "__main__":
    for d in os.listdir(target_dir):
        if re.match(r'^\d{2}-', d):
            full_d = os.path.join(target_dir, d)
            if os.path.isdir(full_d):
                print(f"Cleaning {d}...")
                shutil.rmtree(full_d)

    files = [f for f in os.listdir(source_dir) if f.endswith('.md')]
    for f in sorted(files, key=lambda x: int(re.search(r'(\d+)', x).group(1))):
        print(f"Processing {f}...")
        process_file(f)
