import uvicorn
from src.main import app
from src.config.config import config

if __name__ == "__main__":
    uvicorn.run("src.main:app", host="0.0.0.0", port=config.PORT, reload=True)