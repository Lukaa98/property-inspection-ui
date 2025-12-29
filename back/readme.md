# 1. Deactivate first
deactivate

# 2. Delete the existing venv
rm -rf venv

# 3. Recreate it
python -m venv venv

# 4. Activate again
source venv/Scripts/activate

# 5. Reinstall deps
pip install -r requirements.txt

# 6. Run the backend again on a safe port:
uvicorn main:app --reload --port 8081

