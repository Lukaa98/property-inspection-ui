# 1. Create it
python -m venv venv

# 2. Activate
source venv/Scripts/activate

# 3. Install deps
pip install -r requirements.txt

# 4. Run the backend again on a safe port:
uvicorn main:app --reload --port 8081

# 5. Deactivate 
deactivate

# 6. Delete the existing venv
rm -rf venv

