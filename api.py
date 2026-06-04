from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from connection import send_to_event_hub, generate_taxio_ride_confirmation
from datetime import datetime
import uuid

app = FastAPI()
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="templates"), name="static")

@app.get("/")
def booking_home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})


@app.get("/book")
def book_ride(request: Request):  
    ride = generate_taxio_ride_confirmation()
    result = send_to_event_hub(ride)
    # Create a custom confirmation ID and attach to ride
    confirmation_id = f"TXO-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
    ride["confirmation_id"] = confirmation_id
    return templates.TemplateResponse("confirmation.html", {"request": request, "confirmation_id": confirmation_id, "ride": ride})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
