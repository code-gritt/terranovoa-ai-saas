from fastapi import FastAPI # type: ignore
from fastapi.middleware.cors import CORSMiddleware# type: ignore
from pydantic import BaseModel# type: ignore
from geopy.geocoders import Nominatim# type: ignore
from geopy.exc import GeocoderTimedOut, GeocoderServiceError# type: ignore
import time

app = FastAPI(title="Terraloop Backend", description="Handles reverse geocoding for map clicks")

# Enable CORS for production (update origins to match your frontend domain)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend-domain.onrender.com","https://terranovoa-ai.vercel.app"],  # Add your Render frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LocationRequest(BaseModel):
    lat: float
    lon: float

@app.post("/reverse-geocode")
async def reverse_geocode(request: LocationRequest):
    try:
        geolocator = Nominatim(user_agent="terraloop-app")
        time.sleep(1)  # Respect Nominatim's rate limit
        location = geolocator.reverse(f"{request.lat}, {request.lon}", timeout=10)
        if location:
            return {
                "lat": request.lat,
                "lon": request.lon,
                "place": location.address,
                "success": True
            }
        else:
            return {
                "lat": request.lat,
                "lon": request.lon,
                "place": "Unknown location",
                "success": False
            }
    except (GeocoderTimedOut, GeocoderServiceError) as e:
        return {
            "lat": request.lat,
            "lon": request.lon,
            "place": "Geocoding service unavailable",
            "success": False
        }
    except Exception as e:
        return {
            "lat": request.lat,
            "lon": request.lon,
            "place": f"Error: {str(e)}",
            "success": False
        }

if __name__ == "__main__":
    import uvicorn# type: ignore
    uvicorn.run(app, host="0.0.0.0", port=8000)