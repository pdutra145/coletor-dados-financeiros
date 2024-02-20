import uvicorn
import coletor
from coletor.main import app

if __name__ == '__main__':
    uvicorn.run(app)